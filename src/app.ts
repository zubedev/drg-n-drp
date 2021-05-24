class ProjectInput {
    templateElem: HTMLTemplateElement;
    hostElem: HTMLDivElement;
    formElem: HTMLFormElement;

    titleInputEl: HTMLInputElement;
    descInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
        this.templateElem = document.getElementById('project-input') as HTMLTemplateElement;
        this.hostElem = document.getElementById('app') as HTMLDivElement;

        const importedNode = document.importNode(this.templateElem.content, true);
        this.formElem = importedNode.firstElementChild as HTMLFormElement;
        this.formElem.id = 'user-input'; // to apply css style that comes with the id

        this.titleInputEl = this.formElem.querySelector('#title') as HTMLInputElement;
        this.descInputEl = this.formElem.querySelector('#description') as HTMLInputElement;
        this.peopleInputEl = this.formElem.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInputEl.value);
    }

    private configure() { this.formElem.addEventListener('submit', this.submitHandler.bind(this))}

    private attach() { this.hostElem.insertAdjacentElement('afterbegin', this.formElem); }
}

const projInput = new ProjectInput();
