// AutoBind decorator (target and methodName parameters unused)
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    return {
        configurable: true,
        get() { return descriptor.value.bind(this); }
    } as PropertyDescriptor
}

// ProjectInput class
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

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputEl.value.trim();
        const enteredDesc = this.descInputEl.value.trim();
        const enteredPeople = this.peopleInputEl.value.trim();

        // empty or blank validation
        if (enteredTitle.length === 0 || enteredDesc.length === 0 || enteredPeople.length === 0) {
            alert("Invalid input: missing fields! Please try again!");
        } else {
            return [enteredTitle, enteredDesc, +enteredPeople];
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
        if (Array.isArray(userInput)) { console.log(userInput); this.clearInput(); }
    }

    private configure() { this.formElem.addEventListener('submit', this.submitHandler)}

    private attach() { this.hostElem.insertAdjacentElement('afterbegin', this.formElem); }
}

new ProjectInput();
