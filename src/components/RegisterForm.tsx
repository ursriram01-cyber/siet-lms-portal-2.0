"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User, GraduationCap, Calendar, CheckCircle2, Loader2, RefreshCw, AlertCircle, Settings } from "lucide-react";

export default function RegisterForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [extensionId, setExtensionId] = useState("njnpnjnjndboojihhmeibamkcehbklke");
    const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
    const [user, setUser] = useState<any>(null);
    const [showIdInput, setShowIdInput] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        department: "",
        academicYear: "",
        dob: "",
        countryCode: "+91",
        phoneNumber: ""
    });

    const syncWithExtension = useCallback(async (token: string) => {
        if (typeof window === "undefined" || !(window as any).chrome?.runtime?.sendMessage) {
            console.log("Chrome runtime not available");
            setSyncStatus("error");
            return;
        }

        setSyncStatus("syncing");
        try {
            (window as any).chrome.runtime.sendMessage(extensionId, {
                action: "setToken",
                token: token
            }, (response: any) => {
                if ((window as any).chrome.runtime.lastError) {
                    console.error("Sync Error:", (window as any).chrome.runtime.lastError);
                    setSyncStatus("error");
                } else if (response?.status === "success") {
                    console.log("Extension synced successfully");
                    setSyncStatus("success");
                } else {
                    setSyncStatus("error");
                }
            });
        } catch (err) {
            console.error("Sync Catch Error:", err);
            setSyncStatus("error");
        }
    }, [extensionId]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                setFormData(prev => ({ ...prev, fullName: session.user.user_metadata.full_name || "" }));

                // Check if profile exists
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setStep(4);
                    // Automatically attempt to sync token if profile exists
                    if (session.access_token) {
                        syncWithExtension(session.access_token);
                    }
                } else {
                    setStep(2);
                }
            }
        };
        checkUser();
    }, [syncWithExtension]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/register`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Supabase Login Error", error);
            alert("Failed to login with Google");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // Save to Supabase
            const { error } = await supabase.from('profiles').insert({
                id: user.id,
                full_name: formData.fullName,
                department: formData.department,
                academic_year: formData.academicYear,
                date_of_birth: formData.dob,
                mobile_number: `${formData.countryCode}${formData.phoneNumber}`
            });
            if (error) throw error;

            // Attempt to sync token with Extension
            if (token) {
                await syncWithExtension(token);
            }

            setStep(4);
        } catch (error: any) {
            console.error("Submit Error", error);
            alert(`Failed to complete registration: ${error.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSync = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            syncWithExtension(session.access_token);
        } else {
            alert("Please sign in again to sync.");
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
            {/* Steps Progress */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
                {[1, 2, 4].map((s, idx) => (
                    <div
                        key={s}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-800 text-slate-500"
                            }`}
                    >
                        {step > s ? <CheckCircle2 size={20} /> : (idx + 1)}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-6 text-center">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Create your account</h2>
                        <p className="text-slate-400">Join the professional community of extension users.</p>
                    </div>
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                                Continue with Google
                            </>
                        )}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Academic Details</h2>
                        <p className="text-slate-400">Tell us a bit more about yourself.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><User size={18} /></span>
                            <input
                                type="text" placeholder="Full Name"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><GraduationCap size={18} /></span>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-colors appearance-none"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                <option value="CSE">Computer Science and Engineering (CSE)</option>
                                <option value="CyberSecurity">CSE (Cyber Security)</option>
                                <option value="AIDS">Artificial Intelligence and Data Science</option>
                                <option value="AIML">Artificial Intelligence and Machine Learning</option>
                                <option value="ECE">Electronics and Communication Engineering (ECE)</option>
                                <option value="VLSI">Electronics Engineering (VLSI Design & Technology)</option>
                                <option value="EEE">Electrical and Electronics Engineering (EEE)</option>
                                <option value="IT">Information Technology (IT)</option>
                                <option value="MECH">Mechanical Engineering</option>
                                <option value="CIVIL">Civil Engineering</option>
                                <option value="AGRI">Agricultural Engineering</option>
                                <option value="BIOMED">Biomedical Engineering</option>
                                <option value="BIOTECH">Biotechnology</option>
                                <option value="FOOD">Food Technology</option>
                            </select>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Calendar size={18} /></span>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-colors appearance-none"
                                value={formData.academicYear}
                                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                            >
                                <option value="">Select Academic Year</option>
                                <option value="2022-2026">2022 - 2026</option>
                                <option value="2023-2027">2023 - 2027</option>
                                <option value="2024-2028">2024 - 2028</option>
                                <option value="2025-2029">2025 - 2029</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 ml-1 font-medium">Date of Birth</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Calendar size={18} /></span>
                                <input
                                    type="date"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.dob}
                                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 ml-1 font-medium">Mobile Number</label>
                            <div className="flex gap-2">
                                <div className="relative w-24">
                                    <input
                                        type="text" placeholder="+91"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-center text-white focus:border-blue-500 outline-none transition-colors"
                                        value={formData.countryCode}
                                        onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="tel" placeholder="Mobile Number"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors"
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.phoneNumber || !formData.department}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Complete Registration"}
                    </button>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 text-center py-8">
                    <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        {syncStatus === "syncing" ? (
                            <Loader2 size={48} className="animate-spin text-emerald-500" />
                        ) : syncStatus === "error" ? (
                            <AlertCircle size={48} className="text-red-500" />
                        ) : (
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            {syncStatus === "success" ? "All set!" : syncStatus === "syncing" ? "Syncing..." : "Sync Required"}
                        </h2>
                        <p className="text-slate-400 italic">
                            {syncStatus === "error" ? "Extension ID mismatch or connection blocked." : "Welcome to the premium experience."}
                        </p>
                    </div>

                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-4">
                        <p className="text-slate-300 text-sm">
                            {syncStatus === "success"
                                ? "Your extension is now unlocked! You can close this window."
                                : "If your extension is still locked, it may be due to a local ID mismatch."}
                        </p>

                        {(syncStatus === "error" || showIdInput) && (
                            <div className="space-y-3 pt-2 text-left border-t border-slate-800 mt-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Configuration</label>
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-400">Find your ID in <code className="text-blue-400">chrome://extensions</code></p>
                                    <input
                                        type="text"
                                        value={extensionId}
                                        onChange={(e) => setExtensionId(e.target.value)}
                                        placeholder="Extension ID"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleManualSync}
                            disabled={syncStatus === "syncing"}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} className={syncStatus === "syncing" ? "animate-spin" : ""} />
                            {syncStatus === "syncing" ? "Syncing..." : "Sync with Extension"}
                        </button>
                    </div>

                    {!showIdInput && syncStatus !== "success" && (
                        <button
                            onClick={() => setShowIdInput(true)}
                            className="text-xs text-slate-500 hover:text-white flex items-center gap-1 mx-auto transition-colors"
                        >
                            <Settings size={12} /> Troubleshoot Extension ID
                        </button>
                    )}

                    <button
                        onClick={() => window.location.href = "/"}
                        className="px-8 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-medium rounded-xl transition-all"
                    >
                        Return Home
                    </button>
                </div>
            )}
        </div>
    );
}
