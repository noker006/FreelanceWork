import { LightningElement, track } from 'lwc';
import createCase from '@salesforce/apex/CaseFormController.createCase';



export default class CaseForm extends LightningElement {

    @track case__c = {
        Title__c: "",
        Text__c: ""
    }

    userId = "";
    role = "";

    connectedCallback() {
        this.userId = this.searchParams("userId");
        this.role = this.searchParams("role");
    }

    searchParams(name){
        let url_string = window.location.href;
        let url = new URL(url_string);

        return url.searchParams.get(name);
    }

    handleCreateCase(){
        if (this.checkFormValidity() == true) {
            this.createCase(
                this.case__c.Title__c, 
                this.case__c.Text__c, 
                this.userId, 
                this.role
            );
        }
    }

    onChange(event) {
        this.case__c[event.target.name] = event.target.value;

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
        let regFormInputs = this.template.querySelectorAll(".formInput");

        let isValid = true;

        regFormInputs.forEach(function (value) {

            let isTrue = value.checkValidity()
            if (!isTrue) {
                isValid = false;
            }

        });

        return isValid;

    }

    async createCase(title, text, userId, role) {
        let case2 = await createCase({
             title: title, 
             text: text,
             userId: userId,
             role: role
       });
    }
}