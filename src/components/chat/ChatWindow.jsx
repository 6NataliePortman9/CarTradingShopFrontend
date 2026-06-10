import { useEffect, useState } from "react";
import {
    getConversationMessages,
    sendMessage,
    markConversationAsRead
}
    from "../../services/notificationService";
import "./ChatWindow.css";


export default function ChatWindow({ conversation, currentUserId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const currentUserEmail =
        conversation.user1Id === currentUserId
            ? conversation.user1Email
            : conversation.user2Email;

    useEffect(() => {
        loadMessages();
        markMessagesAsRead();
    }, [conversation]);

    async function loadMessages() {
        try {
            const data = await getConversationMessages(
                conversation.conversationId
            );
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function markMessagesAsRead() {

        try {

            await markConversationAsRead(
                conversation.conversationId,
                currentUserId
            );

        } catch (error) {

            console.error(error);
        }
    }

    async function handleSend() {
        if (!text.trim()) return;
        try {
            await sendMessage(
                conversation.conversationId,
                currentUserId,
                text
            );
            setText("");
            loadMessages();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="chat-window">

            <div className="chat-header">
                <div>
                    <div className="chat-title">
                        {conversation.carName || "Conversation"}
                    </div>
                    <div className="chat-subtitle">
                        {conversation.user1Id === currentUserId
                            ? conversation.user2FirstName
                            : conversation.user1FirstName}
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map(msg => {
                    const isMine = msg.senderEmail === currentUserEmail;

                    return (
                        <div
                            key={msg.notificationId}
                            className={isMine ? "message-row mine" : "message-row"}
                        >
                            <div className={isMine ? "message-bubble mine" : "message-bubble"}>
                                {msg.message}
                                <div
                                    className="message-time"
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        alignItems: "center"
                                    }}
                                >

                                    {
                                        !msg.isRead &&
                                        !isMine && (

                                            <span
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    background: "red",
                                                    display: "inline-block"
                                                }}
                                            />
                                        )
                                    }

                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="chat-input-area">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button onClick={handleSend} className="chat-send-btn">
                    Send
                </button>
            </div>

        </div>
    );
}