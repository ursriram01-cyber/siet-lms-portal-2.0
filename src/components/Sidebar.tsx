"use client";

import Image from "next/image";
import { Instagram, MessageCircle, Mail } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="sticky-sidebar w-80 bg-slate-900 border-r border-slate-800 p-8 flex flex-col gap-8">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl shadow-blue-500/20">
                    <Image
                        src="/sriram.png"
                        alt="Sriram"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Sriram</h2>
                    <p className="text-blue-400 font-medium">Human</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">About Me</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                    Iam Sriram from 1st year it,i love building apps and solution that solves real world problems
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Thought</h3>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                    "when i viewed the college portal i felt something off so i thought to fix that"
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Connect</h3>
                <div className="flex gap-4 items-center">
                    <a
                        href="https://www.instagram.com/ur_sriram/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Instagram"
                    >
                        <Instagram size={20} />
                    </a>
                    <a
                        href="https://wa.me/919488364412"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="WhatsApp"
                    >
                        <MessageCircle size={20} />
                    </a>
                    <a
                        href="mailto:ursriram01@gmail.com"
                        className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Email"
                    >
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </aside>
    );
}
