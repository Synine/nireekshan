import { type ReactNode } from "react";
import './Foo.css';

export type FooProps = {
  count: number;
  connected: boolean;
};

export const Foo = ({ count, connected }: FooProps): ReactNode => {
  return (
    <>
      <h1>Nireekshan - WebSocket Test</h1>
      <div className="card">
        <div className={connected ? "status-connected" : "status-disconnected"}>
          {connected ? "Connected" : "Disconnected"}
        </div>
        <div className="button">count is {count}</div>
        <p>
          This value is being changed via a{" "}
          <b>
            <code>message</code>
          </b>{" "}
          event from WebSocket.
        </p>
      </div>
    </>
  );
};
