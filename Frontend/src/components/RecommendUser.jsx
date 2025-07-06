import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";

const RecommendedUserCard = ({ user, hasRequestBeenSent, sending, onSendRequest }) => {
    return (
    <div className="card bg-base-300 hover:shadow-lg">
        <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-3">
            <div className="avatar size-16 rounded-full">
            <img src={user.profilePic} alt={user.fullName} />
        </div>
        <div>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>
            {user.location && (
            <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {user.location}
            </div>
            )}
        </div>
        </div>

        <div className="flex flex-row gap-10">
        <span className="badge badge-outline p-4">Native: {user.nativeLanguage}</span>
        <span className="badge badge-outline p-4">Learning: {user.learningLanguage}</span>
        </div>

        {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

        <button
            className={`btn w-full  bg-slate-700 mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
            onClick={() => onSendRequest(user._id)}
            disabled={hasRequestBeenSent || sending}
        >
        {hasRequestBeenSent ? (
            <>
                <CheckCircleIcon className="size-4 mr-2" />
                Request Sent
            </>
        ) : (
            <>
                <UserPlusIcon className="  size-4 mr-2" />
                Send Friend Request
            </>
        )}
        </button>
    </div>
    </div>
);
};

export default RecommendedUserCard;
