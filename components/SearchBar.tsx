import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Search = styled.input`
    width: 90%;
    height: 40px;
    border-radius: 10px;
    border: none;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 1.3rem;
    color: #fbfbfb;
    background-color: #0f0f0f;
`;

export default function SearchBar(props: { isPortrait: boolean }) {
    const [results, setResults] = useState<
        { url: string; title: string; id: number }[]
    >([]);

    let query = "";
    const setQuery = (q: string) => {
        query = q;
    };

    const SearchResults = styled.div`
        position: absolute;
        display: flex;
        flex-direction: column;
        width: ${props.isPortrait ? "100%" : "300px"};
        border-radius: 10px;
        border: none;
        padding-left: 20px;
        padding-right: 20px;
        width: 21vw;
        right: 6.5vw;
        font-size: 1.5rem;
        color: #fbfbfb;
        background-color: #0f0f0f;

        a {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    `;

    const [isHovered, setIsHovered] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        document.addEventListener("click", () => {
            setIsSelected(isHovered);
        });
    });

    function onInput(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        setResults([
            {
                url: "/",
                title: "Home",
                id: 1,
            },
            {
                url: "/search/" + query,
                title: "Search results for " + query,
                id: 2,
            },
        ]);
    }

    return (
        <div>
            <Search
                placeholder="Search"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onChange={onInput}
            ></Search>
            {isSelected && results.length > 0 && (
                <SearchResults>
                    {results.map((result) => {
                        return (
                            <Link key={result.id} href={result.url}>
                                {result.title}
                            </Link>
                        );
                    })}
                </SearchResults>
            )}
        </div>
    );
}
