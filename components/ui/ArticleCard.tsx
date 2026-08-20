import type { Piece } from "@/lib/fixtures";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

/**
 * A letter in a list.
 *
 * The heart count is shown but is not a like — reactions are private, and this
 * is the writer's aggregate, not a leaderboard. There is no share count and no
 * follower count anywhere in this component, by design.
 */
export function ArticleCard({ piece, onOpen }: { piece: Piece; onOpen?: () => void }) {
  return (
    <article
      onClick={onOpen}
      style={{
        padding: "24px 0",
        borderTop: "1px solid var(--border-soft)",
        cursor: onOpen ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={piece.author} size={20} hue={piece.hue} />
        <span className="caption" style={{ color: "var(--fg-muted)" }}>
          {piece.author}
        </span>
        <span className="mono" style={{ color: "var(--fg-faint)" }}>
          ·
        </span>
        <span className="mono" style={{ fontSize: 10 }}>
          {piece.date}
        </span>
        {piece.premium && (
          <span
            className="mono"
            style={{
              marginLeft: "auto",
              color: "var(--wine-300)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
            }}
          >
            <Icon.lock />
            PATRON
          </span>
        )}
      </div>

      <div>
        <h3 className="title-md" style={{ margin: 0, marginBottom: 6 }}>
          {piece.title}
        </h3>
        <p
          className="body-reading"
          style={{
            margin: 0,
            fontSize: "var(--t-base)",
            lineHeight: 1.55,
            color: "var(--fg-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {piece.excerpt}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 2 }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>
          {piece.readTime} MIN
        </span>
        <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>
          {piece.mood}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14, color: "var(--fg-subtle)" }}>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center", fontSize: 12 }}>
            <Icon.heart />
            {piece.hearts}
          </span>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center", fontSize: 12 }}>
            <Icon.bookmark />
          </span>
        </div>
      </div>
    </article>
  );
}
