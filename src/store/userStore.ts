import { create } from "zustand";
import { persist } from "zustand/middleware";

// shape of our user state
interface UserState {
  email: string | null;
  name: string | null;
  token: string | null;

  loggedIn: boolean;
  showSplash: boolean;
  // actions
  setUser: (user: Partial<Pick<UserState, "email" | "name" | "token">>) => void;
  setLoggedIn: (flag: boolean) => void;
  setShowSplash: (flag: boolean) => void;
  clearUser: () => void;
}

// Create a persisted user store
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      name: null,
      token: null,

      loggedIn: false,
      showSplash: true,
      // Security fix: persist the auth token with the user record so API modules can read it for Authorization headers.
      setUser: ({ email, name, token }) =>
        set((state) => ({
          email: email ?? state.email,
          name: name ?? state.name,
          token: token ?? state.token,
        })),
      setLoggedIn: (flag: boolean) => set(() => ({ loggedIn: flag })),
      setShowSplash: (flag: boolean) => set(() => ({ showSplash: flag })),
      clearUser: () =>
        set(() => ({
          email: null,
          name: null,
          token: null,

          loggedIn: false,
          showSplash: true,
        })),
    }),
    {
      name: "user-storage", // key in localStorage

      partialize: (state) => ({
        email: state.email,
        name: state.name,
        token: state.token,
        loggedIn: state.loggedIn,
        showSplash: state.showSplash,
      }),
    },
  ),
);
