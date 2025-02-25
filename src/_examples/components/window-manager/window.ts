import { Component, xml } from "/dist/mod.js";

import type { TWindow } from "./TWindow";

export class Window extends Component<{
  props: TWindow,
}> {
  template = xml/*html*/`
    <style>
      :host {
        background: #333;
        display: block;
        width: ${this.props.size.x}px;
        height: ${this.props.size.y}px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: var(--border-radius);
        overflow: hidden;
        --header-height: 40px;
        box-shadow: 1px 1px 5px #000C;
        transform: translate(${this.props.position.x}px, ${this.props.position.y}px);

        outline: 1px dashed cyan;
      }

      header {
        height: var(--header-height);
        line-height: var(--header-height);
        padding: 0 var(--s);
        background: #444;
      }

      main {
        width: 100%;
        height: calc (100% - var(--header-height));
        overflow: auto;
        padding: var(--s);
      }

      .handle {
        --thickness: 6px;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        outline: 1px dashed red;
      }

      .e {
        left: auto;
        right: 0;
      }

      .s {
        top: auto;
        bottom: 0;
      }

      .n, .s {
        height: var(--thickness);
        cursor: ns-resize;
      }

      .e, .w {
        width: var(--thickness);
        cursor: ew-resize;
      }

      .n.e, .s.w {
        cursor: nesw-resize;
        width: 10px;
        height: 10px;
        outline: 1px dashed lime;
      }
      .n.w, .s.e {
        cursor: nwse-resize;
        width: 10px;
        height: 10px;
        outline: 1px dashed lime;
      }
    </style>
    <header>
      ${this.props.header}
    </header>
    <main>
      ${this.props.content}
    </main>
    <div class="handle n" />
    <div class="handle e" />
    <div class="handle s" />
    <div class="handle w" />
    <div class="handle n e" />
    <div class="handle s e" />
    <div class="handle s w" />
    <div class="handle n w" />
  `;
}
