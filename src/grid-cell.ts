import GridCellElement from "./grid-cell-element";
import Grid from "./grid";

interface GridCellConstructor {
    x: number;
    y: number;
    xSpan: number;
    ySpan: number;
    grid: Grid;
}

export default class GridCell {
    public y: number;
    public x: number;
    public ySpan: number;
    public xSpan: number;
    public _element: GridCellElement;
    private _grid: Grid;

    public get element(): GridCellElement {
        return this._element;
    }
    constructor(args: GridCellConstructor) {
        this.y = args.y;
        this.x = args.x;
        this.ySpan = args.ySpan;
        this.xSpan = args.xSpan;
        this._grid = args.grid;
        this._element = new GridCellElement({ cell: this, grid: this._grid });
        this._element.onClick = () => {
            this.onClicked();
        }
    }

    public delete(): void {
        this._element.removeSelf();
    }

    private onClicked(): void {
        this._grid.onClickedCell(this);
    }

}



