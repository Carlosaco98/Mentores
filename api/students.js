const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE_NAME = process.env.SUPABASE_TABLE || "student_records";

function headers() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
}

function assertConfigured(response) {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) return true;
  response.status(503).json({
    error: "Backend no configurado",
    detail: "Anade SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel para activar persistencia real."
  });
  return false;
}

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (!assertConfigured(response)) return;

  const endpoint = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}`;

  if (request.method === "GET") {
    const result = await fetch(`${endpoint}?select=id,payload,updated_at&order=updated_at.desc`, {
      headers: headers()
    });
    const rows = await result.json();
    response.status(result.status).json(rows.map((row) => row.payload));
    return;
  }

  if (request.method === "PUT") {
    const students = Array.isArray(request.body) ? request.body : [];
    const rows = students.map((student) => ({
      id: student.id,
      payload: student,
      updated_at: new Date().toISOString()
    }));

    const result = await fetch(`${endpoint}?on_conflict=id`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(rows)
    });

    const body = await result.json();
    response.status(result.status).json(body);
    return;
  }

  response.status(405).json({ error: "Metodo no permitido" });
};
