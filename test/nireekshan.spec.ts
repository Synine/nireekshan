import { beforeEach, describe, expect, it } from 'vitest';
import { Emitter } from '../src';

describe('nireekshan::basic', () => {
  it('emitter should be initialized', () => {
    const emitter = new Emitter();
    expect(emitter).toBeDefined();
  })
})

describe('nireekshan:emits', () => {
  // variables
  let emitter: Emitter = new Emitter();

  // hooks

  beforeEach(() => {
    emitter = new Emitter();
  })

  // tssts
  it('should not accept a non-function callback', () => {
    try {
      // @ts-expect-error testing for non-function callback
      emitter.on('test', 'not a function');
    } catch (e: Error | any) {
      expect(e?.message).toBe('[emitter]: callback must be a function');
    }
  })

  it('should emit an event', () => {
    emitter.on('test', (val?: { testVal: boolean }) => {
      expect(val?.testVal).toBeTruthy();
    })
    emitter.emit('test', { testVal: true });
  })

  it('should emit multiple events', () => {
    emitter.on('test', (val?: { testVal: boolean }) => {
      expect(val?.testVal).toBeTruthy();
    })
    emitter.on('test', (val?: { testVal: boolean }) => {
      expect(val?.testVal).toBeTruthy();
    })
    emitter.emit('test', { testVal: true });
  })

  it('should be able to remove an event', () => {
    emitter.on('test', (val?: { testVal: boolean }) => {
      expect(val?.testVal).toBeTruthy();
    })
    // should NOT be called, as it's removed
    const notToBeCalledFn = () => {
      // make it fail
      expect(1).toBe(2);
    }
    emitter.on('test', notToBeCalledFn);
    emitter.off('test', notToBeCalledFn);

    emitter.emit('test', { testVal: true })
  })

  it('should only run the handler once', () => {
    let onceCallCount = 0;
    // once-handler
    emitter.once('test', (val?: { testVal: boolean }) => {
      onceCallCount++;
      expect(val?.testVal).toBeTruthy();
      expect(onceCallCount).toBe(1);
    })
    // non-once handler
    emitter.on('test', (val?: { testVal: boolean }) => {
      expect(val?.testVal).toBeTruthy();
    })
    emitter.emit('test', { testVal: true });
    emitter.emit('test', { testVal: true });
    emitter.emit('test', { testVal: true });
  })
})
