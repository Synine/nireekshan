import { WebSocketServer } from "ws";

let i = 0;

const wss = new WebSocketServer({ host: 'localhost', 'port': 8080 });

wss.on('connection', (ws) => {
  ws.on('open', () => {
    console.log('WebSocket connection opened');
  })
  ws.on('message', (message) => {
    console.log('received: %s', message);
  })

  const intervalId = setInterval(() => {
    if (i >= 5) {
      i = 0;
      clearInterval(intervalId);
      ws.close();
    } else {
      ws.send(JSON.stringify({value: i}));
      i++;
    }
  }, 1000);

  ws.on('close', () => {
    console.log('WebSocket connection closed')
    i = 0;
    if (!!intervalId) {
      clearInterval(intervalId);
    }
  })
  console.log('connected, sending message 5 times')
})
