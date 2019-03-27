import Cell from "./cell";
import Coordinate from "./coordinate";

export enum CellAction {
    Hidden,
    Shown,
    Position,
    Span,
    Clicked
}
export declare type CellHistoryCallback = (action: CellAction, history?: CellInfo) => void;
export interface CellInfo {
    cell: Cell;
}

export interface CellMoved extends CellInfo {
    from: Coordinate;
}

export interface CellPosition extends CellInfo {
    after: Coordinate;
}

export interface CellSpan extends CellInfo {
    after: Coordinate;
}

export interface CellHidden extends CellInfo {
    hidden: boolean;
}

export class CellHistory {

    public static callback: CellHistoryCallback;

    public static cellHidden(args: CellHidden) {
        if (this.callback != null) {
            this.callback(args.hidden ? CellAction.Hidden : CellAction.Shown, args);
        }
    }
    public static cellPositionChanged(args: CellPosition) {
        if (this.callback != null) {
            this.callback(CellAction.Position, args);
        }
    }

    public static cellSpanChanged(args: CellSpan) {
        if (this.callback != null) {
            this.callback(CellAction.Span, args);
        }
    }

    public static cellClicked(args: CellInfo) {
        if (this.callback != null) {
            this.callback(CellAction.Clicked, args);
        }
    }
}