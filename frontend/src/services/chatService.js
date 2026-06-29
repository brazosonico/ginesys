// Servicio del Asistente IA.
// Mientras el endpoint de Laravel no exista, usa respuestas simuladas.
// Cuando lo tengas listo en el backend (ej. routes/api.php -> POST /api/chat),
// solo cambia USE_MOCK a false y ajusta la URL si es necesario.

const USE_MOCK = true;
const API_URL = "/api/chat";

function mockReply(message) {
  const text = message.toLowerCase();

  if (text.includes("cita") || text.includes("agendar")) {
    return "Claro, puedo ayudarte a agendar tu cita. ¿Qué especialidad necesitas: Ginecología, Obstetricia o Mastología?";
  }
  if (text.includes("horario")) {
    return "Tenemos disponibilidad esta semana en las mañanas (9:00-12:00) y por las tardes (16:00-19:00). ¿Qué día te conviene más?";
  }
  if (text.includes("doctora") || text.includes("doctor")) {
    return "Puedo conectarte con tu doctora asignada. ¿Quieres que le envíe un mensaje con tu duda o prefieres agendar una consulta?";
  }
  if (text.includes("hola") || text.includes("buenas")) {
    return "¡Hola! Soy el Asistente IA de GineSys. Puedo ayudarte con citas, dudas sobre tratamientos o tu historial clínico. ¿En qué te ayudo hoy?";
  }
  return "Gracias por tu mensaje. Estoy aquí para ayudarte con citas, especialidades o dudas generales sobre tu salud. ¿Podrías darme un poco más de detalle?";
}

export async function sendChatMessage(message, history = []) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockReply(message);
  }

  const token = localStorage.getItem("token"); // ajusta según tu manejo de auth

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener respuesta del asistente");
  }

  const data = await res.json();
  return data.reply;
}