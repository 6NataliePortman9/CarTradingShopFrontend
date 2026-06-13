import { useState } from "react";

import Button from "../ui/Button";

import {
    getOrCreateConversation
}
    from "../../services/conversationService";

import {
    sendMessage
}
    from "../../services/notificationService";

export default function ContactSellerModal({
    isOpen,
    onClose,
    car
}) {

    const [message, setMessage] =
        useState("");

    const [sending, setSending] =
        useState(false);

    const [success, setSuccess] =
        useState(false);


    if (!isOpen || !car)
        return null;

    async function handleSend() {
        try {
            setSending(true);

            const senderId = Number(localStorage.getItem("userId"));
            const sellerId = car.userId || car.UserId;

            // ← додай це
            console.log("senderId:", senderId);
            console.log("sellerId:", sellerId);
            console.log("carId:", car.carId || car.CarId);
            console.log("full car object:", JSON.stringify(car));

            if (!senderId || !sellerId) {
                alert(`Missing data: senderId=${senderId}, sellerId=${sellerId}`);
                return;
            }

            if (!senderId) {
                alert("You must be logged in to send a message.");
                return;
            }

            if (senderId === sellerId) {
                alert("You cannot message yourself.");
                return;
            }

            const conversation = await getOrCreateConversation(
                senderId,
                sellerId,
                car.carId || car.CarId
            );

            await sendMessage(
                conversation.conversationId || conversation.ConversationId,
                senderId,
                message
            );

            setSuccess(true);
            setMessage("");

        } catch (error) {
            console.error(error);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background:
                    "rgba(0,0,0,0.6)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                zIndex: 9999
            }}
        >

            <div
                style={{
                    width: "420px",
                    background: "#111",

                    borderRadius: "16px",

                    padding: "24px",

                    border:
                        "1px solid #333"
                }}
            >

                <h2
                    style={{
                        marginBottom: "16px"
                    }}
                >
                    Contact Seller
                </h2>

                <p
                    style={{
                        marginBottom: "12px",
                        color: "#999"
                    }}
                >
                    {car.carMarka} {car.carName}
                </p>

                <textarea
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }

                    placeholder="Type your message..."

                    rows={5}

                    style={{
                        width: "100%",
                        resize: "none",

                        padding: "12px",

                        borderRadius: "12px",

                        border:
                            "1px solid #444",

                        background: "#1a1a1a",
                        color: "white"
                    }}
                />

                {
                    success && (
                        <div
                            style={{
                                marginTop: "12px",
                                color: "#4ade80"
                            }}
                        >
                            ✓ Message sent successfully
                        </div>
                    )
                }

                <div
                    style={{
                        display: "flex",
                        gap: "12px",

                        marginTop: "20px"
                    }}
                >

                    <Button
                        onClick={handleSend}
                        disabled={
                            sending ||
                            !message.trim()
                        }
                    >
                        {
                            sending
                                ? "Sending..."
                                : "Send"
                        }
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Close
                    </Button>

                </div>

            </div>

        </div>
    );
}