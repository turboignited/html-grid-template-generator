import GridCell from "./grid-cell";
import GridElement from "./grid-element";
import { Elements } from "./elements";
import EditableParagraphElement from "./editable-paragraph-element";
import EditableHeadingElement from "./editable-heading-element";

interface GridConstructor {
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

export default class Grid {
    private _rows: number;
    private _columns: number;
    private _width: number;
    private _height: number;
    private _widthUnit: string;
    private _heightUnit: string;
    private _gridGap: number;
    private _margin: number;
    private _padding: number;
    private _cells: GridCell[][];
    private _element: GridElement;
    private _activeElement: Elements;
    private _activeCell: GridCell;
    public get element(): GridElement {
        return this._element;
    }
    public get rows(): number {
        return this._rows;
    }
    public set gridGap(value: number) {
        this._gridGap = value;
        this.element.updateStyle();
    }

    public get gridGap(): number {
        return this._gridGap;
    }

    public set margin(value: number) {
        this._margin = value;
        this.element.updateStyle();
    }

    public get margin(): number {
        return this._margin;
    }

    public set padding(value: number) {
        this._padding = value;
        this.element.updateStyle();
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

    public get cells(): GridCell[][] {
        return this._cells;
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
    }

    /**
     * Layout of Cells:
     * [         x,y   x,y   x,y
     *      0: [{0,0},{1,0},{2,0}],
     *      1: [{0,1},{1,1},{2,1}],
     *      2: [{0,2},{1,2},{2,2}]
     * ]
     * 
     * Each start index points at a particular row 
     * array which contains objects which belong on that row
     * and are themselves indexed by column index.
     * 
     */
    public getCell(x: number, y: number) {
        return this._cells[y][x];
    }

    public addRow() {
        this._cells[this._rows] = [];
        for (let x = 0; x < this._columns; x++) {
            this.addCell(x, this._rows, 1, 1);
        }
        this.increaseRows();
    }

    public addColumn() {
        for (let y = 0; y < this._rows; y++) {
            this.addCell(this._columns, y, 1, 1);
        }
        this.increaseColumns();
    }

    public removeLastColumn() {
        if (this._columns > 2) {
            for (let y = 0; y < this._rows; y++) {
                let cell = this._cells[y][this._columns - 1];
                if (cell == null) {
                    // Find nearest cell on this row
                    for (let x = this._columns - 1; x > 0; x--) {
                        if (this._cells[y][x] != null) {
                            cell = this._cells[y][x];
                            break;
                        }
                    }
                }
                // Can skip row if this cell spans more than 1
                if (cell.ySpan > 1) {
                    y = cell.y + cell.ySpan - 1;
                }
                if (cell.xSpan > 1) {
                    cell.xSpan--;
                    cell.element.updateStyle();
                } else {
                    this.removeCell(cell);
                }
            }
            this.decreaseColumns();
        }
    }

    public removeLastRow() {
        if (this._rows > 2) {
            for (let x = 0; x < this._columns; x++) {
                let cell = this._cells[this._rows - 1][x];
                if (cell == null) {
                    for (let y = this._rows - 1; y > 0; y--) {
                        if (this._cells[y][x] != null) {
                            cell = this._cells[y][x];
                            break;
                        }
                    }
                }
                if (cell.xSpan > 1) {
                    x = cell.x + cell.xSpan - 1;
                }
                if (cell.ySpan > 1) {
                    cell.ySpan--;
                    cell.element.updateStyle();
                } else {
                    this.removeCell(cell);
                }
            }
            this.decreaseRows();
        }
    }

    private decreaseColumns(): void {
        this._columns--;
        this._element.updateStyle();
    }

    private decreaseRows(): void {
        this._rows--;
        this._element.updateStyle();
    }

    private increaseColumns(): void {
        this._columns++;
        this._element.updateStyle();
    }

    private increaseRows(): void {
        this._rows++;
        this._element.updateStyle();
    }

    private initializeCells() {
        this._cells = [];
        for (let y = 0; y < this._rows; y++) {
            this._cells[y] = [];
            for (let x = 0; x < this._columns; x++) {
                this.addCell(x, y, 1, 1);
            }
        }
        this._element.updateStyle();
    }

    private addCell(x: number, y: number, xSpan: number, ySpan: number): void {
        const cell = new GridCell({
            x: x,
            y: y,
            ySpan: ySpan,
            xSpan: xSpan,
            grid: this
        });
        this._cells[y][x] = cell;
        this._element.addChild(cell.element);
    }

    public removeCell(cell: GridCell, replace?: GridCell): void {
        this._element.removeChild(cell.element);
        cell.delete();
        if (replace != null) {
            this._cells[replace.y][replace.x] = null;
            this._cells[cell.y][cell.x] = replace;
        } else {
            this._cells[cell.y][cell.x] = null;
        }
    }

    public setActiveElement(element: Elements): void {
        this._activeElement = element;
    }

    public setActiveCell(cell: GridCell): void {
        this._activeCell = cell;
        cell.element.setStyle("border", "4px solid black");
    }

    public onClickedCell(cell: GridCell): void {
        if (this._activeElement != null && this._activeElement != Elements.none) {
            // user wants to place an element on the cell
            switch (this._activeElement) {
                case Elements.p:
                    cell.element.addChild(new EditableParagraphElement());
                    break;
                case Elements.h1:
                    cell.element.addChild(new EditableHeadingElement(Elements.h1));
                    break;
                case Elements.h2:
                    cell.element.addChild(new EditableHeadingElement(Elements.h2));
                    break;
                case Elements.h3:
                    cell.element.addChild(new EditableHeadingElement(Elements.h3));
                    break;
                case Elements.h4:
                    cell.element.addChild(new EditableHeadingElement(Elements.h4));
                    break;
                case Elements.h5:
                    cell.element.addChild(new EditableHeadingElement(Elements.h5));
                    break;
                default:
            }
        } else if (this._activeCell != null) {
            // user wants to merge the previously selected cell with another
            this.mergeCells(cell);
        } else if (this._activeCell == null) {
            this.setActiveCell(cell);
        }
    }

    private mergeCells(cell: GridCell) {
        if (this._activeCell.y == cell.y && this._activeCell.ySpan == cell.ySpan) {
            if (this._activeCell.x + this._activeCell.xSpan == cell.x) {
                // Merge right
                this._activeCell.xSpan += cell.xSpan;
                this.removeCell(cell);
            } else if (this._activeCell.x - cell.xSpan == cell.x) {
                // Merge left
                this._activeCell.x = cell.x;
                this._activeCell.xSpan += cell.xSpan;
                this.removeCell(cell, this._activeCell);

            }
        } else if (this._activeCell.x == cell.x && this._activeCell.xSpan == cell.xSpan) {
            if (this._activeCell.y + this._activeCell.ySpan == cell.y) {
                // Merge below
                this._activeCell.ySpan += cell.ySpan;
                this.removeCell(cell);
            } else if (this._activeCell.y - cell.ySpan == cell.y) {
                // Merge above
                this._activeCell.y = cell.y;
                this._activeCell.ySpan += cell.ySpan;
                this.removeCell(cell, this._activeCell);
            }
        }
        this._activeCell.element.updateStyle();
        this._activeCell = null;
    }
}
