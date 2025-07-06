// components/NewConnections.jsx
import { BellIcon, ClockIcon, MessageSquareIcon } from "lucide-react";

const NewConnections = ({ notifications }) => {
    return (
    <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
        <BellIcon className="h-5 w-5 text-success" />
        New Connections
        </h2>
        <div className="space-y-3">
        {notifications.map((notification) => (
            <div
            key={notification._id}
            className="card bg-base-200 shadow-sm"
        >
            <div className="card-body p-4">
            <div className="flex items-start gap-3">
                <div className="avatar mt-1 size-10 rounded-full">
                <img
                    src={notification.receiver.profilePic}
                    alt={notification.receiver.fullName}
                />
                </div>
                <div className="flex-1">
                <h3 className="font-semibold">
                    {notification.receiver.fullName}
                </h3>
                <p className="text-sm my-1">
                    {notification.receiver.fullName} accepted your friend request
                </p>
                <p className="text-xs flex items-center opacity-70">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Recently
                </p>
                </div>
                <div className="badge badge-success">
                    <MessageSquareIcon className="h-3 w-3 mr-1" />
                    New Friend
                </div>
            </div>
            </div>
        </div>
        ))}
    </div>
    </section>
    );
};

export default NewConnections;
