import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

import { useSignin, useSignup, useSignout } from "@/hooks/use-auth";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const { mutate: signInUser } = useSignin();
  const { mutate: signUpUser } = useSignup();
  const { mutate: signOutUser } = useSignout();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    signInUser({ email, password });
  };

  const signUp = async (email: string, password: string, username: string) => {
    signUpUser({ email, password, username });
  };

  const signOut = async () => signOutUser();

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
