import { useState } from "react";
import { ACCESS_TOKEN } from "../../constants";
import { jwtDecode } from "jwt-decode";

export const auth = async () => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        setIsAuthorized(false);
        return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
        await refreshToken();
    } else {
        setIsAuthorized(true);
    }
};