import { supabase } from "../lib/supabase.js";

export async function registerGuest(req, res) {
  const { guest_name } = req.body;

  if (!guest_name || guest_name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter your name (min 2 characters)" });
  }

  const name = guest_name.trim();

  // Check if this name already registered (allow continuing session)
  const { data: existing } = await supabase
    .from("guests")
    .select("id, guest_name, photo_count")
    .ilike("guest_name", name)
    .maybeSingle();

  if (existing) {
    return res.json({ guest: existing, isReturning: true });
  }

  const { data, error } = await supabase
    .from("guests")
    .insert({ guest_name: name })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ guest: data, isReturning: false });
}

export async function getGuestById(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("guests")
    .select("id, guest_name, photo_count, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return res.status(404).json({ error: "Guest not found" });
  res.json({ guest: data });
}