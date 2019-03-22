import { createParagraphLoremIpsum } from "./elements";
import { DeletableBodyElement } from "./deletable-body-element";

export default class EditableParagraphElement extends DeletableBodyElement {
    constructor() {
        super(createParagraphLoremIpsum({
            center: false,
            bold: false,
            editable: true,
            sentences: 1,
            words: 4
        }));

    }

    public updateStyle(): void {
        throw new Error("Method not implemented.");
    }
}