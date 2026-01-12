import RegisterForm from "@/components/RegisterForm";

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12">
            <div className="w-full max-w-lg space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to sync your extension settings.</p>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
