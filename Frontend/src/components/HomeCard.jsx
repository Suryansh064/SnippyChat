import { Link } from "react-router-dom";

export const FriendCard = ({ friend }) => {
    return (
    <div className="flex gap-6">
    <div className="card bg-base-200 p-4 flex flex-col gap-2  w-64">
        <span> AI Friend</span>
        <Link
            to={`/aiChat/${friend._id}`}
            className="btn btn-primary bg-slate-700  btn-sm mt-6"
        >
        AI Chat
        </Link>
    </div>
    <div className="card bg-base-200 p-4 flex flex-col gap-2 w-64">
        <span>{friend.fullName}</span>
        <Link
            to={`/chatPage/${friend._id}`}
            className="btn btn-primary bg-slate-700 btn-sm mt-2"
        >
            Chat
        </Link>
    </div>
    </div>
);
};


export const SectionHeader = ({ title, subtitle, action }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="opacity-70">{subtitle}</p>}
    </div>
    {action}
    </div>
);


