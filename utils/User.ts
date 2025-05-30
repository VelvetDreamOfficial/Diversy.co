import { useEffect } from "react";
import { up } from "up-fetch";
import type { User } from "../types/User";
const upfetch = up(fetch);

export function getUser(
    callback: (user: User | null) => Promise<void> | void,
    withHooks = true
) {
    if (!withHooks) {
        upfetch("/api/auth/me").then(callback);
        return;
    }
    useEffect(() => {
        async function getUser() {
            const result = await upfetch("/api/auth/me");
            return result;
        }

        getUser().catch(console.error).then(callback);
    }, []);
}
