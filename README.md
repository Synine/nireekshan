# `nireekshan`

A tiny and fast event emitter for the browser and Node.js, written in TypeScript.

## Installation

```bash
npm install nireekshan
```

# Usage

If you just want to use it just as an event-emitter, then you can import like this (check out advanced examples for more useful use-cases)

```ts
import { Emitter } from 'nireekshan';

const emitter = new Emitter();

emitter.on('emitMessage', (foo, bar) => {
    // attach logic to the event for some specific callbacks
    emitMessage(foo, bar)
})

// emitting an event will then trigger the method 
//`emitMessage` with the parameters `foo` and `bar`
emitter.emit('emitMessage', foo, bar)
```
For an event-driven architecture, you can use a inverse-emitter to set up request-responses asynchronously

```ts
class MessageEventsWrapper {
    emitter: Emitter;

    constructor(emitter: Emitter) {
        this.emitter = emitter;
        // set up emitter with emit-logic. when an event is received, the emitter sends 'response/<id>' response with provided args
    }

    sendRequest(payload: any, timeout: number = 5_000): Promise<any> {
        return new Promise((resolve, reject) => {
            const requestID = randomUUID();

            const responseEvent = `response/${requestID}`;
            this.emitter.once(responseEvent, (payloadArgs) => {
                // return a successful promise
                resolve(responsePayload);
            });

            // timeouts, so that it won't fill up your memory. BE CAREFUL!!
            const timeoutId = setTimeout(() => {
                // catch error or exception
                reject(new Error(`Request timed out after ${timeout} ms for id: ${requestID}`))
            });
            this.emitter.once(responseEvent, () => clearTimeout(timeoutId));

            console.log(`[CLIENT]: sending request to client with ID: ${requestID}`);
            this.emitter.emit('request', { id: requestID, data: payload });
        })
    }
}

```

# License

This project is licensed using MIT License.

Copyright (C) 2025 Goutham Krishna K V
