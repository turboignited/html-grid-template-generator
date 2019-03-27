import { CellHistory } from "./cell-history";
import Coordinate from "./coordinate";
import CellElement from "./elements/cell-element";

export declare type CellClickHandler = (cell: Cell) => void;

interface CellConstructor {
    position: Coordinate;
    span: Coordinate;
}

export default class Cell {
    private _position: Coordinate;
    private _span: Coordinate;
    private _element: CellElement;

    public get element(): CellElement {
        return this._element;
    }
    public set hidden(value: boolean) {
        this._element.hidden = value;
        CellHistory.cellHidden({ cell: this, hidden: value });
    }
    public get hidden(): boolean {
        return this._element.hidden;
    }

    public set position(coordinate: Coordinate) {
        CellHistory.cellPositionChanged({ cell: this, after: coordinate });
        this._position = coordinate;
        this._element.updateStyle();
    }
    public get position(): Coordinate {
        return this._position;
    }

    public set span(coordinate: Coordinate) {
        CellHistory.cellSpanChanged({ cell: this, after: coordinate });
        this._span = coordinate;
        this._element.updateStyle();
    }
    public get span(): Coordinate {
        return this._span;
    }

    constructor(args: CellConstructor) {
        this._position = args.position;
        this._span = args.span;
        this._element = new CellElement({ cell: this });
        this._element.setClickHandler(() => {
            this.onClicked();
        });
    }

    public onClicked(): void {
        CellHistory.cellClicked({ cell: this });
    }
}



