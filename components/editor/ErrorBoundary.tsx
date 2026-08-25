"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

/**
 * Catches a template that throws while rendering.
 *
 * The canvas builds its artboard during render, so a bad template takes the
 * whole editor down with it and leaves a blank page — no message, no way back,
 * and the work in the inspector still there but unreachable. This keeps the
 * failure local to the canvas and names the template, because "something went
 * wrong" is no use when there are a hundred and thirty-odd of them.
 *
 * A class is the only way to catch a render error in React; the ban on class
 * components in lib/satori/constraints.ts applies to templates, which are
 * rendered by two engines. This is ordinary app UI.
 */
type Props = {
  children: ReactNode;
  /** Named in the message, and used to reset when the user moves on. */
  templateId: string;
  onReset?: () => void;
};

type State = { error: Error | null };

export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Template "${this.props.templateId}" failed to render`, error, info);
  }

  componentDidUpdate(prev: Props) {
    // Choosing a different template is the natural way out, so recover on it
    // rather than making the user find a button.
    if (prev.templateId !== this.props.templateId && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className={styles.wrap} role="alert">
        <div className={styles.card}>
          <div className="eyebrow" style={{ color: "var(--alarm, var(--mood-burning))" }}>
            THIS ARTBOARD WOULD NOT DRAW
          </div>
          <p className={`title-sm ${styles.title}`}>{this.props.templateId}</p>
          <p className={`body-sm ${styles.body}`}>
            The rest of the editor is untouched and your copy is still here. Pick another
            template, or try this one again.
          </p>
          <pre className={styles.detail}>{error.message}</pre>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.retry}
              onClick={() => {
                this.setState({ error: null });
                this.props.onReset?.();
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
