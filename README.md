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

