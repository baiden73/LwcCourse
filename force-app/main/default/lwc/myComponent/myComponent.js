import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {

    //boolean property to dtermine contditional display
    showContacts=false;

    //create an array

    contacts = [

{id: '111', Name: 'John', Title: 'VP'},
{id: '222', Name: 'Dagny', Title: 'SVP'},
{id: '333', Name: 'Henry', Title: 'President'}
    ];
//Create a method to toogle 
toggleView(){
this.showContacts = !this.showContacts;

}
}