import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.PG_URL,
  ssl: process.env.PG_URL && !process.env.PG_URL.includes("localhost")
    ? { rejectUnauthorized: false }
    : false
});

export const DBConnect = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database successfully");
    client.release();
  } catch (error) {
    console.log("PostgreSQL connection error:", error.message);
  }
};

export default pool;
