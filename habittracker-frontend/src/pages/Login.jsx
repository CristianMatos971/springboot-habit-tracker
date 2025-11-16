import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validateLogin({ email, password });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            console.log("Logging in with:", email, password);
            const response = await login({ email, password });
            console.log("Logged in!", response.message);
        } catch (err) {
            setErrors({ api: "Server Error" });
        }
    }

    function validateLogin({ email, password }) {
        const errors = {};

        if (!email.trim()) errors.email = "Email is obrigatory";
        else if (!email.includes("@")) errors.email = "Invalid email";

        if (!password) errors.password = "Obrigatory password";
        else if (password.length < 6)
            errors.password = "Password must have at least 6 characters";

        return errors;
    }

    return (
        <>
            <Header />

            <div className="flex justify-center bg-gray-100 pt-20 pb-20">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-md w-80"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

                    {/* Error messages */}
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                    {errors.api && <p className="text-red-600 text-sm">{errors.api}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        className="border w-full p-2 mb-4 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="relative mb-6">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="border w-full p-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-2 top-2 text-sm text-blue-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm mt-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
