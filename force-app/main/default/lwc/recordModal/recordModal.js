import { api } from 'lwc';
import lightningModal from 'lightning/modal';
export default class RecordModal extends lightningModal {

    @api recordId;
    @api objectApiName;
    @api formMode;
    @api layoutType;
    @api headerLabel;

    handleCancel(){
        this.close('modcancel');
    }

    handleSuccess(){
        this.close('modsuccess');
    }
}