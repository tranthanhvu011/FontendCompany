import { useState } from 'react';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';
import { Modal } from '@/components/common/Modal';
import { FiMail, FiLock, FiFacebook } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export const LoginModal = () => {
    const { isLoginOpen, closeLogin } = useUI();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            closeLogin();
        } catch (error) {
            console.error('Login failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isLoginOpen} onClose={closeLogin} title={isLogin ? 'Welcome Back' : 'Create Account'}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors mt-2"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login Now' : 'Register Now')}
                </button>

                <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                    </div>
                    <div className="relative z-10 inline-block px-4 bg-white dark:bg-gray-800 text-sm text-gray-500">
                        Or continue with
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <FcGoogle size={20} />
                        <span className="text-sm font-medium">Google</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <FiFacebook size={20} className="text-blue-600" />
                        <span className="text-sm font-medium">Facebook</span>
                    </button>
                </div>

                <div className="text-center mt-4 text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary font-bold hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
