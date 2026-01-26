"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tiers = [
    {
        name: "Tier 1 – STARTER",
        subtitle: "Single-page website",
        price: "₹7,200",
        originalPrice: "₹8,000",
        discount: "10% OFF",
        features: [
            "Basic UI design",
            "Fully mobile responsive",
            "Contact form (Email/WhatsApp)",
            "Custom colour palette (3 samples)",
            "Basic SEO setup",
        ],
        cta: "GET STARTED",
        popular: false,
    },
    {
        name: "Tier 2 – GROWTH",
        subtitle: "3 Pages",
        price: "₹12,600",
        originalPrice: "₹14,000",
        discount: "10% OFF",
        features: [
            "3-page advanced website",
            "Modern UI/UX (React, GSAP & Framer Motion)",
            "Fully mobile optimized",
            "Integrated maps & advanced forms",
            "Smooth scroll animations",
            "Google Login authentication",
            "Basic SEO included",
        ],
        cta: "CHOOSE PLAN",
        popular: false,
    },
    {
        name: "Tier 3 – BUSINESS",
        subtitle: "6–8 Pages",
        price: "₹15,000",
        originalPrice: "₹20,000",
        discount: "25% OFF",
        features: [
            "6–8 page professional website",
            "Fully custom UI/UX (Figma + front-end build)",
            "Complete SEO setup (titles, metas, schema)",
            "Domain deployment & hosting setup",
            "Speed optimization (90+ score target)",
            "Multi-authentication system (Google, OTP, Email, Facebook)",
            "Professional business email setup",
            "Google Analytics & Search Console integration",
            "Includes 3 months maintenance",
        ],
        cta: "GO BUSINESS",
        popular: true,
    },
    {
        name: "Tier 4 – E-COMMERCE",
        subtitle: "9–12+ Pages",
        price: "₹24,500",
        originalPrice: "₹35,000",
        discount: "30% OFF",
        features: [
            "9–12+ page full-scale website",
            "Complete E-commerce system (up to 30 products)",
            "Custom dashboard (orders, inventory, products)",
            "Blog system + CMS editor & Admin panel",
            "Advanced authentication (Google, Facebook, OTP, Email)",
            "Payment gateway integration (Razorpay/Stripe)",
            "Order tracking + inventory management",
            "Automated email notifications",
            "Advanced SEO + indexing setup & High-level security",
            "Automated backups",
            "Includes 6+ months maintenance",
        ],
        cta: "FULL E-COMMERCE",
        popular: false,
    },
];

export function PricingSection() {
    return (
        <section className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider"
                    >
                        Pricing Tiers & Solutions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto"
                    >
                        4 Flexible Plans • Scales for All Business Needs <br className="hidden md:block" />
                        UI/UX, Backend, and E-Commerce Solutions • Maintenance & Authentication Included
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className={cn(
                                "relative flex flex-col p-6 rounded-none border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm",
                                tier.popular ? "border-primary shadow-[0_0_20px_rgba(255,230,0,0.15)]" : "hover:border-primary/50"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black font-bold px-4 py-1 text-sm uppercase tracking-wider shadow-lg">
                                    Best Value
                                </div>
                            )}

                            <div className="text-center mb-8 pt-4">
                                <h3 className="text-xl font-bold uppercase mb-2 text-primary">
                                    {tier.name}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">{tier.subtitle}</p>

                                <div className="flex flex-col items-center gap-1 mb-2">
                                    <span className="text-gray-500 line-through text-sm font-medium">
                                        {tier.originalPrice}
                                    </span>
                                    <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded">
                                        {tier.discount}
                                    </span>
                                </div>
                                <div className="text-4xl font-bold text-white">
                                    {tier.price}
                                </div>
                            </div>

                            <ul className="flex-1 space-y-4 mb-8">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-gray-300 text-sm leading-tight text-left">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={cn(
                                    "w-full font-bold uppercase tracking-wider py-6 text-base transition-all duration-300",
                                    tier.popular
                                        ? "bg-primary text-black hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(255,230,0,0.3)]"
                                        : "bg-primary text-black hover:bg-primary/90"
                                )}
                            >
                                {tier.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
