import { UserCheckIcon } from "lucide-react";

const FriendRequests = ({ requests, onAccept, accepting }) => {
    return (
    <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
        <UserCheckIcon className="h-5 w-5 text-primary" />
        Friend Requests
        <span className="badge badge-primary ml-2">{requests.length}</span>
        </h2>
        <div className="space-y-3">
        {requests.map((request) => (
        <div
            key={request._id}
            className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
        >
        <div className="card-body p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div className="avatar w-14 h-14 rounded-full bg-base-300">
                <img
                    src={request.sender.profilePic}
                    alt={request.sender.fullName}
                    />
                </div>
                <div>
                <h3 className="font-semibold">{request.sender.fullName}</h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="badge badge-secondary badge-sm">
                        Native: {request.sender.nativeLanguage}
                </span>
            <span className="badge badge-outline badge-sm">
                Learning: {request.sender.learningLanguage}
            </span>
                    </div>
            </div>
            </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onAccept(request._id)}
                    disabled={accepting[request._id]}
                >
                    Accept
                </button>
            </div>
            </div>
        </div>
        ))}
    </div>
    </section>
);
};

export default FriendRequests;
