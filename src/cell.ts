import Coordinate from "./coordinate";
import CellElement from "./elements/cell-element";
import { Grid } from "./grid";

export declare type CellClickHandler = (cell: Cell) => void;

interface CellConstructor {
    position: Coordinate;
    span: Coordinate;
    grid: Grid;
}

export default class Cell {
    private _position: Coordinate;
    private _span: Coordinate;
    private _element: CellElement;
    private _grid: Grid;

    public get element(): CellElement {
        return this._element;
    }
    public set hidden(value: boolean) {
        this._element.hidden = value;
    }
    public get hidden(): boolean {
        return this._element.hidden;
    }

    public set position(coordinate: Coordinate) {
        this._position = coordinate;
        this._element.updateStyle();
    }
    public get position(): Coordinate {
        return this._position;
    }

    public set span(coordinate: Coordinate) {
        this._span = coordinate;
        this._element.updateStyle();
    }
    public get span(): Coordinate {
        return this._span;
    }

    constructor(args: CellConstructor) {
        this._position = args.position;
        if (args.span.x > 0 && args.span.y > 0) {
            this._span = args.span;
        } else {
            this._span = new Coordinate(1, 1);
        }
        this._grid = args.grid;
        this._element = new CellElement({ cell: this });
        this._element.element.onmousedown = (ev: MouseEvent) => {
            this.onMouseDown();
        }
        this._element.element.onmouseenter = (ev: MouseEvent) => {
            this.onMouseEnter();
        }
        this._element.element.onmouseup = (ev: MouseEvent) => {
            this.onMouseUp();
        }
    }

    public onMouseDown(): void {
        this._grid.selection.startSelection(this);
    }

    public onMouseEnter(): void {
        this._grid.selection.addSelection(this);
    }

    public onMouseUp(): void {
        this._grid.selection.finishSelection(this);
    }
}



