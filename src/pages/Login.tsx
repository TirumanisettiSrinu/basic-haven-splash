
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const { login, state } = useAuth();
  const { isAuthenticated, loading, error } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="p-6 bg-hotel-500 text-white text-center">
              <Hotel className="h-8 w-8 mx-auto mb-2" />
              <h1 className="text-2xl font-semibold">Welcome Back</h1>
              <p className="text-white/80">Sign in to your StayHaven account</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-hotel-500 hover:text-hotel-600"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-hotel-500 hover:bg-hotel-600"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              <p className="text-center text-sm mt-6 text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-hotel-500 hover:text-hotel-600 font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
          
          {/* Demo accounts */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">Demo Accounts</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-white rounded border border-border">
                <p className="font-semibold mb-1">Regular User</p>
                <p>email: user@example.com</p>
                <p>password: password123</p>
              </div>
              <div className="p-2 bg-white rounded border border-border">
                <p className="font-semibold mb-1">Moderator</p>
                <p>email: mod@example.com</p>
                <p>password: password123</p>
              </div>
              <div className="p-2 bg-white rounded border border-border">
                <p className="font-semibold mb-1">Admin</p>
                <p>email: admin@example.com</p>
                <p>password: password123</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
