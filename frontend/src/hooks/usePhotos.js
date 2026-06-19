import { useState, useEffect, useCallback } from "react";
import { supabase }  from "../lib/supabase";
import { getPhotos } from "../services/api";

const PAGE_SIZE = 24;

export function usePhotos() {
  const [photos,    setPhotos]    = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [hasMore,   setHasMore]   = useState(true);
  const [offset,    setOffset]    = useState(0);

  const loadPhotos = useCallback(async (reset = false) => {
    setLoading(true);
    const off = reset ? 0 : offset;
    try {
      const data = await getPhotos(PAGE_SIZE, off);
      setPhotos(p => reset ? data.photos : [...p, ...data.photos]);
      setTotal(data.total);
      setOffset(off + PAGE_SIZE);
      setHasMore((off + PAGE_SIZE) < data.total);
    } catch (err) {
      console.error("Failed to load photos:", err);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  // Initial load
  useEffect(() => {
    loadPhotos(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("photos-channel")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "photos" },
        async (payload) => {
          // Fetch full photo record with guest name
          const { data } = await supabase
            .from("photos")
            .select("id, image_url, thumbnail_url, medium_url, uploaded_at, guests(guest_name)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setPhotos(p => [{
              ...data,
              guest_name: data.guests?.guest_name || "Anonymous",
            }, ...p]);
            setTotal(t => t + 1);
          }
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "photos" },
        (payload) => {
          setPhotos(p => p.filter(ph => ph.id !== payload.old.id));
          setTotal(t => Math.max(0, t - 1));
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { photos, total, loading, hasMore, loadMore: () => loadPhotos(false) };
}