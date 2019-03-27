import Cell from "./cell";
import Coordinate from "./coordinate";

var cell: Cell;

beforeAll(() => {
    cell = new Cell({
        position: new Coordinate(0, 0),
        span: new Coordinate(0, 0),
        grid: null
    });
});

test("should create GridCellElement on DOM", () => {
    expect(cell).toHaveProperty("element");
    expect(document.body.firstElementChild).toBe(cell.element.element);
});

test("should attach onmousedown handler", () => {
    expect(cell.element.element.onmousedown).not.toBeNull();
});
test("should attach mouseup handler", () => {
    expect(cell.element.element.onmouseup).not.toBeNull();
});

test("should attach mouseenter handler", () => {
    expect(cell.element.element.onmouseenter).not.toBeNull();
});

test("should hide from DOM", () => {
    expect(document.body.firstElementChild.getAttribute("hidden")).toBeNull();
    cell.hidden = true;
    expect(document.body.firstElementChild.getAttribute("hidden")).toEqual("");
    cell.hidden = false;
    expect(document.body.firstElementChild.getAttribute("hidden")).toBeNull();
});