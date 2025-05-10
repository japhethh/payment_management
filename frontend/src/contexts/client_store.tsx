import { create } from "zustand";
import axios from "axios";
import { User } from "@/types";

interface StoreState {
  token: string | null;
  userData: User | null;
  error: string | null;
  loading: boolean;
  fetchUserData: () => Promise<void>;
}

export const apiURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://payment-management-api.onrender.com";

const useStore = create<StoreState>((set) => ({
  token: localStorage.getItem("token"),
  userData: null,
  error: null,
  loading: false,

  fetchUserData: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({
        error: "Token not found in localStorage",
        loading: false
      });
      return;
    }

    set({ loading: true });

    try {
      const response = await axios.post<User>(
        `${apiURL}/api/user/getId`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        userData: response.data,
        error: null,
        loading: false
      });

    } catch (error) {
      let errorMessage = "Failed to fetch user data";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
        console.error("API Error:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error:", error.message);
      }

      set({
        error: errorMessage,
        loading: false
      });
    }
  },
}));

export default useStore;