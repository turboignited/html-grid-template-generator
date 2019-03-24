import { DeletableBodyElement } from "./deletable-body-element";
import { createHeadingLoremIpsum, Elements } from "./elements";

export default class EditableHeadingElement extends DeletableBodyElement {
    public updateStyle(): void {
        throw new Error("Method not implemented.");
    }
    constructor(element: Elements) {
        super(createHeadingLoremIpsum({
            element: element.toString(),
            editable: true,
            center: false,
            words: 4,
            sentences: 1
        }));
    }
}