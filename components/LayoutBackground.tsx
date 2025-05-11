import styled from "styled-components";

export default function LayoutBackground({
    isPortrait,
    width,
    height,
}: {
    isPortrait: boolean;
    width?: number;
    height?: number;
}) {
    const backgroundSize = isPortrait
        ? `500%`
        : `${width! * 1.1}px ${height! * 1.1}px`;

    const Background = styled.div`
        background-image: url("/by-zephra.png");
        background-size: ${backgroundSize};
        background-position: ${isPortrait ? "-200px -50px" : "-70px 0px"};
        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
        height: 100vh;
    `;

    return Background;
}
