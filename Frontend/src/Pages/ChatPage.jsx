import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import 'stream-chat-react/dist/css/v2/index.css';
import { ChatLoader, CallButton } from '../components/UsedFunctions';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const chatClient = StreamChat.getInstance(import.meta.env.VITE_ChitChat_API_KEY);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { user: authUser } = useAuth();
  const { chatToken, loading: chatLoading } = useChat();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const connectedRef = useRef(false); 
  useEffect(() => {
    const initChat = async () => {
      if (!chatToken || !authUser || !targetUserId || connectedRef.current) return;

      try {
        await chatClient.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          chatToken
        );

        connectedRef.current = true;

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = chatClient.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        setChannel(currChannel);
        await checkLatency(); 
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      const cleanup = async () => {
        if (connectedRef.current) {
          await chatClient.disconnectUser();
          connectedRef.current = false;
          setChannel(null);
        }
      };
      cleanup();
    };
  }, [chatToken, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
    }
  };

  if (loading || chatLoading || !channel) return <ChatLoader />;

  return (
    <div className="h-screen bg-base-200 text-base-content">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
