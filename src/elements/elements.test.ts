import { createButtonWithClickHandler, createDiv, createHeadingLoremIpsum, createLabel, createParagraph, createParagraphBold, createParagraphLoremIpsum, createSelector, createText } from "./elements";

beforeEach(() => {
    for (var i = document.body.children.length - 1; i >= 0; --i) {
        document.body.children[i].remove();
    }
});
test("should add a div element", () => {
    document.body.appendChild(createDiv());
    expect(document.body.firstChild).toBeInstanceOf(HTMLDivElement);
    expect(document.body.lastChild).toBeInstanceOf(HTMLDivElement);
});

test("should add a paragrap element", () => {
    document.body.appendChild(createParagraph());
    expect(document.body.firstChild).toBeInstanceOf(HTMLParagraphElement);
    expect(document.body.lastChild).toBeInstanceOf(HTMLParagraphElement);
});
test("should add 100 div elements", () => {
    for (let i = 0; i < 100; i++) {
        document.body.appendChild(createDiv());
    }
    for (let i = 0; i < 100; i++) {
        expect(document.body.children[i]).toBeInstanceOf(HTMLDivElement);
    }
});
test("should add 100 paragraph elements", () => {
    for (let i = 0; i < 100; i++) {
        document.body.appendChild(createParagraph());
    }
    for (let i = 0; i < document.body.firstElementChild.children.length; i++) {
        expect(document.body.firstElementChild.children[i]).toBeInstanceOf(HTMLParagraphElement);
    }
});

test("should create a bold paragraph", () => {
    document.body.appendChild(createParagraphBold({ center: false, editable: false, text: "boldParagraph" }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLParagraphElement);
    expect(document.body.firstElementChild.firstElementChild.tagName).toEqual("B");
    expect(document.body.firstElementChild.firstElementChild.textContent).toEqual("boldParagraph");

});

test("should create a clickable button", () => {
    document.body.appendChild(createButtonWithClickHandler({ handler: () => { }, content: null }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLButtonElement);
});

test("should create a loremipsum paragraph", () => {
    document.body.appendChild(createParagraphLoremIpsum({ bold: false, center: false, editable: false, sentences: 5, words: 10 }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLParagraphElement);
});

test("should create a loremipsum heading", () => {
    document.body.appendChild(createHeadingLoremIpsum({ element: "h1", words: 5, sentences: 1, center: false, editable: false }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLHeadingElement);
});

test("should create a loremipsum bold paragraph", () => {
    document.body.appendChild(createParagraphLoremIpsum({ bold: true, center: false, editable: false, sentences: 6, words: 5 }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLParagraphElement);
    expect(document.body.firstElementChild.firstElementChild).not.toBeNull();
    expect(document.body.firstElementChild.firstElementChild.tagName).toEqual("B");
    expect(document.body.firstElementChild.firstElementChild.textContent.length).toBeGreaterThan(4);
});

test("should create a label", () => {
    document.body.appendChild(createLabel({ text: "myLabel" }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLLabelElement);
    expect(document.body.firstElementChild.textContent).toEqual("myLabel");
});

test("should create a selector", () => {
    document.body.appendChild(createSelector({ handler: null, options: null }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLSelectElement);
    expect(document.body.firstElementChild.firstChild).toBeNull();
});


test("should create a selector with options", () => {
    document.body.appendChild(createSelector({ handler: null, options: ["option1", "option2", "option3"] }))
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLSelectElement);
    expect(document.body.firstElementChild.firstChild).toBeInstanceOf(HTMLOptionElement);
});

test("should create a selector with a change handler", () => {
    document.body.appendChild(createSelector({ handler: (value: string) => { }, options: ["option1", "option2", "option3"] }))
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLSelectElement);
    expect(document.body.firstElementChild.firstChild).toBeInstanceOf(HTMLOptionElement);
    const selector = document.body.firstElementChild as HTMLSelectElement;
    expect(selector.onchange).not.toBeNull();
});


test("should create a selector with a change handler without options", () => {
    document.body.appendChild(createSelector({ handler: (value: string) => { }, options: null }));
    expect(document.body.firstElementChild).toBeInstanceOf(HTMLSelectElement);
    expect(document.body.firstElementChild.firstChild).toBeNull();
    const selector = document.body.firstElementChild as HTMLSelectElement;
    expect(selector.onchange).not.toBeNull();
});

test("should create text", () => {
    document.body.appendChild(createText("myText"));
    expect(document.body.innerHTML).toEqual("myText");
});