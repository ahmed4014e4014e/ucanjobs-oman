import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { getUserRole } from "../lib/authRouting";

const AuthContext = createContext(null);

function createProfileSeed(authUser, fallbackRole = "student") {
  if (!authUser?.id) {
    return null;
  }

  return {
    id: authUser.id,
    full_name: authUser.user_metadata?.full_name ?? null,
    role: fallbackRole,
    institute: authUser.user_metadata?.institute ?? null,
    email: authUser.email ?? null,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (authUser) => {
    if (!isSupabaseConfigured || !supabase || !authUser?.id) {
      setProfile(null);
      return null;
    }

    const seededRole = authUser.user_metadata?.role || "student";
    const profileSeed = createProfileSeed(authUser, seededRole);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return null;
    }

    const profilePayload = data
      ? {
          id: authUser.id,
          full_name: data.full_name || profileSeed.full_name,
          role: data.role,
          institute: data.institute || profileSeed.institute,
          email: profileSeed.email || data.email,
        }
      : profileSeed;

    const shouldSyncProfile =
      !data ||
      (!data.full_name && profileSeed.full_name) ||
      (!data.institute && profileSeed.institute) ||
      (!data.email && profileSeed.email);

    if (!shouldSyncProfile) {
      setProfile(data ?? null);
      return data ?? null;
    }

    const { data: syncedProfile, error: syncError } = await supabase
      .from("profiles")
      .upsert(profilePayload)
      .select("*")
      .single();

    if (syncError) {
      setProfile(data ?? null);
      return data ?? null;
    }

    setProfile(syncedProfile);
    return syncedProfile;
  };

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          return;
        }

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(currentSession ?? null);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const resolvedProfile = await loadProfile(currentSession.user);
          if (!mounted) return;
          setProfile(resolvedProfile);
          setLoading(false);
        } else {
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    bootstrapAuth();

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        mounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      try {
        if (!mounted) return;

        setSession(nextSession ?? null);
        setUser(nextSession?.user ?? null);

        if (nextSession?.user) {
          const resolvedProfile = await loadProfile(nextSession.user);
          if (!mounted) return;
          setProfile(resolvedProfile);
          setLoading(false);
        } else {
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      signOut,
      refreshProfile: () => loadProfile(user),
      isSupabaseConfigured,
    }),
    [session, user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
