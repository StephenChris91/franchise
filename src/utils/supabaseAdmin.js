// utils/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  "https://ajxzmfrdbykxjqxybmar.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqeHptZnJkYnlreGpxeHlibWFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjEzMDc0NywiZXhwIjoyMDY3NzA2NzQ3fQ.xtkgMFBzcTaTRJTJ2qkaz8p9F6dXKHgRKz2AG9B9D34"
);
