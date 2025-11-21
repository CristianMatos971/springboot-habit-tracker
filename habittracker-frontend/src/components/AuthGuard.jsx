import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children }) {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    // Se estiver logado:
    if (user) {
        return <>{children}</>;
    }

    // Se Não estiver logado:
    return (
        <div className="relative h-full w-full">
            <div className="h-full w-full opacity-60 grayscale-[0.5] pointer-events-none select-none blur-[1px]">
                {children}
            </div>

            <div
                onClick={() => setShowModal(true)}
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group hover:bg-black/5 transition-all rounded-xl"
            >
                <span className="opacity-0 group-hover:opacity-100 bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-bold transition-opacity shadow-lg">
                    🔒 Login is Needed
                </span>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Restrict Access</h3>
                        <p className="text-slate-600 mb-6">
                            You have to be logged in to access this content.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                to="/login"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full"
                            >
                                Go to Login
                            </Link>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-500 hover:text-slate-700 font-medium py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}