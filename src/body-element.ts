import Body from "./body";

interface BodyElementConstructor {
    element: HTMLElement;
}

/**
 * BodyElement abstract class
 * Provides a base class for all elements that will have HTML involved
 * and handles it's existence as well any children it might choose to add.
 */
export abstract class BodyElement {

    private _element: HTMLElement;
    private _parent: BodyElement;
    private _children: BodyElement[];
    private _id: number;

    /**
     * Get this element's HTML representation
     */
    public get element(): HTMLElement {
        return this._element;
    }

    /**
     * Gets the children of this element
     */
    public get children(): BodyElement[] {
        return this._children;
    }

    /**
     * Gets the parent of this element
     */
    public get parent(): BodyElement {
        return this._parent;
    }

    /**
     * Gets length of children
     */
    public get childrenLength(): number {
        return this._children.length;
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
     * Adds new element to the body
     * @param args BodyElementConstructor
     */
    constructor(args: BodyElementConstructor) {
        this._element = args.element;
        this._children = [];
        this._id = Math.random() * Date.now();
        Body.addElement(this._element);
    }

    /**
     * Handles adding an element as a child of this one
     * @param child what child to add
     */
    public addChild(child: BodyElement): void {
        if (this.indexOfChild(child) == -1) {
            this._children[this._children.length] = child;
            Body.addElementChild(this._element, child._element);
        }
    }

    /**
     * Removes all existence of this element from the body
     * and handles any children it may have
     */
    public removeSelf(): void {
        Body.removeElement(this._element);
        this._element = null;
        this._children.splice(0, this._children.length);
        if (this._parent != null) {
            this._parent.removeChild(this);
        }
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
     * Attempts to find a child of this element, returning it's index
     * @param child child to find index of
     */
    public indexOfChild(child: BodyElement): number {
        return this._children.findIndex(e => e.isSameAs(child));
    }

    /**
     * Removes the specified child from this element and body
     * @param child child to remove
     */
    public removeChild(child: BodyElement): void {
        var index = this.indexOfChild(child);
        if (index >= 0) {
            const el = this._children.splice(index, 1);
            this._element.removeChild(el[0]._element);
        }
    }

    /**
     * Removes the first child from this element and body
     */
    public removeFirstChild(): void {
        if (this.childrenLength > 0) {
            const el = this._children.splice(0, 1);
            this._element.removeChild(el[0]._element);
        }
    }

    /**
     * Removes the last child from this element and body
     */
    public removeLastChild(): void {
        if (this.childrenLength > 0) {
            const el = this._children.splice(this._children.length - 1, 1);
            this._element.removeChild(el[0]._element);
        }
    }

    /**
     * Removes a child from the index specified and body
     * @param index index of child
     */
    public removeChildByIndex(index: number): void {
        if (index >= 0 && index < this._children.length) {
            this.removeChild(this._children[index]);
        }
    }

    /**
     * Removes all children from this element.
     */
    public removeChildren(): void {
        for (let i = 0; i < this._children.length; i++) {
            this._children[i].removeSelf();
        }
        this._children.splice(0, this._children.length);
    }

    /**
     * Attach an onclick handler to this element
     * @param callback function to call when this element is clicked
     */
    public set onClick(callback: Function) {
        this._element.onclick = (ev: Event) => {
            callback();
        };
    }
    /**
     * Call to inform this element that it's style must be updated
     */
    public abstract updateStyle(): void;
}
