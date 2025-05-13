import { useState, useEffect } from "react";
import styled from "styled-components";
import { User } from "../types/User";
import { Socket } from "socket.io-client";
import { up } from "up-fetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCommentDots,
    faTimes,
    faUser,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Aldrich } from "next/font/google";
import dayjs from "dayjs";

const aldrich = Aldrich({ weight: "400", subsets: ["latin"] });

const upfetch = up(fetch);

const MessagesContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Message = styled.div<{ issender: string }>`
    max-width: 70%;
    padding: 0.8rem;
    border-radius: 12px;
    background: ${(props) =>
        props.issender === "true" ? "#0f0f0f" : "#f0f0f0"};
    color: ${(props) => (props.issender === "true" ? "#fbfbfb" : "#0f0f0f")};
    align-self: ${(props) =>
        props.issender === "true" ? "flex-end" : "flex-start"};
`;

const MessageTime = styled.span`
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.2rem;
    display: block;
`;

const InputContainer = styled.div`
    display: flex;
    padding: 1rem;
    gap: 0.5rem;
    background: #f8f8f8;
    border-radius: 0 0 8px 8px;
`;

const MessageInput = styled.input`
    flex-grow: 1;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    &:focus {
        outline: none;
        border-color: #0f0f0f;
    }
`;

const SendButton = styled.button`
    padding: 0.8rem 1.5rem;
    background: #0f0f0f;
    color: #fbfbfb;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
`;

const FloatingButton = styled.button`
    position: fixed;
    bottom: 50px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(-85deg, #f3a6a6 0%, #c9ba47 100%);
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fbfbfb;

    &:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
    }
`;

const ChatboxContainer = styled.div<{ isopen: string }>`
    position: fixed;
    bottom: 120px;
    right: 30px;
    width: ${(props) => (props.isopen === "true" ? "350px" : "0")};
    height: ${(props) => (props.isopen === "true" ? "500px" : "0")};
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 999;
`;

const ChatHeader = styled.div`
    padding: 1rem;
    background: #0f0f0f;
    color: #fbfbfb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: #fbfbfb;
    cursor: pointer;
    padding: 5px;

    &:hover {
        opacity: 0.8;
    }
`;

const Search = styled.input`
    width: 90%;
    height: 40px;
    border-radius: 10px;
    border: none;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 1.1rem;
    color: #fbfbfb;
    background-color: #0f0f0f;
    margin: 10px auto;
`;

const UserList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    max-height: 300px;
    overflow-y: auto;
    background: #f8f8f8;
    border-radius: 8px;
`;

const UserItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #f0f0f0;
    }
`;

const UserAvatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const UserInfo = styled.div`
    flex: 1;
`;

const Username = styled.div`
    font-weight: 500;
`;

const OnlineStatus = styled.div<{ isonline: string }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(props) =>
        props.isonline === "true" ? "#4CAF50" : "#9e9e9e"};
    margin-left: auto;
`;

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid #ddd;
`;

const Tab = styled.div<{ active: string }>`
    padding: 10px 20px;
    cursor: pointer;
    background: ${(props) =>
        props.active === "true" ? "#0f0f0f" : "transparent"};
    color: ${(props) => (props.active === "true" ? "#fbfbfb" : "#0f0f0f")};
    border-radius: 8px 8px 0 0;
`;

export default function FloatingChatbox({
    socket,
    currentUser,
}: {
    socket: Socket;
    currentUser: User;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<"users" | "chat">("users");
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);

    if (!currentUser) return;
    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await upfetch("/api/users");
            setUsers(response);
        };
        fetchUsers().catch(console.error);

        socket.on("private-message", async (message) => {
            upfetch(`/api/messages/${message.senderId}`)
                .then((response) => {
                    setMessages(response);
                })
                .catch(console.error);
        });

        socket.on("delete-message", async (senderId) => {
            upfetch(`/api/messages/${senderId}`)
                .then((response) => {
                    setMessages(response);
                })
                .catch(console.error);
        });

        return () => {
            socket.off("private-message");
            socket.off("delete-message");
        };
    }, [currentUser.id]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const message = {
                content: newMessage,
                recipientId: selectedUser?.id,
            };

            await upfetch("/api/messages", {
                method: "POST",
                body: message,
            });

            socket.emit("private-message", {
                message,
                senderId: currentUser.id,
                recipientId: selectedUser?.id,
            });

            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Filter users based on search
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setActiveTab("chat");

        upfetch("/api/messages/" + user.id)
            .catch(console.error)
            .then((response) => {
                console.log(response);
                setMessages(response);
            });
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await upfetch(`/api/messages/${messageId}`, {
                method: "DELETE",
            });

            socket.emit("delete-message", {
                senderId: currentUser.id,
                recipientId: selectedUser?.id,
            });
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    return (
        <>
            <FloatingButton
                onClick={() => setIsOpen(!isOpen)}
                className={aldrich.className}
            >
                <FontAwesomeIcon icon={faCommentDots} size="2x" />
            </FloatingButton>

            <ChatboxContainer isopen={`${isOpen}`}>
                <ChatHeader className={aldrich.className}>
                    {activeTab === "users"
                        ? "Messages"
                        : selectedUser?.username}
                    <CloseButton onClick={() => setIsOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </CloseButton>
                </ChatHeader>

                <TabContainer>
                    <Tab
                        active={`${activeTab === "users"}`}
                        onClick={() => setActiveTab("users")}
                    >
                        Users
                    </Tab>
                    {selectedUser && (
                        <Tab
                            active={`${activeTab === "chat"}`}
                            onClick={() => setActiveTab("chat")}
                        >
                            Chat
                        </Tab>
                    )}
                </TabContainer>

                {activeTab === "users" ? (
                    <>
                        <Search
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <UserList>
                            {filteredUsers.map((user) => (
                                <UserItem
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <UserAvatar>
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.username}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                style={{
                                                    fontSize: "20px",
                                                    color: "#666",
                                                }}
                                            />
                                        )}
                                    </UserAvatar>
                                    <UserInfo>
                                        <Username>{user.username}</Username>
                                    </UserInfo>
                                    <OnlineStatus
                                        isonline={`${user.isOnline}`}
                                    />
                                </UserItem>
                            ))}
                        </UserList>
                    </>
                ) : (
                    selectedUser && (
                        <>
                            <MessagesContainer>
                                {messages.map((message) => (
                                    <Message
                                        key={message.id}
                                        issender={`${
                                            message.senderId === currentUser.id
                                        }`}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            {message.content}
                                            {message.senderId ===
                                                currentUser.id && (
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    onClick={() =>
                                                        handleDeleteMessage(
                                                            message.id
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <MessageTime>
                                            {dayjs(message.createdAt).format(
                                                "ddd DD hh[h] mm[min]"
                                            )}
                                        </MessageTime>
                                    </Message>
                                ))}
                            </MessagesContainer>
                            <InputContainer>
                                <MessageInput
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
                                />
                                <SendButton onClick={handleSendMessage}>
                                    Send
                                </SendButton>
                            </InputContainer>
                        </>
                    )
                )}
            </ChatboxContainer>
        </>
    );
}
