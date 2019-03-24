import Coordinate from "./coordinate";

export enum GridCellAction {
    Removed,
    Changed,
    Added,
    Moved,

    Child,


    Activated,

    Deactivated
}

export class GridHistory {

    private _actions: GridCellAction[] = [];
    public get actions(): GridCellAction[] {
        return this._actions;
    }
    private _cellsRemoved?: CellHistory[];
    public cellRemoved(cell: CellHistory): void {
        if (this._cellsRemoved == null) {
            this._cellsRemoved = [];
        }
        this._actions.push(GridCellAction.Removed);
        this._cellsRemoved.push(cell);
    }
    public get cellsRemoved(): CellHistory[] {
        return this._cellsRemoved;
    }

    private _cellsChild?: CellChildHistory[];
    public cellChild(child: CellChildHistory): void {
        if (this._cellsChild == null) {
            this._cellsChild = [];
        }
        this._actions.push(GridCellAction.Child);
        this._cellsChild.push(child)
    }
    public get cellsChild(): CellChildHistory[] {
        return this._cellsChild;
    }



    private _cellsChanged?: CellChangedHistory[];
    public cellChanged(cell: CellChangedHistory): void {
        if (this._cellsChanged == null) {
            this._cellsChanged = [];
        }
        this._actions.push(GridCellAction.Changed);
        this._cellsChanged.push(cell);
    }
    public get cellsChanged(): CellChangedHistory[] {
        return this._cellsChanged;
    }

    private _cellsAdded?: CellHistory[];
    public cellAdded(cell: CellHistory): void {
        if (this._cellsAdded == null) {
            this._cellsAdded = [];
        }
        this._actions.push(GridCellAction.Added);
        this._cellsAdded.push(cell);
    }
    public get cellsAdded(): CellHistory[] {
        return this._cellsAdded;
    }

    private _cellsMoved?: CellMovedHistory[];
    public cellMoved(cell: CellMovedHistory): void {
        if (this._cellsMoved == null) {
            this._cellsMoved = [];
        }

        this._actions.push(GridCellAction.Moved);
        this._cellsMoved.push(cell);
    }
    public get cellsMoved(): CellMovedHistory[] {
        return this._cellsMoved;
    }

    private _cellActivated?: CellHistory;
    public set cellActivated(cell: CellHistory) {
        this._actions.push(GridCellAction.Activated);
        this._cellActivated = cell;
    }
    public get cellActivated(): CellHistory {
        return this._cellActivated;
    }

    private _cellDeactivated?: CellHistory;
    public set cellDeactivated(cell: CellHistory) {
        this._actions.push(GridCellAction.Deactivated);
        this._cellDeactivated = cell;
    }
    public get cellDeactivated(): CellHistory {
        return this._cellDeactivated;
    }

    private _columnsHistory: ColumnsHistory;
    public set columnsHistory(history: ColumnsHistory) {
        this._columnsChanged = true;
        this._columnsHistory = history;
    }
    public get columnsHistory(): ColumnsHistory {
        return this._columnsHistory;
    }

    private _rowsHistory: RowsHistory;
    public set rowsHistory(history: RowsHistory) {
        this._rowsChanged = true;
        this._rowsHistory = history;
    }
    public get rowsHistory(): RowsHistory {
        return this._rowsHistory;
    }

    private _rowsChanged: boolean = false;
    private _columnsChanged: boolean = false;
    public get rowsChanged(): boolean {
        return this._rowsChanged;
    }
    public get columnsChanged(): boolean {
        return this._columnsChanged;
    }
}

export interface CellHistory {
    element: HTMLElement;
    position: Coordinate;
    span: Coordinate;
}
export interface CellChildHistory {
    added: boolean;

    cell: CellHistory;

    child: ChildNode;

}
export interface CellChangedHistory {
    new: CellHistory;
    old: CellHistory;
}

export interface CellMovedHistory {
    before: CellHistory;
    after: CellHistory;
}

export interface ColumnsHistory {
    new: number;
    old: number;
}

export interface RowsHistory {
    new: number;
    old: number;
}