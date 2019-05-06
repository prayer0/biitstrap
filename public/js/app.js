require(
	[
		'organizator/Organizator'
	],
	function(
		Organizator
	){
		require(
			[
			    'route!organizator/Resources/routes',
			    'controller!organizator/Resources/controllers'
			],
			function(
				routes,
				controllers
			){
				require(
					[
						'../Apps/MyApp/MyApp',
						'../Apps/InviteForm/InviteForm',
						'../Apps/MessageForm/MessageForm',
						'../Apps/MessageServer/MessageServer'
					],
					function(
						MyApp,
						InviteForm,
						MessageForm,
						MessageServer
					){
						new MyApp();
						new InviteForm();
						new MessageForm();
						new MessageServer();
					}
				);
			}
		);
	}
);