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

        // configure validatables
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
        if (Array.isArray(userInput)) { console.log(userInput); this.clearInput(); }
    }

    private configure() { this.formElem.addEventListener('submit', this.submitHandler)}

    private attach() { this.hostElem.insertAdjacentElement('afterbegin', this.formElem); }
}

new ProjectInput();
