import { Grid } from "./grid";
import { GridOptions } from "./grid-options";

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

const createOptions = (): GridOptions => new GridOptions({ grid: createGrid() });

describe("showOptions", () => {
    test("should show no options if no cells are provided", () => {
        const options = createOptions();
        options.showOptions(null);
    });
});
