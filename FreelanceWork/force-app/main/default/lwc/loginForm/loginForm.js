import { LightningElement, wire, track } from 'lwc';
import checkUser from '@salesforce/apex/LoginFormController.checkUser';

// Заменить имейл поле на  userName поле
//Исправить баг в логин форме(когда выбираешь Freelancer "choose your role" кнопка логин гаснет, 
//но пр этом отрабатывет Apex метод, выбираю Customera кнопка становиться активной)
export default class LoginForm extends LightningElement {

    message = "";

    @track user = {
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        role: ""
    }

    @track wrapper = {
        userId: "",
        role: ""
    }

    async handleLogin() {
        console.log(this.user.email);

        if (this.checkFormValidity() == true) {

            const wrapper = await checkUser({
                email: this.user.email,
                password: this.user.password,
                role: this.user.role
            })

            if (wrapper.userId !==  'User not found') {
                console.log('move to page');
                window.location.href = 'https://freelancework2-developer-edition.ap27.force.com/w2/s/mainpagefw2?userId=' + wrapper.userId + '&role=' +  wrapper.role;

            } else {
                console.log('Message: ' + wrapper.userId);
                this.message = wrapper.userId;
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

            let isTrue = value.checkValidity()
            if (!isTrue) {
                isValid = false;
            }

        });

        return isValid;

    }

    onChange(event) {
        this.user[event.target.name] = event.target.value;

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