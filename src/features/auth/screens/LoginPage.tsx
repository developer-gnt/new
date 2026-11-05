import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { HrsjmLogo } from '../../../components/common/HrsjmLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your mobile number/email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await login({ identifier, password, rememberMe });
      const roleNames = (user.roles || []).map((r: any) =>
        (typeof r === 'string' ? r : r.name || '').toUpperCase()
      );
      const isSeeker =
        roleNames.includes('DONATION_SEEKER') ||
        roleNames.includes('SEEKER') ||
        (user as any).account_type === 'seeker';

      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
      } else if (isSeeker) {
        navigate('/seeker/home', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials or unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (role: 'seeker' | 'admin') => {
    if (role === 'seeker') {
      setIdentifier('seeker@hrsjm.org');
      setPassword('SeekerPass#1');
    } else {
      setIdentifier('admin@hrsjm.org');
      setPassword('AdminPass#1');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#DCE4EC] overflow-hidden">
        {/* Navy Brand Header Banner */}
        <div className="bg-gradient-to-r from-[#011F39] via-[#06294D] to-[#123F68] p-8 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <HrsjmLogo size="md" variant="light" />
          </div>
          <h1 className="text-xl font-bold font-['Playfair_Display',Georgia,serif] tracking-wide text-white">
            Together for a <span className="text-[#FAD465]">More Just</span> Society
          </h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xs mx-auto leading-relaxed">
            Human Rights and Social Justice Mission Portal. Sign in to access your dashboard.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0B2F52]">Sign In</h2>
            <p className="text-xs text-[#718096] mt-0.5">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1.5">
                Mobile Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9888880004 or seeker@hrsjm.org"
                  className="w-full px-4 py-2.5 pl-10 text-sm bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
                  disabled={loading}
                />
                <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2F52] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pl-10 pr-10 text-sm bg-[#EDF2F7] border border-[#DBE5EE] rounded-xl text-[#0B2F52] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAD465] focus:bg-white transition"
                  disabled={loading}
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-[#34516D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DBE5EE] text-[#06294D] focus:ring-[#FAD465] mr-2"
                />
                Remember me
              </label>
              <Link to="/seeker/support" className="text-[#174A78] hover:underline font-medium">
                Need Help?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#FAD465] hover:bg-[#E9B82E] active:bg-[#C9971A] text-[#011F39] font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Credentials Bar */}
          <div className="mt-6 pt-5 border-t border-[#DBE5EE]">
            <p className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider text-center mb-2.5">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickLogin('seeker')}
                className="px-3 py-2 bg-[#EDF2F7] hover:bg-[#E2E8F0] border border-[#DBE5EE] rounded-lg text-xs font-semibold text-[#0B2F52] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <HeartHandshake size={14} className="text-[#0D9488]" />
                <span>Seeker Login</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('admin')}
                className="px-3 py-2 bg-[#EDF2F7] hover:bg-[#E2E8F0] border border-[#DBE5EE] rounded-lg text-xs font-semibold text-[#0B2F52] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ShieldCheck size={14} className="text-[#06294D]" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-[#34516D]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#06294D] font-bold hover:underline">
              Apply as Donation Seeker
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

