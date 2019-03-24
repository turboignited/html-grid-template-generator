import { Grid } from "../grid";
import { BodyElement } from "./body-element";
import { createDiv, Elements } from "./elements";

interface GridElementConstructor {
    grid: Grid;
}
export default class GridElement extends BodyElement {
    private _grid: Grid;

    constructor(args: GridElementConstructor) {
        super({ element: createDiv(), elementType: Elements.div });
        this._grid = args.grid;
        this.updateStyle();
    }

    public updateStyle(): void {
        this.setStyle("display", "grid");
        this.setStyle("grid-gap", `${this._grid.gridGap}px`);
        this.setStyle("grid-template-columns", `repeat(${this._grid.columns}, 1fr)`);
        this.setStyle("grid-template-rows", `repeat(${this._grid.rows}, 1fr)`);
        this.setStyle("width", `${this._grid.width}${this._grid.widthUnit}`);
        this.setStyle("height", `${this._grid.height}${this._grid.heightUnit}`);
        this.setStyle("margin", `${this._grid.margin}px`);
        this.setStyle("padding", `${this._grid.padding}px`);
    }
}