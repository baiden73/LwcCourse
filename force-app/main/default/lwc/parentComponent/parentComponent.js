import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    //private property to hold value
childSaid;

handleFit(evt){
    console.log(evt);
this.childSaid=evt.detail;

}

    constructor(){

        super();
        console.log('Parent Comp:Constructor Fired...');
    }


    connectedCallback(){
        console.log('Parent comp:connectedCallback');
    }
    disconnectedCallback(){
        console.log('Parent comp:disconnectedCallback');
    }
    renderedCallback(){
        console.log('Parent comp:renderedCallback');
    }


}