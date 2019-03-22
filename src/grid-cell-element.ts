import { BodyElement } from "./body-element";
import Grid from "./grid";
import { createDiv, createParagraph, createParagraphRegular, randomColourString } from "./elements";
import GridCell from "./grid-cell";


interface GridCellElementConstructor {
    grid: Grid;
    cell: GridCell;
}
export default class GridCellElement extends BodyElement {
    private _cell: GridCell;
    private _grid: Grid;
    private readonly _colour: string = randomColourString();
    constructor(args: GridCellElementConstructor) {
        super({ element: createDiv() });
        this._grid = args.grid;
        this._cell = args.cell;
        this.updateStyle();
    }

    public updateStyle(): void {
        this.setStyle("grid-row", `${this._cell.y + 1} / span ${this._cell.ySpan}`);
        this.setStyle("grid-column", `${this._cell.x + 1} / span ${this._cell.xSpan}`);
        this.setStyle("border", "1px solid black");
    }

}
