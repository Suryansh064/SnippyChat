import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext"; 
import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_ChitChat_API_KEY;

const Call = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chatToken } = useChat(); 

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCall = async () => {
      if (!user?._id || !callId || !chatToken) return;

      try {
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: user._id,
            name: user.fullName,
            image: user.profilePic,
          },
          token: chatToken,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Failed to join call:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initCall();
  }, [user, callId, chatToken]); 

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen flex items-center justify-center">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <p>Could not initialize call. Please refresh or try again.</p>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default Call;
