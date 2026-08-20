/** The gesture pill. Pinned to the device screen, not to the page. */
export function AndroidNavBar() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg)",
      }}
    >
      <span style={{ width: 110, height: 4, borderRadius: 999, background: "var(--fg-faint)" }} />
    </div>
  );
}
