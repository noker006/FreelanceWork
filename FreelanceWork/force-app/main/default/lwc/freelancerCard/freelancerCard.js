import { LightningElement, api } from 'lwc';

export default class FreelancerCard extends LightningElement {
    @api freelancer = {
        Id: "",
        Email__c: "", 
        Name: "", 
        ImageURL__c: "", 
        Username__c: "",
        Rating__c: ''
    };
}