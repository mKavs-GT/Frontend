import { PricingSection } from "@/components/pricing/PricingSection";
import { AddonsSection } from "@/components/pricing/AddonsSection";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
            <PricingSection />
            <AddonsSection />
        </main>
    );
}
