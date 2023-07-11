import { LightningElement, api } from 'lwc';

export default class OppRecordForm extends LightningElement {

//public prop
@api recordId;
@api objectApiName;

@api layoutType = 'Compact'
@api formMode = 'readonly'


}