"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of `children` once the WebGL subtree has thrown. */
  fallback: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Keeps a WebGL failure (lost context, driver crash, texture decode error) from taking
 * the page with it — the viewer degrades to its DOM fallback instead.
 */
export class WebglBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

let probed: boolean | null = null;

/** Cheap capability probe, run once per page load and cached. */
function webglSupported(): boolean {
  if (probed !== null) return probed;
  try {
    const canvas = document.createElement("canvas");
    probed = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    probed = false;
  }
  return probed;
}

const noopSubscribe = () => () => {};
const serverSnapshot = () => false;

/**
 * `false` during SSR and on machines without WebGL, `true` once mounted in a browser
 * that has it. Uses `useSyncExternalStore` rather than an effect so the server and the
 * first client render agree, and so nothing sets state during an effect.
 */
export function useWebglAvailable(): boolean {
  return useSyncExternalStore(noopSubscribe, webglSupported, serverSnapshot);
}
