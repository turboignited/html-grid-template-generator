import Cell from "./cell";
import { createParagraphBold } from "./elements/elements";
import { GridOptionsElement } from "./elements/grid-options-element";
import { Grid } from "./grid";


export interface GridOptionsConstructor {
    grid: Grid;
}

/**
 * Presents options available that can be performed on cells
 */
export class GridOptions {
    private _element: GridOptionsElement;
    private _grid: Grid;

    constructor(args: GridOptionsConstructor) {
        this._grid = args.grid;
        this._element = new GridOptionsElement();

    }

    public showOptions(cells: Cell[]) {
        if (cells == null) {
            return;
        }

        this._element.element.hidden = false;

        this._element.addChild(createParagraphBold({ text: `Cells: ${cells.length}`, center: true, editable: false }));



    }

    public hideOptions() {
        this._element.element.hidden = true;

    }
}