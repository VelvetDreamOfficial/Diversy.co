import { Aldrich } from "next/font/google";
import styled from "styled-components";

const aldrich = Aldrich({
    weight: "400",
    subsets: ["latin"],
});

export default function Footer({ isPortrait }: { isPortrait: boolean }) {
    const StyledFooter = styled.div`
        position: absolute;
        bottom: 0px;
        text-align: center;
        background-color: #0f0f0f;
        color: #fbfbfb;
        height: 35px;
        align-items: center;
        justify-content: center;
        display: flex;
        width: 100vw;
        font-size: ${isPortrait ? "12px" : "15px"};
    `;

    return (
        <StyledFooter className={aldrich.className}>
            2025-2026 © Diversy.co - All Rights Reserved
        </StyledFooter>
    );
}
