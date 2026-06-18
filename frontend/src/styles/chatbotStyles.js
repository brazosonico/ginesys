export const chatbotStyles = {
    wrapper: {
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 1000,
      fontFamily: "inherit",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
  
    toggleButton: {
      width: 58,
      height: 58,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #ec4899, #db2777)",
      border: "none",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 24px rgba(219, 39, 119, 0.35)",
      cursor: "pointer",
    },
  
    window: {
      width: 360,
      height: 520,
      background: "#ffffff",
      borderRadius: 20,
      boxShadow: "0 12px 40px rgba(190, 24, 93, 0.18), 0 2px 8px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      marginBottom: 16,
      border: "1px solid #fbcfe8",
    },
  
    header: {
      background: "linear-gradient(135deg, #ec4899, #db2777)",
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "#fff",
    },
  
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  
    headerTitle: {
      fontWeight: 700,
      fontSize: 15,
      lineHeight: 1.2,
    },
  
    headerStatus: {
      fontSize: 12.5,
      opacity: 0.9,
      display: "flex",
      alignItems: "center",
      gap: 5,
    },
  
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "#4ade80",
      display: "inline-block",
    },
  
    closeButton: {
      background: "transparent",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      padding: 6,
      display: "flex",
      borderRadius: 8,
    },
  
    messages: {
      flex: 1,
      overflowY: "auto",
      padding: "16px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      background: "#fff7fa",
    },
  
    bubbleUser: {
      alignSelf: "flex-end",
      maxWidth: "82%",
      background: "#ec4899",
      color: "#fff",
      padding: "10px 13px",
      borderRadius: "14px 14px 4px 14px",
      fontSize: 14,
      lineHeight: 1.45,
    },
  
    bubbleBot: {
      alignSelf: "flex-start",
      maxWidth: "82%",
      background: "#ffffff",
      color: "#1f2937",
      padding: "10px 13px",
      borderRadius: "14px 14px 14px 4px",
      fontSize: 14,
      lineHeight: 1.45,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      border: "1px solid #fce7f3",
    },
  
    quickReplies: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 4,
    },
  
    quickReplyButton: {
      background: "#fff",
      border: "1px solid #f9a8d4",
      color: "#be185d",
      borderRadius: 999,
      padding: "6px 12px",
      fontSize: 12.5,
      cursor: "pointer",
      fontWeight: 600,
    },
  
    inputBar: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderTop: "1px solid #fce7f3",
      background: "#fff",
    },
  
    textInput: {
      flex: 1,
      border: "1px solid #f3d4e4",
      borderRadius: 999,
      padding: "10px 16px",
      fontSize: 14,
      outline: "none",
    },
  
    sendButton: (disabled) => ({
      background: disabled ? "#f9a8d4" : "#ec4899",
      border: "none",
      width: 38,
      height: 38,
      borderRadius: "50%",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled ? "default" : "pointer",
      flexShrink: 0,
    }),
  
    typingDot: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#ec4899",
      opacity: 0.6,
    },
  };