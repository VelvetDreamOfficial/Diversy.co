import { useEffect } from "react";

export default function Logout() {
    useEffect(() => {
        function setCookie(name: string, value: string, days: number) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }
        setCookie("token", "", -1);
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    });
}
