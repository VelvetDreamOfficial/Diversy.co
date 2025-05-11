import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
    title: "Diversy.co - The world through diversity",
    description: "A web-based social and documentary platform.",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Document</title>
            </head>
            <body>{children}</body>
        </html>
    );
}
