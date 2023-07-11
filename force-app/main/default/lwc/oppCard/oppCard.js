import { LightningElement, api } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class OppCard extends NavigationMixin(LightningElement) {

    // create public properties to hold the Opp record field values
    @api name;
    @api amount;
    @api stage;
    @api closeDate;
    @api oppId;

    viewRecord(){

        this[NavigationMixin.Navigate]({

            type: 'standard__recordPage',
            attributes:{

                recordId: this.oppId,
                actionName:'edit'
            }
            }
        );


        
    }

    editOpp(){

        RecordModal.open({
            size:'small',
            recordId:this.oppId,
            objectApiName: 'Opportunity',
            formMode:'edit',
            layoutType:'Compact',
            headerLabel:'Edit Opportunity'

        })
        .then((result)=>{
            console.log(result);
            if(result==='modsuccess'){
            const myToast = new ShowToastEvent({
                title: 'Opportunity Saved Successfully',
                message:"The opportunity record was updated successfully",
                variant:'success',
                mode: 'dismissible',
            });

            this.dispatchEvent(myToast);

            const savedEvent = new CustomEvent('modsaved');
            this.dispatchEvent(savedEvent);

            }
        });
    }
    
}