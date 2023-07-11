import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {

    // declare two public properties
    @api childName;
    @api age;

    // private property to hold data from the user input
    childSpeak;

    // create a method to dispatch a custom event to the parent component
    respondToParent(event) {
        // take the user input from the event and move it into my private property
        console.log(event);
        this.childSpeak = event.detail.value;

        // create a custom event
        const myEvent = new CustomEvent('crying', { detail: this.childSpeak });

        // dispatch my custom event
        this.dispatchEvent(myEvent);

    }

    // constructor lifecycle method
    constructor() {
        super();
        console.log('Child Component: Constructor fired....');
    }

    // connected and disconnect callback lifecycle methods
    connectedCallback() {
        console.log('Child Component: connectedCallback fired...');
    }

    disconnectedCallback() {
        console.log('Child Component: disconnectedCallback fired....');
    }

    // rendered callback lifecycle method
    renderedCallback() {
        console.log('Child Component: renderedCallback fired....');
    }
}