"use client";

import { AuthProvider } from '../app/contexts/AuthContext';

export default function ClientAuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
} 