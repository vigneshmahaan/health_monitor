import Dashboard from "@/components/Dashboard";

export default function Home() {
    return (
        <main className="min-h-screen p-4 md:p-8 lg:p-12 relative overflow-hidden">
            {}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-success/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 h-full">
                <Dashboard />
            </div>
        </main>
    );
}
