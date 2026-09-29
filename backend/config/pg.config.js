import pg from "pg";
import "dotenv/config";

// Automatically convert IPv6-only Supabase direct host to IPv4 Connection Pooler for Render / Vercel compatibility
export const sanitizePgUrl = (url) => {
  if (!url) return url;
  const trimmed = url.trim();

  // If already using pooler or localhost, return with proper encoding
  if (trimmed.includes(".pooler.supabase.com") || trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
    return trimmed;
  }

  // Detect Supabase direct connection host (db.<project-ref>.supabase.co:5432) which is IPv6-only
  const supabaseDirectMatch = trimmed.match(
    /^postgresql:\/\/([^:]+):(.*)@db\.([a-z0-9]+)\.supabase\.co:5432\/([^\s?]+)/i
  );

  if (supabaseDirectMatch) {
    const user = supabaseDirectMatch[1];
    const rawPassword = supabaseDirectMatch[2];
    const projectRef = supabaseDirectMatch[3];
    const database = supabaseDirectMatch[4];

    // Decode first to prevent double encoding, then encode special characters like @, #, etc.
    const cleanPassword = encodeURIComponent(decodeURIComponent(rawPassword));

    // Target the IPv4 AWS ap-south-1 connection pooler
    return `postgresql://${user}.${projectRef}:${cleanPassword}@aws-0-ap-south-1.pooler.supabase.com:6543/${database}`;
  }

  return trimmed;
};

const rawUrl = process.env.PG_URL;
const connectionString = sanitizePgUrl(rawUrl);

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes("localhost")
    ? { rejectUnauthorized: false }
    : false,
});

export const DBConnect = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database successfully");
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message);
  }
};

export default pool;
