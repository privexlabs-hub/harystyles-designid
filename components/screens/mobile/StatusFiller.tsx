/**
 * The iOS status bar, drawn rather than screenshotted.
 *
 * Height and padding match IOSFrame exactly so a screen can be dropped into
 * either shell without the clock moving.
 */
export function StatusFiller() {
  return (
    <div
      style={{
        height: 52,
        paddingTop: 16,
        paddingLeft: 28,
        paddingRight: 28,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "var(--font-ui)",
        fontSize: 15,
        fontWeight: 600,
        color: "var(--fg-strong)",
      }}
    >
      <span>9:41</span>
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        <span style={{ display: "flex", gap: 2 }}>
          {[3, 5, 7, 9].map((h) => (
            <span
              key={h}
              style={{ width: 3, height: h, background: "var(--fg-strong)", borderRadius: 1 }}
            />
          ))}
        </span>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
          <path d="M8 1.5C5.7 1.5 3.6 2.4 2 3.9l1.4 1.4C4.6 4.2 6.2 3.5 8 3.5s3.4 0.7 4.6 1.8L14 3.9C12.4 2.4 10.3 1.5 8 1.5zM8 5.5c-1.4 0-2.7 0.5-3.7 1.4L5.7 8.3C6.3 7.8 7.1 7.5 8 7.5s1.7 0.3 2.3 0.8l1.4-1.4C10.7 6 9.4 5.5 8 5.5zM8 9.5l1.5 1.5h-3z" />
        </svg>
        <span
          style={{
            width: 24,
            height: 11,
            border: "1px solid var(--fg-strong)",
            borderRadius: 3,
            padding: 1,
            position: "relative",
          }}
        >
          <span
            style={{
              display: "block",
              width: "75%",
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
