/** Android's status bar: shorter than iOS's, and without the notch inset. */
export function AndroidStatusBar() {
  return (
    <div
      style={{
        height: 28,
        padding: "6px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "var(--fg-strong)",
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <span>9:41</span>
      <span style={{ display: "inline-flex", gap: 5, alignItems: "center", fontSize: 11 }}>
        <span style={{ display: "inline-flex", gap: 1.5 }}>
          {[3, 5, 7, 9].map((h) => (
            <span
              key={h}
              style={{ width: 2.5, height: h, background: "var(--fg-strong)", borderRadius: 1 }}
            />
          ))}
        </span>
        <span
          style={{
            width: 22,
            height: 10,
            border: "1px solid var(--fg-strong)",
            borderRadius: 2,
            padding: 1,
          }}
        >
          <span
            style={{
              display: "block",
              width: "70%",
              height: "100%",
              background: "var(--fg-strong)",
              borderRadius: 1,
            }}
          />
        </span>
      </span>
    </div>
  );
}
