import ContactSection from "../components/home/ContactSection";

export default function Contact() {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      <title>Contact | Africa Web3 Institute</title>
      <ContactSection />
    </div>
  );
}
