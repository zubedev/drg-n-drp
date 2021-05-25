import {Project, ProjectStatus} from "../models/project";

// Listener type
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

export const projectState = ProjectState.getInstance();
