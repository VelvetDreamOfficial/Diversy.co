"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav
            style={{
                zIndex: 2,
                display: "flex",
                justifyContent: "space-between",
                height: "100px",
                width: "100vw",
                position: "absolute",
                top: 0,
                margin: 0,
                padding: 0,
                background: "linear-gradient(-85deg, #F3A6A6 0%, #C9BA47 100%)",
                paddingBlock: "calc(100px / 10)",
                paddingInline: "3%",
            }}
        >
            <Link href="/" style={{ marginBlock: "auto" }}>
                <FontAwesomeIcon
                    icon={faHouse}
                    color="#fbfbfb"
                    size="2x"
                ></FontAwesomeIcon>
            </Link>

            <Link
                href="#"
                style={{ marginBlock: "auto" }}
                onClick={(e) => {
                    e.preventDefault();
                }}
            >
                <FontAwesomeIcon
                    icon={faBars}
                    color="#fbfbfb"
                    size="2x"
                ></FontAwesomeIcon>
            </Link>
        </nav>
    );
}
