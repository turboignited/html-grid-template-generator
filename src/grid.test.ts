import Coordinate from "./coordinate";
import { Grid } from "./grid";

const gridGap = 0;
const height = 400;
const width = 400;
const margin = 0;
const padding = 0;
const widthUnit = "px";
const heightUnit = "px";

const createGrid = (columns: number = 5, rows: number = 5): Grid => {
    return new Grid({
        columns: columns,
        rows: rows,
        gridGap: gridGap,
        height: height,
        width: width,
        heightUnit: heightUnit,
        widthUnit: widthUnit,
        margin: margin,
        padding: padding
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

describe("setCell", () => {
    test("should place a cell at specified position", () => {
        const grid = createGrid();
        const cell = grid.getCell(new Coordinate(0, 0));
        grid.setCell(cell, new Coordinate(1, 1));
        const placed = grid.getCell(new Coordinate(1, 1));
        expect(placed.position).toEqual({ x: 0, y: 0 });
    });
    test("shouldn't place a cell out of bounds", () => {
        const grid = createGrid(5, 5);
        grid.setCell(grid.getCell(new Coordinate(0, 0)), new Coordinate(100, 100));
        expect(grid.getCell(new Coordinate(100, 100))).toBeNull();
    });
});

describe("getCell", () => {
    test("should return cell with correct position", () => {
        const grid = createGrid();
        for (let y = 0; y < grid.columns; y++) {
            for (let x = 0; x < grid.rows; x++) {
                const cell = grid.getCell(new Coordinate(x, y));
                expect(cell.position).toEqual({ x: x, y: y });
            }
        }
    });
    test("shouldn't get a cell out of bounds", () => {
        const grid = createGrid(3, 3);
        expect(grid.getCell(new Coordinate(4, 4))).toBeNull();
    });
});

describe("moveCell", () => {
    test("should move cell to position and hide cell at current position", () => {
        const grid = createGrid();
        const cell = grid.getCell(new Coordinate(0, 0));
        grid.moveCell(cell, new Coordinate(2, 2));
        expect(grid.getCell(new Coordinate(0, 0)).hidden).toBeTruthy();
    });
});

describe("addRow", () => {
    test("should add new row", () => {
        const grid = createGrid(5, 5);
        grid.addRow();
        expect(grid.rows).toEqual(6);
    });
    test("should add new row with cells", () => {
        const grid = createGrid(5, 5);
        expect(grid.totalCells).toEqual(5 * 5);
        for (let x = 0; x < grid.columns; x++) {
            const cell = grid.getCell(new Coordinate(x, 5));
            expect(cell).toBeNull();
        }
        grid.addRow();
        expect(grid.totalCells).toEqual(5 * 6);
        for (let x = 0; x < grid.columns; x++) {
            const cell = grid.getCell(new Coordinate(x, 5));
            expect(cell).not.toBeNull();
        }
    });
});

describe("addColumn", () => {
    test("should add new column", () => {
        const grid = createGrid(5, 5);
        grid.addColumn();
        expect(grid.columns).toEqual(6);
    });
    test("should add new column with cells", () => {
        const grid = createGrid(5, 5);
        expect(grid.totalCells).toEqual(5 * 5);
        for (let y = 0; y < grid.rows; y++) {
            const cell = grid.getCell(new Coordinate(5, y));
            expect(cell).toBeNull();
        }
        grid.addColumn();
        expect(grid.totalCells).toEqual(5 * 6);
        for (let y = 0; y < grid.rows; y++) {
            const cell = grid.getCell(new Coordinate(5, y));
            expect(cell).not.toBeNull();
        }
    });
});

describe("hideLastColumn", () => {
    test("should hide all cells on the last column", () => {
        const grid = createGrid(4, 4);
        for (let y = 0; y < 4; y++) {
            expect(grid.getCell(new Coordinate(3, y)).hidden).toBeFalsy();
        }
        grid.hideLastColumn();
        expect(grid.columns).toEqual(3);
        for (let y = 0; y < 4; y++) {
            expect(grid.getCell(new Coordinate(3, y)).hidden).toBeTruthy();
        }
    });

    test("should adjust cell span if cell spans to the last column", () => {
        const grid = createGrid(4, 4);
        for (let x = 1; x < grid.columns; x++) {
            grid.mergeCells(
                grid.getCell(new Coordinate(0, 0)),
                grid.getCell(new Coordinate(x, 0)));
        }
        expect(grid.getCell(new Coordinate(0, 0)).span.x).toEqual(4);
        expect(grid.getCell(new Coordinate(0, 0)).position).toEqual({ x: 0, y: 0 });
        expect(grid.getCell(new Coordinate(1, 0)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(2, 0)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(3, 0)).hidden).toBeTruthy();

        expect(grid.columns).toEqual(4);
        grid.hideLastColumn();
        expect(grid.columns).toEqual(3);

        expect(grid.getCell(new Coordinate(0, 0)).hidden).toBeFalsy();
        expect(grid.getCell(new Coordinate(0, 0)).position).toEqual({ x: 0, y: 0 });
        expect(grid.getCell(new Coordinate(0, 0)).span.x).toEqual(3);
    });

});

describe("hideLastRow", () => {
    test("should hide all cells on the last row", () => {
        const grid = createGrid(4, 4);
        for (let x = 0; x < 4; x++) {
            expect(grid.getCell(new Coordinate(x, 3)).hidden).toBeFalsy();
        }
        grid.hideLastRow();
        expect(grid.rows).toEqual(3);
        for (let x = 0; x < 4; x++) {
            expect(grid.getCell(new Coordinate(x, 3)).hidden).toBeTruthy();
        }
    });

    test("should adjust cell span if cell spans to the last row", () => {
        const grid = createGrid(4, 4);
        for (let y = 1; y < grid.rows; y++) {
            grid.mergeCells(
                grid.getCell(new Coordinate(0, 0)),
                grid.getCell(new Coordinate(0, y)));
        }
        expect(grid.getCell(new Coordinate(0, 0)).span.y).toEqual(4);
        expect(grid.getCell(new Coordinate(0, 0)).position).toEqual({ x: 0, y: 0 });
        expect(grid.getCell(new Coordinate(0, 1)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(0, 2)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(0, 3)).hidden).toBeTruthy();
        expect(grid.rows).toEqual(4);
        grid.hideLastRow();
        expect(grid.rows).toEqual(3);
        expect(grid.getCell(new Coordinate(0, 0)).hidden).toBeFalsy();
        expect(grid.getCell(new Coordinate(0, 0)).position).toEqual({ x: 0, y: 0 });
        expect(grid.getCell(new Coordinate(0, 0)).span.y).toEqual(3);

    });

});

describe("addCell", () => {
    test("should add cell at correct position", () => {
        const grid = createGrid(5, 5);
        expect(grid.getCell(new Coordinate(0, 5))).toBeNull();
        grid.addCell(new Coordinate(0, 5), new Coordinate(1, 1));
        expect(grid.getCell(new Coordinate(0, 5))).not.toBeNull();
    });
});


describe("hideCell", () => {
    test("should hide any cell", () => {
        const grid = createGrid();
        for (let y = 0; y < grid.rows; y++) {
            for (let x = 0; x < grid.columns; x++) {
                const cell = grid.getCell(new Coordinate(x, y));
                grid.hideCell(cell);
                expect(cell.hidden).toBeTruthy();
            }
        }
    });
});

describe("hideCellAt", () => {
    test("should hide any cell", () => {
        const grid = createGrid();
        for (let y = 0; y < grid.rows; y++) {
            for (let x = 0; x < grid.columns; x++) {
                grid.hideCellAt(new Coordinate(x, y));
                const cell = grid.getCell(new Coordinate(x, y));
                expect(cell.hidden).toBeTruthy();
            }
        }
    });
});


describe("mergeCells", () => {
    /**
     * Right
     */
    test("should merge cell right to span entire row", () => {
        const grid = createGrid(5, 5);
        for (let x = 1; x < grid.columns; x++) {
            grid.mergeCells(
                grid.getCell(new Coordinate(0, 0)),
                grid.getCell(new Coordinate(x, 0)));
            expect(grid.getCell(new Coordinate(x, 0)).hidden).toBeTruthy();
            expect(grid.getCell(new Coordinate(0, 0)).span.x).toEqual(x + 1);
        }
        expect(grid.getCell(new Coordinate(0, 0)).span.x).toEqual(5);
    });
    test("should merge cell right spanning multiple rows", () => {
        const grid = createGrid(5, 5);
        grid.mergeCells(
            grid.getCell(new Coordinate(0, 0)),
            grid.getCell(new Coordinate(0, 1)));
        expect(grid.getCell(new Coordinate(0, 0)).span.y).toEqual(2);
        grid.mergeCells(
            grid.getCell(new Coordinate(1, 0)),
            grid.getCell(new Coordinate(1, 1)));
        expect(grid.getCell(new Coordinate(1, 0)).span.y).toEqual(2);

        grid.mergeCells(
            grid.getCell(new Coordinate(0, 0)),
            grid.getCell(new Coordinate(1, 0)));

        expect(grid.getCell(new Coordinate(0, 0)).span).toEqual({ x: 2, y: 2 });
        expect(grid.getCell(new Coordinate(1, 0)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(1, 1)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(0, 1)).hidden).toBeTruthy();
    });
    /**
     * Above
     */
    test("should merge cell above", () => {
        const grid = createGrid(5, 5);
        grid.mergeCells(
            grid.getCell(new Coordinate(0, 1)),
            grid.getCell(new Coordinate(0, 0))
        );
        expect(grid.getCell(new Coordinate(0, 0)).span.y).toEqual(2);
        expect(grid.getCell(new Coordinate(0, 1)).hidden).toBeTruthy();

    });
    test("should merge cell above spanning multiple rows", () => {
        const grid = createGrid(5, 5);
        grid.mergeCells(
            grid.getCell(new Coordinate(0, 0)),
            grid.getCell(new Coordinate(1, 0)));
        expect(grid.getCell(new Coordinate(0, 0)).span.x).toEqual(2);
        grid.mergeCells(
            grid.getCell(new Coordinate(0, 1)),
            grid.getCell(new Coordinate(1, 1)));
        expect(grid.getCell(new Coordinate(0, 1)).span.x).toEqual(2);

        grid.mergeCells(
            grid.getCell(new Coordinate(0, 0)),
            grid.getCell(new Coordinate(0, 1)));

        expect(grid.getCell(new Coordinate(0, 0)).span).toEqual({ x: 2, y: 2 });
        expect(grid.getCell(new Coordinate(1, 0)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(1, 1)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(0, 1)).hidden).toBeTruthy();
    });

    /**
     * Below
     */
    test("should merge cell below", () => {
        const grid = createGrid(5, 5);
        grid.mergeCells(
            grid.getCell(new Coordinate(0, 0)),
            grid.getCell(new Coordinate(0, 1))
        );
        expect(grid.getCell(new Coordinate(0, 0)).span.y).toEqual(2);
        expect(grid.getCell(new Coordinate(0, 1)).hidden).toBeTruthy();

    });
    test("should merge cell below spanning multiple rows", () => {
        const grid = createGrid(5, 5);
        grid.mergeCells(
            grid.getCell(new Coordinate(0, 0)),
            grid.getCell(new Coordinate(1, 0)));
        expect(grid.getCell(new Coordinate(0, 0)).span.x).toEqual(2);
        grid.mergeCells(
            grid.getCell(new Coordinate(0, 1)),
            grid.getCell(new Coordinate(1, 1)));
        expect(grid.getCell(new Coordinate(0, 1)).span.x).toEqual(2);

        grid.mergeCells(
            grid.getCell(new Coordinate(0, 1)),
            grid.getCell(new Coordinate(0, 0)));

        expect(grid.getCell(new Coordinate(0, 1)).span).toEqual({ x: 2, y: 2 });
        expect(grid.getCell(new Coordinate(0, 0)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(1, 1)).hidden).toBeTruthy();
        expect(grid.getCell(new Coordinate(1, 0)).hidden).toBeTruthy();
    });

    /**
     * Left
     */
    test("should merge cell left to span entire row", () => {
        const grid = createGrid(3, 3);
        grid.mergeCells(
            grid.getCell(new Coordinate(2, 0)),
            grid.getCell(new Coordinate(1, 0)));
        expect(grid.getCell(new Coordinate(2, 0)).hidden).toBeTruthy();
        grid.mergeCells(
            grid.getCell(new Coordinate(1, 0)),
            grid.getCell(new Coordinate(0, 0)));
        expect(grid.getCell(new Coordinate(1, 0)).hidden).toBeTruthy();

        expect(grid.getCell(new Coordinate(0, 0)).span.x).toEqual(3);
    });






});