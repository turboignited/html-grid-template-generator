import Cell from "./cell";
import { Grid } from "./grid";
import { GridOptions } from "./grid-options";

export interface GridSelectionConstructor {
    grid: Grid;
}
/**
 * Handles the selection of individual cells
 */
export class GridSelection {

    private _grid: Grid;
    public selections: Cell[];
    public started: boolean = false;
    public options: GridOptions;

    constructor(args: GridSelectionConstructor) {
        this._grid = args.grid;
        this.options = new GridOptions({ grid: args.grid });
        this.selections = [];
    }

    public startSelection(cell: Cell) {
        if (!this.started) {
            this.started = true;
            this.resetSelections();
            this.selections[0] = cell;
            cell.element.setStyle("border", "4px solid blue");
        }
    }

    public addSelection(cell: Cell) {
        if (this.started) {
            if (this.selections.findIndex((c => c.element.isSameAs(cell.element))) >= 0) {
                return;
            }
            cell.element.setStyle("border", "4px solid blue");
            this.selections.push(cell);
        }
    }

    public finishSelection(cell: Cell) {
        if (this.started) {
            this.started = false;
            if (this.selections[0].element.isSameAs(cell.element)) {
                this.selections[0].element.setStyle("border", "none");
                return;
            }
            this.options.showOptions(this.selections);

        }
    }

    public resetSelections() {
        for (let i = 0; i < this.selections.length; i++) {
            this.selections[i].element.setStyle("border", "none");
        }
        this.selections.splice(0, this.selections.length - 1);
    }
}