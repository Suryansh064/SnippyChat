import { useEffect, useState } from "react";
import { useParams } from "react-router";
import 'stream-chat-react/dist/css/v2/index.css'; // For v10+ of stream-chat-react
import axios from "axios";
import Navbar from "../components/Navbar";
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
import { LoaderIcon, VideoIcon } from "lucide-react";

// Inline ChatLoader component
function ChatLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <LoaderIcon className="animate-spin size-10 text-primary" />
      <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>
    </div>
  );
}

// Inline CallButton component
function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
      <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
        <VideoIcon className="size-6" />
      </button>
    </div>
  );
}

// Use your env variable here
const STREAM_API_KEY = import.meta.env.VITE_ChitChat_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (user) setAuthUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      if (!authUser) return;
      try {
        const res = await axios.get("http://localhost:5001/api/chat/token", { withCredentials: true });
        setToken(res.data.token);
      } catch (err) {
        setToken(null);
      }
    };
    fetchToken();
  }, [authUser]);

  useEffect(() => {
    const initChat = async () => {
      if (!token || !authUser) return;

      setLoading(true);
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [token, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;
  return (
  <div className="h-screen  bg-base-200 text-base-content">
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