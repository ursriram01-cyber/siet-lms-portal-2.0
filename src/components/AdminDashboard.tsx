"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Users, GraduationCap, Calendar, ShieldAlert, Search,
    Trash2, Ban, Loader2, Megaphone, Bell, Clock,
    Palette, LayoutDashboard, ChevronRight, Activity, CheckCircle2,
    CreditCard, Settings, RefreshCcw, Unlock, Lock
} from "lucide-react";

type Tab = "overview" | "users" | "announcements" | "subscription";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [stats, setStats] = useState({
        totalUsers: 0,
        deptStats: {} as Record<string, number>,
        yearStats: {} as Record<string, number>
    });
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [bannerForm, setBannerForm] = useState({
        content: "",
        is_enabled: true,
        bg_color: "#3b82f6",
        text_color: "#ffffff",
        expires_at: ""
    });
    const [subConfig, setSubConfig] = useState({
        subscription_enabled: false,
        trial_duration_months: 5,
        grace_period_days: 7
    });
    const [features, setFeatures] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
        fetchAnnouncements();
        fetchConfig();
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        try {
            const WORKER_URL = "https://siet-lms-backend.ursriram01.workers.dev/admin/get-data";
            const res = await fetch(WORKER_URL, { method: 'POST' });
            const data = await res.json();
            if (data.features) setFeatures(data.features);
            if (data.config) setSubConfig(data.config);
        } catch (err) {
            console.error("Failed to fetch features from Worker", err);
            // Fallback to Supabase if Worker fails
            const { data } = await supabase.from('feature_controls').select('*').order('feature_name');
            if (data) setFeatures(data);
        }
    };

    const handleToggleFeaturePremium = async (featureId: number, currentStatus: boolean) => {
        try {
            const WORKER_URL = "https://siet-lms-backend.ursriram01.workers.dev/admin/update-feature";
            await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: featureId, is_premium: !currentStatus })
            });

            // Also update Supabase to keep them in sync
            await supabase.from('feature_controls').update({ is_premium: !currentStatus }).eq('id', featureId);

            fetchFeatures();
        } catch (error: any) {
            alert("Failed to update feature: " + error.message);
        }
    };

    const fetchConfig = async () => {
        // Handled by fetchFeatures now (bulk fetch)
    };

    const handleSaveConfig = async () => {
        try {
            const WORKER_URL = "https://siet-lms-backend.ursriram01.workers.dev/admin/update-config";
            await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subConfig)
            });

            // Sync with Supabase
            await supabase.from('app_config').update(subConfig).eq('id', 1);

            alert("Subscription settings updated!");
        } catch (error: any) {
            alert("Failed to update settings: " + error.message);
        }
    };

    const handleToggleExempt = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase.from('profiles').update({ subscription_exempt: !currentStatus }).eq('id', userId);
            if (error) throw error;
            fetchData();
        } catch (error: any) {
            alert("Failed to update exempt status: " + error.message);
        }
    };

    const fetchAnnouncements = async () => {
        const { data } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setAnnouncements(data);
    };

    const handleSaveAnnouncement = async () => {
        if (!bannerForm.content) {
            alert("Please enter message content.");
            return;
        }

        try {
            const dataToInsert = {
                ...bannerForm,
                expires_at: bannerForm.expires_at || null
            };
            const { error } = await supabase.from('announcements').insert([dataToInsert]);
            if (error) throw error;
            alert("Announcement saved!");
            setBannerForm({
                content: "",
                is_enabled: true,
                bg_color: "#3b82f6",
                text_color: "#ffffff",
                expires_at: ""
            });
            fetchAnnouncements();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDeleteAnnouncement = async (id: string) => {
        try {
            const { error } = await supabase.from('announcements').delete().eq('id', id);
            if (error) throw error;
            fetchAnnouncements();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No active session");

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', session.user.id)
                .single();

            if (profileError || !profile?.is_admin) {
                throw new Error("You do not have administrative privileges.");
            }

            const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            if (data) {
                setUsers(data);
                const deptStats: Record<string, number> = {};
                const yearStats: Record<string, number> = {};
                data.forEach(u => {
                    if (u.department) deptStats[u.department] = (deptStats[u.department] || 0) + 1;
                    if (u.academic_year) yearStats[u.academic_year] = (yearStats[u.academic_year] || 0) + 1;
                });
                setStats({
                    totalUsers: data.length,
                    deptStats,
                    yearStats
                });
            }
        } catch (error: any) {
            console.error("Fetch Error:", error);
            alert(`Access Denied: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId: string, isBanned: boolean) => {
        try {
            const { error } = await supabase.from('profiles').update({ is_banned: !isBanned }).eq('id', userId);
            if (error) throw error;
            fetchData();
        } catch (error: any) {
            alert(`Failed to update user: ${error.message}`);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 space-y-2">
                <div className="mb-8 px-4">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="text-blue-500" /> Admin
                    </h1>
                    <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Portal Control</p>
                </div>

                <nav className="space-y-1">
                    {[
                        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                        { id: "users", label: "User Control", icon: Users },
                        { id: "announcements", label: "Broadcast", icon: Megaphone },
                        { id: "subscription", label: "Monetization", icon: CreditCard },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={20} className={activeTab === tab.id ? "text-white" : "text-slate-500 group-hover:text-blue-400"} />
                                <span className="font-medium">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <ChevronRight size={16} />}
                        </button>
                    ))}
                </nav>

                <div className="mt-12 p-4 bg-slate-900/50 border border-slate-800 rounded-3xl">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                        <Activity size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">System Status</span>
                    </div>
                    <p className="text-xs text-slate-400">All systems operational. Remote config synced.</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-2">System Overview</h2>
                            <p className="text-slate-400">Real-time usage statistics and demographic breakdown.</p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={80} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <span className="text-slate-400 font-medium">Total Registered Users</span>
                                    {loading ? (
                                        <div className="h-12 w-24 bg-slate-800 animate-pulse rounded-xl" />
                                    ) : (
                                        <div className="text-5xl font-bold text-white tracking-tight">{stats.totalUsers}</div>
                                    )}
                                    <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Live from Supabase
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <GraduationCap size={80} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <span className="text-slate-400 font-medium">Active Departments</span>
                                    {loading ? (
                                        <div className="h-12 w-24 bg-slate-800 animate-pulse rounded-xl" />
                                    ) : (
                                        <div className="text-5xl font-bold text-white tracking-tight">{Object.keys(stats.deptStats).length}</div>
                                    )}
                                    <p className="text-slate-500 text-sm">Diversified academic reach</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Year Distribution */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Calendar className="text-purple-500" size={20} /> Year Distribution
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.yearStats).sort((a, b) => b[1] - a[1]).map(([year, count]) => (
                                        <div key={year} className="group relative">
                                            <div className="flex justify-between mb-1 text-sm">
                                                <span className="text-slate-400">{year}</span>
                                                <span className="text-white font-bold">{count}</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 transition-all duration-1000"
                                                    style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dept Distribution */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <GraduationCap className="text-emerald-500" size={20} /> Top Departments
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(stats.deptStats).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([dept, count]) => (
                                        <div key={dept} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                            <span className="text-slate-300 font-medium text-sm truncate max-w-[150px]">{dept}</span>
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-sm font-bold rounded-lg border border-emerald-500/20">{count} Users</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="space-y-6">
                        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-1">User Management</h2>
                                <p className="text-slate-400">Manage access and monitor student profiles.</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or department..."
                                    className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-blue-500 shadow-xl outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </section>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                        <tr>
                                            <th className="px-8 py-5">Profile</th>
                                            <th className="px-8 py-5">Academic info</th>
                                            <th className="px-8 py-5">Subscription</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredUsers.length === 0 ? (
                                            <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-medium italic">No matches found for "{searchTerm}"</td></tr>
                                        ) : (
                                            filteredUsers.map((u) => (
                                                <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-bold group-hover:text-blue-400 transition-colors">{u.full_name}</span>
                                                            <span className="text-slate-500 text-xs mt-0.5">{u.mobile_number}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-slate-300 text-sm font-medium">{u.department}</span>
                                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{u.academic_year}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            {u.subscription_exempt ? (
                                                                <span className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                                    <Unlock size={12} /> Exempt (Lifetime)
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <span className="text-slate-300 text-sm">
                                                                        {u.trial_end_date ? new Date(u.trial_end_date).toLocaleDateString() : 'N/A'}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Trial Ends</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        {u.is_banned ? (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-500/20">
                                                                <Ban size={10} /> Banned
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
                                                                <CheckCircle2 size={10} /> Active
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleToggleExempt(u.id, u.subscription_exempt)}
                                                                className={`p-2.5 rounded-xl transition-all active:scale-90 ${u.subscription_exempt
                                                                    ? 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
                                                                    : 'bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700'
                                                                    }`}
                                                                title={u.subscription_exempt ? "Remove Exemption" : "Grant Lifetime Access"}
                                                            >
                                                                {u.subscription_exempt ? <Lock size={18} /> : <Unlock size={18} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleBanUser(u.id, u.is_banned)}
                                                                className={`p-2.5 rounded-xl transition-all active:scale-90 ${u.is_banned
                                                                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                                                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                                    }`}
                                                                title={u.is_banned ? "Unban student" : "Ban student"}
                                                            >
                                                                <Ban size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "announcements" && (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-2">Broadcast Center</h2>
                            <p className="text-slate-400">Push real-time updates to all active extension users.</p>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Editor */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Message Content</label>
                                            <textarea
                                                value={bannerForm.content}
                                                onChange={(e) => setBannerForm({ ...bannerForm, content: e.target.value })}
                                                placeholder="Enter your announcement here..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-xl text-white focus:border-blue-500 outline-none h-48 transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                                    <Palette size={14} /> Banner Color
                                                </label>
                                                <input
                                                    type="color"
                                                    value={bannerForm.bg_color}
                                                    onChange={(e) => setBannerForm({ ...bannerForm, bg_color: e.target.value })}
                                                    className="w-full h-14 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 cursor-pointer outline-none hover:border-slate-600 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                                        <Clock size={14} /> Auto-Expiry
                                                    </label>
                                                    {!bannerForm.expires_at && (
                                                        <span className="text-[10px] text-amber-500 font-bold animate-pulse">Set Date & Time</span>
                                                    )}
                                                </div>
                                                <input
                                                    type="datetime-local"
                                                    value={bannerForm.expires_at}
                                                    onChange={(e) => setBannerForm({ ...bannerForm, expires_at: e.target.value })}
                                                    className="w-full h-14 bg-slate-950 border border-slate-800 rounded-2xl px-5 text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveAnnouncement}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        <Bell size={20} /> Deploy Announcement
                                    </button>
                                </div>
                            </div>

                            {/* Preview & History */}
                            <div className="lg:col-span-5 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Live Preview</label>
                                    <div
                                        style={{ backgroundColor: bannerForm.bg_color, color: "#ffffff" }}
                                        className="rounded-3xl p-8 text-center font-bold text-lg shadow-2xl min-h-[140px] flex items-center justify-center border border-white/10 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="relative z-10">{bannerForm.content || "Wait for your message..."}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-4">Deployment History</h3>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {announcements.map(a => (
                                            <div key={a.id} className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl flex items-center justify-between gap-4 group">
                                                <div className="flex-1 truncate">
                                                    <p className="text-sm text-slate-200 font-medium truncate">{a.content}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold mt-1">
                                                        {a.expires_at ? `Expires: ${new Date(a.expires_at).toLocaleString()}` : 'No Expiry'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAnnouncement(a.id)}
                                                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "subscription" && (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-2">Monetization Settings</h2>
                            <p className="text-slate-400">Control the global subscription system and trial periods.</p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white">Subscription System</h3>
                                        <p className="text-sm text-slate-400">Master switch for all monetization features.</p>
                                    </div>
                                    <button
                                        onClick={() => setSubConfig({ ...subConfig, subscription_enabled: !subConfig.subscription_enabled })}
                                        className={`w-16 h-8 rounded-full transition-colors relative ${subConfig.subscription_enabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${subConfig.subscription_enabled ? 'left-9' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 text-xs text-slate-400">
                                    <p className="flex gap-2">
                                        <ShieldAlert size={14} className="text-amber-500 shrink-0" />
                                        <span>If disabled, the extension behaves as fully free for everyone. No trial checks will be performed.</span>
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Trial Duration (Months)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={subConfig.trial_duration_months}
                                            onChange={(e) => setSubConfig({ ...subConfig, trial_duration_months: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none font-bold text-xl"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Months</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Grace Period (Days)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={subConfig.grace_period_days}
                                            onChange={(e) => setSubConfig({ ...subConfig, grace_period_days: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none font-bold text-xl"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Days</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveConfig}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Settings size={18} /> Save Settings
                                </button>
                            </div>
                        </div>

                        {/* Feature Controls Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Premium Feature Controls</h3>
                                    <p className="text-sm text-slate-400 mt-1">Designate which features require subscription access</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {features.map((feature) => (
                                    <div key={feature.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium">{feature.feature_name}</span>
                                                {feature.is_premium ? (
                                                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20">PREMIUM</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">FREE</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleFeaturePremium(feature.id, feature.is_premium)}
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${feature.is_premium
                                                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
                                                : 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border border-purple-500/20'
                                                }`}
                                        >
                                            {feature.is_premium ? 'Make Free' : 'Make Premium'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-200">
                                <p className="flex gap-2">
                                    <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span>Changes take effect on next extension sync (once per day). Users can reload extension to force sync.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
