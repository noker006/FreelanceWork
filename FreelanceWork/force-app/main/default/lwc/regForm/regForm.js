import { LightningElement, track } from 'lwc';
import createUser from '@salesforce/apex/RegistrationFormController.createUser';
import Username from '@salesforce/schema/User.Username';

//Добавить врапер и возврашать внем юзерид и роль и передовать через url в параметрах userId и role
// Изменить патерн для юзернэймов(чтобы можно было только английские буквы и цифры)
export default class RegForm extends LightningElement {

    @track user = {
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        role: ""
    }

    async handleRegister() {
        console.log(this.user.email);

        if (this.checkFormValidity() == true) {

            const message = await createUser({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                userName: this.user.userName,
                email: this.user.email,
                password: this.user.password,
                role: this.user.role
            })

            if (message !==  'There is already a user with the same username') {
                console.log('move to page');
                window.location.href = 'https://freelancework2-developer-edition.ap27.force.com/w2/s/mainpagefw2?userId=' + message;

            } else {
                console.log('Message: ' + message);
            }

        }
    }

    value = '';
    get options() {
        return [
            { label: 'Customer', value: 'Customer' },
            { label: 'Freelancer', value: 'Freelancer' },
        ];
    }

    checkFormValidity() {
        let regFormInputs = this.template.querySelectorAll(".regFormInput");

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

    onChange(event) {
        this.user[event.target.name] = event.target.value;

        console.log('isvalid ' + this.checkFormValidity());
        if (this.checkFormValidity() == true) {
            let r = this.template.querySelectorAll(".isDisabled");
            r[0].classList.remove("isDisabled");
        } else {
            let r = this.template.querySelectorAll(".footerButton");
            r[1].classList.add("isDisabled");
        }
    }

    handleBack() {
        window.location.href = 'https://freelancework2-developer-edition.ap27.force.com/w2/s/';
    }

}