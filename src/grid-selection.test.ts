import Coordinate from "./coordinate";
import { Grid } from "./grid";

const createGrid = (): Grid => new Grid({
    columns: 4,
    rows: 4,
    gridGap: 0,
    height: 800,
    width: 800,
    heightUnit: "px",
    widthUnit: "px",
    margin: 0,
    padding: 0
});


const grid = createGrid();
describe("startSelection", () => {
    test("should set cell to first", () => {
        expect(grid.selection.started).toBeFalsy();
        grid.selection.startSelection(grid.getCell(new Coordinate(0, 0)));
        expect(grid.selection.started).toBeTruthy();
        expect(grid.selection.selections[0]).toEqual(grid.getCell(new Coordinate(0, 0)));
    });
    test("should set border on start cell", () => {
        expect(grid.selection.selections[0].element.getStyle("border")).toBeTruthy();
    });
});
describe("addSelection", () => {
    test("should leave cell started with untouched", () => {
        expect(grid.getCell(new Coordinate(0, 0)).element.getStyle("border")).toBeTruthy();
        grid.selection.addSelection(grid.getCell(new Coordinate(0, 0)));
        expect(grid.getCell(new Coordinate(0, 0)).element.getStyle("border")).toBeTruthy();
    });

    test("should add any other cell to selections", () => {
        grid.selection.addSelection(grid.getCell(new Coordinate(1, 1)));
        expect(grid.getCell(new Coordinate(1, 1)).element.getStyle("border")).toBeTruthy();
        grid.selection.addSelection(grid.getCell(new Coordinate(1, 2)));
        expect(grid.getCell(new Coordinate(1, 2)).element.getStyle("border")).toBeTruthy();
        grid.selection.addSelection(grid.getCell(new Coordinate(1, 3)));
        expect(grid.getCell(new Coordinate(1, 3)).element.getStyle("border")).toBeTruthy();
        grid.selection.addSelection(grid.getCell(new Coordinate(2, 1)));
        expect(grid.getCell(new Coordinate(2, 1)).element.getStyle("border")).toBeTruthy();
    });
});

describe("finishSelection", () => {
    test("should finish selection early if finished with first cell", () => {
        grid.selection.finishSelection(grid.getCell(new Coordinate(0, 0)));
        expect(grid.getCell(new Coordinate(0, 0)).element.getStyle("border")).toBeFalsy();

    });
});

describe("resetSelections", () => {
    test("should undo changes to selections", () => {
        grid.selection.resetSelections();

        for (let i = 0; i < grid.selection.selections.length; i++) {
            expect(grid.selection.selections[i].element.getStyle("border")).toBeFalsy();
        }
    });
});