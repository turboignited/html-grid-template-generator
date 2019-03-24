import Coordinate from "./coordinate";
import { createParagraphRegular, Elements } from "./elements/elements";
import { Grid } from "./grid";
import { GridHistory } from "./grid-history";

const gridGap = 0;
const height = 400;
const width = 400;
const margin = 0;
const padding = 0;
const widthUnit = "px";
const heightUnit = "px";

const createGrid = (): Grid => {
    return new Grid({
        columns: 5,
        rows: 5,
        gridGap: gridGap,
        height: height,
        width: width,
        heightUnit: heightUnit,
        widthUnit: widthUnit,
        margin: margin,
        padding: padding,
        cellClickedHandler: null
    });

}

describe("constructor", () => {
    const grid = createGrid();

    test("should be present on the DOM", () => {
        expect(document.body.firstElementChild).toBeInstanceOf(HTMLDivElement);
    });

    test("should represent grid values in DOM", () => {
        expect(document.body.firstElementChild.getAttribute("style").includes("display: grid")).toBeTruthy();
        expect(document.body.firstElementChild.getAttribute("style").includes(`grid-template-rows: repeat(${grid.rows}`)).toBeTruthy();
        expect(document.body.firstElementChild.getAttribute("style").includes(`grid-template-columns: repeat(${grid.columns}`)).toBeTruthy();
        expect(document.body.firstElementChild.getAttribute("style").includes(`height: ${grid.height}${grid.heightUnit}`)).toBeTruthy();
        expect(document.body.firstElementChild.getAttribute("style").includes(`width: ${grid.width}${grid.widthUnit}`)).toBeTruthy();
    });
});

describe("mergeActiveCellToCell", () => {
    test("should merge cell right of active cell", () => {
        const history: GridHistory = new GridHistory();
        const grid: Grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(0, 0)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(1, 0)), history);
        expect(grid.getCell(new Coordinate(0, 0)).span.x).toBe(2);
        expect(grid.getCell(new Coordinate(1, 0))).toBeNull();
    });

    test("should remove, merge and swap cell left of active cell", () => {
        const history: GridHistory = new GridHistory();
        const grid: Grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(4, 4)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(3, 4)), history);
        expect(grid.getCell(new Coordinate(3, 4)).span.x).toBe(2);
        expect(grid.getCell(new Coordinate(4, 4))).toBeNull();
    });

    test("should remove, merge and swap cell above active cell", () => {
        const history: GridHistory = new GridHistory();
        const grid: Grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(2, 3)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(2, 2)), history);
        expect(grid.getCell(new Coordinate(2, 2)).span.y).toBe(2);
        expect(grid.getCell(new Coordinate(2, 3))).toBeNull();
    });


    test("should remove and merge cell below active cell", () => {
        const history: GridHistory = new GridHistory();
        const grid: Grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(3, 3)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(3, 4)), history);
        expect(grid.getCell(new Coordinate(3, 3)).span.y).toBe(2);
        expect(grid.getCell(new Coordinate(3, 4))).toBeNull();
    });

    test("should ignore attempting to merge illegal cells", () => {
        const history: GridHistory = new GridHistory();
        const grid: Grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(4, 4)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(0, 0)), history);
        expect(grid.getCell(new Coordinate(4, 4))).not.toBeNull();
        expect(grid.getCell(new Coordinate(0, 0))).not.toBeNull();
    });

    test("should handle attempting to merge null cells", () => {
        const history: GridHistory = new GridHistory();
        const grid: Grid = createGrid();
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(10, 10)), history);
    });
});

describe("mergeActiveCellToCell->History", () => {
    test("should return correct cellsChanged information", () => {
        const history: GridHistory = new GridHistory();
        const grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(0, 0)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(1, 0)), history);
        const cellsChanged = history.cellsChanged;
        expect(cellsChanged[0].new.span.x).toEqual(2);
        expect(cellsChanged[0].old.span.x).toEqual(1);
    });
    test("should return correct cellsMoved information", () => {
        const history: GridHistory = new GridHistory();
        const grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(2, 1)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(2, 0)), history);
        const cellsMoved = history.cellsMoved;
        expect(cellsMoved[0].before.position.y).toEqual(1);
        expect(cellsMoved[0].after.position.y).toEqual(0);
    });

    test("should return correct cellsRemoved information", () => {
        let history: GridHistory = new GridHistory();
        const grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(2, 1)));
        history = grid.mergeActiveCellToCell(grid.getCell(new Coordinate(2, 0)), history);
        const cellsRemoved = history.cellsRemoved;
        expect(cellsRemoved[0].position.x).toEqual(2);
        expect(cellsRemoved[0].position.y).toEqual(0);

    });

});

describe("restoreHistory", () => {

    test("should restore a deleted cell", () => {
        const history: GridHistory = new GridHistory();
        const grid: Grid = createGrid();
        //1) Delete cell
        grid.setActiveCell(grid.getCell(new Coordinate(0, 0)));
        grid.mergeActiveCellToCell(grid.getCell(new Coordinate(1, 0)), history);
        expect(history.cellsChanged.length).toEqual(1);
        expect(history.cellsChanged[0].old.span.x).toEqual(1);
        expect(history.cellsChanged[0].new.span.x).toEqual(2);
        expect(history.cellsRemoved.length).toEqual(1);

        var cell = grid.getCell(new Coordinate(0, 0));
        expect(cell.position.x).toEqual(0);
        expect(cell.position.y).toEqual(0);
        expect(cell.span.x).toEqual(2);
        expect(cell.span.y).toEqual(1);


        //2) Restore deleted cell
        const newHistory = grid.restoreHistory(history);
        expect(newHistory.cellsAdded.length).toEqual(1);
        const deletedCell = grid.getCell(new Coordinate(1, 0));
        expect(deletedCell.position.x).toEqual(1);
        expect(deletedCell.position.y).toEqual(0);

        //3) Restore span
        expect(newHistory.cellsChanged.length).toEqual(1);
        expect(newHistory.cellsChanged[0].old.span.x).toEqual(2);
        expect(newHistory.cellsChanged[0].new.span.x).toEqual(1);
        cell = grid.getCell(new Coordinate(0, 0));
        expect(cell.span.x).toEqual(1);

    });

    test("should restore a removed row", () => {
        const grid: Grid = createGrid();
        const changed = grid.removeLastRow();

        expect(changed.cellsRemoved.length).toEqual(grid.columns);
        expect(changed.cellsAdded).toBeUndefined();
        expect(changed.cellsChanged).toBeUndefined();
        expect(changed.cellsChild).toBeUndefined();
        expect(changed.rowsChanged).toBeTruthy();

        const restored = grid.restoreHistory(changed);
        expect(restored.rowsChanged).toBeTruthy();

        expect(restored.cellsAdded.length).toEqual(grid.columns);
    });


    test("should restore a removed column", () => {
        const grid: Grid = createGrid();
        expect(grid.columns).toEqual(5);
        expect(grid.rows).toEqual(5);
        const changed = grid.removeLastColumn();
        expect(grid.columns).toEqual(4);
        expect(grid.rows).toEqual(5);


        expect(changed.cellsRemoved.length).toEqual(grid.rows);
        expect(changed.cellsAdded).toBeUndefined();
        expect(changed.cellsChanged).toBeUndefined();
        expect(changed.cellsChild).toBeUndefined();
        expect(changed.columnsChanged).toBeTruthy();


        const restored = grid.restoreHistory(changed);
        expect(restored.columnsChanged).toBeTruthy();
        expect(grid.columns).toEqual(5);
        expect(grid.rows).toEqual(5);

        expect(restored.cellsAdded.length).toEqual(grid.rows);
    });

    test("should undo restoring a column", () => {
        const grid: Grid = createGrid();
        const changed = grid.removeLastColumn();
        const restored = grid.restoreHistory(changed);
        expect(restored.columnsChanged).toBeTruthy();
        expect(restored.cellsAdded.length).toEqual(grid.rows);

        const undo = grid.restoreHistory(restored);
        expect(undo.cellsRemoved.length).toEqual(grid.rows);
        expect(undo.cellsAdded).toBeUndefined();
        expect(undo.cellsChanged).toBeUndefined();
        expect(undo.cellsChild).toBeUndefined();
        expect(undo.columnsChanged).toBeTruthy();
    });

    test("should restore element with children", () => {
        const grid: Grid = createGrid();
        const cell = grid.getCell(new Coordinate(0, 0));
        cell.element.element.appendChild(createParagraphRegular({ center: true, editable: false, text: "aParagraph" }));
        const history = grid.removeCell(cell);
        expect(history.element.children.length).toEqual(1);
    });

    test("should undo multiple cell merges", () => {
        const grid: Grid = createGrid();
        grid.setActiveCell(grid.getCell(new Coordinate(0, 0)));

        let firstHistory = new GridHistory();
        firstHistory = grid.mergeActiveCellToCell(grid.getCell(new Coordinate(1, 0)), firstHistory);
    });
});

describe("addActiveElementToCell", () => {
    test("should add element as child of cell", () => {
        const grid: Grid = createGrid();
        grid.activeElement = Elements.h2;
        grid.addActiveElementToCell(grid.getCell(new Coordinate(0, 0)));
        expect(grid.getCell(new Coordinate(0, 0)).element.children.length).toEqual(1);
    });
});


describe("addActiveElementToCell->History", () => {
    test("should contain history of element added to a cell", () => {
        const grid: Grid = createGrid();
        grid.activeElement = Elements.h2;
        const history = grid.addActiveElementToCell(grid.getCell(new Coordinate(0, 0)));
        expect(history.added).toBeTruthy();
        expect(history.cell.element.children.length).toEqual(1);
    });
    test("should undo adding an element to a cell", () => {
        const grid = createGrid();
        const history = new GridHistory();
        grid.activeElement = Elements.h2;
        history.cellChild(grid.addActiveElementToCell(grid.getCell(new Coordinate(0, 0))));
        expect(history.cellsChild.length).toEqual(1);
        expect(history.cellsChild[0].cell.element.children[0].tagName).toEqual(Elements.h2.toUpperCase());
        expect(grid.getCell(new Coordinate(0, 0)).element.children.length).toEqual(1);

        const restored = grid.restoreHistory(history);
        expect(grid.getCell(new Coordinate(0, 0)).element.children.length).toEqual(0);
    });
});

describe("removeCell", () => {
    const grid = createGrid();

    test("should nullify a cell", () => {
        const cell = grid.getCell(new Coordinate(0, 0));
        expect(cell).not.toBeNull();
        grid.removeCell(cell);
        expect(grid.getCell(new Coordinate(0, 0))).toBeNull();

        const newCell = grid.getCell(new Coordinate(grid.columns - 1, grid.rows - 1));
        expect(newCell).not.toBeNull();
        grid.removeCell(newCell);
        expect(grid.getCell(new Coordinate(grid.columns - 1, grid.rows - 1))).toBeNull();
    });
    test("should remove cell element from DOM", () => {
        const cell = grid.getCell(new Coordinate(1, 1));
        grid.removeCell(cell);
        expect(grid.getCell(new Coordinate(1, 1))).toBeNull();
    });
});

describe("removeCell->History", () => {

    const grid = createGrid();

    test("should contain information about removed cell", () => {
        const cell = grid.getCell(new Coordinate(0, 0));
        const element = cell.element.element;
        const history = grid.removeCell(cell);
        expect(grid.getCell(new Coordinate(0, 0))).toBeNull();
        expect(history.position).toEqual({ x: 0, y: 0 });
        expect(history.span).toEqual({ x: 1, y: 1 });
        expect(history.element).toEqual(element);
    });
});

describe("removeCellAt", () => {
    const grid = createGrid();
    test("should nullify a cell by coordinates", () => {
        const cell = grid.getCell(new Coordinate(0, 0));
        grid.removeCellAt(cell.position);
        expect(grid.getCell(cell.position)).toBeNull();
    });
});

describe("getCell", () => {
    const grid = createGrid();

    test("should return a valid cell by 0 index", () => {
        const cell = grid.getCell(new Coordinate(4, 4));
        expect(cell.position.x).toEqual(4);
        expect(cell.position.y).toEqual(4);
    });
});

describe("moveCell", () => {

    test("should move cell to specified position", () => {
        const grid = createGrid();
        const cell = grid.getCell(new Coordinate(4, 4));
        expect(cell.position.x).toEqual(4);
        expect(cell.position.y).toEqual(4);

        grid.moveCell(cell, new Coordinate(0, 0));

        expect(cell.position.x).toEqual(0);
        expect(cell.position.y).toEqual(0);
        expect(grid.getCell(new Coordinate(0, 0))).toEqual(cell);

    });

    test("should remove cell at place moved", () => {
        const grid = createGrid();
        const cell = grid.getCell(new Coordinate(4, 4));
        grid.moveCell(cell, new Coordinate(0, 0));
        expect(grid.getCell(new Coordinate(4, 4))).toBeNull();
    });

    test("shouldn't move cell out of range", () => {
        const grid = createGrid();
        const cell = grid.getCell(new Coordinate(4, 4));
        grid.moveCell(cell, new Coordinate(100, 100));
        expect(grid.getCell(new Coordinate(4, 4))).toEqual(cell);
        expect(grid.getCell(new Coordinate(4, 4)).position.x).toEqual(4);

        expect(grid.getCell(new Coordinate(4, 4)).position.y).toEqual(4);
    });
});

describe("setCell", () => {
    test("should move cell into a new position and leave a null in its current position", () => {
        const grid = createGrid();
        grid.moveCell(grid.getCell(new Coordinate(0, 0)), new Coordinate(0, 1));
        const moved = grid.getCell(new Coordinate(0, 1));
        expect(moved.position.x).toBe(0);
        expect(moved.position.y).toBe(1);
        expect(grid.getCell(new Coordinate(0, 0))).toBeNull();
    });

});

describe("removeLastColumn", () => {

    test("should remove a column and cells", () => {
        const grid = createGrid();
        expect(grid.columns).toEqual(5);
        expect(grid.totalCells).toEqual(grid.columns * grid.rows);
        const testCell = grid.getCell(new Coordinate(4, 0));
        expect(testCell.position.x).toEqual(4);

        grid.removeLastColumn();
        expect(grid.columns).toEqual(4);
        expect(grid.totalCells).toEqual(4 * grid.rows);
        for (let y = 0; y < grid.rows; y++) {
            const cell = grid.getCell(new Coordinate(4, y));
            expect(cell).toBeNull();
        }
    });
});

describe("removeLastRow", () => {

    test("should remove a row and cells", () => {
        const grid = createGrid();
        expect(grid.rows).toEqual(5);
        expect(grid.totalCells).toEqual(grid.columns * grid.rows);
        const testCell = grid.getCell(new Coordinate(0, 4));
        expect(testCell.position.y).toEqual(4);

        grid.removeLastRow();
        expect(grid.rows).toEqual(4);
        expect(grid.totalCells).toEqual(grid.columns * 4);
        for (let x = 0; x < grid.columns; x++) {
            const cell = grid.getCell(new Coordinate(x, 4));
            expect(cell).toBeNull();
        }
    });
});


/**
 * Restore functions
 */
describe("restoreCellAdded", () => {
    test("should undo adding a cell", () => {
        const grid = createGrid();
        const added = grid.addCell(new Coordinate(0, 0), new Coordinate(0, 0));
        expect(grid.getCell(added.position)).not.toBeNull();
        expect(added.position).toEqual({ x: 0, y: 0 });
        const undo = grid.restoreCellAdded(added);
        expect(undo.position).toEqual({ x: 0, y: 0 });
        expect(grid.getCell(undo.position)).toBeNull();
    });
});

describe("restoreCellRemoved", () => {
    test("should undo removing a cell", () => {
        const grid = createGrid();
        const removed = grid.removeCell(grid.getCell(new Coordinate(0, 0)));
        expect(grid.getCell(removed.position)).toBeNull();
        const undo = grid.restoreCellRemoved(removed);
        expect(undo.position).toEqual({ x: 0, y: 0 });
        expect(grid.getCell(undo.position)).not.toBeNull();
    });
});

describe("restoreCellMoved", () => {

    test("should undo moving a cell", () => {
        const grid = createGrid();
        const moved = grid.moveCell(grid.getCell(new Coordinate(0, 0)), new Coordinate(2, 2));
        expect(grid.getCell(new Coordinate(0, 0))).toBeNull();
        const undo = grid.restoreCellMoved(moved)
        expect(undo.before.position).toEqual({ x: 2, y: 2 });
        expect(undo.after.position).toEqual({ x: 0, y: 0 });
    });

});
