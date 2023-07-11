import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class AcctRelated extends LightningElement {

    accountId;              // property to hold the account Id received from the message channel
    accountName;            // property to hold the account Name received from the message channel
    subscription = {};      // property to hold the subscription object returned from subscribe

    oppLabel='Opportunities';
    caseLabel='Cases';

    get relatedLabel(){
        return 'Related Records for ' + this.accountName;
    }


    updateOppLabel(event){
    this.oppLabel = 'Opportunities' + '('+event.detail+')';
    }

    updateCaseLabel(event){
        this.caseLabel = 'Cases' + '('+event.detail+')';
            }
    // create MessageContext object
    @wire(MessageContext) 
    messageContext;

    // method to subscribe to the message channel
    subscribeToMessageChannel() {
        this.subscription = subscribe(this.messageContext, AccountMC, (message) => this.handleMessage(message));
    }

    // method to unsubscribe from the message channel
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }
    
    // method to handle the message channel message received
    handleMessage(message) {
        this.accountId = message.recordId;
        this.accountName = message.accountName;
        console.log('acctRelated: Message received and handled: ' + this.accountId + ' ' + this.accountName);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }
}