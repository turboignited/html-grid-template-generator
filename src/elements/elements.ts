import { LoremIpsum } from "lorem-ipsum";

/**
 * Many functions to help with creating HTMLElements
 */

export enum Elements {
    none = "none",
    p = "p",
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",

    div = "div"
}

type NumberInputChangedHandler = (value: number) => void;
type TextInputChangeHandler = (value: string) => void;
type SelectorChangeHandler = (value: string) => void;

/**
 * Helper functions
 */
export const randomColourString = (): string => {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
}
export const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const createElement = (tag: string): HTMLElement => {
    return document.createElement(tag);
}
export const createText = (text: string = ""): Text => {
    return document.createTextNode(text);
}

/**
 * Textual HTMLElements
 */
export const createParagraph = (): HTMLParagraphElement => {
    return createElement("p") as HTMLParagraphElement;
}
export const createBold = (): HTMLElement => {
    return createElement("b");
}
interface ParagraphRegularArguments {
    editable: boolean;
    text: string;
    center: boolean;
}
export const createParagraphRegular = (args: ParagraphRegularArguments): HTMLParagraphElement => {
    const paragraph = createParagraph();
    paragraph.appendChild(createText(args.text));
    if (args.editable) {
        paragraph.contentEditable = "true";
    }
    if (args.center) {
        paragraph.style.textAlign = "center";
    }
    return paragraph;
}
interface ParagraphBoldArguments {
    editable: boolean;
    text: string;
    center: boolean;
}

export const createParagraphBold = (args: ParagraphBoldArguments): HTMLParagraphElement => {
    const paragraph = createParagraph();
    const bold = createBold();
    bold.appendChild(createText(args.text));
    paragraph.appendChild(bold);
    if (args.editable) {
        paragraph.contentEditable = "true";
    }
    if (args.center) {
        paragraph.style.textAlign = "center";
    }
    return paragraph;
}
interface ParagraphLoremIpsumArguments {
    editable: boolean;
    center: boolean;
    sentences: number;
    words: number;
    bold: boolean;
}
export const createParagraphLoremIpsum = (args: ParagraphLoremIpsumArguments) => {
    const lorem = new LoremIpsum({
        wordsPerSentence: {
            max: args.words,
            min: args.words
        }
    });
    if (args.bold) {
        return createParagraphBold({ text: lorem.generateSentences(args.sentences), editable: args.editable, center: args.center });
    } else {
        return createParagraphRegular({ text: lorem.generateSentences(args.sentences), editable: args.editable, center: args.center });
    }
}

interface HeadingLoremIpsumArguments {
    editable: boolean;
    center: boolean;
    sentences: number;
    words: number;
    element: string;
}
export const createHeadingLoremIpsum = (args: HeadingLoremIpsumArguments) => {
    const lorem = new LoremIpsum({
        wordsPerSentence: {
            max: args.words,
            min: args.words
        }
    });
    const heading = createElement(args.element);
    const text = createText(lorem.generateSentences(args.sentences));
    heading.appendChild(text);
    if (args.editable) {
        heading.contentEditable = "true";
    }
    if (args.center) {
        heading.style.textAlign = "center";
    }
    return heading;
}

/**
 * Container HTMLElements
 */
export const createDiv = (): HTMLDivElement => {
    const div = createElement("div") as HTMLDivElement;
    return div;
}

/**
 * Interactive HTMLElements
 */
interface NumberInputArguments {
    placeholder?: string;
    handler: NumberInputChangedHandler;
}
export const createNumberInput = (args: NumberInputArguments): HTMLInputElement => {
    const input: HTMLInputElement = createElement("input") as HTMLInputElement;
    if (args.placeholder != null) {
        input.setAttribute("placeholder", args.placeholder);
    }
    input.setAttribute("type", "number");
    input.onchange = (ev: any) => {
        const c = parseInt(ev.target.value);
        if (!isNaN(c)) {
            args.handler(c);
        }
    };
    return input;
}
interface TextInputArguments {
    placeholder?: string;
    handler: TextInputChangeHandler;
}
export const createTextInput = (args: TextInputArguments): HTMLInputElement => {
    const input: HTMLInputElement = createElement("input") as HTMLInputElement;
    if (args.placeholder != null) {
        input.setAttribute("placeholder", args.placeholder);
    }
    input.setAttribute("type", "text");
    input.onchange = (ev: any) => {
        const value = ev.target.value.toString();
        args.handler(value);
    }
    return input;
}

interface SelectorArguments {
    options: string[];
    handler: SelectorChangeHandler;
}
export const createSelector = (args: SelectorArguments): HTMLSelectElement => {
    const select: HTMLSelectElement = createElement("select") as HTMLSelectElement;
    if (args.options != null) {
        for (let i = 0; i < args.options.length; i++) {
            const option = createElement("option") as HTMLOptionElement;
            option.value = args.options[i];
            option.text = args.options[i];
            select.options.add(option);
        }
    }
    if (args.handler != null) {
        select.onchange = (ev: any) => {
            args.handler(ev.target.value);
        }
    }
    return select;
}

interface LabelArguments {
    text: string;
}
export const createLabel = (args: LabelArguments): HTMLLabelElement => {
    const label: HTMLLabelElement = createElement("label") as HTMLLabelElement;
    label.textContent = args.text;
    return label;
}
interface ButtonArguments {
    content: HTMLElement;
}
export const createButton = (args: ButtonArguments): HTMLButtonElement => {
    const button: HTMLButtonElement = createElement("button") as HTMLButtonElement;
    if (args.content != null) {
        button.appendChild(args.content);
    }
    return button;
}

interface ButtonClickHandlerArguments {
    content: HTMLElement;
    handler: Function;
}
export const createButtonWithClickHandler = (args: ButtonClickHandlerArguments) => {
    const button: HTMLButtonElement = createButton({ content: args.content });
    button.onclick = () => {
        args.handler();
    };
    return button;
}