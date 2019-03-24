import Coordinate from "./coordinate";
import GridCellElement from "./elements/grid-cell-element";
import { Grid } from "./grid";

interface GridCellConstructor {
    position: Coordinate;
    span: Coordinate;
    grid: Grid;

    element?: HTMLElement;
}

export default class GridCell {
    public position: Coordinate;
    public span: Coordinate;
    public _element: GridCellElement;
    private _grid: Grid;

    public get element(): GridCellElement {
        return this._element;
    }
    constructor(args: GridCellConstructor) {
        this.position = args.position;
        this.span = args.span;
        this._grid = args.grid;
        if (args.element == null) {
            this._element = new GridCellElement({ cell: this });
        } else {
            this._element = new GridCellElement({ cell: this, element: args.element });
        }
        this._element.setClickHandler(() => {
            this.onClicked();
        });

    }

    public deleteElement(): void {
        this._element.removeSelf();
    }

    public onClicked(): void {
        this._grid.onClickedCell(this);
    }

}



