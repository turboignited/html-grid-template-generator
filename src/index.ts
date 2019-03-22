import Grid from "./grid";
import Body from "./body";
import GridExporter from "./grid-exporter";
import { createSelector, createButtonWithClickHandler, createParagraphBold, createParagraphRegular, Elements, createNumberInput } from "./elements";



window.onload = async () => {

    const units: string[] = ["px", "fr", "%"];
    const gridSettings = {
        columns: 3,
        rows: 3,
        width: window.innerWidth - 100,
        height: window.innerHeight - 100,
        widthUnit: units[0],
        heightUnit: units[0],
        gridGap: 0,
        margin: 0,
        padding: 0
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

    Body.addElement(gridDimensionsText);
    Body.addElement(elementSelectorText);

    Body.addElement(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Add Column"
            }),
            handler: () => {
                grid.addColumn();
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));

    Body.addElement(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Add Row"
            }),
            handler: () => {
                grid.addRow();
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));

    Body.addElement(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Remove Column"
            }),
            handler: () => {
                grid.removeLastColumn();
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));

    Body.addElement(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Remove Row"
            }),
            handler: () => {
                grid.removeLastRow();
                gridDimensionsText.textContent = `${grid.columns}x${grid.rows}`;
            }
        }));

    Body.addElement(
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
                grid.setActiveElement(Elements[value]);
            }
        }));

    Body.addElement(
        createNumberInput({
            handler: (value: number) => {
                if (value >= 0) {
                    grid.gridGap = value;
                }
            },
            placeholder: "Grid Gap (0px)"
        })
    )
    Body.addElement(
        createNumberInput({
            handler: (value: number) => {
                if (value >= 0) {
                    grid.margin = value;
                }
            },
            placeholder: "Margin (0px)"
        })
    )
    Body.addElement(
        createNumberInput({
            handler: (value: number) => {
                if (value >= 0) {
                    grid.padding = value;
                }
            },
            placeholder: "Padding (0px)"
        })
    )

    Body.addElement(
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
        padding: gridSettings.padding
    });
}