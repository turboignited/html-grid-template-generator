import Coordinate from "./coordinate";
import EditableHeadingElement from "./elements/editable-heading-element";
import EditableParagraphElement from "./elements/editable-paragraph-element";
import { Elements } from "./elements/elements";
import GridElement from "./elements/grid-element";
import GridCell from "./grid-cell";
import { CellChangedHistory, CellChildHistory, CellHistory, CellMovedHistory, ColumnsHistory, GridCellAction, GridHistory, RowsHistory } from "./grid-history";


declare type CellClickHandler = (history: GridHistory) => any;

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

    cellClickedHandler: CellClickHandler;
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

    private _cellClickedHandler: CellClickHandler;
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

    public set activeElement(element: Elements) {
        this._activeElement = element;
    }

    public get activeCell(): GridCell {
        return this._activeCell;
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

    public get totalCells(): number {
        var total: number = 0;
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                const cell = this._cells[y][x];
                if (cell != null) {
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
        this._cellClickedHandler = args.cellClickedHandler;
        this._element = new GridElement({ grid: this });
        this.initializeCells();
    }

    /**
     * Returns a cell at the specified coordinates
     * @param x coordinate of cell
     * @param y coordinate of cell
     */
    public getCell(position: Coordinate): GridCell {
        if (position.x > this._columns || position.y > this._rows || position.x < 0 || position.y < 0) {
            return;
        }
        return this._cells[position.y][position.x];
    }


    public setCell(cell: GridCell, position: Coordinate): CellMovedHistory {
        if (position.x > this._columns - 1 || position.y > this._rows - 1 || position.x < 0 || position.y < 0) {
            return;
        }
        // safe to nullify
        this._cells[position.y][position.x] = cell;
        if (cell != null) {
            return {
                after:
                {
                    element: cell.element.element,
                    position: position,
                    span: cell.span
                },
                before: {
                    element: cell.element.element,
                    position: cell.position,
                    span: cell.position
                }
            }
        }
    }

    public moveCell(cell: GridCell, position: Coordinate): CellMovedHistory {
        if (position.x > this._columns - 1 || position.y > this._rows - 1 || position.x < 0 || position.y < 0) {
            return;
        }
        const currentPosition = cell.position;
        cell.position = position;
        this.setCell(cell, position);
        this.setCell(null, currentPosition);
        return {
            after: {
                element: cell.element.element,
                position: cell.position,
                span: cell.span
            },
            before: {
                element: cell.element.element,
                position: currentPosition,
                span: cell.span
            }
        }
    }

    /**
     * Creates a new row and fills it with the number of columns of the grid.
     */
    public addRow(): GridHistory {
        const history: GridHistory = new GridHistory();
        this._cells[this._rows] = [];
        for (let x = 0; x < this._columns; x++) {
            history.cellAdded(this.addCell(new Coordinate(x, this._rows), new Coordinate(1, 1)));
        }
        history.rowsHistory = this.increaseRows();
        return history;
    }

    /**
     * Appends new cells onto the end of each row to match the grid's rows.
     */
    public addColumn(): GridHistory {
        const history: GridHistory = new GridHistory();
        for (let y = 0; y < this._rows; y++) {
            history.cellAdded(this.addCell(new Coordinate(this._columns, y), new Coordinate(1, 1)));
        }
        history.columnsHistory = this.increaseColumns();
        return history;
    }


    /**
     * Loops over each row of the last column attempting to remove each cell individually.
     * 1) If a cell is not found on a row it will go left to each column finding the nearest cell
     * and reduces the cells x/column span.
     * 2) If a cell spans multiple rows then the loop will perform faster.
     */
    public removeLastColumn(): GridHistory {
        if (this._columns > 2) {
            const history: GridHistory = new GridHistory();
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
                    cell.element.updateStyle();
                    history.cellChanged({
                        new: {
                            position: cell.position,
                            span: cell.span,
                            element: cell.element.element
                        },
                        old: {
                            position: cell.position,
                            span: new Coordinate(cell.span.x + 1, cell.span.y),
                            element: cell.element.element
                        }
                    });
                } else {
                    history.cellRemoved(this.removeCell(cell));
                }
            }
            history.columnsHistory = this.decreaseColumns();
            return history;
        }
    }

    /**
     * Loops over each column of the last row attempting to remove each cell individually.
     * 1) If a cell is not found on a column it will go up each row finding the nearest cell
     * and reduces the cells y/row span.
     * 2) If a cell spans multiple columns then the loop will perform faster.
     */
    public removeLastRow(): GridHistory {
        if (this._rows > 2) {
            const history: GridHistory = new GridHistory();
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
                    cell.element.updateStyle();
                    history.cellChanged({
                        new: {
                            element: cell.element.element,
                            position: cell.position,
                            span: cell.span
                        },
                        old: {
                            element: cell.element.element,
                            position: cell.position,
                            span: new Coordinate(cell.span.x, cell.span.y + 1)
                        }
                    });
                } else {
                    history.cellRemoved(this.removeCell(cell));
                }
            }
            history.rowsHistory = this.decreaseRows();
            return history;
        }
    }
    /**
     * Handles the flow of actions to perform when a user interacts with a cell.
     * 1) The user has selected an element to place on the cell.
     * 2) The user has selected a cell for the first time.
     * 3) The user has a cell previously selected and has selected another cell.
     * @param cell usually provided by a child of the grid
     */
    public onClickedCell(cell: GridCell): GridHistory {
        let history = new GridHistory();
        if (this._activeElement != null && this._activeElement != Elements.none) {
            // user wants to place an element on the cell
            history.cellChild(this.addActiveElementToCell(cell));
        } else if (this._activeCell != null) {
            // user wants to merge the previously selected cell with another
            history = this.mergeActiveCellToCell(cell, history);

        } else if (this._activeCell == null) {
            history.cellActivated = this.setActiveCell(cell);
        }
        if (this._cellClickedHandler != null) {
            // provide registered handler with history
            this._cellClickedHandler(history);
        }
        return history;
    }

    // Allow user to perform any action as recorded in the history. 
    public restoreHistory(history: GridHistory): GridHistory {
        const newHistory: GridHistory = new GridHistory();
        for (let i = 0; i < history.actions.length; i++) {
            switch (history.actions[i]) {
                case GridCellAction.Activated:
                    newHistory.cellDeactivated = this.restoreCellActivated(history.cellActivated);
                    break;
                case GridCellAction.Deactivated:
                    newHistory.cellActivated = this.restoreCellDeactivated(history.cellDeactivated);
                    break;
                case GridCellAction.Child:
                    newHistory.cellChild(this.restoreCellChild(history.cellsChild.shift()));
                    break;
                case GridCellAction.Added:
                    newHistory.cellRemoved(this.restoreCellAdded(history.cellsAdded.shift()));
                    break;
                case GridCellAction.Removed:
                    newHistory.cellAdded(this.restoreCellRemoved(history.cellsRemoved.shift()));
                    break;
                case GridCellAction.Changed:
                    newHistory.cellChanged(this.restoreCellChanged(history.cellsChanged.shift()));
                    break;
                case GridCellAction.Moved:
                    newHistory.cellMoved(this.restoreCellMoved(history.cellsMoved.shift()));
                    break;
                default:
                    break;
            }
        }
        if (history.rowsChanged) {
            newHistory.rowsHistory = this.restoreRowsHistory(history.rowsHistory);
        } else if (history.columnsChanged) {
            newHistory.columnsHistory = this.restoreColumnsHistory(history.columnsHistory);
        }
        return newHistory;

    }
    public restoreCellDeactivated(history: CellHistory): CellHistory {
        return this.setActiveCell(this.getCell(history.position));
    }
    public restoreCellActivated(history: CellHistory): CellHistory {
        return this.clearActiveCell();
    }
    public restoreCellChild(history: CellChildHistory): CellChildHistory {
        const cell = this.getCell(history.cell.position);
        if (history.added) {
            cell.element.removeChild(history.child);
            return {
                added: false,
                child: history.child,
                cell: {
                    element: history.cell.element,
                    position: cell.position,
                    span: cell.span
                }
            }
        } else {
            cell.element.addChild(history.child);
            return {
                added: true,
                child: history.child,
                cell: {
                    element: history.cell.element,
                    position: cell.position,
                    span: cell.span
                }
            }
        }
    }
    public restoreColumnsHistory(history: ColumnsHistory): ColumnsHistory {
        if (history.new > history.old) {
            return this.decreaseColumns();
        } else {
            return this.increaseColumns();
        }
    }
    public restoreRowsHistory(history: RowsHistory): RowsHistory {
        if (history.new > history.old) {
            return this.decreaseRows();
        } else {
            return this.increaseRows();
        }
    }
    public restoreCellAdded(history: CellHistory): CellHistory {
        return this.removeCellAt(history.position);
    }
    public restoreCellMoved(history: CellMovedHistory): CellMovedHistory {
        return this.moveCell(this.getCell(history.after.position), history.before.position);
    }
    public restoreCellRemoved(history: CellHistory): CellHistory {
        return this.addCellWithHTMLElement(history.position, history.span, history.element);
    }
    public restoreCellChanged(history: CellChangedHistory): CellChangedHistory {
        const cell = this.getCell(history.new.position);
        cell.position = history.old.position;
        cell.span = history.old.span;
        cell.element.setElement(history.old.element);
        return {
            new: {
                position: history.old.position,
                span: history.old.span,
                element: history.old.element
            },
            old: {
                position: history.new.position,
                span: history.new.span,
                element: history.new.element
            }
        }
    }

    /**
     * Simply decreases the columns property and informs the element to update it's style.
     */
    public decreaseColumns(): ColumnsHistory {
        this._columns--;
        this._element.updateStyle();
        return {
            new: this._columns,
            old: this._columns + 1
        }
    }

    /**
     * Simply decreases the rows property and informs the element to update it's style.
     */
    public decreaseRows(): RowsHistory {
        this._rows--;
        this._element.updateStyle();
        return {
            new: this._rows,
            old: this._rows + 1
        }
    }

    /**
     * Simply increments the columns property and informs the element to update it's style.
     */
    public increaseColumns(): ColumnsHistory {
        this._columns++;
        this._element.updateStyle();
        return {
            new: this._columns,
            old: this._columns - 1
        }
    }

    /**
     * Simply increments the rows property and informs the element to update it's style.
     */
    public increaseRows(): RowsHistory {
        this._rows++;
        this._element.updateStyle();
        return {
            new: this._rows,
            old: this._rows - 1
        }
    }

    /**
     * Creates the initial cell grid and informs the element to update it's style to represent 
     * the grid's properties.
     */
    public initializeCells() {
        this._cells = [];
        for (let y = 0; y < this._rows; y++) {
            this._cells[y] = [];
            for (let x = 0; x < this._columns; x++) {
                this.addCell(new Coordinate(x, y), new Coordinate(1, 1));
            }
        }
        this._element.updateStyle();
    }

    /**
     * Constructs and places a new GridCell into the specified x and y aswell as inserting it into 
     * the DOM as a child of the grid.
     * @param x coordinate to construct and place the new cell
     * @param y coordinate to construct and place the new cell
     * @param xSpan how many columns the cell should extend, minimum is 1
     * @param ySpan how many rows the cell should extend, minimum is 1
     */
    public addCell(position: Coordinate, span: Coordinate): CellHistory {
        const cell = new GridCell({
            position: position,
            span: span,
            grid: this
        });
        this._cells[position.y][position.x] = cell;
        this._element.addChild(cell.element.element);
        return {
            element: cell.element.element,
            position: position,
            span: span
        };
    }

    public addCellWithHTMLElement(position: Coordinate, span: Coordinate, element: HTMLElement): CellHistory {
        const cell = new GridCell({
            position: position,
            span: span,
            grid: this,
            element: element
        });
        this.setCell(cell, position);
        this._element.addChild(cell.element.element);
        return {
            element: element,
            position: position,
            span: span
        };
    }

    /**
     * Removes and nullifies the cell at the specified coordinates and delete's it from the DOM, 
     * making it no longer a child of the grid.
     * @param x x position of the cell in the grid
     * @param y y position of the cell in the grid
     */
    public removeCellAt(position: Coordinate): CellHistory {
        const cell = this.getCell(position);
        if (cell != null) {
            this._element.removeChild(cell.element.element);
            cell.deleteElement();
            this.setCell(null, position);
            return {
                element: cell.element.element,
                position: cell.position,
                span: cell.span
            }
        }
    }

    /**
     * Removes the cell from the DOM by deleting it from the grid and nullifying it.
     * @param cell cell to remove
     */
    public removeCell(cell: GridCell): CellHistory {
        const element = cell.element.element;
        cell.deleteElement();
        this.setCell(null, cell.position);
        return {
            element: element,
            position: cell.position,
            span: cell.span
        }
    }

    public setActiveCell(cell: GridCell): CellHistory {
        if (this._activeCell == null) {
            this._activeCell = cell;
            cell.element.setStyle("border", "4px solid black");
            return {
                element: cell.element.element,
                position: cell.position,
                span: cell.span
            }
        }
    }

    public clearActiveCell(): CellHistory {
        if (this._activeCell != null) {
            const element = this._activeCell.element.element;
            const position = this._activeCell.position;
            const span = this._activeCell.span;
            this._activeCell.element.updateStyle();
            this._activeCell = null;
            return {
                element: element,
                position: position,
                span: span
            }
        }
    }

    public removeFirstChildFromCell(cell: GridCell): CellChildHistory {
        return {
            added: false,
            child: cell.element.removeFirstChild(),
            cell: {
                element: cell.element.element,
                position: cell.position,
                span: cell.span
            }
        }
    }

    public removeLastChildFromCell(cell: GridCell): CellChildHistory {
        return {
            added: false,
            child: cell.element.removeLastChild(),
            cell: {
                element: cell.element.element,
                position: cell.position,
                span: cell.span
            }
        }
    }

    public addActiveElementToCell(cell: GridCell): CellChildHistory {
        let added: boolean = true;
        let child: ChildNode;
        switch (this._activeElement) {
            case Elements.p:
                child = cell.element.addChild(new EditableParagraphElement().element);
                break;
            case Elements.h1:
                child = cell.element.addChild(new EditableHeadingElement(Elements.h1).element);
                break;
            case Elements.h2:
                child = cell.element.addChild(new EditableHeadingElement(Elements.h2).element);
                break;
            case Elements.h3:
                child = cell.element.addChild(new EditableHeadingElement(Elements.h3).element);
                break;
            case Elements.h4:
                child = cell.element.addChild(new EditableHeadingElement(Elements.h4).element);
                break;
            case Elements.h5:
                child = cell.element.addChild(new EditableHeadingElement(Elements.h5).element);
                break;
            default:
                added = false;
                break;
        }
        return {
            added: added,
            child: child,
            cell: {
                element: cell.element.element,
                position: cell.position,
                span: cell.span
            }
        }
    }

    public mergeActiveCellToCell(merge: GridCell, history: GridHistory): GridHistory {
        if (this._activeCell != null && merge != null) {
            const x = this._activeCell.position.x;
            const y = this._activeCell.position.y;
            const xSpan = this._activeCell.span.x;
            const ySpan = this._activeCell.span.y;
            if (y == merge.position.y && ySpan == merge.span.y) {
                // same row and up/down span
                if (x + xSpan == merge.position.x) {
                    // spans right
                    // Merge right
                    // increase span to cover cell to the right
                    this._activeCell.span.x += merge.span.x;
                    history.cellChanged({
                        new: {
                            element: this._activeCell.element.element,
                            position: this._activeCell.position,
                            span: this._activeCell.span
                        },
                        old: {
                            element: this._activeCell.element.element,
                            position: this._activeCell.position,
                            span: new Coordinate(this._activeCell.span.x - merge.span.x, ySpan)
                        }
                    });
                    // safe to remove merge
                    history.cellRemoved(this.removeCell(merge));
                } else if (x - merge.span.x == merge.position.x) {
                    // merge span right to join cell
                    // Merge left
                    this._activeCell.span.x += merge.span.x;
                    history.cellChanged({
                        new: {
                            element: this._activeCell.element.element,
                            position: new Coordinate(merge.position.x, y),
                            span: this._activeCell.span
                        },
                        old: {
                            element: this._activeCell.element.element,
                            position: this._activeCell.position,
                            span: new Coordinate(this._activeCell.span.x - merge.span.x, ySpan)
                        }
                    });
                    history.cellRemoved(this.removeCell(merge));
                    history.cellMoved(this.moveCell(this._activeCell, merge.position));
                }
            } else if (x == merge.position.x && xSpan == merge.span.x) {
                if (y + this._activeCell.span.y == merge.position.y) {
                    // Merge below
                    this._activeCell.span.y += merge.span.y;
                    history.cellChanged({
                        new: {
                            element: this._activeCell.element.element,
                            position: this._activeCell.position,
                            span: this._activeCell.span
                        },
                        old: {
                            element: this._activeCell.element.element,
                            position: this._activeCell.position,
                            span: new Coordinate(this._activeCell.span.x, this._activeCell.span.y - merge.span.y)
                        }
                    });
                    history.cellRemoved(this.removeCell(merge));
                } else if (y - merge.span.y == merge.position.y) {
                    // Merge above
                    this._activeCell.span.y += merge.span.y;
                    history.cellChanged({
                        new: {
                            element: this._activeCell.element.element,
                            position: new Coordinate(x, merge.position.y),
                            span: this._activeCell.span
                        },
                        old: {
                            element: this._activeCell.element.element,
                            position: this._activeCell.position,
                            span: new Coordinate(this._activeCell.span.x, this._activeCell.span.y - merge.span.y)
                        }
                    });
                    history.cellRemoved(this.removeCell(merge));
                    history.cellMoved(this.moveCell(this._activeCell, merge.position));
                }
            }
            this.clearActiveCell();

            return history;
        }
    }
}
