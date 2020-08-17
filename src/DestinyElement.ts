import { deferredElements } from "./html/deferredElements";
import type { Renderable } from "./html/Renderable";

/**
 * A class for creating new custom elements in Destiny UI.
 */
export abstract class DestinyElement extends HTMLElement {
  constructor () {
    if (new.target === DestinyElement) {
      throw new TypeError("Can't initialize abstract class.");
    }
    super();
    const shadow = this.attachShadow({ mode: "open" });
    queueMicrotask(
      () => {
        shadow.appendChild(
          this.render().content,
        );
      },
    );
  }

  out (
    callback: (element: HTMLElement) => Promise<void> | void,
  ): this {
    deferredElements.set(
      this,
      callback,
    );

    return this;
  }

  abstract render (): Renderable;
}
