define(
    [
        'organizator/Organizator/Application'
    ],
    function(
        Organizator_Application
    ){
        class MyApp extends Organizator_Application {
            constructor(){
                super('MyApp');

                this.hello();
            }

            hello(){
                let request = {
                    'url': Organizator.Routing.Generator.generateUrl('hello');
                }

                Organizator.Routing.request(request);
            }
        }
        
        return MyApp;
    }
);