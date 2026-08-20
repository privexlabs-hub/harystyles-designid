import type { ReactNode } from "react";
import styles from "./Frames.module.css";

/** The iOS shell — 390×800, 44px corners. Android is squarer at 380 and 28. */
export function DeviceShell({
  children,
  kind = "ios",
}: {
  children: ReactNode;
  kind?: "ios" | "android";
}) {
  return (
    <div className={kind === "android" ? styles.androidShell : styles.deviceShell}>
      <div className={styles.deviceScreen}>{children}</div>
    </div>
  );
}

/** Its true outer size, so MockupFrame can scale it without measuring. */
export const DEVICE_SIZE = { ios: { w: 406, h: 816 }, android: { w: 392, h: 812 } } as const;
