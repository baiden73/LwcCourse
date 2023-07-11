import { LightningElement, api, wire} from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class GetRecordForm extends LightningElement {
@api recordId;
contact;
error;
wireResponse = theContact;

//@wire(getRecord, {recordId: '$recordId', fields: [NAME_FIELD, TITLE_FIELD, PHONE_FIELD,EMAIL_FIELD]}) 
//contact;


@wire(getRecord, {recordId: '$recordId', fields: [NAME_FIELD, TITLE_FIELD, PHONE_FIELD,EMAIL_FIELD]}) 
wiredContact(theContact){
this.wireResponse = theContact;
if(this.wireResponse.data){
this.contact = this.wireResponse.data;

}
if(this.wireResponse.error){
    this.error=this.wireResponse.error;
this.contact = undefined;
}

};

get title(){
    let titleVar = this.contact.data.fields.Title.value;
    return titleVar.toUpperCase();
}

get phone(){

    return this.contact.data.fields.Phone.value;
}

get email(){

    return this.contact.data.fields.Email.value;
}


}