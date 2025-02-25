import { resolveSlotPositions } from "./resolveSlotPositions.js";
import { resolveAttributeValue } from "./resolveAttributeValue.js";
import { parseAttributeName } from "./parseAttributeName.js";
import { assignElementData } from "./elementData/_assignElementData.js";
import type { Component } from "../../../componentLogic/Component.js";
import type { TElementData } from "./TElementData.js";

/**
 * Goes through all the elements in a template that are flagged with the `destiny::attr` attribute and figures out what events need to be listened to, and how the DOM needs to be updated if any of the given props are reactive.
 * @param templ A template element that has been processed by `resolveSlots()`.
 * @param props Any items that were slotted into the HTML template
 */
export function hookAttributeSlotsUp (
  templ: DocumentFragment,
  props: Array<unknown>,
): void {
  const attributeSlots = Object.values(
    templ.querySelectorAll("[destiny\\:attr],[data-capture-props]"),
  ) as unknown as Array<HTMLElement & ChildNode>;

  for (const element of attributeSlots) {
    const { captureProps } = element.dataset;
    const values: TElementData = {
      prop:      new Map<string, unknown>(),
      on:        new Map<string, unknown>(),
      call:      new Map<string, unknown>(),
      destiny:   new Map<string, unknown>(),
      attribute: new Map<string, unknown>(),
    } as const;
    for (const {name, value} of element.attributes) {
      const val = resolveSlotPositions(value);

      //if no slots, skip
      if (!val.length) {
        if (captureProps && name !== "destiny:attr") {
          const [namespace, attributeName] = parseAttributeName(name);
          values[namespace].set(attributeName, value);
        }
        continue;
      }

      const attrVal = resolveAttributeValue(val, props);
      const [namespace, attributeName] = parseAttributeName(name);
      values[namespace].set(attributeName, attrVal);
    }
    
    if (captureProps) {
      queueMicrotask(() => {
        (element as Component).assignedData = values;
      });
    } else {
      assignElementData(element, values);
    }
  }
}
