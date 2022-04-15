import { LightningElement, track , api, wire } from 'lwc';
import getUser from '@salesforce/apex/ProfileController.getUser';
import changeUser from '@salesforce/apex/ProfileController.changeUser';

//Сделать валидация на Change(чтобы она гасла когда у нас не валидные данные)
export default class Profile extends LightningElement {
    @api userid = '';

    @track user = {
        Id : '', 	
        Email__c: '', 
        Name: '', 
        Password__c: '', 
        Username__c: '', 
        CreatedDate: '',
        ImageURL__c: '' 
    }

    renderedCallback() {
        if(this.user.Id == '' || this.user.Id == undefined){
            this.getUser()
        }
    }

    async getUser() {
        this.user = await getUser({
            id: this.userid
        })

        console.log(  'this.user' );
        console.log(  this.user.Id );
        console.log(  this.user);
    }

    async handleChange(){
        console.log(  '!!!111this.user : ' );
        console.log(  this.user );

        if (this.checkFormValidity() == true) {

            let changedUser = await changeUser({
                id: this.userid,
                email: this.user.Email__c,
                name: this.user.Name, 
                password: this.user.Password__c,
                imageURL: this.user.ImageURL__c
            })

            this.user.Name = changedUser.Name;
            this.user.Email__c = changedUser.Email__c;
            this.user.Password__c = changedUser.Password__c;
            this.user.ImageURL__c = changedUser.ImageURL__c;

            console.log(  'this.user' );
            console.log(  this.user );

            console.log(  'changedUser: ' );
            console.log( changedUser );
            
        }
    }

    onChange(event) {
        this.user[event.target.name] = event.target.value;

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

            console.log('VVVV' + value.checkValidity());
            let isTrue = value.checkValidity()
            if (!isTrue) {
                isValid = false;
            }

        });

        return isValid;

    }

}