
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const Register = () => {
  const { register, state } = useAuth();
  const { isAuthenticated, loading, error } = state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    phone: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check password strength
  useEffect(() => {
    const errors = [];
    let strength = 0;
    
    if (formData.password.length === 0) {
      setPasswordStrength(0);
      return;
    }
    
    // Length check
    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    } else {
      strength += 1;
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(formData.password)) {
      errors.push("Password must contain at least one uppercase letter");
    } else {
      strength += 1;
    }
    
    // Lowercase check
    if (!/[a-z]/.test(formData.password)) {
      errors.push("Password must contain at least one lowercase letter");
    } else {
      strength += 1;
    }
    
    // Number check
    if (!/[0-9]/.test(formData.password)) {
      errors.push("Password must contain at least one number");
    } else {
      strength += 1;
    }
    
    setPasswordErrors(errors);
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Username validation
    if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (passwordErrors.length > 0) {
      errors.password = "Please fix password issues";
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    // Country validation
    if (!formData.country) {
      errors.country = "Please select a country";
    }
    
    // City validation
    if (!formData.city) {
      errors.city = "Please enter a city";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { confirmPassword, ...userData } = formData;
    await register(userData);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="w-full max-w-lg animate-fade-in-up">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-hotel-500 text-white text-center">
              <Hotel className="h-8 w-8 mx-auto mb-2" />
              <h1 className="text-2xl font-semibold">Create an Account</h1>
              <p className="text-white/80">Join StayHaven to start booking your perfect stays</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    className={cn(formErrors.username && "border-red-300")}
                  />
                  {formErrors.username && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.username}</p>
                  )}
                </div>
                
                {/* Email */}
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
                    className={cn(formErrors.email && "border-red-300")}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      className={cn("pr-10", formErrors.password && "border-red-300")}
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
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-1 h-1">
                        <div 
                          className={cn(
                            "flex-1 rounded-full transition-colors",
                            passwordStrength > 0 ? "bg-red-400" : "bg-gray-200"
                          )}
                        ></div>
                        <div 
                          className={cn(
                            "flex-1 rounded-full transition-colors",
                            passwordStrength > 1 ? "bg-yellow-400" : "bg-gray-200"
                          )}
                        ></div>
                        <div 
                          className={cn(
                            "flex-1 rounded-full transition-colors",
                            passwordStrength > 2 ? "bg-yellow-400" : "bg-gray-200"
                          )}
                        ></div>
                        <div 
                          className={cn(
                            "flex-1 rounded-full transition-colors",
                            passwordStrength > 3 ? "bg-green-400" : "bg-gray-200"
                          )}
                        ></div>
                      </div>
                      
                      {passwordErrors.length > 0 && (
                        <ul className="text-xs space-y-1">
                          {passwordErrors.map((error, index) => (
                            <li key={index} className="flex items-start">
                              <AlertCircle className="h-3 w-3 text-red-500 mr-1 mt-0.5" />
                              <span className="text-muted-foreground">{error}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {passwordErrors.length === 0 && (
                        <p className="text-xs flex items-center text-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Password meets all requirements
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className={cn(formErrors.confirmPassword && "border-red-300")}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
                
                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleSelectChange('country', value)}
                  >
                    <SelectTrigger className={cn(formErrors.country && "border-red-300")}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.country && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.country}</p>
                  )}
                </div>
                
                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    className={cn(formErrors.city && "border-red-300")}
                  />
                  {formErrors.city && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                  )}
                </div>
                
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-hotel-500 hover:bg-hotel-600 mt-6"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <p className="text-center text-sm mt-4 text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-hotel-500 hover:text-hotel-600 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
