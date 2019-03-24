import { createButtonWithClickHandler, createNumberInput, createParagraphBold, createParagraphRegular, createSelector, Elements } from "./elements/elements";
import { Grid, GridConstructor } from "./grid";
import GridExporter from "./grid-exporter";
import { GridHistory } from "./grid-history";


window.onload = () => {

    const cellClickHandler = (history: GridHistory) => {
        gridHistoryUndo.push(history);
    }
    const units: string[] = ["px", "fr", "%"];
    const gridSettings: GridConstructor = {
        columns: 3,
        rows: 3,
        width: window.innerWidth - 100,
        height: window.innerHeight - 100,
        widthUnit: units[0],
        heightUnit: units[0],
        gridGap: 0,
        margin: 0,
        padding: 0,
        cellClickedHandler: cellClickHandler
    }
    const gridDimensionsText = createParagraphRegular({
        text: `${gridSettings.columns}x${gridSettings.rows}`,
        editable: false,
        center: true
    });
    const elementSelectorText = createParagraphRegular({
        text: "'none' element selected, select a cell to begin editing",
        editable: false,
        center: true
    });
    const gridHistoryUndo: GridHistory[] = [];
    const gridHistoryRedo: GridHistory[] = [];




    document.body.appendChild(gridDimensionsText);
    document.body.appendChild(elementSelectorText);

    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Add Column"
            }),
            handler: () => {
                gridHistoryUndo.push(grid.addColumn());
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));

    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Add Row"
            }),
            handler: () => {
                gridHistoryUndo.push(grid.addRow());
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));

    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Remove Column"
            }),
            handler: () => {
                gridHistoryUndo.push(grid.removeLastColumn());
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));

    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Remove Row"
            }),
            handler: () => {
                gridHistoryUndo.push(grid.removeLastRow());
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));


    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Undo"
            }),
            handler: () => {
                if (gridHistoryUndo.length > 0) {
                    const undo = gridHistoryUndo.splice(gridHistoryUndo.length - 1, 1);
                    gridHistoryRedo.push(grid.restoreHistory(undo[0]));
                }
            }
        }));


    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Redo"
            }),
            handler: () => {
                if (gridHistoryRedo.length > 0) {
                    const redo = gridHistoryRedo.splice(gridHistoryRedo.length - 1, 1);
                    gridHistoryUndo.push(grid.restoreHistory(redo[0]));
                }
            }
        }));

    document.body.appendChild(
        createSelector({
            options: Object.keys(Elements),
            handler: (value: string) => {
                switch (Elements[value]) {
                    case Elements.none:
                        elementSelectorText.textContent = "'none' element selected, select a cell to begin editing";
                        break;
                    case Elements.p:
                        elementSelectorText.textContent = "Click a cell to add a 'p' element";
                        break;
                    case Elements.h1:
                        elementSelectorText.textContent = "Click a cell to add a 'h1' element";
                        break;
                    case Elements.h2:
                        elementSelectorText.textContent = "Click a cell to add a 'h2' element";
                        break;
                    case Elements.h3:
                        elementSelectorText.textContent = "Click a cell to add a 'h3' element";
                        break;
                    case Elements.h4:
                        elementSelectorText.textContent = "Click a cell to add a 'h4' element";
                        break;
                    case Elements.h5:
                        elementSelectorText.textContent = "Click a cell to add a 'h5' element";
                        break;
                    default:
                        break;
                }
                grid.activeElement = Elements[value];
            }
        }));

    document.body.appendChild(
        createNumberInput({
            handler: (value: number) => {
                if (value >= 0) {
                    grid.gridGap = value;
                }
            },
            placeholder: "Grid Gap (0px)"
        })
    )
    document.body.appendChild(
        createNumberInput({
            handler: (value: number) => {
                if (value >= 0) {
                    grid.margin = value;
                }
            },
            placeholder: "Margin (0px)"
        })
    )
    document.body.appendChild(
        createNumberInput({
            handler: (value: number) => {
                if (value >= 0) {
                    grid.padding = value;
                }
            },
            placeholder: "Padding (0px)"
        })
    )

    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Export HTML"
            }),
            handler: () => {
                GridExporter.generate(grid);
            }
        }));


    const grid: Grid = new Grid({
        width: gridSettings.width,
        height: gridSettings.height,
        columns: gridSettings.columns,
        rows: gridSettings.rows,
        heightUnit: gridSettings.heightUnit,
        widthUnit: gridSettings.widthUnit,
        gridGap: gridSettings.gridGap,
        margin: gridSettings.margin,
        padding: gridSettings.padding,
        cellClickedHandler: gridSettings.cellClickedHandler
    });
}