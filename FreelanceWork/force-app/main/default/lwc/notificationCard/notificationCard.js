import { LightningElement, api } from 'lwc';

export default class NotificationCard extends LightningElement {
    @api notification = {
        Id: "",
        Customer__r: {
            ImageURL__c: "",
            Id: ""
        },
        Freelancer__r: {
            ImageURL__c: "",
            Id: ""
        },
        ImageURL__c: "",
        Name: "",
        Text__c: "",
        Title__c: ""
    };

    imageURL = "";

    connectedCallback() {
        
    }

    handleDelete(event) {
        event.preventDefault();

        const deletedEvent = new CustomEvent('deleted',{detail: this.notification});

        this.dispatchEvent(deletedEvent);
    }
}