"use client";

import Link from "next/link";
import { Chrome } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <Chrome size={24} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">ExtensionPortal</span>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors"
                >
                    Sign In
                </Link>
                <Link
                    href="/register"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    Sign Up with Google
                </Link>
            </div>
        </nav>
    );
}
