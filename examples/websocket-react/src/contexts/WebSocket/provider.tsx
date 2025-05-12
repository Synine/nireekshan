import { useEffect, useMemo, useRef, type ReactNode, type Ref } from "react";
import { Emitter } from "nireekshan";

import { WebsocketContext } from "./context";

export type WebsocketProviderProps = {
  children: undefined | ReactNode | ReactNode[];
  onOpen: (event: Event) => void | ((event: Event) => void)[];
  onClose: (event: CloseEvent) => void | ((event: CloseEvent) => void)[];
  onMessage: (
    message: MessageEvent
  ) => void | ((message: MessageEvent) => void)[];
};

export const WebSocketProvider = ({
  children,
  onOpen,
  onClose,
  onMessage,
}: WebsocketProviderProps) => {
  const isInitialStrictModeRef = useRef(true);

  const emitter = useMemo(() => new Emitter(), []);

  const ws: Ref<WebSocket | undefined | null> = useRef(null);

  useEffect(() => {
    if (onOpen) {
      if (typeof onOpen === "function") {
        console.log("SET UP ON OPEN");
        emitter.once("open", onOpen);
      }
    }
    if (onClose) {
      if (typeof onClose === "function") {
        console.log("SET UP ON CLOSE");
        emitter.once("close", onClose);
      }
    }
    if (onMessage) {
      if (typeof onMessage === "function") {
        console.log("SET UP ON MESSAGE");
        emitter.on("message", onMessage);
      }
    }

    return () => {
      if (onOpen) {
        emitter.off("open", onOpen);
      }
      if (onClose) {
        emitter.off("close", onClose);
      }
      if (onMessage) {
        emitter.off("message", onMessage);
      }
    };
  }, [onOpen, onClose, onMessage, emitter]);

  useEffect(() => {
    // NOTE: React in strict-mode runs the useEffect twice, so the current condition
    // is to ignore the first useEffect run. Ignore this unless relevant.
    if (
      import.meta.env.MODE === "development" &&
      isInitialStrictModeRef.current
    ) {
      console.warn(
        `[WebsocketProvider]: React strict-mode fix: first-run skips WS creation`
      );
      isInitialStrictModeRef.current = false;
      return;
    }

    // emit WebSocket events into Nireekshan Emitter so Nireekshan becomes the
    // point of contact for the context rather than WebSocket conn directly.

    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = (event: Event) => {
      emitter.emit("open", event);
    };
    ws.current.onclose = (event: CloseEvent) => {
      emitter.emit("close", event);
    };
    ws.current.onmessage = (message: MessageEvent) => {
      emitter.emit("message", message);
    };
    ws.current.onerror = (error: Event) => {
      console.error(`WebSocket error`, error);
    };
    return () => {
      ws.current?.close();
      if (import.meta.env.MODE === "development") {
        isInitialStrictModeRef.current = true;
      }
    };
  }, [emitter]);

  return (
    <WebsocketContext.Provider value={null}>
      {children}
    </WebsocketContext.Provider>
  );
};
