import styled from "styled-components";
import { Marko_One } from "next/font/google";
import { up } from "up-fetch";

const upfetch = up(fetch);

// Define fonts
const markoOne = Marko_One({
    weight: "400",
    subsets: ["latin"],
});
export default function Login({ isPortrait }: { isPortrait: boolean }) {
    const TitleText = styled.h1`
        font-family: ${markoOne.style.fontFamily};
        font-size: ${isPortrait ? "3rem" : "5rem"};
        text-align: center;
        color: #fbfbfb;
        padding-top: 60px;
    `;

    const FormBox = styled.form`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: 50vh;
        gap: 20px;
        margin-inline: auto;

        input {
            height: 40px;
            border-radius: 10px;
            border: none;
            font-size: 1.3rem;
            color: #fbfbfb;
            background-color: #0f0f0f;
            height: 60px;
            width: 300px;
            text-indent: 10px;
        }

        input:focus {
            outline: none;
        }

        input:not(:empty) {
            color: #fbfbfb;
            background-color: #0f0f0f;
        }

        button {
            height: 40px;
            border-radius: 10px;
            border: none;
            font-size: 1.3rem;
            color: #fbfbfb;
            background-color: #0f0f0f;
            height: 60px;
            width: 300px;
            text-indent: 10px;
        }
    `;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = form.elements[0] as HTMLInputElement;
        const password = form.elements[1] as HTMLInputElement;

        try {
            const result = await upfetch("/api/auth/login", {
                method: "POST",
                body: {
                    username: username.value,
                    password: password.value,
                },
            });

            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main>
            <TitleText>Login</TitleText>
            <FormBox onSubmit={handleSubmit}>
                <input placeholder="Username" type="text" autoComplete="off" />
                <input placeholder="Password" type="password" />
                <button type="submit">Sign In</button>
            </FormBox>
        </main>
    );
}
