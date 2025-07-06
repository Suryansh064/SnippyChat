import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import FriendRequests from "../components/FriendRequest";
import NewConnections from "../components/NewConnection";
import { NoNotificationsFound } from "../components/UsedFunctions";

const Notification = () => {
    const { receivedRequests, getReceivedRequests, acceptFriendRequest } = useUser();
    const [accepting, setAccepting] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        await getReceivedRequests();
        setLoading(false);
    };
    fetchData();
    }, []);

    const handleAccept = async (id) => {
        setAccepting((prev) => ({ ...prev, [id]: true }));
        await acceptFriendRequest(id);
        await getReceivedRequests();
        setAccepting((prev) => ({ ...prev, [id]: false }));
    };

    const incomingRequests = receivedRequests?.incoming || [];
    const acceptedRequests = receivedRequests?.accepted || [];

    return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
            Notifications
        </h1>

        {loading ? (
            <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
        ) : (
        <>
            {incomingRequests.length > 0 && (
            <FriendRequests
                requests={incomingRequests}
                onAccept={handleAccept}
                accepting={accepting}
            />
            )}

            {acceptedRequests.length > 0 && (
            <NewConnections notifications={acceptedRequests} />
            )}

            {incomingRequests.length === 0 &&
        acceptedRequests.length === 0 && <NoNotificationsFound />}
        </>
        )}
    </div>
    </div>
);
};

export default Notification;
