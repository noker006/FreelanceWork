import { LightningElement } from 'lwc';

export default class HomePage extends LightningElement {
    
    showProfile = false;
    showJobsTab = false;
    showMyJobsFreelancerTab = false;
    showMyJobsCustomerTab = false;
    showJobView = false;
    
    isFreelancer = false;
    isCustomer = false;
    
    userId = '';
    role = '';
    
    jobIdForJobView = '';

    handleLogin(){
        window.location.href = 'https://freelancework2-developer-edition.ap27.force.com/w2/s/loginfw2';
    }

    handleRegister(){
        window.location.href = 'https://freelancework2-developer-edition.ap27.force.com/w2/s/registrationfw2';
    }

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

    handleSelectedcard(event){
        let jobId = event.detail;
        this.jobIdForJobView = jobId;

        console.log('jobId: ');
        console.log(jobId);

        this.closeAllTabs();
        this.showJobView = true;
    }

    closeAllTabs() {
        this.showMyJobsFreelancerTab = false;
        this.showMyJobsCustomerTab = false;
        this.showProfile = false;
        this.showJobsTab = false;
        this.showJobView = false;
    }
    
}