import { ShieldCheck, Zap, BarChart3, Lock, ArrowRight, Chrome } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium animate-pulse">
          <Zap size={14} />
          <span>New: Gemini-Powered Code Solver</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
          Supercharge your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            LMS Experience
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate productivity extension for SIET LMS. Fix the dark mode,
          solve complex coding problems with AI, and code like a pro with built-in IDE features.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <a
            href="https://drive.google.com/file/d/1xN8TTxHPKWZWReFZEPT71Kh4D3Pl_Z1M/view"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 group"
          >
            Download Extension <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700">
            Features
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Powerful Extension Tools</h2>
          <p className="text-slate-400">Everything you need to master your coding labs and course content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">🤖 AI Assistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrated Gemini AI extract contexts and test cases to solve coding problems instantly with high availability.
            </p>
          </div>

          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">⚡ Smart Helpers</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              IDE-grade Linter, custom snippets (Abber), and instant boilerplate code insertion with Ctrl+Shift+K.
            </p>
          </div>

          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Lock size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">🎨 Premium Themes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Universal dark mode fixes with 12+ pro themes like Dracula, plus Game and Anime visual modes.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[3rem] p-12 md:p-24 border border-blue-500/10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white tracking-tight">Getting Started</h2>
              <p className="text-slate-400">Unlock full features in under a minute.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">Install Extension</h4>
                  <p className="text-slate-400 text-sm">Download and pin our extension for easy access to tools.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">Sign in & Sync</h4>
                  <p className="text-slate-400 text-sm">Log in with Google to sync your API keys and daily usage goals.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">Master the LMS</h4>
                  <p className="text-slate-400 text-sm">Use the new sidebar and AI tools to complete tasks efficiently.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-video bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/20 group-hover:opacity-0 transition-opacity flex items-center justify-center">
              <Chrome size={64} className="text-blue-400" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="pt-12 p-8 space-y-4 text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto" />
              <div className="h-4 bg-slate-700 rounded w-48 mx-auto" />
              <div className="h-10 bg-blue-600 rounded-lg w-32 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center pb-24">
        <div>
          <div className="text-4xl font-extrabold text-white">Gemini</div>
          <div className="text-slate-500 text-sm font-medium">Smart Solver</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-white">12+</div>
          <div className="text-slate-500 text-sm font-medium">IDE Themes</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-white">Live</div>
          <div className="text-slate-500 text-sm font-medium">Time Tracking</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-white">100%</div>
          <div className="text-slate-500 text-sm font-medium">LMS Support</div>
        </div>
      </section>
    </div>
  );
}
