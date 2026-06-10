import { useState, useEffect } from "react";
import { registerGuest, getGuest } from "../services/api";

const GUEST_KEY = "wedding_guest_id";

export function useGuest() {
  const [guest,   setGuest]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Restore session
  useEffect(() => {
    const savedId = localStorage.getItem(GUEST_KEY);
    if (savedId) {
      getGuest(savedId)
        .then(({ guest }) => setGuest(guest))
        .catch(() => localStorage.removeItem(GUEST_KEY));
    }
  }, []);

  async function register(name) {
    setLoading(true);
    setError(null);
    try {
      const { guest } = await registerGuest(name);
      localStorage.setItem(GUEST_KEY, guest.id);
      setGuest(guest);
      return guest;
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function updatePhotoCount(delta = 1) {
    setGuest(g => g ? { ...g, photo_count: g.photo_count + delta } : g);
  }

  function logout() {
    localStorage.removeItem(GUEST_KEY);
    setGuest(null);
  }

  return { guest, loading, error, register, updatePhotoCount, logout };
}