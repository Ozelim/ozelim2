import { Pool } from "pg";

const g = globalThis;
if (!g._pgPool2) {
  g._pgPool2 = new Pool({ connectionString: process.env.DATABASE_URL });
}

export default g._pgPool2;
