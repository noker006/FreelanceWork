import { LightningElement, track, wire } from 'lwc';
import createJob from '@salesforce/apex/CreateJobController.createJob';
import getPickListValues from '@salesforce/apex/JobsTabController.getPicklistValues';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import JOB_OBJECT from '@salesforce/schema/Job__c'; 
import Skills_FIELD from '@salesforce/schema/Job__c.Skills__c';

export default class CreateJob extends LightningElement {
    @track lstOptions = [];
    
    // Get Object Info.
    @wire (getObjectInfo, {objectApiName: JOB_OBJECT})
    jobObjectInfo;
    
    // Get Picklist values.
    @wire(getPicklistValues, {recordTypeId: '$jobObjectInfo.data.defaultRecordTypeId', fieldApiName: Skills_FIELD })
    languages(data, error){
        if(data && data.data && data.data.values){
            data.data.values.forEach( objPicklist => {
                this.lstOptions.push({
                    label: objPicklist.label,
                    value: objPicklist.value
                });
            });
        } else if(error){
            console.log(error);
        }
    };
    
    handleMultyPicklistChange(event) {
        this.lstSelected = event.detail.value;
    }
    
    @track job = {
        Category__c: "",
        Description__c: "",
        Duration__c: "",
        ExperienceLevel__c: "",
        FullPayment__c: "",
        HourlyRate__c: "",
        Name: "",
        Skills__c: ""
    }
    customerId = "";
    
    @track paymentTypeOptions = [ 
        { label: 'FullPayment', value: 'FullPayment' },
        { label: 'HourlyRate', value: 'HourlyRate' },
    ];
    paymentTypeValue = 'FullPayment';
    isHourlyRate = false;
    isFullPayment = true;
    
    @track durationValues = [];
    @track skillsValues = [];
    @track categoryValues = [];
    @track expLevelValues = [];
    @track lstSelected = [];

    connectedCallback() {
        this.customerId = this.searchParams("userId");
        this.getPickListValuesForExp();
        this.getPickListValuesForCategory();
        this.getPickListValuesForSkill();
        this.getPickListValuesForDuration();
    }

    searchParams(name){
        let url_string = window.location.href;
        let url = new URL(url_string);

        return url.searchParams.get(name);
    }

    handleCreateJob(){
        this.createJob(
            this.job.Category__c,
            this.job.Description__c, 
            this.job.Duration__c, 
            this.job.ExperienceLevel__c, 
            this.job.FullPayment__c, 
            this.job.HourlyRate__c,
            this.job.Name,
            this.lstSelected,
            this.customerId
        );
    }

    async getPickListValuesForExp(){
        let statusValues = await getPickListValues({
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
        let statusValues = await getPickListValues({
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
        let statusValues = await getPickListValues({
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

    async getPickListValuesForDuration(){
        let statusValues = await getPickListValues({
             ObjectApi_name: 'Job__c', 
             Field_name: 'Duration__c'
        });
        
        let arrayForComboBox = [];

        statusValues.forEach(function(status) {
            let objForCombobox = { label: status, value: status }

            arrayForComboBox.push(objForCombobox);
        });
        arrayForComboBox.push({label: "none", value: ""});

        this.durationValues = arrayForComboBox;
    }

    async createJob(
        category, 
        description, 
        duration, 
        experienceLevel,
        fullPayment,
        hourlyRate,
        name,
        skills,
        customerId
    ){
        let job = await createJob({
            category: category, 
            description: description, 
            duration: duration, 
            experienceLevel: experienceLevel,
            fullPayment: fullPayment,
            hourlyRate: hourlyRate,
            name: name,
            skills: skills,
            customerId: customerId
        })
    }

    onChangeRadioGroup(event) {
        this.paymentTypeValue = event.target.value;

        if( this.paymentTypeValue === 'FullPayment') {
            this.isFullPayment = true;
            this.isHourlyRate = false;
        } else if(this.paymentTypeValue === 'HourlyRate') {
            this.isHourlyRate = true;
            this.isFullPayment = false;
        }
    }

    onChange(event) {
        this.job[event.target.name] = event.target.value;

        console.log('isvalid ' + this.checkFormValidity());
        if (this.checkFormValidity() == true) {
            let r = this.template.querySelectorAll(".isDisabled");
            r[0].classList.remove("isDisabled");
        } else {
            let r = this.template.querySelectorAll(".footerButton");
            r[0].classList.add("isDisabled");
        }
    }

    checkFormValidity() {
        let regFormInputs = this.template.querySelectorAll(".settingsInput");

        let isValid = true;

        regFormInputs.forEach(function (value) {

            let isTrue = value.checkValidity()
            if (!isTrue) {
                isValid = false;
            }

        });

        return isValid;

    }
}