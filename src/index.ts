import { createButtonWithClickHandler, createNumberInput, createParagraphBold } from "./elements/elements";
import { Grid } from "./grid";
import GridExporter from "./grid-exporter";
import { History } from "./history";

window.onload = () => {
    const units: string[] = ["px", "fr", "%"];

    document.body.appendChild(
        createButtonWithClickHandler({
            content: createParagraphBold({
                center: false,
                editable: false,
                text: "Add Column"
            }),
            handler: () => {
                grid.addColumn();
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
                grid.addRow();
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
                grid.hideLastColumn();
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
                grid.hideLastRow();
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

    const history: History = new History();
    const grid: Grid = new Grid({
        columns: 3,
        rows: 3,
        width: window.innerWidth - 100,
        height: window.innerHeight - 100,
        widthUnit: units[0],
        heightUnit: units[0],
        gridGap: 0,
        margin: 0,
        padding: 0
    });

}