export const styles = {

  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#1a1a1a",
    fontFamily: "Inter, sans-serif",
  },

 
 navbar: {
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid #F2D4DF",
},

navInner: {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "14px 34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
},

logo: {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 20,
  fontWeight: 800,
  color: "#1a1a1a",
  letterSpacing: "-0.5px",
},

logoImage: {
  width: 34,
  height: 34,
  objectFit: "contain",
},

navLinks: {
  display: "flex",
  alignItems: "center",
  gap: 28,
  flex: 1,
  justifyContent: "center",
},

navLink: {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#4B1528",
  fontWeight: 600,
  fontSize: 14,
  transition: "0.2s",
},

navActions: {
  display: "flex",
  alignItems: "center",
  gap: 10,
},

outlineButton: {
  border: "1px solid #D4537E",
  background: "#ffffff",
  color: "#D4537E",
  borderRadius: 12,
  padding: "10px 18px",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 13,
  minWidth: 120,
},

primaryButton: {
  border: "none",
  background: "#D4537E",
  color: "#ffffff",
  borderRadius: 12,
  padding: "11px 18px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(212,83,126,0.22)",
  fontSize: 13,
  minWidth: 120,
},

  hamburger: {
    display: "none",
  },

  mobileDropdown: {
    position: "absolute",
    top: 80,
    right: 20,
    width: 240,
    background: "#fff",
    border: "1px solid #F2D4DF",
    borderRadius: 18,
    padding: 18,
    display: "grid",
    gap: 12,
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  },

  mobileLink: {
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 700,
    color: "#4B1528",
  },

  hero: {
    background: "linear-gradient(160deg,#FFF0F5 0%,#ffffff 60%)",
    textAlign: "center",
    padding: "120px 20px 90px",
  },

  container: {
    maxWidth: 1180,
    margin: "0 auto",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #F2D4DF",
    background: "#fff",
    color: "#D4537E",
    borderRadius: 999,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 28,
  },

  heroTitle: {
    fontSize: 72,
    lineHeight: 1,
    fontWeight: 950,
    margin: 0,
    color: "#1a1a1a",
  },

  pinkText: {
    display: "block",
    color: "#D4537E",
  },

  heroText: {
    maxWidth: 760,
    margin: "28px auto 0",
    color: "#666",
    fontSize: 20,
    lineHeight: 1.8,
  },

  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: 18,
    marginTop: 40,
    flexWrap: "wrap",
  },

  section: {
    padding: "110px 20px",
    borderTop: "1px solid #F2D4DF",
    background: "#fff",
  },

  altSection: {
    padding: "110px 20px",
    borderTop: "1px solid #F2D4DF",
    background: "#FFF8FA",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: 52,
    fontWeight: 950,
    marginBottom: 18,
    color: "#1a1a1a",
  },

  sectionText: {
    textAlign: "center",
    color: "#666",
    fontSize: 18,
    lineHeight: 1.8,
    maxWidth: 720,
    margin: "0 auto",
  },

  specialtyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 30,
    marginTop: 60,
  },

  card: {
    background: "#fff",
    border: "1px solid #F2D4DF",
    borderRadius: 24,
    padding: "40px 28px",
    textAlign: "center",
    boxShadow: "0 12px 34px rgba(212,83,126,0.08)",
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: 900,
    marginBottom: 18,
    color: "#1a1a1a",
  },

  cardText: {
    color: "#666",
    lineHeight: 1.8,
    fontSize: 16,
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 36,
    marginTop: 60,
    textAlign: "center",
  },

  stepNumber: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "#FBEAF0",
    border: "2px solid #F4C0D1",
    color: "#D4537E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 24,
    margin: "0 auto 20px",
  },

  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 70,
    alignItems: "center",
    marginTop: 50,
  },

  list: {
    display: "grid",
    gap: 16,
    marginTop: 30,
    color: "#4B1528",
    fontWeight: 700,
    fontSize: 16,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 22,
  },

  statCard: {
    background: "#fff",
    border: "1px solid #F2D4DF",
    borderRadius: 22,
    padding: "34px 20px",
    textAlign: "center",
    boxShadow: "0 10px 28px rgba(212,83,126,0.08)",
  },

  statValue: {
    fontSize: 48,
    fontWeight: 950,
    color: "#D4537E",
    marginBottom: 10,
  },

  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 24,
    marginTop: 50,
  },

  memberCard: {
    background: "#fff",
    border: "1px solid #F2D4DF",
    borderRadius: 22,
    padding: "36px 20px",
    textAlign: "center",
    boxShadow: "0 12px 34px rgba(212,83,126,0.08)",
    lineHeight: 1.8,
    fontWeight: 700,
  },

  cta: {
    background: "#FBEAF0",
    padding: "120px 20px",
    textAlign: "center",
    borderTop: "1px solid #F2D4DF",
  },

  footer: {
    borderTop: "1px solid #F2D4DF",
    background: "#fff",
  },

  footerInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "30px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    color: "#666",
  },

  footerLinks: {
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
  },

  loginPage: {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #FFF8FA 0%, #FBEAF0 45%, #ffffff 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
},

loginCard: {
  width: "100%",
  maxWidth: 1040,
  background: "#ffffff",
  border: "1px solid #F2D4DF",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 24px 70px rgba(212, 83, 126, 0.18)",
},

loginTop: {
  height: 72,
  padding: "0 38px",
  borderBottom: "1px solid #F2D4DF",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "rgba(255,255,255,0.85)",
},

loginBrand: {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#1a1a1a",
  fontSize: 18,
},

loginLogo: {
  width: 34,
  height: 34,
  objectFit: "contain",
},

loginRegisterText: {
  fontSize: 13,
  color: "#4B1528",
  fontWeight: 700,
},

textButton: {
  border: "none",
  background: "transparent",
  color: "#D4537E",
  fontWeight: 900,
  cursor: "pointer",
  padding: 0,
},

loginContent: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  minHeight: 640,
},

loginLeft: {
  background: "linear-gradient(160deg, #FBEAF0 0%, #FFF8FA 100%)",
  padding: "80px 56px",
  borderRight: "1px solid #F2D4DF",
},

loginLeftTitle: {
  color: "#4B1528",
  fontSize: 34,
  lineHeight: 1.15,
  margin: "14px 0",
  fontWeight: 950,
},

loginLeftText: {
  color: "#993556",
  lineHeight: 1.75,
  fontWeight: 650,
  fontSize: 16,
},

loginBenefits: {
  display: "grid",
  gap: 20,
  marginTop: 42,
  color: "#4B1528",
  lineHeight: 1.55,
  fontSize: 14,
},

loginBenefitItem: {
  display: "grid",
  gridTemplateColumns: "42px 1fr",
  gap: 14,
  alignItems: "start",
},

loginBenefitIcon: {
  width: 42,
  height: 42,
  borderRadius: 14,
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 21,
  boxShadow: "0 8px 20px rgba(212, 83, 126, 0.12)",
},

loginRight: {
  padding: "70px 58px",
},

loginTitle: {
  fontSize: 34,
  margin: 0,
  color: "#111",
  fontWeight: 950,
},

loginSubtitle: {
  marginTop: 8,
  color: "#666",
  fontWeight: 650,
  lineHeight: 1.5,
},

userTypeGrid: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  margin: "30px 0",
},

userType: {
  border: "1px solid #F2D4DF",
  background: "#ffffff",
  borderRadius: 18,
  padding: "20px 14px",
  fontWeight: 900,
  cursor: "pointer",
  color: "#4B1528",
  boxShadow: "0 8px 22px rgba(212, 83, 126, 0.06)",
},

userTypeActive: {
  border: "2px solid #D4537E",
  background: "#FBEAF0",
  color: "#993556",
  borderRadius: 18,
  padding: "20px 14px",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 10px 26px rgba(212, 83, 126, 0.18)",
},

userTypeIcon: {
  fontSize: 32,
  marginBottom: 10,
},

loginForm: {
  display: "grid",
},

formLabel: {
  fontWeight: 850,
  marginBottom: 8,
  color: "#4B1528",
  fontSize: 14,
},

formInput: {
  height: 46,
  border: "1px solid #F2D4DF",
  borderRadius: 12,
  padding: "0 14px",
  marginBottom: 18,
  fontSize: 15,
  outline: "none",
  background: "#FFF8FA",
},

forgotButton: {
  border: "none",
  background: "transparent",
  color: "#D4537E",
  textAlign: "right",
  fontWeight: 800,
  cursor: "pointer",
  marginBottom: 22,
},

loginSubmit: {
  height: 48,
  border: "none",
  borderRadius: 12,
  background: "#D4537E",
  color: "#ffffff",
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 8px 22px rgba(212,83,126,0.26)",
},

divider: {
  textAlign: "center",
  color: "#666",
  margin: "28px 0 18px",
  fontSize: 13,
  fontWeight: 700,
},

socialGrid: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
},

socialButton: {
  height: 46,
  border: "1px solid #F2D4DF",
  background: "#ffffff",
  borderRadius: 12,
  fontWeight: 850,
  cursor: "pointer",
  color: "#4B1528",
},

bottomText: {
  textAlign: "center",
  color: "#666",
  marginTop: 28,
  fontSize: 14,
  fontWeight: 650,
},
 
loginTopLeft: {
  display: "flex",
  alignItems: "center",
  gap: 18,
},

backHomeButton: {
  border: "1px solid #F2D4DF",
  background: "linear-gradient(135deg, #FFF8FA 0%, #FBEAF0 100%)",
  color: "#D4537E",
  padding: "10px 18px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  gap: 8,
  transition: "0.25s ease",
  boxShadow: "0 4px 14px rgba(212,83,126,0.12)",
},

backHomeButtonHover: {
  transform: "translateY(-2px)",
},
};