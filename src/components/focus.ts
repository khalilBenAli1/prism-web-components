/** Walk the composed tree, including assigned slots and nested open shadow roots. */
export function focusableElements(root: Element): HTMLElement[] {
  const result: HTMLElement[] = [];
  function visit(element: Element) {
    if (
      element instanceof HTMLElement &&
      element.tabIndex >= 0 &&
      !element.matches(':disabled,[hidden]') &&
      element.getClientRects().length
    )
      result.push(element);
    const children =
      element instanceof HTMLSlotElement
        ? element.assignedElements({ flatten: true })
        : element.shadowRoot
          ? Array.from(element.shadowRoot.children)
          : Array.from(element.children);
    children.forEach(visit);
  }
  Array.from(root.children).forEach(visit);
  return result;
}
export function activeElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}
