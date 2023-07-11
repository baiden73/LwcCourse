import { LightningElement, api } from 'lwc';
import GenWattStyle from '@salesforce/resourceUrl/GenWattStyle';
import {loadStyle} from 'lightning/platformResourceLoader';

export default class HelloWorld extends LightningElement {


    //create a private property
    @api firstName='World';

    constructor(){
        super();
        loadStyle(this, GenWattStyle)
        .then(()=>{console.log('Style sheet loaded')})
        .catch((error)=>{console.error('Error occured loading style sheet')});
    }
}