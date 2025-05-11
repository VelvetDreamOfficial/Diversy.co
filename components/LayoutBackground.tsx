import { useEffect, useState } from "react";
import styled from "styled-components";

export default function LayoutBackground() {
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

    const backgroundSize = isPortrait
        ? `300%`
        : `${screenWidth * 1.1}px ${screenHeight * 1.1}px`;

    const Background = styled.div`
        background-image: url("/by-zephra.png");
        background-size: ${backgroundSize};
        background-position: ${isPortrait ? "-200px -50px" : "-70px -50px"};
        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
        height: 100vh;
    `;

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

    return Background;
}
