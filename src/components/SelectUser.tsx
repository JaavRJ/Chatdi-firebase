import { useContext, useEffect, useState, useCallback } from "react";
import { getDatabase, ref, onValue, update, DataSnapshot, get, off } from "firebase/database";
import FChatContext from "../context/FChatContext";
import { Navigate } from "react-router-dom";
import "../css/SelectUser.css";

const generateChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
};

export const ChatSelection = () => {
    const { userData } = useContext(FChatContext);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const loadUsers = useCallback(() => {
        if (userData) {
            const database = getDatabase();
            const usersRef = ref(database, "users");

            const usersListener = (snapshot: DataSnapshot) => {
                const data = snapshot.val();
                const userList: any[] = [];
                for (const key in data) {
                    if (data.hasOwnProperty(key) && key !== userData.uid) {
                        userList.push({ id: key, ...data[key] });
                    }
                }
                setUsers(userList);
                setLoading(false);
            };

            onValue(usersRef, usersListener);

            return () => {
                off(usersRef, 'value', usersListener);
            };
        }
    }, [userData]);

    const loadUnreadCounts = useCallback(() => {
        if (userData) {
            const database = getDatabase();
            const chatsRef = ref(database, "chats");

            const chatsListener = (snapshot: DataSnapshot) => {
                const chatsData = snapshot.val();
                const newUnreadCounts: { [key: string]: number } = {};

                for (const chatId in chatsData) {
                    if (chatsData.hasOwnProperty(chatId)) {
                        const chat = chatsData[chatId];
                        const [userId1, userId2] = chatId.split('_');
                        const otherUserId = userId1 === userData.uid ? userId2 : userId1;

                        console.log(userId1)
                        console.log(userId2)
                        // Contar los mensajes no leídos solo si el usuario está en el chat
                        const unreadCount = Object.values(chat.messages || {}).filter(
                            (msg: any) => (msg.authorUid !== userData.uid && !msg.read) &&
                                (userData.uid === userId1 || userData.uid === userId2)
                        ).length;

                        if (unreadCount > 0) {
                            newUnreadCounts[otherUserId] = (newUnreadCounts[otherUserId] || 0) + unreadCount;
                        }
                    }
                }
                setUnreadCounts(newUnreadCounts);
            };

            onValue(chatsRef, chatsListener);

            return () => {
                off(chatsRef, 'value', chatsListener);
            };
        }
    }, [userData]);

    useEffect(() => {
        loadUsers();
        loadUnreadCounts();
    }, [loadUsers, loadUnreadCounts]);

    const handleChatClick = async (userId: string) => {
        if (userData) {
            const chatId = generateChatId(userData.uid, userId);
            const database = getDatabase();
            const messagesRef = ref(database, `chats/${chatId}/messages`);

            try {
                const messagesSnapshot = await get(messagesRef);
                const messagesData = messagesSnapshot.val();

                if (messagesData) {
                    const updates: { [key: string]: any } = {};

                    for (const msgId in messagesData) {
                        if (messagesData[msgId].authorUid !== userData.uid && !messagesData[msgId].read) {
                            updates[`chats/${chatId}/messages/${msgId}/read`] = true;
                        }
                    }

                    if (Object.keys(updates).length > 0) {
                        await update(ref(database), updates);
                        console.log('Mensajes marcados como leídos');
                    }
                }
            } catch (error) {
                console.error('Error obteniendo mensajes:', error);
            }

            setSelectedUser(userId);
        }
    };

    if (!userData) return <Navigate to="/login" replace />;

    if (selectedUser) {
        const chatId = generateChatId(userData.uid, selectedUser);
        return <Navigate to={`/chat/${chatId}`} replace />;
    }

    return (
        <div className="container-global">
            <div className="chat-selection-container">
                <h2 className="chat-selection-title">Selecciona un Usuario para chatear</h2>
                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : (
                    <ul className="user-list">
                        {users.map((user) => (
                            <li key={user.id} className="user-list-item">
                                <button className="user-button" onClick={() => handleChatClick(user.id)}>
                                    <img src={user.avatar} alt={user.username} className="user-avatar" />
                                    {user.username}
                                    {unreadCounts[user.id] > 0 && (
                                        <span className="notification-badge">{unreadCounts[user.id]}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
