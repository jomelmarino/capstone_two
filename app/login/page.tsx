'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LockClosedIcon } from '@heroicons/react/20/solid'; // Kung gumagamit ka ng Heroicons
import { supabase } from '../../lib/supabase';

// Mas simple at mas malinis na state management
interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Please enter both email and password.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      alert('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Password reset email sent! Check your inbox.');
      setIsForgotPassword(false);
      setResetEmail('');
    }
  };

  return (
    // ✨ **Design Changes: Darker Background & Centering**
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#107DAC' }}>
      <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-2xl"> {/* Added padding, white background, larger shadow, rounded corners */}

        {/* ## Header */}
        <div>
          <Image className="mx-auto h-30 w-30" src="/Logo.png" alt="Logo" width={120} height={120} loading="eager" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isForgotPassword ? 'Reset Password' : 'Welcome Back!'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isForgotPassword ? 'Enter your email to receive a reset link.' : 'Sign in to See The Student Enrolled.'}
          </p>
        </div>

        {/* --- */}

        {/* ## Form */}
        {isForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            {/* Email Field for Reset */}
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="resetEmail"
                  name="resetEmail"
                  type="email"
                  required
                  autoComplete="email"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="name@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Email'}
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="group relative flex w-full justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* Form Fields - Tinanggal ang -space-y-px para mas maganda ang spacing */}
          <div className="space-y-4"> {/* Increased spacing between fields */}
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  // ✨ **Design Changes: More rounded, better focus ring**
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  // ✨ **Design Changes: More rounded, better focus ring**
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          {/* --- */}

          {/* ## Options (Remember Me & Forgot Password) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 whitespace-nowrap">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {/* --- */}

          {/* ## Submit Button */}
          <div>
            <button
              type="submit"
              // ✨ **Design Changes: Bolder button, shadow, slightly larger padding**
              className="group relative flex w-full justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
            >
              <LockClosedIcon className="h-5 w-5 mr-2" aria-hidden="true" /> {/* Added icon for visual appeal */}
              Sign In
            </button>
          </div>
         </form>
       )}

     </div>
   </div>
 );
}