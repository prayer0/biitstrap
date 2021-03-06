define(
    [
        'organizator/Organizator/Application',
        'text!/js/Apps/MyApp/view/message-unit-invite.html.njk',
        'text!/js/Apps/MyApp/view/message-unit-accept.html.njk'
    ],
    function(
        Organizator_Application,
        tpl_messageUnitInvite,
        tpl_messageUnitAccept
    ){
        class MyApp extends Organizator_Application {
            constructor(){
                super('MyApp');

                this.eventSource = null;
                this.peer_host = undefined;
                this.peer_port = undefined;
                this.peer_pubkey = undefined;

                this.messageCollectionElement = document.querySelector('.messages .collection');
                this.statusElement = document.querySelector('.status .b');
                this.userPubkeyElement = document.querySelector('.user .b');
                this.peerPubkeyElement = document.querySelector('.peer .b');

                this.user_pubkey = this.userPubkeyElement.innerText;

                this.inviteCollection = Organizator.PersistentDb.addCollection('invite');
                this.listen();
            }

            setPeerPubkey(pubkey){
                this.peer_pubkey = pubkey;
                this.statusElement.innerHTML = 'waiting answer..';
                this.peerPubkeyElement.innerHTML = pubkey;
            }

            listen(){
                var self = this;

                this.eventSource = new EventSource(Organizator.Routing.Generator.generateUrl('listen'));

                this.eventSource.onmessage = function(event) {
                    let response = JSON.parse(event.data);

                    if(typeof response !== 'undefined'){
                        if(response.type == 'invite' && !self.inviteCollection.find({txid: response.txid}).length){
                            self.inviteCollection.insert({
                                txid: response.txid
                            });
                            Organizator.PersistentDb.saveDatabase();

                            if(!self.messageCollectionElement.querySelectorAll('.messageunit').length){
                                self.messageCollectionElement.innerHTML = '';
                            }

                            self.messageCollectionElement.insertAdjacentHTML('afterbegin', Organizator.Nunjucks.renderString(tpl_messageUnitInvite, {
                                mode: 'received',
                                txid: response.txid,
                                recipient_pubkey: Organizator.applications.MyApp.user_pubkey,
                                sender_pubkey: response.from
                            }));

                            setTimeout(function(){
                                if(confirm("Someone with following details invites you to off-chain communication. Do you confirm to share your details?\n" + JSON.stringify(response, null, 4))){
                                    self.accept(response);
                                }
                            }, 200);
                        }

                        if(response.type == 'accept' && !self.inviteCollection.find({txid: response.txid}).length){
                            self.inviteCollection.insert({
                                txid: response.txid
                            });
                            Organizator.PersistentDb.saveDatabase();

                            if(!self.messageCollectionElement.querySelectorAll('.messageunit').length){
                                self.messageCollectionElement.innerHTML = '';
                            }

                            self.messageCollectionElement.insertAdjacentHTML('afterbegin', Organizator.Nunjucks.renderString(tpl_messageUnitAccept, {
                                mode: 'received',
                                txid: response.txid,
                                replyto: response.replyto,
                                recipient_pubkey: Organizator.applications.MyApp.user_pubkey,
                                sender_pubkey: response.from
                            }));

                            self.peer_host = response.ip;
                            self.peer_port = response.port;
                            self.setPeerPubkey(response.from);
                            Organizator.applications.MessageServer.set(response.ip, response.port);
                            Organizator.applications.MessageServer.start();
                        }
                    }
                }
            }

            accept(invite){
                this.setPeerPubkey(invite.from);
                this.peer_host = invite.ip;
                this.peer_port = invite.port;

                let formData = new FormData();
                formData.append('recipient', invite.from);
                formData.append('host', invite.ipt);
                formData.append('port', invite.port);
                formData.append('txid', invite.txid);

                let self = this;

                let xhr = new XMLHttpRequest();
                xhr.open('POST', Organizator.Routing.Generator.generateUrl('accept'));
                xhr.addEventListener('load', function(){
                    self.serverResponse = JSON.parse(this.responseText);

                    if(self.serverResponse.form.isValid){
                        if(!self.messageCollectionElement.querySelectorAll('.messageunit').length){
                            self.messageCollectionElement.innerHTML = '';
                        }

                        self.messageCollectionElement.insertAdjacentHTML('afterbegin', Organizator.Nunjucks.renderString(tpl_messageUnitAccept, {
                            mode: 'sent',
                            txid: invite.txid,
                            replyto: invite.txid,
                            sender_pubkey: Organizator.applications.MyApp.user_pubkey,
                            recipient_pubkey: invite.from
                        }))

                        Organizator.applications.MessageServer.set(invite.ip, invite.port);
                        Organizator.applications.MessageServer.start();
                    }else{
                       console.log('error');
                    }
                });
                xhr.send(formData);
                xhr = undefined;
            }
        }
        
        return MyApp;
    }
);