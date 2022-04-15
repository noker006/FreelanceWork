import { LightningElement } from 'lwc';
import getNotifications from '@salesforce/apex/NotificationsTabController.getNotifications';

export default class MainPage extends LightningElement {

    showProfile = false;
    showJobsTab = false;
    showMyJobsFreelancerTab = false;
    showMyJobsCustomerTab = false;
    showJobView = false;
    showCreateJob = false;
    showNotifications = false;
    showCaseForm = false;

    isFreelancer = false;
    isCustomer = false;

    userId = '';
    role = '';

    jobIdForJobView = '';

    numberNotifications = '';

    searchParams(name){
        let url_string = window.location.href;
        let url = new URL(url_string);

        return url.searchParams.get(name);
    }

    renderedCallback() {
        this.userId = this.searchParams("userId");
        this.role = this.searchParams("role");
        console.log('userId AND role from URL: ' +  this.userId +'    ' +  this.role );

        if(this.role === "Freelancer"){
            this.isFreelancer = true;
        } else if(this.role === "Customer") {
            this.isCustomer = true;
        }
    }


    connectedCallback() {
        this.userId = this.searchParams("userId");
       
        this.getNotifications(this.userId);
    }

    handleProfile() {
        this.closeAllTabs();

        this.showProfile = true;
        console.log('this.showProfile');
        console.log(this.showProfile);
    }

    handleJobs() {
        this.closeAllTabs();

        this.showJobsTab = true;
    }
    
    handleMyJobsFreelancer(){
        this.closeAllTabs();
        
        this.showMyJobsFreelancerTab = true;
    }
    
    handleMyJobsCustomer(){
        this.closeAllTabs();
        
        this.showMyJobsCustomerTab = true;
    }
    
    handleCreateJob(){
        this.closeAllTabs();
        
        this.showCreateJob = true;
    }
    
    handleNotifications(){
        this.closeAllTabs();
        
        this.showNotifications = true;
    }

    handleCase() {
        this.closeAllTabs();
        
        this.showCaseForm = true;
    }

    handleSelectedcard(event){
        let jobId = event.detail;
        this.jobIdForJobView = jobId;
        
        console.log('jobId: ');
        console.log(jobId);
        
        this.closeAllTabs();
        this.showJobView = true;
    }
    
    handleNotificationsChanged(event){
        let notifications  = event.detail
        this.numberNotifications = notifications.length;

        console.log( 'this.numberNotifications: ');
        console.log( this.numberNotifications);
    }


    async getNotifications(userId) {
        let notifications = await getNotifications({
            userId:  userId
        }); 

        this.numberNotifications = notifications.length;
    }

    closeAllTabs() {
        this.showMyJobsFreelancerTab = false;
        this.showMyJobsCustomerTab = false;
        this.showProfile = false;
        this.showJobsTab = false;
        this.showJobView = false;
        this.showCreateJob = false;
        this.showNotifications = false;
        this.showCaseForm = false;
    }


}