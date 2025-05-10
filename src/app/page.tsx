"use client";

import Navbar from "./Navbar";
import styled from "styled-components";
import { Marko_One, Markazi_Text, Aldrich } from "next/font/google";
import Footer from "./Footer";

// Define fonts
const markoOne = Marko_One({
    weight: "400",
    subsets: ["latin"],
});

const markaziText = Markazi_Text({
    weight: "400",
    subsets: ["latin"],
});
const aldrich = Aldrich({
    weight: "400",
    subsets: ["latin"],
});

// Define styles
const Background = styled.div`
    background-image: url("/by-zephra.png");
    background-size: 107%;
    background-position: -48px 20px;
    background-repeat: no-repeat;
    height: 100vh;
    user-select: none;
    -webkit-user-drag: none;
`;

const TitleBox = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15%;
    justify-content: center;
    height: 100vh;
`;

const MainTitle = styled.h1`
    color: #fbfbfb;
    font-size: 7rem;
`;

const Subtitle = styled.h2`
    color: #fbfbfb;
    font-size: 2.3rem;
    transform: translate(10px, -40px);
`;

// a
const FloatingBox = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 60%;
    top: 35%;
    width: 100vw;
    transform: rotate(10deg);
`;
const FloatingImage = styled.img`
    width: 20%;
    -webkit-user-drag: none;
`;

const WIPBox = styled.div``;

const WIPTitle = styled.h1`
    color: #fbfbfb;
    font-size: 1.2rem;
`;

const WIPSubTitle = styled.h2`
    color: #fbfbfb;
    font-size: 0.8rem;
`;

// Main component
export default function Home() {
    return (
        <Background>
            <Navbar />
            <TitleBox>
                <MainTitle className={markoOne.className}>Diversy</MainTitle>
                <Subtitle className={markaziText.className}>
                    The world through <u>diversity</u>
                </Subtitle>
            </TitleBox>
            <FloatingBox>
                <FloatingImage src="/img.png" />
                <WIPBox className={aldrich.className}>
                    <WIPTitle>Page under construction</WIPTitle>
                    <WIPSubTitle>Come back later</WIPSubTitle>
                </WIPBox>
            </FloatingBox>

            <Footer />
        </Background>
    );
}
