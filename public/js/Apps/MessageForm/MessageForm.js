define(
    [
        'organizator/Organizator/Application',
        '/js/Apps/FormStd/FormStd.js',
        'text!/js/Apps/MyApp/view/message-unit-invite.html.njk'
    ],
    function(
        Organizator_Application,
        FormStd,
        tpl_messageUnitInvite
    ){
        class MessageForm extends Organizator_Application {
            constructor(){
                super('MessageForm');

                this.formName = 'messageform';
                this.form = document.querySelector('form[name="' + this.formName + '"]');
                this.field__message = this.form.querySelector('[name="message"]');

                this.bindEvents();
            }

            bindEvents(){
                this.form.addEventListener('submit', this.formSubmitted.bind(this));
            }

            formSubmitted(event){
                event.preventDefault();
                
                let message = this.field__message.value;
                Organizator.applications.MessageServer.send(message);
                this.form.reset();
            }

            onFormSuccess(response){
            }

            unlock(){
                for(let element of this.form.querySelectorAll('textarea, input, button')){
                    element.removeAttribute('disabled');
                }
            }

            lock(){
                for(let element of this.form.querySelectorAll('textarea, input, button')){
                    element.setAttribute('disabled', true);
                }
            }
        }
        
        return MessageForm;
    }
);