"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const addons = [
    "Logo & Branding Design",
    "Hosting Setup & Configuration",
    "Content Writing (SEO-optimized)",
    "Monthly Subscription Maintenance",
    "Advanced SEO Optimization",
    "Social Media Management",
    "Ad Campaign Management",
    "Full Branding Kit",
    "Website Security Enhancements",
    "Extra Pages / Extra Products",
    "API Integrations",
];

export function AddonsSection() {
    return (
        <section className="bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
            <div className="max-w-5xl mx-auto border border-primary/20 p-8 md:p-12 relative rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm">
                {/* Glow effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider flex items-center justify-center gap-3"
                    >
                        <span className="text-primary">//</span> OPTIONAL ADD-ONS
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12">
                    {addons.map((addon, index) => (
                        <motion.div
                            key={addon}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 230, 0, 0.05)", borderColor: "rgba(255, 230, 0, 0.5)" }}
                            className="border border-zinc-800 p-4 text-center text-gray-200 font-medium hover:text-primary transition-colors cursor-default rounded-sm bg-zinc-900/50"
                        >
                            {addon}
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Button variant="link" className="text-white underline underline-offset-4 hover:text-primary uppercase tracking-widest text-sm">
                        Discuss Custom Requirements
                    </Button>
                </div>
            </div>
        </section>
    );
}
