import Events from "../components/home/Events";

export default function EventsPage() {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      <Events />
    </div>
  );
}
