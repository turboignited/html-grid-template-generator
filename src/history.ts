import { CellAction, CellHistory, CellInfo } from "./cell-history";
import { createParagraphBold, createParagraphRegular } from "./elements/elements";
import { HistoryElement } from "./elements/history-element";
import { GridAction, GridHistory } from "./grid-history";

export declare type HistoryCallback = (index: number) => void;

export interface HistoryConstructor {
    undoCallback: HistoryCallback;
    redoCallback: HistoryCallback;
}

export interface HistoryAddedArgs {
    cellAction?: CellAction;
    gridAction?: GridAction;
    cellInfo?: CellInfo;
}

export class History {
    private _element: HistoryElement;
    private _added: HistoryAddedArgs[];
    private _cellHistory: CellHistory;
    private _gridHistory: GridHistory;
    public get cellHistory(): CellHistory {
        return this._cellHistory;
    }
    public get gridHistory(): GridHistory {
        return this._gridHistory;
    }

    constructor() {
        this._element = new HistoryElement();
        this._added = [];
        this._element.setStyle("width", window.innerWidth.toString());
        this._element.setStyle("height", "100px");
        this._element.setStyle("overflow-y", "scroll");
        this._element.setStyle("background", "gray");
        GridHistory.callback = this.gridCallback;
        CellHistory.callback = this.cellCallback;

    }

    public cellCallback(action: CellAction, history: CellInfo) {
        this._added.push({ cellAction: action, cellInfo: history });
        this._element.addChild(createParagraphRegular({ text: `${this._added.length}) Cell: ${CellAction[action]}`, center: true, editable: false }));
        this._element.element.scrollTop = this._element.element.scrollHeight;
    }

    public gridCallback(action: GridAction) {
        this._added.push({ gridAction: action });
        this._element.addChild(createParagraphBold({ text: `${this._added.length}) Grid: ${GridAction[action]}`, center: true, editable: false }));
        this._element.element.scrollTop = this._element.element.scrollHeight;
    }
}