import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextType {
  getUser: () => Promise<User | undefined>;
  user: User | undefined;
  loading: boolean;
  handleQuickStart: (type: "text") => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user || typeof window === "undefined") return;

    getUser();
  }, []);

  async function getUser() {
    if (user) {
      setLoading(false);
      return user;
    }

    const supabase = createSupabaseClient();

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();
    setUser(supabaseUser || undefined);
    setLoading(false);
    return supabaseUser || undefined;
  }

  const contextValue: UserContextType = {
    getUser,
    user,
    loading,
    handleQuickStart: (type: "text") => {
      // Implement the handleQuickStart function here
    },
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
