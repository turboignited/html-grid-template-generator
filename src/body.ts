/**
 * Body class
 * Provides a static interface to the HTMLElements
 */
export default class Body {

    /**
     * Adds a specified element to the document body
     * @param element HTML element to add
     */
    public static addElement(element: HTMLElement) {
        if (!document.body.contains(element)) {
            document.body.appendChild(element);
        }
    }

    /**
     * Places child element in the parent in the body
     * @param parent parent of child
     * @param child child of parent
     */
    public static addElementChild(parent: HTMLElement, child: HTMLElement) {
        if (!parent.contains(child)) {
            parent.appendChild(child);
        }
    }

    /**
     * Handles the removal of the specified element
     * @param element element to remove from body
     */
    public static removeElement(element: HTMLElement) {
        element.remove();
    }

    /**
     * Handles the removal of all specified element's children
     * @param element element whose children should be removed from the body
     */
    public static removeElementChildren(element: HTMLElement) {
        for (let i = 0; i < element.children.length; i++) {
            element.children[i].remove();
        }
    }

    /**
     * Handles removing a single child from the specified parent element
     * @param parent parent of child
     * @param child child of parent
     */
    public static removeElementChild(parent: HTMLElement, child: HTMLElement) {
       parent.removeChild(child);
    }
}