import { Elements } from "./elements";

export interface BodyElementConstructor {
    element: HTMLElement;
}

/**
 * BodyElement abstract class
 * Provides a base class for all elements that will have HTML involved
 * and handles it's existence as well any children it might choose to add.
 */
export abstract class BodyElement {

    private _element: HTMLElement;
    private _id: number;
    private _elementType: Elements;

    /**
     * Get this element's HTML representation
     */
    public get element(): HTMLElement {
        return this._element;
    }

    /**
     * Gets the children of this element
     */
    public get children(): HTMLCollection {
        return this._element.children;
    }

    /**
     * Gets the parent of this element
     */
    public get parent(): HTMLElement {
        return this._element.parentElement;
    }

    public get hidden(): boolean {
        return this.element.hidden;
    }

    public set hidden(value: boolean) {
        this.element.hidden = value;
    }

    public get elementType(): Elements {
        return this._elementType;
    }
    /**
     * Gets a particular style on this element
     * @param name i.e. "grid-row"
     */
    public getStyle(name: string): string {
        return this._element.style[name];
    }

    /**
     * Sets a particular style on on this element
     * @param name i.e. "grid-row"
     * @param value i.e. "1 / span 2"
     */
    public setStyle(name: string, value: string): void {
        this._element.style[name] = value;
    }

    /**
     * Changes the old element to point to a new element
     * @param element new element
     */
    public setElement(element: HTMLElement) {
        if (this._element != element) {
            this._element.remove();
            this._element = element;
            if (this._element.parentElement != null) {
                this._element.parentElement.appendChild(element);
            } else {
                document.body.appendChild(element);
            }
        }
    }

    /**
     * Adds new element to the body
     * @param args BodyElementConstructor
     */
    constructor(args: BodyElementConstructor) {
        this._element = args.element;
        this._elementType = args.element.tagName.toLocaleLowerCase() as Elements;
        this._id = Math.random() * Date.now();
        document.body.appendChild(args.element);
    }

    /**
     * Handles adding an element as a child of this one
     * @param child what child to add
     */
    public addChild(child: ChildNode): ChildNode {
        if (!this._element.contains(child)) {
            this._element.appendChild(child);
            return child;
        }
    }

    /**
     * Removes all existence of this element from the body
     * and handles any children it may have
     */
    public removeSelf(): void {
        this._element.remove();
    }

    /**
     * Returns whether the id of this element is the same
     * as the passed in element
     * @param element element to compare
     */
    public isSameAs(element: BodyElement): boolean {
        return this._id == element._id;
    }


    /**
     * Removes the specified child from this element and body
     * @param child child to remove
     */
    public removeChild(child: ChildNode): void {
        if (this._element.contains(child)) {
            this._element.removeChild(child);
        }
    }

    /**
     * Removes the first child from this element and body
     */
    public removeFirstChild(): ChildNode {
        const child = this._element.firstChild;
        child.remove();
        return child;
    }
    /**
     * Removes the last child from this element and body
     */
    public removeLastChild(): ChildNode {
        const child = this._element.lastChild;
        child.remove();
        return child;
    }

    /**
     * Attach an onclick handler to this element
     * @param callback function to call when this element is clicked
     */
    public setClickHandler(callback: Function) {
        this._element.onclick = (ev: Event) => {
            callback();
        };
    }

    public removeClickHandler() {
        this._element.onclick = null;
    }

    /**
     * Call to inform this element that it's style must be updated
     */
    public abstract updateStyle(): void;
}
