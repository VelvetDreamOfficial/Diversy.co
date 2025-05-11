import styled from "styled-components";
import { Marko_One } from "next/font/google";
import { useRouter } from "next/router";

// Define fonts
const markoOne = Marko_One({
    weight: "400",
    subsets: ["latin"],
});

// Main component
export default function Query() {
    const router = useRouter();
    const query = router.query.query as string;

    const TitleText = styled.h1`
        font-family: ${markoOne.style.fontFamily};
        font-size: 5rem;
        text-align: left;
        color: #fbfbfb;
        padding-top: 60px;
    `;

    return <TitleText>{query}</TitleText>;
}
