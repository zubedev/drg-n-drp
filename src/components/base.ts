// ProjectBase abstract class
export abstract class ProjectBase<T extends HTMLElement, U extends HTMLElement> {
    templateElem: HTMLTemplateElement;
    hostElem: T;
    element: U;

    protected constructor(templateId: string, hostId: string, hostInsertPos: InsertPosition, elementId?: string) {
        this.templateElem = document.getElementById(templateId) as HTMLTemplateElement;
        this.hostElem = document.getElementById(hostId) as T;

        const importedNode = document.importNode(this.templateElem.content, true);
        this.element = importedNode.firstElementChild as U;
        if (elementId) { this.element.id = elementId; } // to apply css style

        this.attach(hostInsertPos);
    }

    private attach(position: InsertPosition) { this.hostElem.insertAdjacentElement(position, this.element); }

    abstract configure(): void;
    abstract renderContent(): void;
}
