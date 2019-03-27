import Cell from "./cell";
import { Grid } from "./grid";
export default class GridExporter {

    public static generate(grid: Grid) {
        if (grid != null) {
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
                    const cell: Cell = grid.cells[y][x];
                    if (cell != null) {
                        contents.push(`<div style="grid-row: ${cell.position.y + 1} / span ${cell.span.y}; grid-column: ${cell.position.x + 1} / span ${cell.span.x}";>`);
                        if (cell.element.children.length > 0) {
                            for (let i = 0; i < cell.element.children.length; i++) {
                                const child: HTMLElement = cell.element.children[i] as HTMLElement;
                                if (child != null) {
                                    const tagName: string = child.tagName.toLocaleLowerCase();
                                    contents.push(`<${tagName}>${child.innerHTML}</${tagName}>`);
                                }

                            }
                        }
                        contents.push("</div>");
                    }
                }
            }
            contents.push("</div>");
            alert(contents.join('\n'));
        }
    }
}
