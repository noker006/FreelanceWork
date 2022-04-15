import { LightningElement, track, api } from 'lwc';

export default class CardRequest extends LightningElement {
    @api request = {
        Freelancer__r: {
            ImageURL__c: "",
            Name: "",
            Id: ""
        },
        FullPayment__c: "",
        HourlyRate__c: "",
        DeadLine__c: "",
        Message__c: "",
        Id: ""
    }

    handleAccept(event) {
        event.preventDefault();

        const acceptedEvent = new CustomEvent('accepted',{detail: this.request});

        this.dispatchEvent(acceptedEvent);
        console.log('handleAccept Dispatch*************');
    }

    handleReject(event) {
        event.preventDefault();
        
        const rejectedEvent = new CustomEvent('rejected', {detail: this.request });

        this.dispatchEvent(rejectedEvent);
    }
    
}