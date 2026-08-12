import { SignupForm } from "@/components/signup-form";
import { Link } from "react-router-dom";

export function Signup() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-50 relative">
            <Link to="/" className="absolute top-5 left-5"><img src="/public/logo.png" className="h-10"></img></Link>
            <div className="w-full max-w-sm">
                <SignupForm />
            </div>
        </div>
    );
}