export function Hero() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-10 mb-70">
            <div className="flex flex-col justify-center items-center gap-10 mt-50">
                <p className="text-6xl text-cyan-500">A simple way to store and manage your files.</p>
                <p className="text-xl text-gray-500 max-w-2xl text-center leading-relaxed">Upload, organize, and access your files securely from anywhere.</p>
            </div>
            <div className="mt-50 rounded-2xl border border-cyan-200 bg-cyan-100/30 shadow-lg shadow-black/5 p-2"><img src="/homepage-cloud-vault.png" className="h-140 w-full rounded-xl"></img></div>
        </div>
    );
}