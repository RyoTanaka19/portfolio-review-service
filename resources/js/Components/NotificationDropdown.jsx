// resources/js/Components/NotificationDropdown.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationDropdown({ user }) {
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // 通知取得
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await axios.get("/notifications");
            const notifArray = Array.isArray(res.data.notifications)
                ? res.data.notifications
                : Object.values(res.data.notifications);
            setNotifications(notifArray);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [user]);

    // 通知既読化
    const markAsRead = async (id) => {
        try {
            await axios.patch(`/notifications/${id}/read`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative"
            >
                🔔
                {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
                        {notifications.length}
                    </span>
                )}
            </button>

            {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-md z-50">
                    {notifications.length === 0 && (
                        <p className="p-3 text-gray-500">通知はありません</p>
                    )}
                    {Array.isArray(notifications) &&
                        notifications.map((n) => {
                            const data =
                                typeof n.data === "string"
                                    ? JSON.parse(n.data)
                                    : n.data;
                            return (
                                <div
                                    key={n.id}
                                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => markAsRead(n.id)}
                                >
                                    <div className="font-medium">
                                        {data.message}
                                    </div>
                                    {data.rating && (
                                        <div className="text-sm text-gray-400">
                                            評価: {data.rating} / 5
                                        </div>
                                    )}
                                    {data.comment && (
                                        <div className="text-sm text-gray-500">
                                            {data.comment}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
