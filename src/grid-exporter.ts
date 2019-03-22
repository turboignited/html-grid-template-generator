import GridCell from "./grid-cell";
import Grid from "./grid";
export default class GridExporter {

    public static generate(grid: Grid) {
        var contents: string[] = [];
        contents[0] = `<div style="display: grid; `;
        if (grid.margin != 0) {
            contents[0] += `margin: ${grid.margin}px; `;
        }
        if (grid.padding != 0) {
            contents[0] += `padding: ${grid.padding}px; `;
        }
        if (grid.gridGap != 0) {
            contents[0] += `grid-gap: ${grid.gridGap}px; `;
        }
        contents[0] += `grid-template-columns: repeat(${grid.columns},1fr); `;
        contents[0] += `grid-template-rows: repeat(${grid.rows},1fr);`;
        contents[0] += `">`;
        for (let y = 0; y < grid.cells.length; y++) {
            for (let x = 0; x < grid.cells[y].length; x++) {
                const cell: GridCell = grid.cells[y][x];
                if (cell != null) {
                    contents.push(`<div style="grid-row: ${cell.y + 1} / span ${cell.ySpan}; grid-column: ${cell.x + 1} / span ${cell.xSpan}"`);
                    if (cell.element.childrenLength > 0) {
                        cell.element.children.forEach(element => {
                            const child: HTMLElement = element.element;
                            const tagName: string = child.tagName.toLocaleLowerCase();
                            contents.push(`<${tagName}>${child.innerHTML}</${tagName}>`);
                        });
                    }
                    contents.push("</div>");
                }
            }
        }
        contents.push("</div>");
        alert(contents.join('\n'));
    }
}
