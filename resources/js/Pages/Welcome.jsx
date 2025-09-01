import React from "react";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Welcome() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title="ACMS — Professional Management Expertise Center" />

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
                        {/* <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2">
                            ACMS
                        </h1> */}
                        <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl mx-auto px-4">
                            Academy Course Management System
                        </p>
                    </section>

                    <section className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
                        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8">
                            <div className="text-center mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    ACMS Login
                                </h2>
                                <p className="text-white/70 text-xs sm:text-sm mt-1">
                                    Access your ACMS dashboard
                                </p>
                            </div>

                            <form
                                onSubmit={submit}
                                className="space-y-3 sm:space-y-4"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="block text-xs sm:text-sm text-white/80 mb-1"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:ring-2 focus:ring-[#22d3ee] text-white placeholder-white/50 text-sm sm:text-base"
                                        autoComplete="username"
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

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <InputLabel
                                            htmlFor="password"
                                            value="Password"
                                            className="block text-xs sm:text-sm text-white/80"
                                        />
                                        <a
                                            href={route("password.request")}
                                            className="text-xs text-[#22d3ee] hover:underline"
                                        >
                                            Forgot?
                                        </a>
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 outline-none focus:ring-2 focus:ring-[#22d3ee] text-white placeholder-white/50 text-sm sm:text-base"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="••••••••"
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-1 text-xs sm:text-sm"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="accent-[#22d3ee]"
                                        />
                                        Remember me
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-xl py-2 sm:py-3 font-semibold bg-[#22d3ee] hover:opacity-90 transition text-sm sm:text-base"
                                    disabled={processing}
                                >
                                    {processing ? "Logging in..." : "Login"}
                                </button>
                            </form>

                            <p className="text-xs text-white/60 mt-3 sm:mt-4">
                                By continuing you agree to our{" "}
                                <a
                                    href="#"
                                    className="text-[#22d3ee] hover:underline"
                                >
                                    Terms
                                </a>{" "}
                                &{" "}
                                <a
                                    href="#"
                                    className="text-[#22d3ee] hover:underline"
                                >
                                    Privacy
                                </a>
                                .
                            </p>
                        </div>

                        <p className="text-center text-xs text-white/60 mt-3 sm:mt-4">
                            Don't have an account?{" "}
                            <a
                                href="#"
                                className="text-[#a78bfa] hover:underline"
                            >
                                Request access
                            </a>
                        </p>
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
