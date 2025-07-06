import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/me`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("Auth fetch error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { user, token } = res.data;
      if (user && token) {
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        return { success: true };
      } else {
        return { success: false, error: "Invalid response from server." };
      }
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        error: err?.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/signup`,
        { fullName, email, password },
        { withCredentials: true }
      );

      const { user, token } = res.data;
      if (user && token) {
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        return { success: true };
      } else {
        return { success: false, error: "Invalid signup response from server." };
      }
    } catch (err) {
      return {
        success: false,
        error: err?.response?.data?.message || "Signup failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout API error:", err.message);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        signup,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
