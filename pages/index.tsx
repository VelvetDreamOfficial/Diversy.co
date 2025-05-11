import styled from "styled-components";
import { Marko_One, Markazi_Text, Aldrich } from "next/font/google";

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

// Main component
export default function Home({ isPortrait }: { isPortrait: boolean }) {
    // Define styles

    const TitleBox = styled.div`
        display: flex;
        flex-direction: column;
        ${isPortrait
            ? "transform: translateY(100px)"
            : "justify-content: center"};
        margin-left: ${isPortrait ? "20px" : "8vw"};
        padding-top: ${isPortrait ? "0" : "20vh"};
    `;

    const MainTitle = styled.h1`
        color: #fbfbfb;
        font-size: ${isPortrait ? "11vh" : "8vw"};
    `;

    const Subtitle = styled.h2`
        color: #fbfbfb;
        font-size: ${isPortrait ? "3.8vh" : "2.5vw"};
        transform: ${isPortrait
            ? "translate(5px, -20px)"
            : "translate(10px, -40px)"};
    `;

    const FloatingBox = styled.div`
        position: absolute;
        display: flex;
        flex-direction: column;
        left: ${isPortrait ? "20px" : "60%"};
        top: ${isPortrait ? "40%" : "35%"};
        transform: ${isPortrait ? "none" : "rotate(10deg)"};
        width: fit-content;
    `;
    const FloatingImage = styled.img`
        width: ${isPortrait ? "60%" : "20%"};
        -webkit-user-drag: none;
    `;

    const WIPBox = styled.div`
        color: ${isPortrait ? "#0f0f0f" : "#fbfbfb"};
        * {
            width: fit-content;
        }
    `;

    const WIPTitle = styled.h1`
        font-size: ${isPortrait ? "3vh" : "3vw"};
    `;

    const WIPSubTitle = styled.h2`
        font-size: ${isPortrait ? "2vh" : "0.8vw"};
    `;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: isPortrait ? "column" : "row",
            }}
        >
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
        </div>
    );
}
