import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, googleSignIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      
      await signup(email, password, displayName, role);
      addToast('Account created successfully!');
      navigate(role === 'business' ? '/business' : '/user');
      
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create an account. ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async (role) => {
    try {
      setError('');
      setLoading(true);
      
      await googleSignIn(role);
      addToast('Successfully signed up with Google!');
      navigate(role === 'business' ? '/business' : '/user');
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-dark glass-border neon-shadow p-6 sm:p-10 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow">Create Account</h2>
          <p className="mt-2 text-slate-200">
            Join QueueMaster to streamline your queue experience
          </p>
        </div>
        
        {error && (
          <div className="bg-rose-400/20 border border-rose-200/30 text-rose-100 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-200">
                Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-300/50"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-300/50"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-300/50"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-300 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-300/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Account Type
              </label>
              <div className="mt-2 flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="user-role"
                    name="role"
                    type="radio"
                    value="user"
                    checked={role === 'user'}
                    onChange={() => setRole('user')}
                    className="h-4 w-4 text-sky-400 focus:ring-sky-400 border-white/20 bg-white/10"
                  />
                  <label htmlFor="user-role" className="ml-2 block text-sm text-slate-200">
                    User
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="business-role"
                    name="role"
                    type="radio"
                    value="business"
                    checked={role === 'business'}
                    onChange={() => setRole('business')}
                    className="h-4 w-4 text-sky-400 focus:ring-sky-400 border-white/20 bg-white/10"
                  />
                  <label htmlFor="business-role" className="ml-2 block text-sm text-slate-200">
                    Business
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 rounded-md text-white glass-dark glass-border transition-transform-shadow glass-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Sign Up'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 glass-dark text-slate-200 rounded">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => handleGoogleSignIn('user')}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 rounded-md glass-dark glass-border text-sm font-medium text-white hover:bg-white/10 focus:outline-none"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#FFC107"/>
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#FF3D00"/>
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#4CAF50"/>
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#1976D2"/>
              </svg>
              Sign up as User with Google
            </button>
            <button
              onClick={() => handleGoogleSignIn('business')}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 rounded-md glass-dark glass-border text-sm font-medium text-white hover:bg-white/10 focus:outline-none"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#FFC107"/>
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#FF3D00"/>
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#4CAF50"/>
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#1976D2"/>
              </svg>
              Sign up as Business with Google
            </button>
          </div>
        </div>
        
        <div className="text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-300 hover:text-white">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;