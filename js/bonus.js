/*	This code was created by self-taught programmer Anton Lempiy when he knew nothing about code
	organization. It contains some elements of OOP JavaScript and uses HTML5 canvas features. 
	The most proud thing in this module is 'smart shuffle' function which imitates a real human
	shuffle logics. This program has a lot of misswritings but its one of the aouthors favourite first
	works cause he's done it by himself and 's spend a week to do this. Enjoy! */

var bonus = (function () {
	var canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d'),
	lastTime;

	canvas.width = 600;
	canvas.height = 600;

	var bonusBox = document.getElementById('bonus-box');
	

	var ActiveSlot = function(pos) {
		this.position = pos;
		this.initPosition = pos;
		this.optimize();
	};
	ActiveSlot.prototype.optimize = function() {
		if (this.position == 1 || this.position == 2 || this.position == 3) {
			this.y = 0;
		}
		else if (this.position == 4 || this.position == 5 || this.position == 6) {
			this.y = 200;
		}
		else if (this.position == 7 || this.position == 8 || this.position == 9) {
			this.y = 400;
		};
		if (this.position == 1 || this.position == 4 || this.position == 7) {
			this.x = 0;
		}
		else if (this.position == 2 || this.position == 5 || this.position == 8) {
			this.x = 200;
		}
		else if (this.position == 3 || this.position == 6 || this.position == 9) {
			this.x = 400;
		};
	};

	var MovingImages = function (pos) {
		this.initPosition = pos;
		this.position = pos;
		this.correctPosition = false;
		this.optimize();
		this.speed = 5;
		this.sprite = 'https://i.imgsafe.org/67ef161.jpg';
		this.clicked = false;
	};
		

	MovingImages.prototype.optimize = function() {
	if (this.position == 1 || this.position == 2 || this.position == 3) {
		this.y = 0;
	}
	else if (this.position == 4 || this.position == 5 || this.position == 6) {
		this.y = 200;
	}
	else if (this.position == 7 || this.position == 8 || this.position == 9) {
		this.y = 400;
	};
	if (this.position == 1 || this.position == 4 || this.position == 7) {
		this.x = 0;
	}
	else if (this.position == 2 || this.position == 5 || this.position == 8) {
		this.x = 200;
	}
	else if (this.position == 3 || this.position == 6 || this.position == 9) {
		this.x = 400;
	};
};
	MovingImages.prototype.updateImage = function (dt) {
		if(this.clicked==true) {
			if (activeSlot.y == this.y) {
				if (this.x < activeSlot.x && (activeSlot.x - this.x) <= 200) {
				(this.x += this.speed) * dt;
					if (this.x == activeSlot.x) {
						this.clicked = false;
						activeSlot.x-=200;
					};

				}

				else if (this.x > activeSlot.x && (this.x - activeSlot.x) <= 200) {
				(this.x -= this.speed) * dt;	
					if (this.x == activeSlot.x) {
						this.clicked = false;
						activeSlot.x+=200;
					};
				}
				else {this.clicked=false;};
			};
			if (activeSlot.x == this.x) {
				if (this.y < activeSlot.y && (activeSlot.y - this.y) <= 200) {
				(this.y += this.speed) * dt;
					if (this.y == activeSlot.y) {
						this.clicked = false;
						activeSlot.y-=200;
					};

				}

				else if (this.y > activeSlot.y && (this.y - activeSlot.y) <= 200) {
				(this.y -= this.speed) * dt;	
					if (this.y == activeSlot.y) {
						this.clicked = false;
						activeSlot.y+=200;
					};
				}
				else {this.clicked=false;};
			};
		};
	};

	
	MovingImages.prototype.renderImage = function () {
	var cutX;
	var cutY;
			if(this.initPosition==1||this.initPosition==4||this.initPosition==7) {
				cutX = 0;
			};
			if(this.initPosition==2||this.initPosition==5||this.initPosition==8) {
					cutX = Resources.get(this.sprite).width/3;
			};
			if(this.initPosition==3||this.initPosition==6||this.initPosition==9) {
					cutX = (Resources.get(this.sprite).width/3)*2;
			};
			if(this.initPosition==1||this.initPosition==2||this.initPosition==3) {
				cutY = 0;
			};
			if(this.initPosition==4||this.initPosition==5||this.initPosition==6) {
					cutY = Resources.get(this.sprite).height/3;
			};
			if(this.initPosition==7||this.initPosition==8||this.initPosition==9) {
					cutY = (Resources.get(this.sprite).height/3)*2;

			};
    			ctx.drawImage(Resources.get(this.sprite), cutX, cutY, Resources.get(this.sprite).width/3, Resources.get(this.sprite).height/3, this.x, this.y, 200, 200);
		};
	function eventListnerGame(e){ 
		 	var coorX = e.pageX - canvas.offsetLeft;
		 	var coorY = e.pageY - canvas.offsetTop;
		 	allMovingImages.forEach(function(movingImage) {
	            movingImage.clickHandler(coorX, coorY);
	    });
	};
	MovingImages.prototype.clickHandler = function (coorX, coorY) {
	if (coorX > this.x && coorY > this.y && coorX < this.x + 200 && coorY < this.y + 200) {
			this.movingStart();
		};
	};
	MovingImages.prototype.movingStart = function() {
	if (allowedAction()) {
				if (this.y==activeSlot.y){

					this.clicked = true;
					if (activeSlot.position - this.position == 1) {	
						this.position  = activeSlot.position;
						setTimeout(function() {
							activeSlot.position = activeSlot.position - 1;
							}, 2500 / movingImage.speed - 10)
					};
					if (this.position - activeSlot.position == 1) {
						this.position = activeSlot.position;
						setTimeout(function() {
							activeSlot.position = activeSlot.position + 1;
							}, 2500 / movingImage.speed - 10)
					};
					if (activeSlot.x !== this.x) {

					cancelAnimationFrame(mainReq);
					main();
					};
					
				};
				if (activeSlot.x == this.x) {
					
					this.clicked = true;
					if (activeSlot.position - this.position == 3) {		
						this.position = activeSlot.position;
						setTimeout(function() {
							activeSlot.position = activeSlot.position - 3;
							}, 2500 / movingImage.speed)
					};
					if (this.position - activeSlot.position == 3) {
						this.position = activeSlot.position;
						setTimeout(function() {
							activeSlot.position = activeSlot.position + 3;
							}, 2500 / movingImage.speed)
					};
					if (activeSlot.y !== this.y) {

					window.cancelAnimationFrame(mainReq);
					main();
					};
					
				};			
			};	
	};

	var allMovingImages = [];
	var movingImage = new MovingImages (1);
	allMovingImages.push(movingImage);
	var movingImage2 = new MovingImages (2);
	allMovingImages.push(movingImage2);
	var movingImage3 = new MovingImages (4);
	allMovingImages.push(movingImage3);
	var movingImage4 = new MovingImages (5);
	allMovingImages.push(movingImage4);
	var movingImage5 = new MovingImages (6);
	allMovingImages.push(movingImage5);
	var movingImage6 = new MovingImages (7);
	allMovingImages.push(movingImage6);
	var movingImage7 = new MovingImages (8);
	allMovingImages.push(movingImage7);
	var movingImage8 = new MovingImages (9);
	allMovingImages.push(movingImage8);



var activeSlot = new ActiveSlot(3);



	var activeSlot = new ActiveSlot(3,1);
	function shuffleAllImages() {
	gameStarted=false;
	allMovingImages.forEach(function(movingImage) {
            movingImage.speed = 50;
        });
	var myVar;
    myVar = setInterval(shuffleImage, 150);

	function myStopFunction() {
		
	    clearInterval(myVar);
	    allMovingImages.forEach(function(movingImage) {
	            movingImage.speed = 5;
	    });

	};
	setTimeout(function() {myStopFunction(); tempArray.splice(0, tempArray.length); tempArray = [];
	    tempObj = {}; gameStarted=true;}, 6000)
	};
	var tempArray = [];
	var tempObj = {};
	function shuffleImage() {
		for (movingImage in allMovingImages) {
			if (allMovingImages[movingImage] !== tempObj) {

	            if(allMovingImages[movingImage].y==activeSlot.y && (activeSlot.position - allMovingImages[movingImage].position == 1 || allMovingImages[movingImage].position - activeSlot.position == 1)){
	            	tempArray.push(allMovingImages[movingImage]);
	            };
	            if(allMovingImages[movingImage].x==activeSlot.x && (activeSlot.position - allMovingImages[movingImage].position == 3 || allMovingImages[movingImage].position - activeSlot.position == 3)){
	            	tempArray.push(allMovingImages[movingImage]);
	            };
	        };
	    };
	     shuffle(tempArray);
	     tempObj = tempArray[0];
	     tempObj.movingStart();
	     tempArray.splice(0,tempArray.length);
	};
	function shuffle(array) {
	    var i = array.length,
	        j = 0,
	        temp;

	    while (i--) {

	        j = Math.floor(Math.random() * (i+1));

	        // swap randomly chosen element with current element
	        temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;

	    };

	    return array;
	};

	var mainReq;

	function main() {
		
		var now = Date.now(),
	            dt = (now - lastTime) / 1000.0;
	    //checkPositions();
		updateImages(dt);
	 	render();
		mainReq = window.requestAnimationFrame(main);
		winOrLose();

	};


	function init() {
		lastTime = Date.now();
		bonusBox.appendChild(canvas);
		render();
		shuffleAllImages();
		canvas.addEventListener('click', eventListnerGame, false);

	};
	function updateImages(dt) {

	        allMovingImages.forEach(function(movingImage) {
	            movingImage.updateImage(dt);
	        });
	    };
	function checkWin() {
	var n = 0;
	var win = false;
	for (movingImage in allMovingImages) {
		if (allMovingImages[movingImage].initPosition == allMovingImages[movingImage].position && allMovingImages[movingImage].initPosition == allMovingImages[movingImage].position) {
			n++;
		};
	};
	if (n==allMovingImages.length) {
		win = true;
	};
	return win;
	};
	function winOrLose() {
	if (gameStarted){
	if (checkWin()) {
	  	setTimeout(stopMotionWin,800)
	};
	};
	};
	var stopMotionWin = function() {
	renderWin();
	if (mainReq!== undefined) {
		  window.cancelAnimationFrame(mainReq);
         };
		canvas.removeEventListener('click', eventListnerGame, false);
	  	canvas.addEventListener('click', eventFinishGame, false);
	};
	var eventFinishGame = function(e) {
				init();
				canvas.removeEventListener('click', eventFinishGame, false);
	};
	function renderWin() {
	ctx.font = "34pt Impact";
	  	ctx.textAlign = "center";

	  	ctx.fillStyle = "white";
	  	ctx.fillText('You win!', (canvas.width) / 2, canvas.height / 2);

	  	
	  
	  	ctx.strokeStyle = "black";
	  	ctx.lineWidth = 2;
	  	ctx.strokeText('You win!', (canvas.width) / 2, canvas.height / 2);

	};
	function allowedAction() {
		var allowedAction = true;
		for (movingImage in allMovingImages) {
			if (allMovingImages[movingImage].clicked == true) {
				allowedAction = false;
			};
		};
		return allowedAction;
	};
	function render() {
		ctx.fillStyle='white';
		ctx.fillRect(0,0,600,600);
		
		allMovingImages.forEach(function(movingImage) {
	            movingImage.renderImage();
	    });
	};
	function refresh(){
		allMovingImages.forEach(function(movingImage) {
	            movingImage.position = movingImage.initPosition;
	    });
	    activeSlot.position = activeSlot.initPosition;
	    allMovingImages.forEach(function(movingImage) {
	            movingImage.optimize();
	    });
	    activeSlot.optimize();
	}

	window.ctx = ctx;	
	return {
	    init: init,
	    refresh: refresh
  	}	
})();