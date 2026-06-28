import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext(null);
const PROFILE_LOAD_TIMEOUT_MS = 8000;

function createProfileSeed(authUser, fallbackRole = null) {
  if (!authUser?.id) {
    return null;
  }

  return {
    id: authUser.id,
    full_name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
    role: fallbackRole ?? authUser.user_metadata?.role ?? null,
    institute: authUser.user_metadata?.institute ?? null,
    email: authUser.email ?? null,
  };
}

function getPendingOAuthRole() {
  try {
    return window.localStorage.getItem("ucan_pending_oauth_role");
  } catch (_error) {
    return null;
  }
}

function clearPendingOAuthRole() {
  try {
    window.localStorage.removeItem("ucan_pending_oauth_role");
  } catch (_error) {
    // Ignore storage access issues. The profile row is already resolved by this point.
  }
}

function withTimeout(promise, timeoutMs, timeoutMessage) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const profileRequestIdRef = useRef(0);

  const clearAuthState = () => {
    profileRequestIdRef.current += 1;
    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileLoading(false);
    setProfileError("");
    setLoading(false);
  };

  const resolveProfileRecord = async (authUser) => {
    if (!isSupabaseConfigured || !supabase || !authUser?.id) {
      return null;
    }

    const seededRole = authUser.user_metadata?.role || getPendingOAuthRole() || null;
    const profileSeed = createProfileSeed(authUser, seededRole);

    const { data, error } = await withTimeout(
      supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle(),
      PROFILE_LOAD_TIMEOUT_MS,
      "Profile loading timed out. Please try again."
    );

    if (error) {
      throw error;
    }

    if (!data) {
      if (!profileSeed?.role) {
        throw new Error(
          "Your account session exists, but the platform could not find a matching profile row."
        );
      }

      const { data: createdProfile, error: createError } = await withTimeout(
        supabase.from("profiles").upsert(profileSeed).select("*").single(),
        PROFILE_LOAD_TIMEOUT_MS,
        "Profile creation timed out. Please try again."
      );

      if (createError) {
        throw createError;
      }

      return createdProfile;
    }

    const profileUpdates = {};

    if (!data.full_name && profileSeed?.full_name) {
      profileUpdates.full_name = profileSeed.full_name;
    }

    if (!data.institute && profileSeed?.institute) {
      profileUpdates.institute = profileSeed.institute;
    }

    if (!data.email && profileSeed?.email) {
      profileUpdates.email = profileSeed.email;
    }

    if (Object.keys(profileUpdates).length === 0) {
      return data;
    }

    const { data: syncedProfile, error: syncError } = await withTimeout(
      supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", authUser.id)
        .select("*")
        .single(),
      PROFILE_LOAD_TIMEOUT_MS,
      "Profile sync timed out. Please try again."
    );

    if (syncError) {
      return data;
    }

    return syncedProfile;
  };

  const loadProfile = async (authUser) => {
    const requestId = ++profileRequestIdRef.current;

    if (!authUser?.id || !isSupabaseConfigured || !supabase) {
      setProfile(null);
      setProfileLoading(false);
      setProfileError("");
      return null;
    }

    setProfileLoading(true);
    setProfileError("");

    try {
      const resolvedProfile = await resolveProfileRecord(authUser);

      if (profileRequestIdRef.current !== requestId) {
        return resolvedProfile;
      }

      setProfile(resolvedProfile);
      clearPendingOAuthRole();
      setProfileError("");
      return resolvedProfile;
    } catch (error) {
      const fallbackProfile = createProfileSeed(
        authUser,
        authUser.user_metadata?.role || getPendingOAuthRole() || null
      );

      if (profileRequestIdRef.current === requestId) {
        setProfile(fallbackProfile);
        setProfileError(
          error?.message ||
            "We found your session, but your profile could not be loaded."
        );
      }
      return fallbackProfile;
    } finally {
      if (profileRequestIdRef.current === requestId) {
        setProfileLoading(false);
      }
    }
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
        setLoading(false);

        if (currentSession?.user) {
          void loadProfile(currentSession.user);
        } else {
          setProfile(null);
          setProfileLoading(false);
          setProfileError("");
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
        setLoading(false);

        if (nextSession?.user) {
          void loadProfile(nextSession.user);
        } else {
          setProfile(null);
          setProfileLoading(false);
          setProfileError("");
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
    clearAuthState();

    if (isSupabaseConfigured && supabase) {
      try {
        await withTimeout(
          supabase.auth.signOut({ scope: "local" }),
          5000,
          "Local sign out timed out."
        );
      } catch (_error) {
        // Local auth state was already cleared above, so we do not block logout on a network issue.
      }
    }
  };

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      profileLoading,
      profileError,
      signOut,
      refreshProfile: () => loadProfile(user),
      isSupabaseConfigured,
    }),
    [session, user, profile, loading, profileLoading, profileError]
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
