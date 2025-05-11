"use client";

import styled from "styled-components";
import "./global.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Markazi_Text, Marko_One } from "next/font/google";

// Define fonts
const markoOne = Marko_One({
    weight: "400",
    subsets: ["latin"],
});

const markaziText = Markazi_Text({
    weight: "400",
    subsets: ["latin"],
});

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TitleText = styled.h1`
    font-size: 5rem;
    color: #fbfbfb;
    margin-right: 20vw;
`;

const ErrorText = styled.h2`
    font-size: 2rem;
    color: #fbfbfb;
    margin-right: 20vw;
`;

const CuteErrorImage = styled.img`
    width: 30%;
    z-index: 1;
`;

export default function Custom404() {
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

    const Main = styled.div`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #0f0f0f;
    `;

    return (
        <main>
            <Navbar isPortrait></Navbar>
            <Main>
                <Container>
                    <CuteErrorImage src="/uwu.jpg" />
                    <div>
                        <TitleText className={markoOne.className}>
                            Error 404
                        </TitleText>
                        <ErrorText className={markaziText.className}>
                            Page not found
                        </ErrorText>
                    </div>
                </Container>
            </Main>
            <Footer isPortrait />
        </main>
    );
}
