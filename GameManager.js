// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();


function GameManager(){
	this.updateRate = 60;
	this.updateFunction = undefined;
	this.drawFunction = undefined;
	this.lastFrameTime = Date.now();
	this.lastUpdateTime = Date.now();
	this.currentFPS = 0;
	this.currentUpdSec =0; 
}

GameManager.prototype.animate = function() {
	requestAnimFrame(this.animate.bind(this));
	if(this.drawFunction != undefined){
		//FPS computing
		var t = Date.now();
		var delta = t - this.lastFrameTime;
		this.lastFrameTime = t;
		this.currentFPS = Math.round(1/(delta/1000));	
		this.drawFunction();
	}
}

GameManager.prototype.update = function() {
	if(this.updateFunction != undefined){
		this.updateFunction();
	}
	var t = Date.now();
	var delta = t - this.lastUpdateTime;
	this.lastUpdateTime = t;
	this.currentUpdSec = Math.round(1/(delta/1000));
	setTimeout(this.update.bind(this),1000/this.updateRate);
}

GameManager.prototype.setDrawFunction = function(func){
	this.drawFunction = func;
	
}

GameManager.prototype.setUpdateFunction = function(func){
	this.updateFunction = func;
}

GameManager.prototype.init = function(){
	this.lastFrameTime = Date.now()
	this.lastUpdateTime = Date.now()
	this.animate();
	this.update();
}