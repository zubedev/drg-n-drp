import {ProjectBase} from "./base";
import {projectState} from "../state/project";
import {Validatable} from "../models/validatable";
import {validate} from "../utils/validation";
import {autobind} from "../decorators/autobind";

// ProjectInput class
export class ProjectInput extends ProjectBase<HTMLDivElement, HTMLFormElement> {
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
