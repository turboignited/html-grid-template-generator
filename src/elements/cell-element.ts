import Cell from "../cell";
import { BodyElement } from "./body-element";
import { createDiv, randomColourString } from "./elements";

interface CellElementConstructor {
    cell: Cell;
}

export default class CellElement extends BodyElement {
    private _cell: Cell;
    private _colour: string = randomColourString();

    constructor(args: CellElementConstructor) {
        super({ element: createDiv() });
        this._cell = args.cell;
        this.updateStyle();
    }

    public updateStyle(): void {
        this.setStyle("background", this._colour);
        this.setStyle("grid-row", `${this._cell.position.y + 1} / span ${this._cell.span.y}`);
        this.setStyle("grid-column", `${this._cell.position.x + 1} / span ${this._cell.span.x}`);
    }

}
