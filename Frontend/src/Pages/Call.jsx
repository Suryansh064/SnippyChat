import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios"
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

import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_ChitChat_API_KEY;

const Call = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

  useEffect(() => {
    const initCall = async () => {
      if (!authUser?._id || !callId) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/chat/token`, { withCredentials: true });
        const token = res.data.token;
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token,
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
  }, [authUser, callId]);

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
