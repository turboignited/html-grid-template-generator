import Coordinate from "./coordinate";
import GridCell from "./grid-cell";

var cell: GridCell;

beforeAll(() => {
    cell = new GridCell({
        grid: null,
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

test("should remove GridCellElement from DOM", () => {
    const element = cell.element.element;
    expect(document.body.firstElementChild).toBe(element);
    cell.deleteElement();
    expect(document.body.firstElementChild).toBeNull();
});