'use client';

import { motion } from 'framer-motion';

import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-primary/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">MyFlix</h1>
          <p className="text-gray-300">Your personal streaming experience</p>
        </motion.div>

        {/* Login form */}
        <LoginForm />

        {/* Creds info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <h3 className="text-sm font-semibold text-white mb-2">Demo credentials:</h3>
          <p className="text-xs text-gray-400">Email: test@test.com</p>
          <p className="text-xs text-gray-400">Password: test123</p>
          <p className="text-xs text-gray-500 mt-2">
            * Any valid email and password will work for testing purposes
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
