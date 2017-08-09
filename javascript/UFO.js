(function(window) {

    //
    function UFO(type, beforeActiveCounter, max_x, max_y) {
        //alert("Estou a inicializar o air plane");
        this.initialize(type, beforeActiveCounter, max_x, max_y);
    }

    var p = UFO.prototype = new Container();


// static properties:
    // air plane types
    UFO.TYPE1 = 1;
    UFO.TYPE1_VEL = 2;

    UFO.TYPE1_IMAGE = new Image();
    UFO.TYPE1_IMAGE.src = "img/ufo/ufo1.png";

    //UFO.TYPE1_HIT = 24;


    UFO.TYPE2 = 2;
    UFO.TYPE2_VEL = 1;

    UFO.TYPE2_IMAGE = new Image();
    UFO.TYPE2_IMAGE.src = "img/ufo/ufo2.png";

    //UFO.TYPE2_HIT = 24;

    // Other static values
    BLINK_TIME = 500;

// public properties:

    p.type; // Air plane type - One of the static values

    p.bitmap; // Image/Icon visible in canvas
    p.routeShape;    // Shape used to draw Air Plain route in canvas
    p.routeColor; // random color to draw path
    p.text;

    p.lastUFOShapeRadius = 0;    // Shape used to draw Air Plain route in canvas
    p.ufoShape;    // Shape used to draw Air Plain route in canvas

    p.positions; // AirLine route course - array of points


    p.hit;		//average radial disparity

    p.vel;		// UFO velocity


    p.isActive = false;         //is it active
    p.isLanding = false;         //it is landing
    p.isAirportRouteTraced = false;         //it is a airport route?!?
    p.isWarning = false;         //is it active

    p.isToDelete = false;         //it is a airport route?!?

    p.beforeActiveCounter;	//Start counter before being active, i.e., used for place on the screen
    p.lastVisibleChangeDate;    // Like beforeActiveCounter, it it used to blink/change visibility of bitmap before being active


    // Boundaries used in addRandomRoute
    p.max_x;		// max X
    p.max_y;		// max Y


    
	
    // constructor:
p.Shape_initialize = p.initialize;	//unique to avoid overiding base class
	
    p.initialize = function(type, beforeActiveCounter, max_x, max_y) {
        this.Shape_initialize(); // super call
  
        //this.activate(size);
        this.type = type;
            
        this.max_x = max_x;
        this.max_y = max_y;

        this.name = name;

        // Build Image
        if(this.type == UFO.TYPE1) {
            this.name = "Nitro";
            this.vel = UFO.TYPE1_VEL;

            this.bitmap = new Bitmap(UFO.TYPE1_IMAGE);

            // Hit depends of air plane icon size.. but since all of them has the same size...
            //this.hit = UFO.TYPE1_HIT; // 48 pixel image icon
            this.hit = this.bitmap.image.width/2|0;
            //this.hit *= 1.1; //pad a bit
            
            this.routeColor = Graphics.getRGB(
                203,
                128,//Math.round(Math.random() * 40),
                70,
                0.2);
            
        } else if(this.type == UFO.TYPE2) {
            this.name = "Turbo";
            this.vel = UFO.TYPE2_VEL;

            this.bitmap = new Bitmap(UFO.TYPE2_IMAGE);

            // Hit depends of air plane icon size.. but since all of them has the same size...
            //this.hit = UFO.TYPE2_HIT; // 48 pixel image icon
            this.hit = this.bitmap.image.width/2|0;
            //this.hit *= 1.1; //pad a bit
            
            this.routeColor = Graphics.getRGB(
                219,
                192,//Math.round(Math.random() * 40),
                113,
                0.2);
        }


        //this.bitmap = new Bitmap(this.bitmapImageRed);
        //this.bitmap.image.src = this.bitmapImageRed;
        this.bitmap.name = name;
        //this.setPosition(0,0);

        //this.bitmap.rotation = 360 * Math.random()|0;
        
        /*this.bitmap.regX = this.bitmap.image.width/2|0;
        this.bitmap.regY = this.bitmap.image.height/2|0;*/
        this.bitmap.regX = this.bitmap.image.width/2|0; // 24
        this.bitmap.regY = this.bitmap.image.height/2|0; // 12

        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale = 1;//Math.random()+0.6;


        // Build Shape used to draw air plane route
        this.routeShape = new Shape();

        this.text = new Text(this.name, "bold 12px Arial", "#FF0000");
        this.text.visible = false;

        // Add Display object to the container
        this.addChild(this.bitmap);
        this.addChild(this.routeShape);
        this.addChild(this.text);

        this.ufoShape = new Shape();
        this.addChild(this.ufoShape);

        // Other initializations
        //this.routeColor = Graphics.getRGB(100,100,100);
        /*var random = Math.random() * 360;
        this.routeColor = Graphics.getHSL(
			random,
			100,//Math.round(Math.random() * 40),
			50,
			1.0);*/

        // Empty array at biginning
        this.positions = new Array();

        this.isActive = false;
        //this.bitmap.alpha = 0.5;
        this.beforeActiveCounter = beforeActiveCounter;
        this.lastVisibleChangeDate = new Date();
        //alert(this.lastVisibleChangeTime);
    }


// public methods:

    /* Mouse Events methods */
    // Must be Game Engine Call it because not all mouseOver events under a bitmap
    // should be process...
    p.mouseOver = function() {
        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale * 1.5;
        this.text.visible = true;
    }
	
    p.mouseOut = function() {
        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale;
        this.text.visible = false;
    }


    p.setPosition = function(x, y) {
        this.bitmap.x = x;
        this.bitmap.y = y;

        this.text.x = x;
        this.text.y = y;
    }

    /* Route methods */
    p.addRoutePoint = function(x, y) {
        this.positions.push(new Point(x, y));
    }

    p.clearRoute = function() {
        this.routeShape.graphics.clear();
        this.positions.length = 0; //= new Array();
    }
    
    p.getLastPositions = function(nLastPoints) {
        var tempArray = new Array();
         
        if(this.positions.length < nLastPoints) {
            return tempArray;
        }
         
        tempArray = this.positions.slice(-nLastPoints);

        return tempArray;
    }
    
    p.addRandomRoute = function() {
        // 1. another way to do the same
        var randomX = Math.round((this.max_x-200) * Math.random());
        var randomY = Math.round((this.max_y-200) * Math.random());
        
        if(randomX < 200) {
            randomX = 200;
        }
        
        if(randomY < 200) {
            randomY = 200;
        }

        // found an intermediate point ...
        // used to draw a more soft route
        x3 = Math.round((this.bitmap.x + randomX) / 2);
        y3 = Math.round((this.bitmap.y + randomY) / 2);

        //alert('New Random Position for the target: (' + target.toString() + ') position. X:' + randomX + ' Y:' + randomY);

        this.addRoutePoint(x3, y3);
        this.addRoutePoint(randomX, randomY);

        this.setAirportRouteTraced(false);
    }

    p.drawRoute = function(startX, startY, endX, endY) {
        // set up our drawing properties:
        //lineGraphics.setStrokeStyle(Math.random()*20+2,"round").beginStroke(color);
        this.routeShape.graphics.setStrokeStyle(10,"round","round").beginStroke(this.routeColor);

        // start the line at the last position:
        this.routeShape.graphics.moveTo(startX,startY);
            
        // draw the line, and close the path:
        this.routeShape.graphics.lineTo(endX,endY);
    }


    //handle what a air plane does to itself every frame
    p.move = function() {
        if( (!this.isActive) && (this.beforeActiveCounter > 0) ) {
            //this.bitmap.visible = !this.bitmap.visible;

            var curTime = new Date();

            if(curTime.getTime() - this.lastVisibleChangeDate.getTime() > BLINK_TIME) {
                this.bitmap.visible = !this.bitmap.visible;
                this.lastVisibleChangeDate = curTime;
            }

            this.beforeActiveCounter--; 
            
            //this.drawUFOCircle(this.hit*2, Graphics.getRGB(0,255,0,1.0));
            this.drawUFOCircle(this.hit*2, this.routeColor,10);
            //this.drawUFOCircle(this.hit*2, Graphics.getRGB(219,192,113,0.4), 10);
            
            return;

        } else if( (! this.isActive) && (! this.isLanding) ) {
            // it is now active
            this.bitmap.visible = true;
            this.bitmap.alpha = 1;
            //this.bitmap.image = this.bitmapImageBlack; //todo
            this.ufoShape.graphics.clear();
            this.isActive = true;
        }

        
        // 1. Add a random route if necessary
        if(this.positions.length <= 0) {
            if(! this.isLanding) {
                this.clearRoute();

                this.addRandomRoute();
                //alert('New Random Position for the target: (' + target.toString() + ') position. X:' + randomX + ' Y:' + randomY);
            } else {
                //alert("Is To Delete")
                this.isToDelete = true;
                return;
            }
        }

        // 2. Move UFO to the next route point
        var i = 0;
        while(i < this.vel) {
            //target.x = nextPosition.x;
            //target.y = nextPosition.y;
            var nextPosition = this.positions.shift();

            if(!nextPosition) {
                break;
            }

    //        var oldX = this.bitmap.x;
    //        var oldY = this.bitmap.y;

            //alert("Old Target x:" + target.x + "Old Target y:" + target.y);
            if(nextPosition.x > this.bitmap.x) {
                this.bitmap.x = this.bitmap.x + 1;
            } else if(nextPosition.x < this.bitmap.x) {
                this.bitmap.x = this.bitmap.x - 1;
            }

            if(nextPosition.y > this.bitmap.y) {
                this.bitmap.y = this.bitmap.y + 1;
            } else if(nextPosition.y < this.bitmap.y) {
                this.bitmap.y = this.bitmap.y - 1;
            }

            // update text position too
            this.setPosition(this.bitmap.x, this.bitmap.y);

            //alert("New Target x:" + target.x + "New Target y:" + target.y);
            if( (this.bitmap.x != nextPosition.x) || (this.bitmap.y != nextPosition.y) ) {
                this.positions.unshift(nextPosition);
            }

            // 3. compute rotation
            //Suppose you're at (a, b) and the object is at (c, d). Then the relative position of the object to you is (x, y) = (c - a, d - b).
            // (x, y) = (c - a, d - b).
            xDiff = nextPosition.x - this.bitmap.x;
            yDiff = nextPosition.y - this.bitmap.y;

            // Another way to this.. but doesn´t work well
            //Then you could use the Math.atan2() function to get the angle in radians.
            /*var theta = Math.atan2(yDiff, xDiff);
            //note that the result is in the range [-π, π]. If you need nonnegative numbers, you have to add
            if (theta < 0) {
                theta += 2 * Math.PI;
            }

            // convert radians to degrees, multiply by 180 / Math.PI.
            var angle = theta * 180 / Math.PI;
            this.bitmap.rotation = angle;*/

            /*var nextRotationValue = 0;

            if(xDiff > 0) {
                nextRotationValue = 90;
            } else if(xDiff < 0) {
                nextRotationValue = 270;
            }

            if(yDiff > 0) {
                if(nextRotationValue == 90) {
                    nextRotationValue = 135; // 90 + 45
                } else if(nextRotationValue == 270) {
                    nextRotationValue = 225; // 270 - 45
                } else { //this.bitmap.rotation == 0
                    nextRotationValue = 180;
                }
            } else if(yDiff < 0) {
                if(nextRotationValue == 90) {
                    nextRotationValue = 45; // 90 + 45
                } else if(nextRotationValue == 270) {
                    nextRotationValuen = 315; // 270 + 45
                } else {
                    nextRotationValue = 0;
                }
            }

            // Ajust rotation by soft moves
            if(nextRotationValue > this.bitmap.rotation) {
                if(nextRotationValue - this.bitmap.rotation < 180) {
                    this.bitmap.rotation = this.bitmap.rotation + 2;
                } else {
                    this.bitmap.rotation = this.bitmap.rotation - 2;
                }

            } else if(nextRotationValue < this.bitmap.rotation) {
                if(this.bitmap.rotation - nextRotationValue < 180) {
                    this.bitmap.rotation = this.bitmap.rotation - 2;
                } else {
                    this.bitmap.rotation = this.bitmap.rotation + 2;
                }
                //this.bitmap.rotation = this.bitmap.rotation - 1;
            }

            if(this.bitmap.rotation < 0) {
                this.bitmap.rotation = this.bitmap.rotation + 360;
            } else if(this.bitmap.rotation > 360) {
                this.bitmap.rotation = this.bitmap.rotation - 360;
            }*/

            i++;
        }
        
        /*if( (!this.isAirportRouteTraced) && (!this.isWarning) ) {
            this.drawUFOCircle(this.hit*2, Graphics.getRGB(255,255,255,1.0));
        }*/
    }
	
    p.hitPoint = function(tX, tY) {
        return this.hitRadius(tX, tY, 0);
    }
	
    p.hitRadius = function(tX, tY, tHit) {
        return hitRadius(this.bitmap.x, this.bitmap.y, this.hit, tX, tY, tHit);
        //early returns speed it up
        /*if(tX - tHit > this.bitmap.x + this.hit) {
            return false;
        }
        if(tX + tHit < this.bitmap.x - this.hit) {
            return false;
        }
        if(tY - tHit > this.bitmap.y + this.hit) {
            return false;
        }
        if(tY + tHit < this.bitmap.y - this.hit) {
            return false;
        }

        //alert((this.hit + tHit) + " > " + (Math.sqrt(Math.pow(Math.abs(this.bitmap.x - tX),2) + Math.pow(Math.abs(this.bitmap.y - tY),2))));
        //now do the circle distance test
        return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.bitmap.x - tX),2) + Math.pow(Math.abs(this.bitmap.y - tY),2));*/
    }


    p.hitRectangle = function(rectangle) {
        return hitRectangle(this.bitmap.x, this.bitmap.y, rectangle);
        /*if( (rectangle.x <= this.bitmap.x) && (this.bitmap.x <= rectangle.x + rectangle.width) &&
            (rectangle.y <= this.bitmap.y) && (this.bitmap.y <= rectangle.y + rectangle.height) ) {

            return true;
        }

        return false;*/
    }

    p.land = function(landingPositions) {
        //alert("Landing positions array is:" + landingPositions);
        this.isActive = false;

        this.ufoShape.graphics.clear();
        this.lastUFOShapeRadius = this.hit;

        this.isLanding = true;
        this.vel = 1;

        this.bitmap.scaleX = this.bitmap.scaleY = this.bitmap.scale = 0.5;
        //this.bitmap.image = this.bitmapImageWhite; // todo

        this.clearRoute();
        for(index in landingPositions) {
            var p = landingPositions[index];
            //alert("Land positions are:" + p.x + "," + p.y);
            this.addRoutePoint(p.x, p.y);
        }
    }

    p.setAirportRouteTraced = function(flag) {
        
        if(this.isAirportRouteTraced != flag) {
            //alert("setAirportRouteTraced: Value-" + flag);
            this.isAirportRouteTraced = flag;

            /*if(this.bitmap.image != this.bitmapImageRed) {
                if(this.isAirportRouteTraced) {
                    //this.bitmap.image = this.bitmapImageGreen; //todo

                } else {
                    //this.bitmap.image = this.bitmapImageBlack; //todo
                }

            }*/
            
            if( (this.isAirportRouteTraced) && (!this.isWarning) ) {
                this.ufoShape.graphics.clear();                
                
            } else if( (!this.isAirportRouteTraced) && (!this.isWarning) ) {
                //this.drawUFOCircle(this.hit*2, Graphics.getRGB(255,255,255,1.0));
            }
            
        }

    }

    p.changeToWarningMode = function(maxRadius) {
        //this.bitmap.image = this.bitmapImageRed; //todo
        this.isWarning = true;
        
        /*this.ufoShape.graphics.clear();
        
        this.lastUFOShapeRadius += 2;
        if(this.lastUFOShapeRadius > maxRadius) {
            this.lastUFOShapeRadius = this.hit;
        }

        this.ufoShape.graphics.setStrokeStyle(1).beginStroke("#FF0000"); //#C0C0C0
	//this.ufoShape.graphics.beginRadialGradientFill(["#FF0","#00F"],[0,1],this.bitmap.x,this.bitmap.y,0,this.bitmap.x,this.bitmap.y,40);
	this.ufoShape.graphics.drawCircle(this.bitmap.x,this.bitmap.y,this.lastUFOShapeRadius);*/
        
        this.drawUFOCircle(this.hit*4, Graphics.getRGB(255,0,0,1.0), 1);
    }

    p.changeToNormalMode = function() {
        this.isWarning = false;
        
        /*if(this.bitmap.image == this.bitmapImageRed) {
            if(this.isLanding || this.isAirportRouteTraced) {
                //this.bitmap.image = this.bitmapImageGreen; //todo
            } else {
                //this.bitmap.image = this.bitmapImageBlack; //todo
            }

            this.ufoShape.graphics.clear();
            this.lastUFOShapeRadius = this.hit;
        }*/
        
        /*if(this.isAirportRouteTraced) {
            this.ufoShape.graphics.clear();                
        } else {
            //this.drawUFOCircle(this.hit*2, Graphics.getRGB(255,255,255,1.0));
        }*/
        
        this.ufoShape.graphics.clear();    
    }
    
    p.explode = function() {
        //this.bitmap.image = this.bitmapImageExplode; //todo
        /*this.ufoShape.graphics.beginFill("#FFFF00");
        this.ufoShape.graphics.drawEllipse(this.bitmap.x, this.bitmap.y, this.bitmap.image.width*2, this.bitmap.image.height+this.hit*4);
        this.ufoShape.graphics.endFill();*/
        this.ufoShape.graphics.clear();
        this.ufoShape.graphics.beginFill("#FFFF00");
        this.ufoShape.graphics.moveTo(this.bitmap.x, this.bitmap.y);
        //draw spaceRock
        var size = this.bitmap.image.width;
        var angle = 0;
        var radius = size;
        while(angle < (Math.PI*2 - .5)) {
                angle += .25+(Math.random()*100)/500;
                radius = size+(size/2*Math.random());
                this.ufoShape.graphics.lineTo(this.bitmap.x+Math.sin(angle)*radius, this.bitmap.y+Math.cos(angle)*radius);
        }

        this.ufoShape.graphics.endFill(); // draw the last line segment back to the start point.
    }
    
    p.drawUFOCircle = function(maxRadius, color, thickness) {
        //this.bitmap.image = this.bitmapImageRed; //todo

        this.ufoShape.graphics.clear();
        
        this.lastUFOShapeRadius += 2;
        if(this.lastUFOShapeRadius > maxRadius) {
            this.lastUFOShapeRadius = this.hit;
        }

        this.ufoShape.graphics.setStrokeStyle(thickness).beginStroke(color); //#C0C0C0 // "#FF0000"
	//this.ufoShape.graphics.beginRadialGradientFill(["#FF0","#00F"],[0,1],this.bitmap.x,this.bitmap.y,0,this.bitmap.x,this.bitmap.y,40);
	this.ufoShape.graphics.drawCircle(this.bitmap.x,this.bitmap.y,this.lastUFOShapeRadius);
    }

    window.UFO = UFO;
}(window));