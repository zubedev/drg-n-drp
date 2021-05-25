import {ProjectBase} from "./base";
import {Project, ProjectStatus} from "../models/project";
import {ProjectItem} from "./item";
import {projectState} from "../state/project";
import {DragTarget} from "../models/drag-drop";
import {autobind} from "../decorators/autobind";

// ProjectList class
export class ProjectList extends ProjectBase<HTMLDivElement, HTMLElement> implements DragTarget {
    projects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', 'beforeend', `${type}-projects`);
        this.projects = [];
        this.configure();
        this.renderContent();
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects: Project[]) => {
            this.projects = projects.filter(proj => {
                if (this.type === 'active') { return proj.status === ProjectStatus.Active; }
                else { return proj.status === ProjectStatus.Finished; }
            });
            this.renderProjects();
        });
    }

    renderContent() {
        this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
        const listElem = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
        listElem.innerHTML = ''; // clear the list for re-rendering
        for (const proj of this.projects) {
            new ProjectItem(this.element.querySelector('ul')!.id, proj);
        }
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault(); // enables dropping (js default: disabled)
            this.element.querySelector('ul')!.classList.add('droppable');
        }
    }

    @autobind
    dropHandler(event: DragEvent) {
        projectState.moveProject(
            event.dataTransfer!.getData('text/plain'),
            this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
        );
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        this.element.querySelector('ul')!.classList.remove('droppable');
    }
}
