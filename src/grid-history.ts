export enum GridAction {
    ColumnRemoved,
    ColumnAdded,
    RowRemoved,
    RowAdded
}
export declare type GridHistoryCallback = (action: GridAction) => void;

export class GridHistory {

    public static callback: GridHistoryCallback;

    public static rowsChanged(added: boolean) {
        if (this.callback != null) {
            this.callback(added ? GridAction.RowAdded : GridAction.RowRemoved);

        }
    }
    public static columnsChanged(added: boolean) {
        if (this.callback != null) {
            this.callback(added ? GridAction.ColumnAdded : GridAction.ColumnRemoved);
        }
    }
}