import { LightningElement, track} from 'lwc';
import getJobs from '@salesforce/apex/MyJobsFreelancerController.getJobs';
import getPicklistValues from '@salesforce/apex/MyJobsFreelancerController.getPicklistValues';

//!!!!!!!!!!!!!!!!Important: Сделать фильтрацию чтобы показывались только Jobы этого фрилансера
//Bug: Если быстро кликать по Search то почемуто показываются первые 4 записи и последние 3 записи а по офсетам пишет что он 11
export default class MyJobsFreelancer extends LightningElement {
    query = ''
    jobs = [];
    offset =  0;
    isFree = true;

    baseQuery = ' SELECT  id, Category__c, Description__c, '
    + 'ExperienceLevel__c, HourlyRate__c, Name, Skills__c, Customer__r.Name, Customer__r.ImageURL__c, Customer__r.Id ' 
    + 'FROM Job__c '
    + 'WHERE (Status__c = \'Done\' OR Status__c = \'In process\') ';

    @track expLevelValues = [];
    @track categoryValues = [];
    @track skillsValues = [];
    @track statusValues = [];

    @track jobsFilters = {
        ExperienceLevel__c: "",
        Category__c: "",
        Skills__c: "",
        Status__c: ""
    }
    
    objForCombobox = {
        label: "",
        value: ""
    }

    connectedCallback() {
        this.getJobsForLoad(this.query, this.offset);
        this.getPickListValuesForExp();
        this.getPickListValuesForCategory();
        this.getPickListValuesForSkill();
        this.getPickListValuesForStatus();
    }

    handleSearch() {
        this.query = this.getQueryWithFilters(
            this.jobsFilters.ExperienceLevel__c, 
            this.jobsFilters.Category__c, 
            this.jobsFilters.Skills__c, 
            this.jobsFilters.Status__c
        );
        console.log('Query from search: ');
        console.log(this.query);

        this.offset = 0;
        this.getJobsForSearch(this.query, this.offset);
    }

    handleClear() {
        this.query = '';

        this.jobsFilters.ExperienceLevel__c = "";
        this.jobsFilters.Category__c = "";
        this.jobsFilters.Skills__c = "";
        this.jobsFilters.Status__c = "";

        this.offset = 0;
        this.getJobsForSearch(this.query, this.offset);
    }
    
    loadData(event) {
        const bottom =  Math.round(event.target.scrollHeight - event.target.scrollTop) == event.target.clientHeight;
        if (bottom && this.isFree) {
            this.isFree = false;
            this.getJobsForLoad(this.query, this.offset);
        }
    }
    
    onChange(event) {
        this.jobsFilters[event.target.name] = event.target.value;
    }

    getQueryWithFilters(expLevel, category, skills, status) {
        let query = this.baseQuery;
        
        if (expLevel !== "") {
            query += 'AND ' + 'ExperienceLevel__c = \'' + expLevel + '\'' + ' ';
        }

        if (category !== "") {
            query += 'AND ' + 'Category__c = \'' + category + '\'' + ' ';
        }

        if (skills !== "") {
            query += 'AND ' + 'Skills__c INCLUDES (\'' + skills + '\')' + ' ';
        }

        if (status !== "") {
            query += 'AND ' + 'Status__c = \'' + status + '\'' + ' ';
        }
        
        query += 'LIMIT 4 ' + 'OFFSET :offset';   
        
        return query;
    }

    async getJobsForSearch(query, offset) {
        let wrappper = await getJobs({
            query: query,
            offset:  offset
        });

        console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWwrappper ForSearch: ');
        console.log(wrappper);

        this.jobs = wrappper.jobs;
        this.offset = wrappper.offset;
    }

    async getJobsForLoad(query, offset) {
        
        let wrappper = await getJobs({
            query: query,
            offset:  offset
        });

        console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWwrappper ForLoad: ');
        console.log(wrappper);

        this.jobs  =  this.jobs.concat( wrappper.jobs);
        this.offset = wrappper.offset;

        this.isFree = true
    }

    async getPickListValuesForExp(){
        let statusValues = await getPicklistValues({
             ObjectApi_name: 'Job__c', 
             Field_name: 'ExperienceLevel__c'
        });
        
        let arrayForComboBox = [];

        statusValues.forEach(function(status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({label: "none", value: ""});
        
        this.expLevelValues = arrayForComboBox;
    }

    async getPickListValuesForCategory(){
        let statusValues = await getPicklistValues({
             ObjectApi_name: 'Job__c', 
             Field_name: 'Category__c'
        });
        
        let arrayForComboBox = [];

        statusValues.forEach(function(status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({label: "none", value: ""});

        this.categoryValues = arrayForComboBox;
    }

    async getPickListValuesForSkill(){
        let statusValues = await getPicklistValues({
             ObjectApi_name: 'Job__c', 
             Field_name: 'Skills__c'
        });
        
        let arrayForComboBox = [];

        statusValues.forEach(function(status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({label: "none", value: ""});

        this.skillsValues = arrayForComboBox;
    }

    async getPickListValuesForStatus(){
        let statusValues = await getPicklistValues({
             ObjectApi_name: 'Job__c', 
             Field_name: 'Status__c'
        });
        
        let arrayForComboBox = [];

        statusValues.forEach(function(status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({label: "none", value: ""});

        this.statusValues = arrayForComboBox;
    }
    
}