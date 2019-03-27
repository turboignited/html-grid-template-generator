import Cell from "./cell";
import Coordinate from "./coordinate";
import GridElement from "./elements/grid-element";
import { GridHistory } from "./grid-history";

export interface GridConstructor {
    width: number;
    height: number;
    columns: number;
    rows: number;
    widthUnit: string;
    heightUnit: string;
    gridGap: number;
    margin: number;
    padding: number;
}

export class Grid {
    private _rows: number;
    private _columns: number;
    private _width: number;
    private _height: number;
    private _widthUnit: string;
    private _heightUnit: string;
    private _gridGap: number;
    private _margin: number;
    private _padding: number;
    /**
     * Layout of Cells:
     * [         x,y   x,y   x,y
     *      0: [{0,0},{1,0},{2,0}],
     *      1: [{0,1},{1,1},{2,1}],
     *      2: [{0,2},{1,2},{2,2}]
     * ]
     * 
     * Each initial index points at a particular row 
     * array which contains objects whom belong on that row
     * and are themselves indexed by column index.
     */
    private _cells: Cell[][];
    private _element: GridElement;

    public get element(): GridElement {
        return this._element;
    }
    public get rows(): number {
        return this._rows;
    }

    public get gridGap(): number {
        return this._gridGap;
    }

    public get margin(): number {
        return this._margin;
    }

    public get padding(): number {
        return this._padding;
    }

    public get columns(): number {
        return this._columns;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get heightUnit(): string {
        return this._heightUnit;
    }

    public get widthUnit(): string {
        return this._widthUnit;
    }

    public get cells(): Cell[][] {
        return this._cells;
    }

    public set padding(value: number) {
        this._padding = value;
        this._element.updateStyle();
    }

    public set margin(value: number) {
        this._margin = value;
        this._element.updateStyle();
    }

    public set widthUnit(value: string) {
        this._widthUnit = value;
        this._element.updateStyle();
    }

    public set heightUnit(value: string) {
        this._heightUnit = value;
        this._element.updateStyle();
    }

    public set gridGap(value: number) {
        this._gridGap = value;
        this._element.updateStyle();
    }
    public set columns(value: number) {
        GridHistory.columnsChanged(value > this._columns)
        this._columns = value;
        this._element.updateStyle();
    }

    public set rows(value: number) {
        GridHistory.rowsChanged(value > this._rows);
        this._rows = value;
        this._element.updateStyle();
    }

    public get totalCells(): number {
        var total: number = 0;
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                if (this.getCell(new Coordinate(x, y)) != null) {
                    total++;
                }
            }
        }
        return total;
    }

    constructor(args: GridConstructor) {
        this._rows = args.rows;
        this._columns = args.columns;
        this._width = args.width;
        this._height = args.height;
        this._widthUnit = args.widthUnit;
        this._heightUnit = args.heightUnit;
        this._gridGap = args.gridGap;
        this._margin = args.margin;
        this._padding = args.padding;
        this._element = new GridElement({ grid: this });
        this.initializeCells();
        this._element.updateStyle();
    }

    public initializeCells(): void {
        this._cells = [];
        for (let y = 0; y < this._rows; y++) {
            this._cells[y] = [];
            for (let x = 0; x < this._columns; x++) {
                this.addCell(new Coordinate(x, y), new Coordinate(1, 1));
            }
        }
    }
    public setCell(cell: Cell, position: Coordinate): void {
        this._cells[position.y][position.x] = cell;
    }

    public getCell(position: Coordinate): Cell {
        return this._cells[position.y][position.x];
    }

    public moveCell(cell: Cell, position: Coordinate): void {
        const currentPosition = cell.position;
        cell.position = position;
        this.setCell(cell, position);
        this.hideCellAt(currentPosition);
    }

    public addRow(): void {
        if (this._cells[this._rows] != null) {
            for (let x = 0; x < this._columns; x++) {
                this.getCell(new Coordinate(x, this._rows)).hidden = false;
            }
        } else {
            this._cells[this._rows] = [];
            for (let x = 0; x < this._columns; x++) {
                this.addCell(new Coordinate(x, this._rows), new Coordinate(1, 1));
            }
        }
        this.rows++;
    }

    public addColumn(): void {
        for (let y = 0; y < this._rows; y++) {
            const cell = this.getCell(new Coordinate(this._columns, y));
            if (cell != null) {
                cell.hidden = false;
            } else {
                this.addCell(new Coordinate(this._columns, y), new Coordinate(1, 1));
            }
        }
        this.columns++;
    }

    public removeLastColumn(): void {
        if (this._columns > 2) {
            for (let y = 0; y < this._rows; y++) {
                let cell = this._cells[y][this._columns - 1];
                if (cell == null) {
                    // Find nearest cell on this row
                    for (let x = this._columns - 1; x >= 0; x--) {
                        if (this._cells[y][x] != null) {
                            cell = this._cells[y][x];
                            break;
                        }
                    }
                }
                // Can skip row if this cell spans more than 1
                if (cell.span.y > 1) {
                    y = cell.position.y + cell.span.y - 1;
                }
                if (cell.span.x > 1) {
                    cell.span.x--;
                } else {
                    this.hideCell(cell);
                }
            }
            this.columns--;
        }
    }

    public removeLastRow(): void {
        if (this._rows > 2) {
            for (let x = 0; x < this._columns; x++) {
                let cell = this._cells[this._rows - 1][x];
                if (cell == null) {
                    for (let y = this._rows - 1; y >= 0; y--) {
                        if (this._cells[y][x] != null) {
                            cell = this._cells[y][x];
                            break;
                        }
                    }
                }
                if (cell.span.x > 1) {
                    x = cell.position.x + cell.span.x - 1;
                }
                if (cell.span.y > 1) {
                    cell.span.y--;
                } else {
                    this.hideCell(cell);
                }
            }
            this.rows--;
        }
    }

    public addCell(position: Coordinate, span: Coordinate): void {
        const cell = new Cell({
            position: position,
            span: span
        });
        this.setCell(cell, position);
        this._element.addChild(cell.element.element);
    }

    public hideCell(cell: Cell): void {
        if (cell != null) {
            cell.hidden = true;
        }
    }

    public hideCellAt(position: Coordinate): void {
        this.hideCell(this.getCell(position));
    }

    public mergeCells(cell: Cell, merge: Cell) {
        if (cell != null && merge != null) {
            if (cell.position.y == merge.position.y && cell.span.y == merge.span.y) {
                // same row and up/down span
                if (cell.position.x + cell.span.x == merge.position.x) {
                    // spans right
                    // Merge right
                    // increase span to cover cell to the right
                    cell.span.x += merge.span.x;
                    // safe to remove merge
                    this.hideCell(merge);
                } else if (cell.position.x - merge.span.x == merge.position.x) {
                    // merge span right to join cell
                    // Merge left
                    cell.span.x += merge.span.x;

                    this.hideCell(merge);
                    this.moveCell(cell, merge.position);
                }
            } else if (cell.position.x == merge.position.x && cell.span.x == merge.span.x) {
                if (cell.position.y + cell.span.y == merge.position.y) {
                    // Merge below
                    cell.span.y += merge.span.y;

                    this.hideCell(merge);
                } else if (cell.position.y - merge.span.y == merge.position.y) {
                    // Merge above
                    cell.span.y += merge.span.y;

                    this.hideCell(merge);
                    this.moveCell(cell, merge.position);
                }
            }
        }
    }
}
