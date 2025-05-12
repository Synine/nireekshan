import { useCallback, useState } from "react";
import "./App.css";
import { WebSocketProvider } from "./contexts/WebSocket/provider";
import { Foo } from "./components/Foo";

function App() {
  // states
  const [connected, setConnected] = useState(false);
  const [count, setCount] = useState(0);

  // handlers
  const onOpen = useCallback((event: Event) => {
    console.log("WebSocket connection opened:", event);
    setConnected(true);
  }, []); // Empty dependency array means this function reference will remain stable

  const onClose = useCallback((event: CloseEvent) => {
    console.log("WebSocket connection closed:", event);
    setConnected(false);
  }, []);

  const onMessage = useCallback((message: MessageEvent) => {
    const x = JSON.parse(message.data);
    if ("value" in x && typeof x.value === "number") {
      setCount(() => x.value);
    }
  }, []);

  // component

  return (
    <>
      <WebSocketProvider
        onOpen={onOpen}
        onClose={onClose}
        onMessage={onMessage}
      >
        {/* NOTE: modified from React Vite QuickStart */}
        <Foo count={count} connected={connected} />
      </WebSocketProvider>
    </>
  );
}

export default App;
