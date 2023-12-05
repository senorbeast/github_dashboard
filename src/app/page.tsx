import Dashboard from "@/components/Dashboard";
import NavBar from "@/components/Navbar";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="absolute top-0 left-0 z-10 w-full h-full">
                <NavBar />
                <Dashboard />
            </div>
        </main>
    );
}
