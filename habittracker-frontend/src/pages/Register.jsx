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

            <div className="flex justify-center bg-gray-100 dark:bg-gray-800 pt-20 pb-20 transition-colors duration-300">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md w-80 transition-colors duration-300"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                        Register
                    </h2>

                    {errors.api && <p className="text-red-600 text-sm">{errors.api}</p>}
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
                    )}

                    <input
                        type="text"
                        placeholder="Name"
                        className="border w-full p-2 mb-4 rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="border w-full p-2 mb-4 rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="border w-full p-2 rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-2 top-2 text-sm text-blue-600 font-medium hover:text-blue-800"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="border w-full p-2 mb-6 rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        Register
                    </button>

                    <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium dark:text-blue-400">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
