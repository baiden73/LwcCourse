import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import {refreshApex} from '@salesforce/apex';
import {getPicklistValues} from 'lightning/uiObjectInfoApi';
import OPP_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPP_AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import OPP_CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import {subscribe, unsubscribe} from 'lightning/empApi';
import {updateRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class OpportunityList extends LightningElement {

    // create a public property to inherit the record Id from the Account record page
    @api recordId;

    results;                        // property to hold the provisioned object from the wire service
    recordsToDisplay = false;       // boolean property to dteremine if we have records to display
    displayedOpps = [];             // array property to hold the opp records to DISPLAY in the UI
    allOpps = [];                   // array property to hold ALL of the related opp records.
    status='All';                         // property to hold the value selected in the combobox
    totalRecords;                   // property to hold the total number of records being displayed
    totalAmount;                    // property to hold the total amount of opp records being displayed
    channelName='/topic/Opportunities';
    subscription = {};
    tableMode = false;              // property to determine display of either table or card format
    myDrafts=[];
    cardChecked = true;
    tableChecked = false;


    columns = [
        {label: 'Opportunity Name', fieldName: OPP_NAME_FIELD.fieldApiName, type:"text", editable:true}, 
        {label: 'Amount', fieldName: OPP_AMOUNT_FIELD.fieldApiName, type:"currency", editable:true}, 
        {label: 'Stage', fieldName: OPP_STAGE_FIELD.fieldApiName, type:"text"}, 
        {label: 'Close Date', fieldName: OPP_CLOSEDATE_FIELD.fieldApiName, type:"date"}

    ];
    
    // an array property to hold the options for the combobox
    @track comboOptions = [
        { value: 'All', label: 'All' },
        { value: 'Open', label: 'Open' },
        { value: 'Closed', label: 'Closed' },
        //{ value: 'ClosedWon', label: 'Closed Won' },
        //{ value: 'ClosedLost', label: 'Closed Lost' }
    ];

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: OPP_STAGE_FIELD})
    wiredPicklist({data, error}){
       
        if(data){
            console.log(data);
//iterate
for(let item of data.values){
this.comboOptions.push({value:item.value, label:item.label});

}

this.comboOptions=this.comboOptions.slice();
        }
        if(error){
            console.log('Error occured......');
            console.error(error);
        }
    };
    // use the wire service (decorator) to invoke getOpportunities and handle the returned object in a method
    @wire(getOpportunities, { accountId: '$recordId'})
    wiredOpps(oppRecords) {
        // move the provisioned object into a property so I can refresh the cache when I need to
        this.results = oppRecords;
        console.log(this.results);
        // check to see if we got data or error returned
        if (this.results.data) {
            this.allOpps = this.results.data;
            this.displayedOpps = this.results.data;
            this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;
            this.dispatchEvent(new CustomEvent('oppcount', {detail:this.allOpps.length}));
            this.updateList();
        }

        if (this.results.error) {
            console.error('Error occurred retrieving opp records....');
            console.error(this.results.error);
            this.recordsToDisplay = false;
        }
    };
    // create a method to handle a selection in the the combobox
    handleChange(event) {
        this.status = event.detail.value;           // take the value selected from the combobox
        this.updateList();                          // invoke a method to update the list based off of status
    }

    // create a method to update the list of opps to display in the UI based off of the value of status
    updateList() {
        this.displayedOpps = [];            // clear out the displayedOpps array

        // create a variable to hold the current record
        let currentRecord = {};

        // determine which records meet our filter criteria, and move them into displayedOpps
        if (this.status === 'All') {
            this.displayedOpps = this.allOpps;          // move the full array of opps into displayedOpps
        } else {
            // iterate over the records, check them against the status, and add to displayedOpps as needed
            for (let i = 0; i < this.allOpps.length; i++) {

                // move the current record into currentRecord
                currentRecord = this.allOpps[i];

                // check records against status
                if (this.status === 'Open') {
                    if (!currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                } else if (this.status === 'Closed') {
                    if (currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }

                } else if ( this.status === currentRecord.StageName) {
                    this.displayedOpps.push(currentRecord);
                }
                // } else if (this.status === 'ClosedWon') {
                //     if (currentRecord.IsWon) {
                //         this.displayedOpps.push(currentRecord);
                //     }
                // } else if (this.status === 'ClosedLost') {
                //     if (currentRecord.IsClosed && !currentRecord.IsWon) {
                //         this.displayedOpps.push(currentRecord);
                //     }
                // }
            }         
        }

        // check to see if I have any records to display
        this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;

        // calculate total record count and amount
        this.totalRecords = this.displayedOpps.length;
        this.totalAmount = this.displayedOpps.reduce((prev, curr) => prev + (isNaN(curr.Amount) ? 0 : curr.Amount), 0);
    }


    refreshWire(){

        refreshApex(this.results);
    }

/// create a method to subscribe to a push topic
handleSubscribe() {
    // callback function to execute when receiving a message on the channel
    const messageCallback = response => {
        // check for deletion event
        if (response.data.event.type === 'deleted') {
            // check to see if it is an opp we are displaying
            if (this.allOpps.find(elem => { return elem.Id === response.data.sobject.Id})) {
                this.refreshWire();
            }
        } else {    // must be created, updated or undeleted
            if (response.data.sobject.AccountId === this.recordId) {
                this.refreshWire();
            }
        }
    }

    // subscribe to push topic
    subscribe(this.channelName, -1, messageCallback)
        .then(response => {this.subscription = response});
}

// create a method to unsubscribe from a push topic
handleUnsubscribe() {
    // unsubscribe from the push topic
    unsubscribe(this.subscription, response => { console.log('Opplist unsubscribed from push topic...')} );
}
//executed when the component is inserted into DOM
connectedCallback(){
    this.handleSubscribe();
}
//executed when the component is removed from the DOM
disconnectedCallback(){
    this.handleunsubscribe();
}

// create a method to toggle between card and table fromate when the user selects an option
handleToggle(event) {
    const selection = event.detail.value;

    if (selection === 'card') {
        this.tableMode = false;
        this.cardChecked =true;
        this.tableChecked =false;
    } else if (selection === 'table') {
        this.tableMode = true;
        this.cardChecked =false;
        this.tableChecked =true;
    }
}

handleTableSave(event){

    this.myDrafts = event.detail.draftValues;
    console.log(this.myDrafts);

const inputItems = this.myDrafts.slice().map(draft => {

    var fields = Object.assign({}, draft);
    return { fields};
});
console.log(JSON.stringify(inputItems));

const promises = inputItems.map(recordInput => updateRecord(recordInput));

Promise.all(promises)
.then(result => {
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Success!',
            message: 'Successfully updated the records',
            variant: 'success'
        })
    );
})
.catch(error =>{
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error!',
            message: 'Error occured the records',
            variant: 'error'
        })
    );
})
.finally(()=>{

    this.myDrafts = [];
});

}

}