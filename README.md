# Destiny UI

[![Discord](https://img.shields.io/badge/chat-Discord-%23738ad6?logo=discord&logoColor=white "Chat on Discord")](https://discord.gg/WS7JWRj) ![alpha](https://img.shields.io/badge/-alpha-red) [![Firefox 75.0+](https://img.shields.io/badge/Firefox-75.0+-brightgreen?logo=mozilla%20firefox&logoColor=white)](https://www.mozilla.org/en-US/exp/firefox/new/) [![Chromium 82.0+](https://img.shields.io/badge/Chromium-82.0+-brightgreen?logo=google%20chrome&logoColor=white)](https://www.chromium.org/) [![No support for Safari yet](https://img.shields.io/badge/Safari-no%20support%20yet-red?logo=safari&logoColor=white)](https://www.apple.com/safari/)

A reactive UI library for JavaScript and TypeScript. Uses standard JS/TS syntax; no compiling required. Built on top of the native Web Components API and uses the native HTML parser for the templates. No vDOM.

## Goals

- Quick to start prototyping
- No mandatory compiling
- Small
- Fast
- Take advantage of modern web platform features

### Non-goals

- Support outdated browsers like Internet Explorer

## Disclaimer

❗ _This is an experimental library. There **will** be breaking changes. Some parts are still heavily under construction or missing entirely. Use at your own risk._

## How to run

1. install node
2. run `npm i` in root
3. run `npm run compile` in root
4. start a dev server (ex: `npx http-server .`) and open `/index.html` to view demo

To get syntax-highlighting for HTML templates, you can use an extension called [`tobermory.es6-string-html`](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) on VSCode. Similar plugins are available for other editors too. Any extension that makes the editor treat template literals' tags as that block's file extension (ex. ``xml/*html*/`…`;`` is treated as an .html snippet) should also work. This only gives you syntax highlighting, though: slots are unfortunately not type checked; that would require a dedicated extension for this library, which does not yet exist.

## Examples

Live demo (with source maps): https://destiny.okku.dev/

You can convert anything to be reactive using the `reactive()` function. Their primitive value can be accessed via the `value` property. Setting `value` will cause the reactive item to dispatch events to all its listeners.

The `xml` template tag will parse the content as XHTML and returns an TemplateResult object containing a `DocumentFragment`. Any reactive items given to it via `${}` slots are bound both ways. This means that when the value of the reactive element is changed later, the relevant part of the DOM is automatically updated. If a reactive item is bound to something that may change from user input, the value of the reactive item will be automatically updated accordingly as user input comes in.

In the below example, two reactive items `#who` and `#count` are defined. `#who` is set as the value of an input element: the value of `#who` is updated whenever the text field in question receives input. `#who` is also rendered as text below, so as the user types, the text below will update in real time. `#count` on the other hand is just a number which is incremented once a second; the seconds counter is automatically rerendered every time the count changes.

```js
import { Component, xml, reactive, register } from "https://code.okku.dev/destiny-ui/0.5.1/dist/mod.js";

register(class ExampleComponent extends Component {
  #who = reactive("visitor");
  #count = reactive(0);
  #timer = setInterval(() => {
    this.#count.value++;
  }, 1e3);

  disconnectedCallback () {
    clearInterval(this.#timer);
  }

  template = xml`
    <label>What's your name? <input type="text" value="${this.#who}" /></label>
    <p>
      Hello, ${this.#who}!
      You arrived ${this.#count} seconds ago.
    </p>
  `;
});
```

[👉 View on codepen.io](https://codepen.io/okku/pen/MWKXMVK?editors=1010)

The library figures out what the appropriate DOM operation for each slot is from the location of the slots and binds those as callbacks to each reactive item it receives. Non-reactive slots are not bound; they are simply stringified and inserted in. There is no vDOM and no diffing or reconciliation. When a reactive item is updated, the changes will automatically propagate correctly to each dependent reactive item in the chain. This means that performance of updates scales with the complexity of the update (how many things need to be rerendered because of the update) instead of the total complexity of the application (like you would have with vDOM based solutions). Parsed HTML templates are cached in a WeakMap, so rendering multiple elements with the same template is quick after the first render.

You can also make arrays reactive. ReactiveArrays will behave generally akin to normal arrays, except that they will give you reactive properties instead of normal ones. You can manipulate the array like you would normal arrays and the DOM and other dependents will update with it; forget immutability! Here's an example of using a reactive array:

```js
import { xml, reactive } from "https://code.okku.dev/destiny-ui/0.5.1/dist/mod.js";

const thingsILike = reactive(["cats", "JavaScript", "sleep"]);

document.body.append(xml`
  <h1>Things I like</h1>
  <ul>
    ${thingsILike.map(value => xml`
      <li>${value}</li>
    `)}
  </ul>
`.content);

// later update the list:
setTimeout(() => {
  thingsILike.push("reactivity");
  thingsILike[1] = "TypeScript";
}, 3e3);
```

[👉 View on codepen.io](https://codepen.io/okku/pen/wvMXLpZ?editors=0010)

## Docs

No documentation yet, sorry. Some documentation can be found in source, however. Not ideal, but better than nothing for now.

## Supported platforms

Current versions target newest stable release of SpiderMonkey (Firefox) and V8 (Chromium). JavaScriptCore (Safari) is not yet supported.

Versions ≥1.0 will target the latest two releases of Firefox and Chromium, and the latest release of Safari. Hopefully.

Chakra (Internet Explorer & old Edge) will not be supported. Ever. New Edge uses V8, so it's supported.
