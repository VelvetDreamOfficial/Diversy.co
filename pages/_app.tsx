import { useEffect, useState } from "react";
import "../app/global.css";
import type { AppProps } from "next/app";
import LayoutBackground from "../components/LayoutBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import io, { Socket } from "socket.io-client";
import { getUser } from "../utils/User";
import { User } from "../types/User";
import FloatingChatbox from "../components/Chatbox";

export default function MyApp({ Component, pageProps }: AppProps) {
    const [screenWidth, setScreenWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);
    const [isPortrait, setIsPortrait] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [socket, setSocket] = useState<Socket>();

    const s = io();

    getUser(async (user) => {
        setSocket(s);
        setUser(user);
        if (user) s.emit("auth", user.token);
    });

    useEffect(() => {
        if (screenWidth < screenHeight) {
            setIsPortrait(true);
        } else {
            setIsPortrait(false);
        }
    }, [screenWidth, screenHeight]);

    useEffect(() => {
        // Update screen width and height

        function handleResize() {
            setScreenWidth(window.innerWidth);
            setScreenHeight(window.innerHeight);
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });

    const Main = LayoutBackground({
        isPortrait,
        width: screenWidth,
        height: screenHeight,
    });

    return (
        <main>
            {socket && (
                <main>
                    <FloatingChatbox
                        currentUser={user!}
                        socket={socket}
                    ></FloatingChatbox>
                    <Navbar isPortrait></Navbar>
                    <Main>
                        <Component
                            {...pageProps}
                            isPortrait={isPortrait}
                            height={screenHeight}
                            width={screenWidth}
                            socket={socket}
                        />
                    </Main>
                    <Footer isPortrait />
                </main>
            )}
        </main>
    );
}
