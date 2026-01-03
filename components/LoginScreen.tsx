import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to StreakSync</h1>
          <p className="text-slate-400 mt-2 text-center">Track your habits, achieve your goals, and join a community of achievers.</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all transform hover:scale-[1.02]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
          Continue with Google
        </button>
        
        {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
            </div>
        )}
      </div>
    </div>
  );
};
