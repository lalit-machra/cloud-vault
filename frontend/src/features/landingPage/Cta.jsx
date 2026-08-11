import { useNavigate } from "react-router-dom";

export function Cta() {
    const githubUrl = "https://github.com/lalit-machra/cloud-vault";
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen bg-gray-100/60">
            <div className="flex-1 flex flex-col justify-center items-center gap-10">
                <p className="max-w-[400px] text-5xl text-cyan-500 pl-5">Your Files. Your Cloud. Your Way.</p>
                <button onClick={() => navigate("/signup")} className="w-38 h-18 p-2 bg-cyan-500 text-white text-xl rounded-md hover:bg-cyan-600">Get Started</button>
            </div>
            <footer className="w-full flex flex-row justify-between items-center py-8 px-6 bg-[oklch(0.97_0_0)]">
                <div className="h-full pr-6 flex flex-row justify-between items-center gap-10">
                    <p className="text-ls text-gray-500">Developed by Lalit Machra</p>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <div className="h-full pl-5">
                    <p className="text-ls text-gray-500">© 2026 Cloud Vault</p>
                </div>
            </footer>
        </div>
    );
}