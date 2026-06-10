import {
    useEffect,
    useState
}
    from "react";

import Navbar
    from "../components/layout/Navbar";

import ChatWindow
    from "../components/chat/ChatWindow";

import {
    getUserConversations
}
    from "../services/conversationService";

export default function NotificationPage() {

    const [
        conversations,
        setConversations
    ] = useState([]);

    const [
        selectedConversation,
        setSelectedConversation
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(false);

    const userId =
        Number(
            localStorage.getItem(
                "userId"
            )
        );

    useEffect(() => {

        loadConversations();

    }, []);

    async function loadConversations() {

        try {

            setLoading(true);

            const data =
                await getUserConversations(
                    userId
                );

            console.log(data);

            setConversations(data);

        }
        catch (error) {

            console.error(
                "Failed loading conversations:",
                error
            );
        }
        finally {

            setLoading(false);
        }
    }

    if (loading) {

        return (
            <>
                <Navbar />

                <h2
                    style={{
                        padding: "40px"
                    }}
                >
                    Loading conversations...
                </h2>
            </>
        );
    }

    return (
        <>

            <Navbar />

            <div
                style={{
                    display: "flex",
                    height: "90vh"
                }}
            >

                <div
                    style={{
                        width: "350px",
                        borderRight:
                            "1px solid #333",
                        overflowY: "auto"
                    }}
                >

                    <h2
                        style={{
                            padding: "20px"
                        }}
                    >
                        Conversations
                    </h2>

                    {
                        Array.isArray(conversations) &&
                        conversations.map(
                            convo => {

                                const otherUser =
                                    convo.user1Id === userId
                                        ? convo.user2FirstName
                                        : convo.user1FirstName;

                                return (

                                    <div
                                        key={
                                            convo.conversationId
                                        }

                                        onClick={() =>
                                            setSelectedConversation(
                                                convo
                                            )
                                        }

                                        style={{
                                            padding: "20px",
                                            cursor: "pointer",
                                            borderBottom:
                                                "1px solid #222"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >

                                            <h4>
                                                {otherUser}
                                            </h4>

                                            {
                                                convo.hasUnreadMessages && (

                                                    <div
                                                        style={{
                                                            width: "12px",
                                                            height: "12px",
                                                            borderRadius: "50%",
                                                            background: "red"
                                                        }}
                                                    />
                                                )
                                            }

                                        </div>

                                        <p>
                                            {
                                                convo.carName
                                            }
                                        </p>

                                    </div>
                                );
                            })
                    }

                </div>

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                    {
                        selectedConversation
                            ? (
                                <ChatWindow
                                    conversation={
                                        selectedConversation
                                    }

                                    currentUserId={
                                        userId
                                    }
                                />
                            )
                            : (
                                <h2>
                                    Select conversation
                                </h2>
                            )
                    }

                </div>

            </div>

        </>
    );
}