import { LightningElement, track, api } from 'lwc';
import getJob from '@salesforce/apex/jobViewController.getJob';
import createRequest from '@salesforce/apex/jobViewController.createRequest';
import createNotification from '@salesforce/apex/jobViewController.createNotification';

export default class JobView extends LightningElement {
    @track job = {
        Id: '', 
        Category__c: '', 
        Description__c: '', 
        ExperienceLevel__c: '', 
        HourlyRate__c: '',  
        Name: '',
        Skills__c: '', 
        Status__c: '',
    }

    @track request = {
        Id: '', 
        DeadLine__c: '',
        FullPayment__c: '',
        Message__c: '',
    }

    @api jobid = '';
    freelancerId = '';

    role = '';
    isCustomer = false;
    isFreelancer = false;

    connectedCallback() {
        console.log( 'VIEWWWWWWWWWWWWWWWWWWWWWWWWWW this.jobid')

        console.log( this.jobid)
        this.getJob();
        this.role = this.searchParams("role");
        this.freelancerId = this.searchParams("userId");
        this.checkRole();
    }

    checkRole(){
        if(this.role === 'Customer') {
            this.isCustomer = true;
        } else if(this.role === 'Freelancer') {
            this.isFreelancer = true;
        }
    }

    async getJob(){
        let job = await getJob({
            jobId:  this.jobid
        }); 

        this.job = job;

    }

    searchParams(name){
        let url_string = window.location.href;
        let url = new URL(url_string);

        return url.searchParams.get(name);
    }

    handleRequest(){
        console.log( 'DeadLine__c: ');
        console.log( this.request.DeadLine__c);
        let deadLine = new Date( this.request.DeadLine__c);
        console.log( deadLine);
        this.createRequest(this.jobid, this.freelancerId, deadLine, this.request.FullPayment__c, this.request.Message__c);
        this.createNotification(this.jobid, this.freelancerId);
    }

    async createRequest(jobId, freelancerId, deadLine, fullPayment, message){
        let request  = await createRequest({
            jobId:  jobId, 
            freelancerId: freelancerId,
            deadLine: deadLine,
            fullPayment: fullPayment,
            message: message
        }); 
    }

    async createNotification(jobId, freelancerId){
        let notification  = await createNotification({
            jobId:  jobId, 
            freelancerId: freelancerId
        }); 
    }
    
    onChange(event) {
        this.request[event.target.name] = event.target.value;
    }



}