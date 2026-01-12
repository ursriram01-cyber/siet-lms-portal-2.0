"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function SubscribePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/login");
            return;
        }
        setUser(session.user);
        setLoading(false);
    };

    const handlePayment = async (plan: 'monthly' | 'half_yearly' | 'yearly') => {
        if (!user) {
            alert("Please login first");
            return;
        }

        setProcessing(true);

        // Razorpay amounts are in paise (multiply by 100)
        const amounts = {
            monthly: 500,     // ₹5
            half_yearly: 2900, // ₹29
            yearly: 4900      // ₹49
        };

        const planNames = {
            monthly: "Monthly",
            half_yearly: "6 Months",
            yearly: "Yearly"
        };

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID", // Replace with your actual key
            amount: amounts[plan],
            currency: "INR",
            name: "SIET LMS Extension",
            description: `${planNames[plan]} Subscription`,
            image: "/icon.png",
            handler: async function (response: any) {
                // Payment successful
                console.log("Payment success:", response);

                // Update user subscription in database
                const endDate = new Date();
                if (plan === 'monthly') {
                    endDate.setMonth(endDate.getMonth() + 1);
                } else if (plan === 'half_yearly') {
                    endDate.setMonth(endDate.getMonth() + 6);
                } else {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }

                const { error } = await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                        subscription_end_date: endDate.toISOString()
                    })
                    .eq('id', user.id);

                // SYNC WITH CLOUDFLARE D1
                try {
                    const WORKER_URL = "https://siet-lms-backend.ursriram01.workers.dev/update-subscription";
                    await fetch(WORKER_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            plan: plan
                        })
                    });
                    console.log("SIET TRACKER: Synced subscription to Cloudflare D1");
                } catch (err) {
                    console.error("SIET TRACKER: Failed to sync subscription to Cloudflare", err);
                }

                if (error) {
                    console.error("Error updating subscription:", error);
                    alert("Payment received but failed to update subscription. Please contact support.");
                } else {
                    alert("🎉 Subscription activated! Reload your extension to access premium features.");
                    router.push("/admin");
                }
                setProcessing(false);
            },
            prefill: {
                email: user.email,
                contact: user.user_metadata?.mobile_number || ""
            },
            theme: {
                color: "#3b82f6"
            },
            modal: {
                ondismiss: function () {
                    setProcessing(false);
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {/* Load Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="container mx-auto px-6 py-16">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                Choose Your Plan
                            </h1>
                            <p className="text-xl text-slate-400">
                                Unlock premium features and support development
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {/* Monthly Plan */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-colors flex flex-col">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold text-white">₹5</span>
                                        <span className="text-slate-400 text-sm">/month</span>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-2">Perfect for trying it out</p>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {[
                                        "✨ AI Code Assistant",
                                        "🎨 Game & Anime Modes",
                                        "🛠️ Code Helper Tools"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePayment('monthly')}
                                    disabled={processing}
                                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 text-white font-bold rounded-xl transition-colors"
                                >
                                    {processing ? "..." : "Monthly Plan"}
                                </button>
                            </div>

                            {/* 6 Months Plan */}
                            <div className="relative bg-slate-800 border-2 border-blue-500/30 rounded-3xl p-6 flex flex-col">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-blue-500/20">
                                        POPULAR
                                    </span>
                                </div>
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">6 Months</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold text-white">₹29</span>
                                        <span className="text-blue-200 text-sm">/6mo</span>
                                    </div>
                                    <p className="text-blue-300 text-xs mt-2">Just ₹4.8/month</p>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {[
                                        "✨ AI Consistently",
                                        "🎨 All Visual Themes",
                                        "🛠️ Advanced Tools",
                                        "🎉 Success Confetti",
                                        "🚀 Priority Support"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white text-sm">
                                            <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePayment('half_yearly')}
                                    disabled={processing}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    {processing ? "..." : "Get 6 Months"}
                                </button>
                            </div>

                            {/* Yearly Plan */}
                            <div className="relative bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 flex flex-col">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-purple-500/20">
                                        BEST VALUE
                                    </span>
                                </div>
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Yearly</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold text-white">₹49</span>
                                        <span className="text-purple-200 text-sm">/year</span>
                                    </div>
                                    <p className="text-purple-300 text-xs mt-2 font-bold">Unbeatable ₹4/month</p>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {[
                                        "💎 Everything Unlocked",
                                        "🎁 Early Access Features",
                                        "⭐ Founder's Badge",
                                        "🎨 Custom Theme Requests",
                                        "🚀 Instant Support"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white text-sm">
                                            <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePayment('yearly')}
                                    disabled={processing}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/20"
                                >
                                    {processing ? "..." : "Get Yearly"}
                                </button>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-white font-semibold">Can I upgrade later?</p>
                                    <p className="text-slate-400">Yes, you can upgrade to a longer plan anytime.</p>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Why is it so affordable?</p>
                                    <p className="text-slate-400">We want every student to have access to these tools. We rely on volume to cover our costs.</p>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Need help?</p>
                                    <p className="text-slate-400">
                                        Contact us at{" "}
                                        <a href="mailto:sietlmshelp@gmail.com" className="text-blue-400 hover:underline">
                                            sietlmshelp@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
