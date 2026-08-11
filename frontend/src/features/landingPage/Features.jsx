export function Features({ featurePageNumber, featureTitle, featureDescription, featureImg }) {
    return (
        <>
            {(featurePageNumber % 2 != 0) ?
                (<div className="min-h-screen w-full flex flex-row justify-end items-center mb-50 bg-gray-100/60">
                    <div className="w-2/5 flex flex-col justify-center items-center gap-6">
                        <p className="text-4xl text-cyan-500 max-w-[400px]">{featureTitle}</p>
                        <p className="text-xl text-gray-500 text-wrap leading-relaxed max-w-[400px]">{featureDescription}</p>
                    </div>
                    <div className="w-3/5">
                        <div className="rounded-2xl border border-cyan-200 bg-cyan-100/30 shadow-lg shadow-black/5 p-2"><img src={featureImg} className="rounded-xl"></img></div>
                    </div>
                </div>) :
                (<div className="min-h-screen w-full flex flex-row justify-start items-center mb-50">
                    <div className="w-3/5">
                        <div className="rounded-2xl border border-cyan-200 bg-cyan-100/30 shadow-lg shadow-black/5 p-2"><img src={featureImg} className="rounded-xl"></img></div>
                    </div>
                    <div className="w-2/5 flex flex-col justify-center items-center gap-6">
                        <p className="text-4xl text-cyan-500 max-w-[400px]">{featureTitle}</p>
                        <p className="text-xl text-gray-500 text-wrap max-w-[400px] leading-relaxed">{featureDescription}</p>
                    </div>
                </div>)
            }
        </>
    );
}