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
});

describe("getCell", () => {
    test("should return cell with correct position", () => {


    });
});