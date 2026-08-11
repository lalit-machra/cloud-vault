import { useNavigate } from "react-router-dom";

export function Navbar() {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 flex flex-row justify-between items-center py-6 bg-[oklch(0.97_0_0)]">
            <div className="h-full pl-5">
                <img className="h-12" src="../../../public/logo.png"></img>
            </div>
            <div className="h-full pr-6 flex flex-row justify-between items-center gap-10">
                <button onClick={() => navigate("/login")} className="w-20 h-12 p-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">Login</button>
                <button onClick={() => navigate("/signup")} className="w-20 h-12 p-2 bg-white text-cyan-500 border-1 border-cyan-500 rounded-md hover:bg-cyan-100/20">Sign Up</button>
            </div>
        </div>
    );
}