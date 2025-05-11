"use client";

import Navbar from "../../../components/Navbar";
import styled from "styled-components";
import { Marko_One } from "next/font/google";
import Footer from "../../../components/Footer";
import { useRouter } from "next/router";
import LayoutBackground from "../../../components/LayoutBackground";

// Define fonts
const markoOne = Marko_One({
    weight: "400",
    subsets: ["latin"],
});

// Main component
export default function Query({
    isPortrait,
    width,
    height,
}: {
    isPortrait: boolean;
    width?: number;
    height?: number;
}) {
    const router = useRouter();
    const query = router.query.query as string;

    const TitleText = styled.h1`
        font-family: ${markoOne.style.fontFamily};
        font-size: 5rem;
        text-align: left;
        color: #fbfbfb;
        padding-top: 60px;
    `;

    const Main = LayoutBackground({ isPortrait, width, height });

    return (
        <Main>
            <Navbar />
            <TitleText>{query}</TitleText>

            <Footer isPortrait={isPortrait} />
        </Main>
    );
}
