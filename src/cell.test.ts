import Cell from "./cell";
import Coordinate from "./coordinate";

var cell: Cell;

beforeAll(() => {
    cell = new Cell({
        position: new Coordinate(0, 0),
        span: new Coordinate(0, 0)
    });
});

test("should create GridCellElement on DOM", () => {
    expect(cell).toHaveProperty("element");
    expect(document.body.firstElementChild).toBe(cell.element.element);
});

test("should attach click handler", () => {
    expect(cell.element.element.onclick).not.toBeNull();
});

test("should hide from DOM", () => {
    expect(document.body.firstElementChild.getAttribute("hidden")).toBeNull();
    cell.hidden = true;
    expect(document.body.firstElementChild.getAttribute("hidden")).toEqual("");
    cell.hidden = false;
    expect(document.body.firstElementChild.getAttribute("hidden")).toBeNull();

});