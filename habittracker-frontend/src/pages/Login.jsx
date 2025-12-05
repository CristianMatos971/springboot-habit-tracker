import { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validateLogin({ email, password });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await login({ email, password });
            navigate("/Dashboard");
        } catch (err) {
            setErrors({ api: err.message || "Invalid credentials" });
        }
    }

    function validateLogin({ email, password }) {
        const errors = {};

        if (!email.trim()) errors.email = "Email is required";
        else if (!email.includes("@")) errors.email = "Invalid email";

        if (!password) errors.password = "Password is required";
        else if (password.length < 6)
            errors.password = "Password must have at least 6 characters";

        return errors;
    }

    return (
        <>
            <Header />

            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
                >
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Please sign in to your account
                        </p>
                    </div>

                    {errors.api && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">{errors.api}</div>}

                    <div className="space-y-5">
                        <div>
                            {errors.email && <span className="text-red-500 text-xs float-right">{errors.email}</span>}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            {errors.password && <span className="text-red-500 text-xs float-right">{errors.password}</span>}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[34px] text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </div>

                    <p className="text-center text-sm mt-8 text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold hover:underline transition-colors">
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
