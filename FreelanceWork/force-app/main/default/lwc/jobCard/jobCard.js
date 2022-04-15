import { LightningElement , track , api } from 'lwc';

export default class JobCard extends LightningElement {
    @api job =  {
        Category__c: '', 
        Description__c: '', 
        ExperienceLevel__c: '',
        HourlyRate__c: '',
        Skills__c: '',
        Name: '',
        Customer__r: {
            ImageURL__c: '',
            Name: '',
            Id: ''
        }
    }

}