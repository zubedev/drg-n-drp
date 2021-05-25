// AutoBind decorator (target and methodName parameters unused)
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    return {
        configurable: true,
        get() { return descriptor.value.bind(this); }
    } as PropertyDescriptor
}

// Validation interface
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minVal?: number;
    maxVal?: number;
}

// Validation function
function validate(obj: Validatable) {
    let isValid = true;
    if (obj.required) { // required = true
        isValid = isValid && obj.value.toString().trim().length !== 0;
    }
    if (typeof obj.value === 'string' && obj.minLength != null) { // or undefined, can be 0
        isValid = isValid && obj.value.trim().length >= obj.minLength;
    }
    if (typeof obj.value === 'string' && obj.maxLength != null) { // or undefined, can be 0
        isValid = isValid && obj.value.trim().length <= obj.maxLength;
    }
    if (typeof obj.value === 'number' && obj.minVal != null) { // or undefined, can be 0
        isValid = isValid && obj.value >= obj.minVal;
    }
    if (typeof obj.value === 'number' && obj.maxVal != null) { // or undefined, can be 0
        isValid = isValid && obj.value <= obj.maxVal;
    }
    return isValid;
}

// Drag-n-Drop interfaces
interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {Active, Finished}

// Project class
class Project {
    constructor(
        public id: string,
        public title: string,
        public desc: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

type Listener<T> = (items: T[]) => void;

// State class
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(fn: Listener<T>) { this.listeners.push(fn); }
}

// ProjectState class
class ProjectState extends State<Project> {
    private static instance: ProjectState;
    private projects: Project[] = [];

    private constructor() { super(); }

    static getInstance() {
        if (this.instance) { return this.instance; }
        this.instance = new ProjectState();
        return this.instance;
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }

    addProject(t: string, d: string, p:number) {
        this.projects.push(new Project(
            Math.random().toString(), t, d, p, ProjectStatus.Active));
        this.updateListeners();
    }

    moveProject(projId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(proj => proj.id === projId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
}

const projectState = ProjectState.getInstance();

// ProjectBase abstract class
abstract class ProjectBase<T extends HTMLElement, U extends HTMLElement> {
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

// ProjectItem class
class ProjectItem extends ProjectBase<HTMLUListElement, HTMLLIElement> implements Draggable {
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

// ProjectList class
class ProjectList extends ProjectBase<HTMLDivElement, HTMLElement> implements DragTarget {
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

// ProjectInput class
class ProjectInput extends ProjectBase<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement;
    descInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
        super('project-input', 'app', 'afterbegin', 'user-input');

        this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement;
        this.descInputEl = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputEl = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
    }

    configure() { this.element.addEventListener('submit', this.submitHandler)}

    renderContent() {}

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputEl.value.trim();
        const enteredDesc = this.descInputEl.value.trim();
        const enteredPeople = this.peopleInputEl.value.trim();

        // configure validatable
        const validatableTitle: Validatable = {value: enteredTitle, required: true, minLength:5, maxLength: 50};
        const validatableDesc: Validatable = {value: enteredDesc, maxLength: 100};
        const validatablePeople: Validatable = {value: +enteredPeople, required: true, minVal: 1, maxVal: 9};

        // empty or blank validation
        if (validate(validatableTitle) && validate(validatableDesc) && validate(validatablePeople)) {
            return [enteredTitle, enteredDesc, +enteredPeople];
        } else {
            alert("Invalid input, please try again!");
        }
    }

    private clearInput() {
        this.titleInputEl.value = ''
        this.descInputEl.value = ''
        this.peopleInputEl.value = ''
    }

    @autobind // bind 'this' properly to method
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [t, d, p] = userInput;
            projectState.addProject(t, d, p);
            this.clearInput();
        }
    }
}

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
