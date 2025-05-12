import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { User } from "../../../types/User";
import { getUser } from "../../../utils/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { up } from "up-fetch";
import { Socket } from "socket.io-client";
import { useRouter } from "next/router";

const upfetch = up(fetch);

const ProfileContainer = styled.div<{ customcss?: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: var(--background);
    color: var(--foreground);
    min-height: calc(100vh - 35px);
    margin-block: 2%;
    overflow-y: scroll;
    height: calc(100vh - 35px);

    ${(props) => props.customcss && props.customcss}
`;

const ProfileCard = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 2rem;
    width: 100vw;
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

    props.socket.on("connected", (id: string) => {
        if (id === user?.id)
            setUser((prev) => (prev ? { ...prev, isOnline: true } : null));
    });

    props.socket.on("disconnected", (id: string) => {
        if (id === user?.id)
            setUser((prev) => (prev ? { ...prev, isOnline: false } : null));
    });

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await upfetch(`/api/users/${id}`);

                setUser(user);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        };
        fetchUser();
    }, [id]);

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format("DD/MM/YYYY");
    };

    if (loading || !user) return <div>Loading...</div>;

    return (
        <ProfileContainer customcss={user.customCSS}>
            <ProfileCard className="profile-card">
                <div className="avatar-plus-username">
                    <Avatar>
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={`${user.username}'s avatar`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                className="avatar"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faUser}
                                style={{ fontSize: "64px", color: "#666" }}
                            />
                        )}
                    </Avatar>
                    <UserInfo>
                        <Username className="username">
                            {user.username}
                        </Username>
                        <JoinDate className="join-date">
                            Member since {formatDate(user.createdAt)}
                        </JoinDate>
                        <StatusBadge
                            isonline={`${user.isOnline}`}
                            className="status"
                        >
                            {user.isOnline ? "Online" : "Offline"}
                        </StatusBadge>
                    </UserInfo>
                </div>

                <div className="profile-details">
                    <h2 className="profile-details-title">Profile Details</h2>
                    <p className="last-updated">
                        Last updated: {formatDate(user.updatedAt)}
                    </p>
                    <p className="user-id">
                        User ID: <code>{user.id}</code>
                    </p>
                </div>
            </ProfileCard>
        </ProfileContainer>
    );
};

export default ProfilePage;
