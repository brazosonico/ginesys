import { useState, useRef, useEffect } from "react";
import { chatbotStyles as styles } from "../styles/chatbotStyles";
import { sendChatMessage } from "../services/chatService";

const QUICK_REPLIES = [
  "Agendar una cita",
  "Ver mis horarios disponibles",
  "Hablar con mi doctora",
];

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      text: "¡Hola! Soy tu Asistente IA de GineSys. Puedo ayudarte a agendar citas o resolver dudas sobre tratamientos. ¿En qué te apoyo?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now() + "-user", role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(text, messages);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + "-bot", role: "bot", text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-error",
          role: "bot",
          text: "Tuve un problema para responder. Intenta de nuevo en un momento.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.wrapper}>
      {isOpen && (
        <div style={styles.window}>
          <div style={styles.header}>
            <div style={styles.headerAvatar}>✨</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.headerTitle}>Asistente IA</div>
              <div style={styles.headerStatus}>
                <span style={styles.statusDot} />
                Disponible 24/7
              </div>
            </div>
            <button
              style={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} style={styles.messages}>
            {messages.map((m) => (
              <div key={m.id} style={m.role === "user" ? styles.bubbleUser : styles.bubbleBot}>
                {m.text}
              </div>
            ))}

            {isTyping && (
              <div style={styles.bubbleBot}>
                <span style={styles.typingDot} />{" "}
                <span style={styles.typingDot} />{" "}
                <span style={styles.typingDot} />
              </div>
            )}

            {messages.length <= 1 && !isTyping && (
              <div style={styles.quickReplies}>
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    style={styles.quickReplyButton}
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.inputBar}>
            <input
              style={styles.textInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
            />
            <button
              style={styles.sendButton(!input.trim() || isTyping)}
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              aria-label="Enviar mensaje"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        style={styles.toggleButton}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default ChatbotWidget;