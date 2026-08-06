import { createContext, useContext, useEffect, useState } from "react";
import { signupApi, loginApi, getUserApi } from "@/features/auth/authApi";

const AuthContext = createContext({
    loading: true,
    user: { userId: null, username: null, email: null },
    signup: () => {},
    login: () => {},
    logout: () => {}
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState({ userId: null, username: null, email: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const user = await getUserApi();
            console.log("hello");
            setUser({ userId: user.id, username: user.username, email: user.email });
            setLoading(false);
        }
        fetchUser();
    }, []);

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

    return (<AuthContext.Provider value={{ loading, user, signup, login, logout }}>
        {children}
    </AuthContext.Provider>);
}

export function useAuth() {
    return useContext(AuthContext);
}