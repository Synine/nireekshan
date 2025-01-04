/**
 * @name Nireekshan
 * @description Nireekshan - A minimal event emitter
 * @author Goutham Krishna K V <https://github.com/gouthamkrishnakv>
 * @copyright Goutham Krishna K V 2025
 * @license MIT
 */

type VariadicArgs = any[];
type EventCallback = (...args: VariadicArgs) => any

const CALLBACK_ERROR_MESSAGE = '[emitter]: callback must be a function';

/**
 * A minimal event emitter
 * @class
 * @example
 * const emitter = new Emitter();
 * emitter.on('foo', (val: {bar: string}) => {
 *   console.log('test event emitted with value:', val);
 * });
 * emitter.emit('test', {bar: 'baz'});
 * // Output: test event emitted with value: {bar: 'baz'}
 *
 */
export class Emitter {
  private eventMap: Map<string, EventCallback[]>

  constructor() {
    this.eventMap = new Map();
  }

  /**
   * Attaches a callback to the given event. If the callback is undefined,
   * the method does nothing.
   * @param {string} event - The event to which the callback must be attached.
   * @param callback - The callback to be attached to the event.
   * @throws Error if the callback is not a function.
   */
  on(event: string, callback?: EventCallback) {
    if (typeof callback !== 'function') {
      throw new Error(CALLBACK_ERROR_MESSAGE);
    }
    if (!this.eventMap.has(event)) {
      this.eventMap.set(event, []);
    }
    this.eventMap.get(event)?.push(callback);
  }

  /**
   * Attaches a callback to the given event and removes the callback after
   * it is called once. If the callback is undefined, the method does nothing.
   * @param {string} event - The event to which the callback must be attached.
   * @param callback - The callback to be attached to the event.
   * @throws Error if the callback is not a function.
   */
  once(event: string, callback?: EventCallback) {
    if (typeof callback !== 'function') {
      throw new Error(CALLBACK_ERROR_MESSAGE);
    }
    const onceWrapper = (...args: VariadicArgs) => {
      this.off(event, onceWrapper);
      callback(...args);
    }
    this.on(event, onceWrapper);
  }

  /**
   * Removes a callback from an event. If the callback is not found, the method does nothing.
   * @param {string} event - The event from which the callback must be removed.
   * @param callbackToRemove - The callback to be removed from the event.
   * @throws Error if the callback is not a function.
   */
  off(event: string, callbackToRemove: EventCallback) {
    const callbacks = this.eventMap.get(event);
    if (callbacks) {
      const callbackIndex = callbacks.indexOf(callbackToRemove);
      if (callbackIndex !== -1) {
        callbacks.splice(callbackIndex, 1);
        if (callbacks.length === 0) {
          this.eventMap.delete(event);
        }
      }
    }
  }

  /**
   * Triggers all callbacks for the given event. If no callbacks are
   * attached to the event, the method does nothing.
   * @param {string} event - The event for which the callbacks must be triggered.
   * @param {...VariadicArgs} args - The arguments to be passed to the callbacks.
   */
  emit(event: string, ...args: VariadicArgs) {
    const callbacksMaybe: EventCallback[] | undefined = this.eventMap.get(event);
    if (callbacksMaybe) {
      for (const callback of callbacksMaybe) {
        callback(...args);
      }
    }
  }
}
