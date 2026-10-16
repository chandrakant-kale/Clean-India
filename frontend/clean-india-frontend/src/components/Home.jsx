import Hero from "./points/Hero";
import Info from "./points/Info";
import Last from "./points/last";
import Rate from "./points/Rate";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#F8F7F2] text-[#252820]">
            <Hero />
            <Info />
            <Rate />
            <Last />
        </main>
    );
}