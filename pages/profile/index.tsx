import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { User } from "../../types/User";
import { getUser } from "../../utils/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { up } from "up-fetch";
import { Socket } from "socket.io-client";

const upfetch = up(fetch);

const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: var(--background);
    color: var(--foreground);
    min-height: calc(100vh - 35px);
    margin-block: 8%;
`;

const ProfileCard = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 2rem;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
    overflow: hidden;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

const UsernameInput = styled.input`
    font-size: 24px;
    text-align: center;
    border: none;
    background: transparent;
    &:focus {
        outline: none;
        border-bottom: 2px solid #0f0f0f;
    }
`;

const Username = styled.h1`
    font-size: 24px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

const UserInfo = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const JoinDate = styled.p`
    color: #666;
    font-size: 14px;
`;

const StatusBadge = styled.span<{ isonline: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 12px;
    margin-top: 0.5rem;
    background: ${(props) =>
        props.isonline === "true" ? "#4CAF50" : "#9e9e9e"};
    color: white;
`;

const ProfilePage = (props: { socket: Socket }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    props.socket.on("connected", (id: string) => {
        if (id === user?.id)
            setUser((prev) => (prev ? { ...prev, isOnline: true } : null));
    });

    props.socket.on("disconnected", (id: string) => {
        if (id === user?.id)
            setUser((prev) => (prev ? { ...prev, isOnline: false } : null));
    });

    useEffect(() => {
        getUser(async (userData) => {
            setUser(userData);
            setUsername(userData?.username || "");
            setAvatar(userData?.avatar || "");
            setLoading(false);
        }, false);
    }, []);

    const handleUsernameClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleUsernameBlur = async () => {
        setIsEditing(false);
        if (username !== user?.username) {
            try {
                await upfetch("/api/users/me", {
                    method: "PUT",
                    body: { username },
                });
                setUser((prev) => (prev ? { ...prev, username } : null));
            } catch (e) {
                console.error(e);
                setUsername(user?.username || "");
            }
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    function _arrayBufferToBase64(buffer: any) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64String =
                "data:image/png;base64," +
                _arrayBufferToBase64(await file.arrayBuffer());

            console.log(base64String);
            try {
                await upfetch("/api/users/me", {
                    method: "PUT",
                    body: { avatar: base64String },
                });
                setAvatar(base64String);
                setUser((prev) =>
                    prev ? { ...prev, avatar: base64String } : null
                );
            } catch (e) {
                console.error(e);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format("DD/MM/YYYY");
    };

    if (loading || !user) return <div>Loading...</div>;

    return (
        <ProfileContainer>
            <ProfileCard>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <Avatar onClick={handleAvatarClick}>
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={`${username}'s avatar`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faUser}
                            style={{ fontSize: "64px", color: "#666" }}
                        />
                    )}
                </Avatar>

                <UserInfo>
                    {isEditing ? (
                        <UsernameInput
                            ref={inputRef}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={handleUsernameBlur}
                            onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                    await handleUsernameBlur();
                                }
                            }}
                        />
                    ) : (
                        <Username onClick={handleUsernameClick}>
                            {username}
                        </Username>
                    )}
                    <JoinDate>
                        Member since {formatDate(user.createdAt)}
                    </JoinDate>
                    <StatusBadge isonline={`${user.isOnline}`}>
                        {user.isOnline ? "Online" : "Offline"}
                    </StatusBadge>
                </UserInfo>

                <div className="profile-details">
                    <h2>Profile Details</h2>
                    <p>Last updated: {formatDate(user.updatedAt)}</p>
                    <p>
                        User ID: <code>{user.id}</code>
                    </p>
                </div>
            </ProfileCard>
        </ProfileContainer>
    );
};

export default ProfilePage;
