import { LightningElement, track } from 'lwc';
import getJobs from '@salesforce/apex/MyJobsCustomerController.getJobs';
import getPicklistValues from '@salesforce/apex/MyJobsCustomerController.getPicklistValues';

//!!!!!!!!!!!!!!!!!!!!!Important Сделать фильтрацию чтобы показывались только Jobы текущего  Customera 
//Bug: Если быстро кликать по Search то почемуто показываются первые 4 записи и последние 3 записи а по офсетам пишет что он 11
export default class MyJobsCustomer extends LightningElement {
    query = ''
    jobs = [];
    offset = 0;
    isFree = true;

    urlJobManagment = '/jobmanagement'

    baseQuery = ' SELECT  id, Category__c, Description__c, '
        + 'ExperienceLevel__c, HourlyRate__c, Name, Skills__c, Customer__r.Name, Customer__r.ImageURL__c, Customer__r.Id '
        + 'FROM Job__c '
        + 'WHERE (Status__c = \'Done\' OR Status__c = \'In process\' OR Status__c = \'Waiting\') ';

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

    userId = '';
    role = '';

    connectedCallback() {
        this.getJobsForLoad(this.query, this.offset);
        this.userId = this.searchParams("userId");
        this.role = this.searchParams("role");
        this.getPickListValuesForExp();
        this.getPickListValuesForCategory();
        this.getPickListValuesForSkill();
        this.getPickListValuesForStatus();
    }

    searchParams(name){
        let url_string = window.location.href;
        let url = new URL(url_string);

        return url.searchParams.get(name);
    }

    handleJobCard(event) {
        console.log('@@@@@@@@@@@@@@@@@@@@event.target:');
        console.log( event.target.label);
        window.location.href = 'https://freelancework2-developer-edition.ap27.force.com/w2/s/jobmanagement?jobId=' + event.target.label + '&userId=' +  this.userId + '&role=' + this.role;
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
        const bottom = Math.round(event.target.scrollHeight - event.target.scrollTop) == event.target.clientHeight;
        console.log('scrollHeight: ');
        console.log(event.target.scrollHeight);

        console.log('scrollTop: ');
        console.log(event.target.scrollTop);

        console.log('clientHeight: ');
        console.log(event.target.clientHeight);

        console.log(' Math.round(event.target.scrollHeight - event.target.scrollTop) ');
        console.log( Math.round(event.target.scrollHeight - event.target.scrollTop) );

        console.log('ISSSSSSSS loadData');
        console.log('FREEEEEEEEEEEEEEEE' + this.isFree);
        console.log('BBBBBBBBBBBbottom' + bottom);

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
            offset: offset
        });

        console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWwrappper ForSearch: ');
        console.log(wrappper);

        this.jobs = wrappper.jobs;
        this.offset = wrappper.offset;
    }

    async getJobsForLoad(query, offset) {
        console.log('ISSSSSSSS getJobsForLoad');

        let wrappper = await getJobs({
            query: query,
            offset: offset
        });

        console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWwrappper ForLoad: ');
        console.log(wrappper);

        this.jobs = this.jobs.concat(wrappper.jobs);
        this.offset = wrappper.offset;

        this.isFree = true;


    }

    async getPickListValuesForExp() {
        let statusValues = await getPicklistValues({
            ObjectApi_name: 'Job__c',
            Field_name: 'ExperienceLevel__c'
        });

        let arrayForComboBox = [];

        statusValues.forEach(function (status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({ label: "none", value: "" });

        this.expLevelValues = arrayForComboBox;
    }

    async getPickListValuesForCategory() {
        let statusValues = await getPicklistValues({
            ObjectApi_name: 'Job__c',
            Field_name: 'Category__c'
        });

        let arrayForComboBox = [];

        statusValues.forEach(function (status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({ label: "none", value: "" });

        this.categoryValues = arrayForComboBox;
    }

    async getPickListValuesForSkill() {
        let statusValues = await getPicklistValues({
            ObjectApi_name: 'Job__c',
            Field_name: 'Skills__c'
        });

        let arrayForComboBox = [];

        statusValues.forEach(function (status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({ label: "none", value: "" });

        this.skillsValues = arrayForComboBox;
    }

    async getPickListValuesForStatus() {
        let statusValues = await getPicklistValues({
            ObjectApi_name: 'Job__c',
            Field_name: 'Status__c'
        });

        let arrayForComboBox = [];

        statusValues.forEach(function (status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({ label: "none", value: "" });

        this.statusValues = arrayForComboBox;
    }

}