import { LightningElement, api } from 'lwc';
import ACCOUNT_FIELD from '@salesforce/schema/Opportunity.AccountId';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSE_DATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';

export default class OppRecordEditForm extends LightningElement {

    @api recordId;
    @api objectApiName;

    editMode =false;


    accountField= ACCOUNT_FIELD;
    nameField=NAME_FIELD;
    amountField=AMOUNT_FIELD;
    closeDateField=CLOSE_DATE_FIELD;
    stageField=STAGE_FIELD;

    //create method toggle
    toggleMode(){
        this.editMode = !this.editMode;
    }



}