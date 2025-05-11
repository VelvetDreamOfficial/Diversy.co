import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import styled from "styled-components";
import React, { useState } from "react";
import { Aldrich } from "next/font/google";
import SearchBar from "./SearchBar";
import { getUser } from "../utils/User";
import { User } from "../types/User";

const aldrich = Aldrich({
    weight: "400",
    subsets: ["latin"],
});

export default function Navbar({ isPortrait }: { isPortrait: boolean }) {
    const [user, setUser] = useState<User | null>(null);
    getUser(async (user) => {
        setUser(user);
    });

    const NavBarContainer = styled.div`
        display: flex;
        justify-content: space-between;
        height: 60px;
        width: 100vw;
        position: absolute;
        top: 0;
        background: linear-gradient(-85deg, #f3a6a6 0%, #c9ba47 100%);
        padding-block: calc(100px / 10);
        padding-inline: 3%;
        z-index: 3;
    `;

    const MenuContainer = styled.div`
        position: absolute;
        top: 60px;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(-85deg, #f3a6a6 0%, #c9ba47 100%);
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5%;
    `;

    const InlineBox = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    `;

    const [isOpen, setIsOpen] = useState(false);
    const LinkStyled = styled.div`
        text-decoration: none;
        color: #fbfbfb;
        font-size: ${isPortrait ? "2rem" : "4.5rem"};

        :hover {
            text-decoration: underline;
        }

        text-align: center;
    `;

    function openOrCloseMenu(e: React.MouseEvent) {
        e.preventDefault();

        if (isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }

    function closeMenu() {
        setIsOpen(false);
    }

    return (
        <div>
            <NavBarContainer>
                <Link href="/" style={{ marginBlock: "auto" }}>
                    <FontAwesomeIcon
                        icon={faHouse}
                        color="#fbfbfb"
                        size="2x"
                    ></FontAwesomeIcon>
                </Link>

                <InlineBox>
                    <SearchBar isPortrait />
                    <Link
                        href="#"
                        style={{ marginBlock: "auto" }}
                        onClick={openOrCloseMenu}
                    >
                        <FontAwesomeIcon
                            icon={faBars}
                            color="#fbfbfb"
                            size="2x"
                        ></FontAwesomeIcon>
                    </Link>
                </InlineBox>
            </NavBarContainer>
            {isOpen && (
                <MenuContainer>
                    <LinkStyled>
                        <Link
                            href="/about"
                            className={aldrich.className}
                            onClick={closeMenu}
                        >
                            About
                        </Link>
                    </LinkStyled>
                    <LinkStyled>
                        <Link
                            href="/contact"
                            className={aldrich.className}
                            onClick={closeMenu}
                        >
                            Contact Us
                        </Link>
                    </LinkStyled>

                    {user && (
                        <LinkStyled>
                            <Link
                                href="/profile"
                                className={aldrich.className}
                                onClick={closeMenu}
                            >
                                Profile
                            </Link>
                        </LinkStyled>
                    )}

                    {user && (
                        <LinkStyled>
                            <Link
                                href="/logout"
                                className={aldrich.className}
                                onClick={closeMenu}
                            >
                                Logout
                            </Link>
                        </LinkStyled>
                    )}

                    {!user && (
                        <LinkStyled>
                            <Link
                                href="/login"
                                className={aldrich.className}
                                onClick={closeMenu}
                            >
                                Login
                            </Link>
                        </LinkStyled>
                    )}

                    {!user && (
                        <LinkStyled>
                            <Link
                                href="/register"
                                className={aldrich.className}
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </LinkStyled>
                    )}
                </MenuContainer>
            )}
        </div>
    );
}
