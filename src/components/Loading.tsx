export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
            <div className="flex flex-col items-center">
                <div
                    role="status"
                    aria-label="Loading"
                    className="h-24 w-24 animate-spin rounded-full border-4 border-white/30 border-t-white"
                />
                <p className="mt-2 font-bold text-white">Loading...</p>
            </div>
        </div>
    );
}