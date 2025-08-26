import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('Session error, clearing user:', error.message);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.log('Failed to get session, clearing user:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // For GitHub Pages, we need the full URL including the repository path
      // Remove both query parameters and URL fragments (#)
      const redirectUrl = window.location.href.split('?')[0].split('#')[0];
      
      console.log('🚨 TEST LOG - This should appear when button is clicked!');
      console.log('🔍 Debug: window.location.origin:', window.location.origin);
      console.log('🔍 Debug: window.location.href:', window.location.href);
      console.log('🔍 Debug: window.location.hash:', window.location.hash);
      console.log('🔍 Debug: Redirect URL (cleaned):', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) {
        console.error('OAuth sign-in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Always try to sign out, but handle errors gracefully
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If it's a session not found error, just clear the local state
        if (error.message.includes('session not found') || error.message.includes('403')) {
          console.log('Session already expired, clearing local state');
        } else {
          console.error('Sign out error:', error.message);
        }
      }
      
      // Always clear local state regardless of server response
      setUser(null);
      
    } catch (error) {
      console.error('Error during sign out:', error.message);
      // Even if there's an error, clear the local state
      setUser(null);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.log('Failed to refresh session:', error.message);
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
    } catch (error) {
      console.log('Error refreshing session:', error.message);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    refreshSession,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
