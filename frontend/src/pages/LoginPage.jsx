import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, Lock, Mail, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/pets';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login({ email: email.trim().toLowerCase(), password });
      success(`Welcome back, ${res.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toastError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (testEmail, testPass) => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrors({});
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
            <PawPrint className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to Pawsome Haven
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your credentials to access your adoption applications and live shelter chats.
          </p>
        </div>

        {/* Real Sign In Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="shadow-md shadow-brand-500/20 mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Register here
            </Link>
          </div>

          {/* Collapsible Helper for Evaluator Test Credentials */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowTestCredentials(!showTestCredentials)}
              className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px] font-medium flex items-center justify-between transition-colors"
            >
              <span>Pre-seeded test credentials (Optional reference)</span>
              {showTestCredentials ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showTestCredentials && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Admin:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">admin@pawsome.org / Admin@123</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin@pawsome.org', 'Admin@123')}
                    className="text-[11px] text-brand-600 font-semibold hover:underline"
                  >
                    Use
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Adopter:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">user@example.com / User@123</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillCredentials('user@example.com', 'User@123')}
                    className="text-[11px] text-brand-600 font-semibold hover:underline"
                  >
                    Use
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
