import { BodyElement } from "./body-element";

export abstract class DeletableBodyElement extends BodyElement {
    public updateStyle(): void {
        throw new Error("Method not implemented.");
    }
    constructor(element: HTMLElement) {
        super({ element: element });
        this.element.addEventListener("input", (ev: Event) => {
            this.onChanged();
        });
    }
    private onChanged() {
        if (this.element.textContent == "") {
            // Delete empty paragraph
            this.removeSelf();
        }
    }
}