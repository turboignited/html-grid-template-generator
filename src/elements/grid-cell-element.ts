import GridCell from "../grid-cell";
import { BodyElement } from "./body-element";
import { createDiv, Elements } from "./elements";

interface GridCellElementConstructor {
    cell: GridCell;
    element?: HTMLElement;
}
export default class GridCellElement extends BodyElement {
    private _cell: GridCell;
    constructor(args: GridCellElementConstructor) {
        super({
            element: args.element ? args.element : createDiv(),
            elementType: args.element ? args.element.tagName as Elements : Elements.div
        });
        this._cell = args.cell;
        this.updateStyle();
    }

    public updateStyle(): void {
        //        this.setStyle("background", this._colour);
        this.setStyle("grid-row", `${this._cell.position.y + 1} / span ${this._cell.span.y}`);
        this.setStyle("grid-column", `${this._cell.position.x + 1} / span ${this._cell.span.x}`);
        this.setStyle("border", "1px solid black");
    }

}
