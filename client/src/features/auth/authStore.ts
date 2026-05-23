import { create } from "zustand";
import type { User } from "../../shared/types";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setSession: (session: { accessToken: string; user: User }) => void;
  logout: () => void;
};

const storedToken = localStorage.getItem("luxora_access_token");
const storedUser = localStorage.getItem("luxora_user");

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  setSession: (session) => {
    localStorage.setItem("luxora_access_token", session.accessToken);
    localStorage.setItem("luxora_user", JSON.stringify(session.user));
    set(session);
  },
  logout: () => {
    localStorage.removeItem("luxora_access_token");
    localStorage.removeItem("luxora_user");
    set({ accessToken: null, user: null });
  },
}));
