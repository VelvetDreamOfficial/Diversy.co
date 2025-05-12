import { useState } from "react";
import styled from "styled-components";
import { User } from "../../types/User";
import { getUser } from "../../utils/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: var(--background);
    color: var(--foreground);
    min-height: calc(100vh - 35px); // Accounting for footer height
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
`;

const UserInfo = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const Username = styled.h1`
    font-size: 24px;
    margin-bottom: 0.5rem;
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

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [css, setCss] = useState("");
    getUser(async (userData) => {
        setUser(userData);
        setCss(userData?.customCSS || "");
        setLoading(false);
    });
    const CustomCSSContainer = styled.div`
        :global(html) {
            ${css}
        }
    `;

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format("DD/MM/YYYY");
    };

    return (
        <div>
            {user && !loading && (
                <CustomCSSContainer>
                    <ProfileContainer className="profile-container">
                        <ProfileCard className="profile-card">
                            <Avatar className="avatar">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={`${user.username}'s avatar`}
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
                                            fontSize: "64px",
                                            color: "#666",
                                        }}
                                    />
                                )}
                            </Avatar>

                            <UserInfo className="user-info">
                                <Username className="username">
                                    {user.username}
                                </Username>
                                <JoinDate className="join-date">
                                    Member since {formatDate(user.createdAt)}
                                </JoinDate>
                                <StatusBadge
                                    isonline={`${user.isOnline}`}
                                    className="status-badge"
                                >
                                    {user.isOnline ? "Online" : "Offline"}
                                </StatusBadge>
                            </UserInfo>

                            <div className="profile-details">
                                <h2 className="profile-details-title">
                                    Profile Details
                                </h2>
                                <p className="last-updated">
                                    Last updated: {formatDate(user.updatedAt)}
                                </p>
                                <p className="user-id">User ID: {user.id}</p>
                            </div>
                        </ProfileCard>
                    </ProfileContainer>
                </CustomCSSContainer>
            )}
        </div>
    );
};

export default ProfilePage;
