import Cell from "../cell";
import { BodyElement } from "./body-element";
import { createDiv } from "./elements";

interface CellElementConstructor {
    cell: Cell;
    element?: HTMLElement;
}
export default class CellElement extends BodyElement {
    private _cell: Cell;
    constructor(args: CellElementConstructor) {
        super({ element: args.element ? args.element : createDiv() });
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
