import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-200 flex flex-col items-center px-4 py-10">
            <motion.h1
                className="text-4xl font-bold mb-10 text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Choose Your Plan
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Free Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="border-2 border-gray-300 rounded-2xl shadow-xl p-6 bg-white flex flex-col justify-between h-full">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
                            <p className="text-gray-600 mb-4">Good for simple use</p>
                            <ul className="text-gray-700 space-y-2">
                                <li>✔ Basic features</li>
                                <li>✔ Limited access</li>
                                <li>✔ No payment needed</li>
                            </ul>
                        </div>
                        <button className="mt-6 w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition">
                            Start Free
                        </button>
                    </div>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="border-2 border-purple-500 rounded-2xl shadow-xl p-6 bg-white flex flex-col justify-between h-full">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
                            <p className="text-gray-600 mb-4">Best for full access</p>
                            <ul className="text-gray-700 space-y-2">
                                <li>✔ All features unlocked</li>
                                <li>✔ No limits</li>
                                <li>✔ Best experience</li>
                            </ul>
                        </div>
                        <button className="mt-6 w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition" onClick={() => { navigate('/phone-number') }}
                        >
                            Go Premium
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
