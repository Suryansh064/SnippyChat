import { LoaderIcon, VideoIcon } from "lucide-react";
import { BellIcon } from "lucide-react";
export const  ChatLoader =()=>{
    return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
        <LoaderIcon className="animate-spin size-10 text-primary" />
        <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>
    </div>
    );
};

export const  CallButton = ({ handleVideoCall })=> {
    return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
        <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
        <VideoIcon className="size-6" />
        </button>
    </div>
    );
}

export const  NoNotificationsFound = ()=> {
    return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <BellIcon className="size-8 text-base-content opacity-40" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
        <p className="text-base-content opacity-70 max-w-md">
        When you receive friend requests or messages, they'll appear here.
        </p>
    </div>
    );
}