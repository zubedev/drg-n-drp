import {ProjectBase} from "./base.js";
import {Project} from "../models/project.js";
import {Draggable} from "../models/drag-drop.js";
import {autobind} from "../decorators/autobind.js";

// ProjectItem class
export class ProjectItem extends ProjectBase<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, "beforeend", project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    get persons() {
        if (this.project.people > 1) { return `${this.project.people} persons`; }
        else { return `${this.project.people} person`; }
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.desc;
    }

    @autobind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    @autobind
    dragEndHandler(_: DragEvent) {
        console.log('End of Drag');
    }
}
