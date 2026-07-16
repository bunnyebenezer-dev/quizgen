import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://soemlpqkrbukbkeqbthw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZW1scHFrcmJ1a2JrZXFidGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNjQwNTgsImV4cCI6MjA5OTY0MDA1OH0.-qYmSvsp4lAMzCW_n74WFWcMopgyzpw-xSfwCZm0Zh0";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

console.log("Supabase file loaded");