import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { ensureAuth } from "../services/firebase";

type AuthCtx = { user: User | null; loading: boolean };
const Ctx = createContext<AuthCtx>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureAuth()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
