import { useAuth } from "@/common/context/AuthContext";
import { Navigate } from "react-router-dom";

export function Protected({ children }) {
    const { loading, user } = useAuth();
    console.log(user);
    if (loading) {
        return <h2 className="text-black-500 bg-grey-500/50 m-auto">Loading...</h2>
    } else {
        if (!user.userId) {
            return <Navigate to="/login"></Navigate>
        }
        return (
            <>{children}</>
        );
    }
}