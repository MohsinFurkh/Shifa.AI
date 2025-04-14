"use client";

import { AuthProvider } from '../contexts/AuthContext';

export default function ClientAuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
} 