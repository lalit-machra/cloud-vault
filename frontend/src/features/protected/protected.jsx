import { useAuth } from "@/common/context/AuthContext";
import { Navigate } from "react-router-dom";
import { SpinnerButton } from "@/components/ui/spinner";

export function Protected({ children }) {
    const { loading, user } = useAuth();
    if (loading) {
        return <div className="h-screen w-screen flex justify-center items-center"><SpinnerButton text="Loading"></SpinnerButton></div>
    } else {
        if (!user.userId) {
            return <Navigate to="/login"></Navigate>
        }
        return (
            <>
                {children}
            </>
        );
    }
}