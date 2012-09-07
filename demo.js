var GPIO = require('./GPIO/');

setInterval(function(){
	var p = GPIO.init(0);
	console.log("init");
	p.high();
	setTimeout(function(){
		p.unexport();
		console.log("unexport");
	},1000)
},2000)