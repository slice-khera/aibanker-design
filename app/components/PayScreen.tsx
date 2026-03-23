"use client";

// ── PayScreen — static screenshot of the real app with a chat hotspot ─────────
// Uses a full-bleed iPhone screenshot as background. The top-right chat icon
// and the adjacent profile avatar are interactive launch points.

export default function PayScreen({
  onChatOpen,
  onProfileOpen,
}: {
  onChatOpen?: () => void;
  onProfileOpen?: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed screenshot */}
      <img
        src="/pay-screen.png"
        alt="Payment screen"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* Tappable hotspot over the chat bubble icon (top-right) */}
      {/* Positioned by percentage relative to the 402×874 pt frame */}
      <button
        onClick={onChatOpen}
        aria-label="Open chat"
        style={{
          position: "absolute",
          top: "7.5%",
          right: "22%",
          width: "10%",
          height: "4.5%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* Tappable hotspot over the profile avatar next to chat */}
      <button
        onClick={onProfileOpen}
        aria-label="Open stories"
        style={{
          position: "absolute",
          top: "6.2%",
          right: "5.5%",
          width: "14%",
          height: "6.8%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
    </div>
  );
}
