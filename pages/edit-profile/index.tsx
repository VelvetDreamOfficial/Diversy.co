// Update profile: Avatar, Username, Custom CSS

import styled from "styled-components";
import { up, ResponseError } from "up-fetch";
import { useState } from "react";
import { getUser } from "../../utils/User";

const upfetch = up(fetch);

export default function EditProfile() {
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");
    const [customCSS, setCustomCSS] = useState("");

    getUser((user) => {
        if (user) {
            setUsername(user.username);
            setAvatar(user.avatar);
            setCustomCSS(user.customCSS);
        }
    });

    function _arrayBufferToBase64(buffer: any) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        background: var(--background);
        color: var(--foreground);
        min-height: calc(100vh - 35px); // Accounting for footer height
        margin-block: 8%;
    `;

    const Form = styled.form`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: 50vh;
        gap: 20px;
        margin-inline: auto;
    `;

    const FormInput = styled.input`
        height: 40px;
        border-radius: 10px;
        border: none;
        font-size: 1.3rem;
        color: #fbfbfb;
        background-color: #0f0f0f;
        width: 300px;
        text-indent: 10px;

        &[type="file"] {
            display: none;
        }
    `;
    const FormTextarea = styled.textarea`
        height: 40px;
        width: 300px;

        border-radius: 10px;
        border: none;
        font-size: 1.3rem;
        color: #fbfbfb;
        background-color: #0f0f0f;
        text-indent: 10px;
    `;

    const Avatar = styled.img`
        width: 150px;
        height: 150px;
        border-radius: 50%;
    `;

    const Button = styled.button`
        height: 40px;
        border-radius: 10px;
        border: none;
        font-size: 1.3rem;
        color: #fbfbfb;
        background-color: #0f0f0f;
        width: 300px;
    `;

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await upfetch("/api/users/me", {
                method: "PUT",
                body: {
                    username: username,
                    avatar: avatar,
                    customCSS: customCSS,
                },
            });
            window.location.reload();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Container>
            <Avatar
                src={avatar}
                onClick={() => document.getElementById("avatar")?.click()}
            ></Avatar>
            <Form onSubmit={handleForm}>
                <FormInput
                    placeholder="Username"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    value={username}
                ></FormInput>
                <FormInput
                    type="file"
                    accept="image/*"
                    id="avatar"
                    onChange={async (e) => {
                        setAvatar(
                            "data:*/*;base64," +
                                _arrayBufferToBase64(
                                    await e.target.files![0].arrayBuffer()
                                )
                        );
                    }}
                ></FormInput>
                <FormTextarea
                    placeholder="Custom CSS"
                    onChange={(e) => {
                        setCustomCSS(e.target.value);
                    }}
                    value={customCSS}
                ></FormTextarea>
                <Button type="submit">Save</Button>
            </Form>
        </Container>
    );
}
