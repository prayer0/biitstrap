define(
    [
        'organizator/Organizator/Application',
        'text!/js/Apps/MyApp/view/message-unit.html.njk',
        'text!/js/Apps/MyApp/view/message-unit-invite.html.njk',
        'text!/js/Apps/MyApp/view/message-unit-accept.html.njk'
    ],
    function(
        Organizator_Application,
        tpl_messageUnit,
        tpl_messageUnitInvite,
        tpl_messageUnitAccept
    ){
        class MessageServer extends Organizator_Application {
            constructor(){
                super('MessageServer');

                this.local_host = '127.0.0.1';
                this.local_port = 8080;
                this.local_server = new WebSocket('ws://' + this.local_host + ':' + this.local_port);
                this.local_server.onmessage = this.onmessage;
                this.local_server.onopen = this.onopen;
                this.local_server.onerror = this.onerror;
                
                this.host = null;
                this.port = null;
                this.server = null;
            }

            set(ip, port){
                Organizator.applications.MessageServer.host = ip;
                Organizator.applications.MessageServer.port = port;
                Organizator.applications.MessageServer.start();
            }

            onmessage(event) {
                let message = event.data;

                let message_html = Organizator.Nunjucks.renderString(tpl_messageUnit, {
                    mode: 'received',
                    sender: Organizator.applications.MyApp.peer_pubkey,
                    recipient: Organizator.applications.MyApp.user_pubkey,
                    message: message
                });
                if(!Organizator.applications.MyApp.messageCollectionElement.querySelectorAll('.messageunit').length){
                    Organizator.applications.MyApp.messageCollectionElement.innerHTML = '';
                }
                Organizator.applications.MyApp.messageCollectionElement.insertAdjacentHTML('afterbegin', message_html);                

            }

            onopen() {
            }

            onerror(error) {
            }

            send(message){
                this.server.send(message);

                let message_html = Organizator.Nunjucks.renderString(tpl_messageUnit, {
                    mode: 'sent',
                    sender: Organizator.applications.MyApp.user_pubkey,
                    recipient: Organizator.applications.MyApp.peer_pubkey,
                    message: message
                });
                if(!Organizator.applications.MyApp.messageCollectionElement.querySelectorAll('.messageunit').length){
                    Organizator.applications.MyApp.messageCollectionElement.innerHTML = '';
                }
                Organizator.applications.MyApp.messageCollectionElement.insertAdjacentHTML('afterbegin', message_html);                
            }

            start(){
                this.server = new WebSocket('ws://' + this.host + ':' + this.port);

                Organizator.applications.MessageForm.unlock();
                Organizator.applications.MyApp.statusElement.innerHTML = 'connected: ' + this.host + ':' + this.port;
                Organizator.applications.InviteForm.form.classList.add('hide');
            }

            stop(){
                Organizator.applications.MyApp.statusElement.innerHTML = 'disconnected: ' + this.host + ':' + this.port;
                Organizator.applications.MessageForm.lock();
                Organizator.applications.InviteForm.form.classList.remove('hide');
            }
        }
        
        return MessageServer;
    }
);