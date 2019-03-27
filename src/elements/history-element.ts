import { BodyElement } from "./body-element";
import { createDiv } from "./elements";

export class HistoryElement extends BodyElement {

    constructor() {
        super({ element: createDiv() });

    }
    public updateStyle(): void {
        throw new Error("Method not implemented.");
    }

}