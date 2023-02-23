BabylonViewer.vHelper = function () {
	this.viewer=null; //the viewer instance
	let isReady=false; //a sign for init complete
	
	this.init=function (divID) { 
		const that=this; //save the helper instance for later use
		
		//let viewer=BabylonViewer.viewerManager.getViewerById('babylon-viewer')
		BabylonViewer.viewerManager.getViewerPromiseById(divID)
		.then(function (viewer) {
			that.viewer = viewer; //save the viewer instance
			
			viewer.onEngineInitObservable.add(function (engine) { //add an observer for the view eninge init event
				//set the sign for init-complete
				isReady=true;

				//customize the navbar
				let temp = viewer.templateManager.getTemplate('navBar');
				let param= temp._configuration;
				param.params.hideLogo=true;
				param.params.hideVr=false;
				temp.updateParams(param);
			});
		 });
	}
	
	
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
		
	this.loadFromURL=async function (url) {
		//just in case the initialization is slower than the fetch
		while (! isReady) {
			//wait for the viewer to initialize
			await sleep(100);
		}
		this.viewer.loadModel(url)
	}
}