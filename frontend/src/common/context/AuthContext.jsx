import { createContext, useContext, useState } from "react";
import { signupApi, loginApi } from "@/features/auth/authApi";

const AuthContext = createContext({
    user: { userId: null, username: null, email: null },
    signup: () => {},
    login: () => {},
    logout: () => {}
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState({ userId: null, username: null, email: null });

    const signup = async ({ username, email, password}) => {
        await signupApi({ username, email, password });
        await login({ email, password });
    }

    const login = async ({ email, password }) => {
        const response = await loginApi({ email, password });
        const { user: userInfo, token } = response;
        setUser({ userId: userInfo.id, username: userInfo.username, email: userInfo.email });
        localStorage.setItem("token", token);
    }

    const logout = async () => {
        localStorage.removeItem("token");
        setUser({ userId: null, username: null, email: null });
    }

    return (<AuthContext.Provider value={{ user, signup, login, logout }}>
        {children}
    </AuthContext.Provider>);
}

export function useAuth() {
    return useContext(AuthContext);
}