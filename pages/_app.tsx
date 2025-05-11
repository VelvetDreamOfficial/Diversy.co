import { useEffect, useState } from "react";
import "../app/global.css";
import type { AppProps } from "next/app";
import LayoutBackground from "../components/LayoutBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyApp({ Component, pageProps }: AppProps) {
    const [screenWidth, setScreenWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);
    const [isPortrait, setIsPortrait] = useState(false);

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
            <Navbar isPortrait></Navbar>
            <Main>
                <Component
                    {...pageProps}
                    isPortrait={isPortrait}
                    height={screenHeight}
                    width={screenWidth}
                />
            </Main>
            <Footer isPortrait />
        </main>
    );
}
