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
        class InviteForm extends Organizator_Application {
            constructor(){
                super('InviteForm');

                this.formName = 'inviteform';
                this.form = document.querySelector('form[name="' + this.formName + '"]');
                this.formController = new FormStd(this.form, this.formName, {
                    validationMode: 'onInputChange',
                    isXMLHttpRequest: true,
                    hideBlankFieldErrors: true,
                    onFormSuccess: this.onFormSuccess
                });
            }

            onFormSuccess(response){
                this.form.reset();

                Organizator.applications.MyApp.setPeerPubkey(response.peer_pubkey);
                Organizator.applications.MyApp.messageCollectionElement.innerHTML = Organizator.Nunjucks.renderString(tpl_messageUnitInvite, {
                    mode: 'sent',
                    txid: response.txid,
                    sender_pubkey: Organizator.applications.MyApp.user_pubkey,
                    recipient_pubkey: response.peer_pubkey
                });
            }
        }
        
        return InviteForm;
    }
);