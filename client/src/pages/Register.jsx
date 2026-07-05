import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, KeyRound, Mail, UserPlus, ArrowRight, CheckSquare } from 'lucide-react';

const Register = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await register(name, email, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow -z-10" />

      <div className="glass-panel-heavy w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-800/80 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="bg-indigo-600/15 text-indigo-400 w-12 h-12 rounded-2xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 animate-float">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-2xl tracking-wide text-white">Create Account</h2>
          <p className="text-xs text-slate-400 mt-2">Get started with your smart AI task organizer</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Name</span>
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Email Address</span>
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Password (min. 6 chars)</span>
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input text-sm"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glass-button-primary w-full py-3 mt-6 text-sm flex items-center justify-center space-x-2 font-semibold"
          >
            {isLoading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              <span>Log in instead</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
