"use client";

export default function SubscriptionPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent"></div>
                <div className="container mx-auto px-6 py-24 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold">
                                Supporting Development
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Why Does SIET LMS<br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Need a Subscription?
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                            We believe in transparency. Here's exactly why we're asking for your support.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 pb-24">
                <div className="max-w-3xl mx-auto space-y-16">

                    {/* Real Costs Section */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Real Infrastructure Costs</h2>
                        </div>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                Every time you use the AI Assistant, it costs us money. We use Google's Gemini API, which charges per request.
                                With hundreds of users, these costs add up <strong className="text-white">fast</strong>.
                            </p>
                            <p>
                                Beyond AI, we're running:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                                <li>Supabase database for user authentication and storage</li>
                                <li>Vercel hosting for the admin dashboard</li>
                                <li>CDN and bandwidth costs</li>
                                <li>Email services for notifications</li>
                            </ul>
                            <p className="pt-4 border-t border-slate-800">
                                <strong className="text-blue-400">Translation:</strong> Every feature you love costs real money to run.
                            </p>
                        </div>
                    </section>

                    {/* Time Investment */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Hundreds of Hours</h2>
                        </div>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                This extension didn't appear overnight. It took:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                                <li><strong className="text-white">Design & Planning:</strong> Figuring out what students actually need</li>
                                <li><strong className="text-white">Development:</strong> Writing thousands of lines of code</li>
                                <li><strong className="text-white">Testing:</strong> Ensuring it works flawlessly on your LMS</li>
                                <li><strong className="text-white">Maintenance:</strong> Fixing bugs, adding features, staying updated</li>
                            </ul>
                            <p className="pt-4 border-t border-slate-800">
                                <strong className="text-purple-400">Translation:</strong> Your subscription supports ongoing development and improvements.
                            </p>
                        </div>
                    </section>

                    {/* What You Get */}
                    <section className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">What Your Support Unlocks</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { icon: "✨", title: "AI Code Assistant", desc: "Instant solutions powered by Gemini" },
                                { icon: "🎨", title: "Visual Themes", desc: "Game Mode & Anime Mode" },
                                { icon: "🛠️", title: "Code Helper Tools", desc: "Snippets, linting, autocomplete" },
                                { icon: "🎉", title: "Success Confetti", desc: "Celebrate your wins" },
                                { icon: "🚀", title: "Priority Support", desc: "Quick bug fixes and responses" },
                                { icon: "💡", title: "Future Features", desc: "New tools we're building" }
                            ].map((feature, i) => (
                                <div key={i} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                                    <div className="text-3xl mb-3">{feature.icon}</div>
                                    <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Free Alternative */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Always Free Features</h2>
                        </div>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                We're not locking <em>everything</em> behind a paywall. These stay free forever:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                                <li>Dark Mode theme</li>
                                <li>Screen time tracking</li>
                                <li>Basic UI improvements</li>
                            </ul>
                            <p className="pt-4 border-t border-slate-800">
                                <strong className="text-emerald-400">Our Promise:</strong> Core functionality will always be accessible to everyone.
                            </p>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <div className="text-center py-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Support Development?</h2>
                        <p className="text-slate-400 mb-8">Join hundreds of students who are keeping this project alive.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://siet-lms.vercel.app/subscribe"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Subscribe Now
                            </a>
                            <a
                                href="mailto:sietlmshelp@gmail.com"
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors border border-slate-700"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
