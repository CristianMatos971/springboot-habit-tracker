import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validateRegister({
            name,
            email,
            password,
            confirmPassword,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await register({ name, email, password });
            navigate("/Dashboard");
        } catch (err) {
            setErrors({ api: err.message || "Email already exists" });
        }
    }

    function validateRegister({ name, email, password, confirmPassword }) {
        const errors = {};

        if (!name.trim()) errors.name = "Name is required";

        if (!email.trim()) errors.email = "Email is required";
        else if (!email.includes("@")) errors.email = "Invalid email";

        if (!password) errors.password = "Password is required";
        else if (password.length < 6)
            errors.password = "Password must have at least 6 characters";

        if (confirmPassword !== password)
            errors.confirmPassword = "Passwords do not match";

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
                            Create Account
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Join us to start tracking your habits
                        </p>
                    </div>

                    {errors.api && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">{errors.api}</div>}

                    <div className="space-y-4">
                        <div>
                            {errors.name && <span className="text-red-500 text-xs float-right">{errors.name}</span>}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            {errors.email && <span className="text-red-500 text-xs float-right">{errors.email}</span>}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
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
                                placeholder="Create a password"
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

                        <div>
                            {errors.confirmPassword && <span className="text-red-500 text-xs float-right">{errors.confirmPassword}</span>}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Sign Up
                        </button>
                    </div>

                    <p className="text-center text-sm mt-8 text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold hover:underline transition-colors">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
