import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Forgot Password - ACMS" />

            <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1b3a] to-[#1b2a55] text-white flex flex-col">
                <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                    <section className="text-center mb-6 sm:mb-8">
                        <div className="mx-auto mb-4 sm:mb-6 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
                            <img
                                src="/images/ACMS_logo.png"
                                alt="ACMS Logo"
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                            />
                        </div>
                        <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl mx-auto px-4">
                            Academy Course Management System
                        </p>
                    </section>

                    <section className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
                        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8">
                            <div className="text-center mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    Forgot Password
                                </h2>
                                <p className="text-white/70 text-xs sm:text-sm mt-1">
                                    Reset your ACMS account password
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs sm:text-sm">
                                    {status}
                                </div>
                            )}

                            <div className="mb-4 text-xs sm:text-sm text-white/80">
                                <span className="font-bold">
                                    Forgot your password?
                                </span>
                                <br />
                                No problem. Just let us know your email address
                                and we will email you a password reset link that
                                will allow you to choose a new one.
                            </div>

                            <form
                                onSubmit={submit}
                                className="space-y-3 sm:space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs sm:text-sm text-white/80 mb-1"
                                    >
                                        Email Address
                                    </label>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:ring-2 focus:ring-[#22d3ee] text-white placeholder-white/50 text-sm sm:text-base"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="you@example.com"
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-1 text-xs sm:text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-xl py-2 sm:py-3 font-semibold bg-[#22d3ee] hover:opacity-90 transition text-sm sm:text-base"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Sending..."
                                        : "Email Password Reset Link"}
                                </button>
                            </form>

                            <div className="mt-4 text-center">
                                <a
                                    href="/"
                                    className="text-xs text-[#22d3ee] hover:underline"
                                >
                                    ← Back to Login
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-slate-800 text-gray-300 py-3 sm:py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm">
                        © {new Date().getFullYear()} PMEC — Professional
                        Management Expertise Center
                    </div>
                </footer>
            </div>
        </>
    );
}
