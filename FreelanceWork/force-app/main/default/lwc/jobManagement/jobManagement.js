import { LightningElement, track } from 'lwc';
import getJob from '@salesforce/apex/JobManagementController.getJob';
import getRequests from '@salesforce/apex/JobManagementController.getRequests';
import getFreelancer from '@salesforce/apex/JobManagementController.getFreelancer';
import changeRequestStatus from '@salesforce/apex/JobManagementController.changeRequestStatus';
import createContract from '@salesforce/apex/JobManagementController.createContract';
import getAllFreelancers from '@salesforce/apex/JobManagementController.getAllFreelancers';
import changeJobStatus from '@salesforce/apex/JobManagementController.changeJobStatus';
import closeJob from '@salesforce/apex/JobManagementController.closeJob';
import createNotificationByScript from '@salesforce/apex/JobManagementController.createNotificationByScript';

//Изменить тип данных для поля ImageUrl на фрилансере и кастомере на тип данных text area long 30000;(просто закомитать весь класс в котором используется это поле и изменить тип данных)
// Добавить возможность убирать фрилансеров из табы  Freelancers отдельно по одному
export default class JobManagement extends LightningElement {

    
    @track job = {
        id: '', 
        Category__c: '', 
        Description__c: '', 
        ExperienceLevel__c: '', 
        HourlyRate__c: '',  
        Name: '',
        Skills__c: '', 
        Status__c: ''
    }
    
    @track freelancer = {
        Id: '', 
        Email__c: '', 
        Name: '', 
        ImageURL__c: '', 
        Username__c: ''
    }
    
    @track requests = [];
    @track freelancers = [];
    
    jobId = '';
    requestId = '';
    freelancerId = '';

    userId = '';
    role = '';

    isWaiting = false;
    isInProcess = false;
    isDone = false;

    connectedCallback() {
        this.jobId = this.searchParams("jobId");
        this.userId = this.searchParams("userId");
        this.role = this.searchParams("role");
        this.getJob();
        this.getRequests();
    }

    async getJob(){
        let job = await getJob({
            jobId:  this.jobId
        }); 

        this.job = job;

        if(job.Status__c === 'Done'){
            this.isDone = true;
            this.getFreelancers(this.jobId, 'Done');
        } 

        if(job.Status__c === 'In process'){
            this.isInProcess = true;
            this.getFreelancers(this.jobId, 'In process');
        }

        if(job.Status__c === 'Waiting'){
            this.isWaiting = true;
            this.getFreelancers(this.jobId, 'Waiting');
        }

    }

    async getRequests(){
        console.log('#################getRequests!'); 
        this.requests = await getRequests({
            jobId:  this.jobId
        }); 
        console.log('%%%%%%%%%%%%%%%%%%%%%%this.requests::');

        console.log( this.requests);
    }

    async addToFreelancers() {
        let freelancer = await getFreelancer({
            freelancerId:  this.freelancerId
        });

        this.freelancers.push(freelancer);
    }

    async getFreelancers(jobId, status){
        let freelancers = await getAllFreelancers({
            jobId:  jobId,
            status: status
        });

        this.freelancers = freelancers;
    }

    handleBack() {
        window.location.href = 'https://freelancework2-developer-edition.ap27.force.com/w2/s/mainpagefw2?userId=' +  this.userId + '&role=' + this.role;
    }

    handleStart(){
       this.changeJobStatus(this.jobId);

       this.isWaiting = false;
       this.isInProcess = true;
    }

    async changeJobStatus(jobId){
        let job  = await changeJobStatus({
            jobId:  jobId
        });

        this.job.Status__c = job.Status__c;
    }

    handleAccept(event) {
        let request = event.detail;
        
        this.deleteRequiredRequest(request);
        this.changeRequestStatus(request.Id, 'Confirmed');

        this.freelancerId = request.Freelancer__r.Id;
        this.addToFreelancers();

        this.createContract( this.freelancerId , this.jobId, request.Id);

        this.createNotification(this.jobId, this.freelancerId, 'Confirmed')
    }

    handleReject(event){
        let request = event.detail;
        this.freelancerId = request.Freelancer__r.Id;

        this.deleteRequiredRequest(request);
        this.changeRequestStatus(request.Id, 'Rejected');

        this.createNotification(this.jobId, this.freelancerId, 'Rejected');
    }

    handleGoodClose() {
        this.closeJob(this.jobId, 'Good');

        this.isDone = true;
        this.isInProcess = false;
    }

    handleBadClose(){
        this.closeJob(this.jobId, 'Bad');

        this.isDone = true;
        this.isInProcess = false;
    }

    async closeJob(jobId, script) {
        let job = await closeJob({
            jobId: jobId,
            script: script
        });

        this.job.Status__c = job.Status__c;
    }

    deleteRequiredRequest(request, status) {
        for (let i = 0; i < this.requests.length; i++) {
            if(this.requests[i].Id === request.Id){
                this.requests.splice(i, 1);
            }
        }
    }

    async changeRequestStatus(requestId, status){
        let value = await changeRequestStatus({
            requestId: requestId, 
            status: status
        });
    }

    async createContract(freelancerId, jobId, requestId){
        console.log('Param from createContract: ');
        console.log(freelancerId);
        console.log(jobId);
        console.log(requestId);

        let contract = await createContract({
            freelancerId: freelancerId,
            jobId: jobId,
            requestId: requestId
        });
    }

    async createNotification(jobId, freelancerId, script){
        let notification  = await createNotificationByScript({
            jobId:  jobId, 
            freelancerId: freelancerId,
            script: script
        }); 
    }

    searchParams(name){
        let url_string = window.location.href;
        let url = new URL(url_string);

        return url.searchParams.get(name);
    }

}