/* Main variables */
var canvas;
var context;
            
var audio;
var audio_playing = true;
            
var audio_alarm;
var audio_explosion;
var audio_effects_enabled = true;

/* Stage variable */
var stage;

/* Variables under control off Mouse Events */
// these are common to all elements
// Multi touch not supported!
var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation

var startPt;	// Line draw start position


/* Targets/Air Planes associated structures */
// Key: DisplayObject.id - Value: DisplayObject
var mapIdDisplayObject = new Object();     // Display Objects array/map
            
var UFO1_AIRPORT; // Airport location in the map
//var UFO1_AIRPORT_BITMAP; // Airport location in the map
var UFO1_AIRPORT_PLANET_SHAPE; // Draw Airport location
var UFO1_AIRPORT_ARROW_SHAPE; // Draw Airport arrow shapes around location
var UFO1_AIRPORT_ROUTE = []; // Route on landing
            
var UFO2_AIRPORT; // Airport location in the map
//var UFO2_AIRPORT_BITMAP; // Airport location in the map
var UFO2_AIRPORT_PLANET_SHAPE; // Draw Airport location
var UFO2_AIRPORT_ARROW_SHAPE; // Draw Airport arrow shapes around location
var UFO2_AIRPORT_ROUTE = []; // Route on landing
            

var TICKS_BEFORE_ACTIVE_START_COUNTER = 100;


var INCREASE_DIFICULTY_DELAY_TIME = 45000; // each 5s
var CREATE_UFO_DELAY_TIME = 7000; // each 5s
var last_increase_dificulty_time;
var last_create_airplanes_delay_time = CREATE_UFO_DELAY_TIME; // DIFICULTY
var last_airplane_created = new Date(); // date
var last_nr_airplane_created;
var factor;
            
var isDead = true;
var score = 0;            // Final Score           
var messageField1;		//Message display field
var messageField2;		//Message display field
var messageField3;		//Message display field
var messageContainer;             // Message container
var scoreField;			//score Field
var scoreFieldValue;			//score Field



/* Used to draw GUI */
var STARS_NUMBER = 100;
var stars = [];
//var cloudsShape;
            
/*var isToBlink = false;*/
var lastTrackBlinkDate = new Date();
            
BLINK_TIME = 300;

// Web/Local storage
LOCAL_STORAGE_KEY = "ufocontrol.max_score";

// COntrol Shapes
var playShape;
var pauseShape;
var forwardShape;
var rewindShape;

function init() {
    // create stage and point it to the canvas:
    canvas = document.getElementById("game_canvas");
    
    // grab canvas width and height for later calculations:
    //var width = canvas.width;
    //var height = canvas.height;
    canvas.width = window.innerWidth-(window.innerWidth*0.02);
    canvas.height = window.innerHeight-(window.innerHeight*0.02);
    /*canvas.width = 1920-(1920*0.02);
    canvas.height = 1080-(1080*0.02);*/
    //alert("Canvas Dimenstion=" + canvas.width + "x" + canvas.height)
   
    // audio files
    audio = document.getElementById("music");
    audio_alarm = document.getElementById("alarm");
    audio_explosion = document.getElementById("explosion");

    context = canvas.getContext('2d');

    // grab canvas width and height for later calculations:
    //var width = canvas.width;
    //var height = canvas.height;

    stage = new Stage(canvas);
    //ensure stage is blank
    //stage.clear();
    //stage.autoClear = false;
    stage.mouseEnabled = true;

    stage.enableMouseOver(50);

    // attach mouse handlers directly to the source canvas:
    canvas.onmousemove = onMouseMove;
    canvas.onmousedown = onMouseDown;
    canvas.onmouseup = onMouseUp;


    // Add Touch Support
    // http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true); 


    //alert(canvas.width);
    if(canvas.width > 1024) {
        scoreField = new Text("Total UFO Landed: ", "Italic 34px Sans-Serif", "#FF0000");
    } else {
        scoreField = new Text("Total UFO Landed: ", "Italic 20px Sans-Serif", "#FF0000");
    }
    scoreField.textAlign = "right";
    //scoreField.textBaseline = "hanging";
    scoreField.x = canvas.width - 40;
    scoreField.y = 42;
    
    if(canvas.width > 1024) {
        scoreFieldValue = new Text("0", "bold 34px Sans-Serif", "#00FF00");
    } else {
        scoreFieldValue = new Text("0", "bold 20px Sans-Serif", "#00FF00");
    }
    
    scoreFieldValue.textAlign = "right";
    scoreFieldValue.x = canvas.width - 20;
    scoreFieldValue.y = 42;

    if(canvas.width > 800) {
        messageField1 = new Text("Welcome to the UFO Control Game!!", "bold 34px Arial", "#919191");
    } else {
        messageField1 = new Text("Welcome to the UFO Control Game!!", "bold 34px Arial", "#919191");
    }
    
    messageField1.textAlign = "center";  
                
    messageField2 = new Text("Avoid Space Rocks and lead all the \n\n\
        Unidentified Flying Object (UFO) to his planet!", "bold 20px Arial", "#919191");
    messageField2.textAlign = "center";
    
    var currentMaxScore = localStorage.getItem(LOCAL_STORAGE_KEY);    
    if(!currentMaxScore ) { 
        currentMaxScore = 0;
    } else {
        messageField2.text = "Your Current Max Score is: " + currentMaxScore;
    }           
    /*messageField3 = new Text("Are you ready?!? Click to start...", "bold 18px Arial", "#FF0000");
    messageField3.textAlign = "center";*/

    watchStart();
}


function watchStart() { 
    //alert("watchStart");
    
    // 1. Show Message Container
    messageContainer = new Container();

    //messageField1.x = canvas.width / 2;
    messageField1.x = canvas.width / 2;
    messageField1.y = canvas.height / 2 - canvas.height / 4 + (canvas.height / 6);
    messageField1.outline = true;
    /*messageField1.lineHeight = 3;
    messageField1.lineWidth = 3;
    messageField1.maxWidth = 3;*/
    
    //messageField1.alpha = 0.5;
    messageContainer.addChild(messageField1);
    
    //messageField2.x = canvas.width / 2;
    messageField2.x = canvas.width / 2;
    messageField2.y = canvas.height / 2;
    messageField2.textBaseline = "hanging";
    //messageField2.alpha = 0.5;
    messageContainer.addChild(messageField2);
    
    //messageField3.x = canvas.width / 2;
    /*messageField3.x = canvas.width / 2;
    messageField3.y = canvas.height / 2 + canvas.height / 4 - (canvas.height / 6);
    messageField3.textBaseline = "ideographic";
    messageContainer.addChild(messageField3);*/
    
    // Draw Message Box
    var messageBox = new Shape();   
    messageBox.graphics.setStrokeStyle(50,"round","round").beginStroke(Graphics.getRGB(91,91,91,0.5)); // 223,250,255,1 // 0,250,250
    messageBox.graphics.rect(canvas.width / 2 - canvas.width / 4,canvas.height / 2 - canvas.height / 4, 
        canvas.width / 2, canvas.height / 2);
    messageBox.graphics.endStroke();
    //messageBox.alpha = 0.5;
 
    var crossShape = new Shape();
    crossShape.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,255,255,1));
    crossShape.graphics.drawCircle(canvas.width - canvas.width / 4 - 5, canvas.height / 4 + 5, 25);
    crossShape.graphics.moveTo(canvas.width - canvas.width / 4 - 15, canvas.height / 4 - 10);
    crossShape.graphics.lineTo(canvas.width - canvas.width / 4 + 5, canvas.height / 4 + 20);   
    crossShape.graphics.moveTo(canvas.width - canvas.width / 4 + 5, canvas.height / 4 - 10);
    crossShape.graphics.lineTo(canvas.width - canvas.width / 4 - 15, canvas.height / 4 + 20); 
    crossShape.graphics.endStroke();

    messageContainer.addChild(messageBox);
    messageContainer.addChild(crossShape);   
    
    messageContainer.visible = true;
    stage.addChild(messageContainer);
    
    
    // 2. Show Message Container
    playShape = new Shape();     
    playShape.graphics.beginFill("#dfeeff");
    playShape.graphics.moveTo(canvas.width / 2 - 40 , canvas.height - 35);
    playShape.graphics.lineTo(canvas.width / 2 - 40 , canvas.height - 15);
    playShape.graphics.lineTo(canvas.width / 2 - 15 , canvas.height - 25);
    playShape.graphics.lineTo(canvas.width / 2 - 40 , canvas.height - 35);
    playShape.graphics.endFill(); 
    //playShape.x = canvas.width / 2 - 20;
    //playShape.y = canvas.height - 35;
    playShape.visible = false;
    playShape.mouseEnabled = true;
    playShape.onClick = PlayButtonHandler;
    playShape.onMouseOver = cursor_pointer;
    playShape.onMouseOut = cursor_clear;
    
    //image = new Image();
    //image.src = "img/controls/pause.jpg";
    //pauseShape = new Bitmap(image);
    pauseShape = new Shape();     
    pauseShape.graphics.beginFill("#dfeeff");
    pauseShape.graphics.rect(canvas.width / 2 - 40 , canvas.height - 35 , 10 , 20);
    pauseShape.graphics.rect(canvas.width / 2 - 25 , canvas.height - 35 , 10 , 20);
    pauseShape.graphics.endFill();    
    /*pauseShape.x = canvas.width / 2 - 20;
    pauseShape.y = canvas.height - 35;*/
    pauseShape.mouseEnabled = true;
    pauseShape.onClick = PlayButtonHandler;
    pauseShape.onMouseOver = cursor_pointer;
    pauseShape.onMouseOut = cursor_clear;
    
    forwardShape = new Shape();     
    forwardShape.graphics.beginFill("#dfeeff");
    forwardShape.graphics.moveTo(canvas.width / 2 + 15 , canvas.height - 35);
    forwardShape.graphics.lineTo(canvas.width / 2 + 15 , canvas.height - 15);
    forwardShape.graphics.lineTo(canvas.width / 2 + 20 , canvas.height - 25);
    forwardShape.graphics.lineTo(canvas.width / 2 + 15 , canvas.height - 35);
    // 2nd triangle
    forwardShape.graphics.moveTo(canvas.width / 2 + 25 , canvas.height - 35);
    forwardShape.graphics.lineTo(canvas.width / 2 + 25 , canvas.height - 15);
    forwardShape.graphics.lineTo(canvas.width / 2 + 30 , canvas.height - 25);
    forwardShape.graphics.lineTo(canvas.width / 2 + 25 , canvas.height - 35);
    forwardShape.graphics.endFill();         
    //forwardShape.x = canvas.width / 2 + 20;
    //forwardShape.y = canvas.height - 35;
    forwardShape.mouseEnabled = true;
    forwardShape.onClick = ChangeSpeedButtonHandler;
    forwardShape.onMouseOver = cursor_pointer;
    forwardShape.onMouseOut = cursor_clear;

    rewindShape = new Shape();     
    rewindShape.graphics.beginFill("#dfeeff");
    rewindShape.graphics.moveTo(canvas.width / 2 + 20 , canvas.height - 35);
    rewindShape.graphics.lineTo(canvas.width / 2 + 20 , canvas.height - 15);
    rewindShape.graphics.lineTo(canvas.width / 2 + 15 , canvas.height - 25);
    rewindShape.graphics.lineTo(canvas.width / 2 + 20 , canvas.height - 35);
    // 2nd triangle
    rewindShape.graphics.moveTo(canvas.width / 2 + 30 , canvas.height - 35);
    rewindShape.graphics.lineTo(canvas.width / 2 + 30 , canvas.height - 15);
    rewindShape.graphics.lineTo(canvas.width / 2 + 25 , canvas.height - 25);
    rewindShape.graphics.lineTo(canvas.width / 2 + 30 , canvas.height - 35);
    rewindShape.graphics.endFill();          
    //rewindShape.x = canvas.width / 2 + 20;
    //rewindShape.y = canvas.height - 35;
    rewindShape.visible = false;
    rewindShape.mouseEnabled = true;
    rewindShape.onClick = ChangeSpeedButtonHandler;
    rewindShape.onMouseOver = cursor_pointer;
    rewindShape.onMouseOut = cursor_clear;

    stage.addChild(playShape);
    stage.addChild(pauseShape);
    stage.addChild(forwardShape);
    stage.addChild(rewindShape);
    
    
    // 3. Show Score fields
    scoreField.alpha = 0.5;
    stage.addChild(scoreField);
    
    scoreFieldValue.alpha = 0.5;
    scoreFieldValue.text = (score).toString();
    stage.addChild(scoreFieldValue);
    
    
    DrawScenario();
    
    
    // add some ufo objects
    var obj = addUFO(0);
    obj.bitmap.alpha = 0.5;
    obj = addUFO(0);
    obj.bitmap.alpha = 0.5;
    obj = addUFO(0);
    obj.bitmap.alpha = 0.5;
       
    // add rocks 
                
    /*alert("Airport1 coordenates:"+UFO1_AIRPORT.x+","+UFO1_AIRPORT.y+","+UFO1_AIRPORT.radius);
    alert("Hit Radius result=" + hitRadius(1265, 540, UFO.TYPE1_HIT, UFO1_AIRPORT.x, UFO1_AIRPORT.y, UFO1_AIRPORT.radius));
    var ufo = addUFO(0);
    ufo.setPosition(1265, 540);
    alert("UFO hit Planet?!?:" + ufo.hitRadius(UFO1_AIRPORT.x, UFO1_AIRPORT.y, UFO1_AIRPORT.radius));*/
    
    stage.update(); 	//update the stage to show text
    
    // Play Audio
    /*if(audio_playing) {
                    audio.play();
                }*/

    //watch for clicks
    //canvas.onclick = handleClick;
    canvas.onclick = PlayButtonHandler;
    
    //start game timer
    // assign a tick listener directly to this window:
    //Ticker.setInterval(75); // Default is 50...
    //Ticker.setFPS(10);
    Ticker.addListener(window);
}

function DrawScenario() {
    // Scenario Container
    var scenarioContainer = new Container();
    
    // 1. Draw Some Starts
    DrawStars(scenarioContainer);
    
    // 2. Draw Sun
    DrawSun(scenarioContainer);
    
    // 3. Draw planets and initialize some variables    
    //UFO1_AIRPORT = new Circle(Math.round(canvas.width - canvas.width / 6), Math.round(canvas.height / 2 + 20), 50); // Airport location in the map
    
    // PLANET SHAPE
    /*UFO1_AIRPORT_PLANET_SHAPE = new Shape();    
    //scenarioShape.graphics.setStrokeStyle(5,"round","round").beginStroke(Graphics.getRGB(255,255,255,1));
    UFO1_AIRPORT_PLANET_SHAPE.graphics.beginRadialGradientFill(["#5500FF","#FF0055"], [0.5, 1], UFO1_AIRPORT.x, UFO1_AIRPORT.y, 15, UFO1_AIRPORT.x, UFO1_AIRPORT.y + 20, UFO1_AIRPORT.radius);
    UFO1_AIRPORT_PLANET_SHAPE.graphics.drawCircle(UFO1_AIRPORT.x, UFO1_AIRPORT.y, UFO1_AIRPORT.radius);
    UFO1_AIRPORT_PLANET_SHAPE.graphics.endFill();*/ 
    
    var planetImage = new Image();
    planetImage.src = "img/planets/mars.png";
    UFO1_AIRPORT_PLANET_SHAPE = new Bitmap(planetImage);
    if(canvas.width > 1366) {
        UFO1_AIRPORT = new Circle(Math.round(canvas.width - canvas.width / 6), Math.round(canvas.height / 2 + 20), 75); // Airport location in the map
        UFO1_AIRPORT_PLANET_SHAPE.scaleX = UFO1_AIRPORT_PLANET_SHAPE.scaleY = 1.5;
        
    } else if(canvas.width > 1024) {
        UFO1_AIRPORT = new Circle(Math.round(canvas.width - canvas.width / 6), Math.round(canvas.height / 2 + 20), 50); // Airport location in the map
    
    } else {
        UFO1_AIRPORT = new Circle(Math.round(canvas.width - canvas.width / 6), Math.round(canvas.height / 2 + 20), 25); // Airport location in the map
        UFO1_AIRPORT_PLANET_SHAPE.scaleX = UFO1_AIRPORT_PLANET_SHAPE.scaleY = 0.5;
    }
    
    UFO1_AIRPORT_PLANET_SHAPE.name = "Mars";
    UFO1_AIRPORT_PLANET_SHAPE.x = UFO1_AIRPORT.x-UFO1_AIRPORT.radius;
    UFO1_AIRPORT_PLANET_SHAPE.y = UFO1_AIRPORT.y-UFO1_AIRPORT.radius;
    //scenarioShape.graphics.endStroke();    
    UFO1_AIRPORT_PLANET_SHAPE.alpha = 0.5;
    
    // ARROWS SHAPE
    UFO1_AIRPORT_ARROW_SHAPE = new Shape(); 
    var tempRectangle = new Rectangle(UFO1_AIRPORT.x-UFO1_AIRPORT.radius, UFO1_AIRPORT.y-UFO1_AIRPORT.radius, UFO1_AIRPORT.radius*2, UFO1_AIRPORT.radius*2);
    UFO1_AIRPORT_ARROW_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    drawArrowsAroundRectangle(UFO1_AIRPORT_ARROW_SHAPE.graphics, tempRectangle, false);
    UFO1_AIRPORT_ARROW_SHAPE.graphics.endStroke();
    
    UFO1_AIRPORT_ARROW_SHAPE.visible = false;
    
    UFO1_AIRPORT_ROUTE.length = 0;
    UFO1_AIRPORT_ROUTE.push(new Point(UFO1_AIRPORT.x, UFO1_AIRPORT.y));
    
    
    //UFO2_AIRPORT = new Circle(Math.round(canvas.width / 6), Math.round(canvas.height / 2 - 20), 50); // Airport location in the map
    
    /*UFO2_AIRPORT_PLANET_SHAPE = new Shape();
    UFO2_AIRPORT_PLANET_SHAPE.graphics.beginRadialGradientFill(["#F00","#00F"], [0.2, 0.8], UFO2_AIRPORT.x, UFO2_AIRPORT.y, 0, UFO2_AIRPORT.x, UFO2_AIRPORT.y, UFO2_AIRPORT.radius);
    UFO2_AIRPORT_PLANET_SHAPE.graphics.drawCircle(UFO2_AIRPORT.x, UFO2_AIRPORT.y, UFO2_AIRPORT.radius);
    UFO2_AIRPORT_PLANET_SHAPE.graphics.endFill();
    UFO2_AIRPORT_PLANET_SHAPE.alpha = 0.5;*/
    
    planetImage = new Image();
    planetImage.src = "img/planets/venus.png";
    UFO2_AIRPORT_PLANET_SHAPE = new Bitmap(planetImage);
    if(canvas.width > 1366) {
        UFO2_AIRPORT = new Circle(Math.round(canvas.width / 6), Math.round(canvas.height / 2 - 20), 75); // Airport location in the map
        UFO2_AIRPORT_PLANET_SHAPE.scaleX = UFO2_AIRPORT_PLANET_SHAPE.scaleY = 1.5;
        
    } else if(canvas.width > 1024) {
        UFO2_AIRPORT = new Circle(Math.round(canvas.width / 6), Math.round(canvas.height / 2 - 20), 50); // Airport location in the map
    
    } else {
        UFO2_AIRPORT = new Circle(Math.round(canvas.width / 6), Math.round(canvas.height / 2 - 20), 25); // Airport location in the map
        UFO2_AIRPORT_PLANET_SHAPE.scaleX = UFO2_AIRPORT_PLANET_SHAPE.scaleY = 0.5;
    }
    
    UFO2_AIRPORT_PLANET_SHAPE.name = "Venus";
    UFO2_AIRPORT_PLANET_SHAPE.x = UFO2_AIRPORT.x-UFO2_AIRPORT.radius;
    UFO2_AIRPORT_PLANET_SHAPE.y = UFO2_AIRPORT.y-UFO2_AIRPORT.radius;  
    UFO2_AIRPORT_PLANET_SHAPE.alpha = 0.5;
    
    
    UFO2_AIRPORT_ARROW_SHAPE = new Shape();    
    tempRectangle = tempRectangle = new Rectangle(UFO2_AIRPORT.x-UFO2_AIRPORT.radius, UFO2_AIRPORT.y-UFO2_AIRPORT.radius, UFO2_AIRPORT.radius*2, UFO2_AIRPORT.radius*2);
    UFO2_AIRPORT_ARROW_SHAPE.graphics.setStrokeStyle(3,"round","round").beginStroke(Graphics.getRGB(255,0,0,1));
    drawArrowsAroundRectangle(UFO2_AIRPORT_ARROW_SHAPE.graphics, tempRectangle, false);
    UFO2_AIRPORT_ARROW_SHAPE.graphics.endStroke();
    UFO2_AIRPORT_ARROW_SHAPE.visible = false;
    
    UFO2_AIRPORT_ROUTE.length = 0;
    UFO2_AIRPORT_ROUTE.push(new Point(UFO2_AIRPORT.x, UFO2_AIRPORT.y));
    
    
    scenarioContainer.addChild(UFO1_AIRPORT_PLANET_SHAPE);
    scenarioContainer.addChild(UFO1_AIRPORT_ARROW_SHAPE);    
    scenarioContainer.addChild(UFO2_AIRPORT_PLANET_SHAPE);
    scenarioContainer.addChild(UFO2_AIRPORT_ARROW_SHAPE);
    
    stage.addChild(scenarioContainer);
}

function DrawStars(container) {  
    for (var i = 0; i < STARS_NUMBER; i++) {
        var starShape = new Shape();
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        
        // Get random positions for stars.
        // Make the stars white
        starShape.graphics.beginFill("#FFFFFF");

        // Give the ship some room.
        if (x < 30 || y < 30) {
            starShape.graphics.beginFill("#000000");
        }

        // Draw an individual star.
        //starShape.graphics.beginPath();
        starShape.graphics.drawPolyStar(x, y, 4, 5, 0.6, -90);
        //starShape.graphics.arc(x, y, 3, 0, Math.PI * 2, true);
        //starShape.graphics.closePath();
        starShape.graphics.endFill();
        
        /*var radius = Math.random() * 20 + 5;        
        
        //starShape.graphics.beginFill("#FF0").drawPolyStar(x, y, radius, 5, 0.6, -90);
        starShape.graphics.beginFill("#FFFFFF").drawPolyStar(x, y, radius, 5, 0.6, -90);
        starShape.graphics.endFill();*/
        
        starShape.alpha = 0.4;
       
        stars.push(starShape);
        container.addChild(starShape); 
    }

    //makeShip(container);
    //drawAsteroids(container);
}

function BlinkSomeStars() {
    /*for (var i = 0; i < Math.floor(STARS_NUMBER/2); i++) {
        var index = Math.floor(Math.random() * STARS_NUMBER);
        stars[index].visible = !stars[index].visible;
    }*/
    for (var i = 0; i < Math.floor(STARS_NUMBER/5); i++) {
        var index = Math.floor(Math.random() * STARS_NUMBER);
        stars[index].alpha = Math.random() / 2;
    }
}

function drawAsteroids(container) {
    // Draw asteroids.
    for (i = 0; i <= 20; i++) {
        var astShape = new Shape();
        
        // Get random positions for asteroids.
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);

        // Make the asteroids red
        //ctx.fillStyle = "#FF0000";
        astShape.graphics.beginFill("#FF0000");

        // Keep the asteroids far enough away from
        // the beginning or end.
        if (x > 40 && y > 40 && x < canvas.width-30 && y < canvas.height-30) {

        // Draw an individual asteroid.
        //ctx.beginPath();
        astShape.graphics.arc(x, y, 10, 0, Math.PI * 2, true);
        //ctx.closePath();
        //ctx.fill();
        astShape.graphics.endFill();
        } else--i;
    }

    // Draw blue base.
    //ctx.fillStyle = "#0000FF";
    //ctx.beginPath();
    astShape.graphics.beginFill("#0000FF");
    astShape.graphics.rect(canvas.width-30, canvas.height-30, 30, 30);
    //ctx.closePath();
    //ctx.fill();
    astShape.graphics.endFill();
    
    container.addChild(astShape); 
}
      
function DrawSun(container) {
    /*var sunShape = new Shape();
    //white color with transparency in rgba
    sunShape.graphics.beginFill(Graphics.getRGB(255,215,0,1.0));

    sunShape.graphics.arc(100, 100, 50, 0, Math.PI * 2, true);
    sunShape.graphics.moveTo(100,100);

    for (var i = 0; i < 10; i++) {
        sunShape.graphics.bezierCurveTo(75,37,70,25,50,25);
        sunShape.graphics.bezierCurveTo(20,25,20,62.5,20,62.5);
        sunShape.graphics.bezierCurveTo(20,80,40,102,75,120);
        sunShape.graphics.bezierCurveTo(110,102,130,80,130,62.5);
        sunShape.graphics.bezierCurveTo(130,62.5,130,25,100,25);
        sunShape.graphics.bezierCurveTo(85,25,75,37,75,40); 
    }

    sunShape.graphics.endFill();
    
    container.addChild(sunShape);*/        
}

function handleClick() {
    //prevent extra clicks and hide text
    canvas.onclick = null;
    
    for(id in mapIdDisplayObject) {
        var target = mapIdDisplayObject[id];
        stage.removeChild(target);
    }
    
    mapIdDisplayObject = new Object();
    
    
    score = 0;
    scoreFieldValue.text = (score).toString();
    
    // initialize some variables
    last_increase_dificulty_time = new Date();
    last_airplane_created = new Date();
    last_create_airplanes_delay_time = CREATE_UFO_DELAY_TIME; // DIFICULTY
    last_nr_airplane_created = 0;
    factor = 0.85;

    lastTrackBlinkDate = new Date();
    
    
    scoreField.alpha = 1.0;   
    scoreFieldValue.alpha = 1.0;
    //UFO1_AIRPORT_PLANET_SHAPE.alpha = 1.0;
    //UFO2_AIRPORT_PLANET_SHAPE.alpha = 1.0;
    messageContainer.visible = false;
    
    /*stage.removeChild(messageField1);
    stage.removeChild(messageField2);
    stage.removeChild(messageField3);
    
    stage.removeChild(messagesShadow);*/
    
    //hide anything on stage and show the score
    //stage.removeAllChildren();
    
    //ensure stage is blank and add the ship
    //stage.clear();
    
    
    // add some airplanes
    addUFO(0);
    addUFO(TICKS_BEFORE_ACTIVE_START_COUNTER);
              
    // add rocks 
    
    
    stage.update(); 	//update the stage to show text

    isDead = false;
}


function addUFO(beforeActiveCounter) {
    var p = getAvailableStartPosition();
    if(!p) {
        return null;
    }

    //alert("Vou criar um UFO!");
    //var type = Math.round(Math.random() * 17) + 1;
    //var type = Math.round(Math.random()*3) + 1;
    var type = Math.floor(Math.random()*2) + 1; // between 1 and 2
    var ufo = new UFO(type, beforeActiveCounter, canvas.width, canvas.height);
    
    /*if(canvas.width > 1366) {
        ufo.scaleX = ufo.scaleY = 1.5;
        
    } else if(canvas.width < 1024) {
        ufo.scaleX = ufo.scaleY = 0.5;
    }*/
    
    //var airPlane = new AirPlane();

    // set air plane position by the defined method
    ufo.setPosition(p.x,p.y);
       
    ufo.bitmap.onMouseOver = onMouseOver; 
    //ufo.bitmap.onMousePress = onMouseOver;  
    ufo.bitmap.onMouseOut = onMouseOut;
    ufo.bitmap.mouseEnabled = true;

    // others initializations
    mapIdDisplayObject[ufo.id] = ufo;

    stage.addChild(ufo);
    //alert("ufo plane criado! ID:" + ufo.id);
                
    return ufo;
}

function getAvailableStartPosition() {
    // ensure that there isn´t infinite cycles here
    // we generate 100 random start points maximum
    for(i = 0; i < 100; i++) {
        // Find a random and empty position to put this air plane
        var v = Math.random();
        var x;
        var y;
        if(v > 0.5) {
            x = Math.round(canvas.width * Math.random());
            y = Math.round(Math.random()) * canvas.height; // 0 || canvas.height
        } else {
            x = Math.round(Math.random()) * canvas.width; // 0 || canvas.height
            y = Math.round(canvas.height * Math.random());
        }

        if(x == 0) {
            x = 16;
        }

        if(x == canvas.width) {
            x = canvas.width - 16;
        }

        if(y == 0) {
            y = 16;
        }

        if(y == canvas.height) {
            y = canvas.height - 16;
        }

        // random point generated.. check if there is any air plane near
        var validLocationFounded = true;
        for(id in mapIdDisplayObject) {
            var target = mapIdDisplayObject[id];

            if(target.hitRadius(x, y, target.hit*4)) {
                validLocationFounded = false;
                break;
            }
        }

        if(validLocationFounded) {
            return new Point(x,y);
        }
    }

    return null;
}


function tick() {
    //alert("Tick");
    // Play Audio
    //if(audio_playing && audio.readyState >= 4) {
    if( (audio != null) && (audio_playing) ) {
        audio.play();
    }
        
    // 1. Draw mouseTarget route if necessary
    if((!isDead) && (dragStarted) && (mouseTarget)) {
        //if(dragStarted) {
        // calculate the new position in the shape's local coordinate space:
        var endPt = mouseTarget.routeShape.globalToLocal(stage.mouseX,stage.mouseY);
                    
        mouseTarget.drawRoute(startPt.x, startPt.y, endPt.x, endPt.y);
        //mouseTarget.addRoutePoint(endPt.x, endPt.y);
        /*if(mouseTarget.positions.length <= 0) { // security check - point added
                        // suppose never happens!
                        mouseTarget.addRoutePoint(startPt.x, startPt.y);
                        mouseTarget.addRoutePoint(endPt.x, endPt.y);
                    }*/

        startPt = endPt;
                    
        // Now blinks airplane image/bitmap on the track
        var curTime = new Date();
        if(curTime.getTime() - lastTrackBlinkDate.getTime() > BLINK_TIME) {
            if(mouseTarget.type == UFO.TYPE1) {
                /*UFO1_AIRPORT_BITMAP.visible = !UFO1_AIRPORT_BITMAP.visible; 
                UFO1_AIRPORT_PLANET_SHAPE.visible = UFO1_AIRPORT_BITMAP.visible;*/
        
                UFO1_AIRPORT_ARROW_SHAPE.visible = !UFO1_AIRPORT_ARROW_SHAPE.visible;
                UFO1_AIRPORT_PLANET_SHAPE.alpha = 1.0;
                            
            } else if(mouseTarget.type == UFO.TYPE2) {
                /*UFO2_AIRPORT_BITMAP.visible = !UFO2_AIRPORT_BITMAP.visible;
                UFO2_AIRPORT_PLANET_SHAPE.visible = UFO2_AIRPORT_BITMAP.visible;*/
                        
                UFO2_AIRPORT_ARROW_SHAPE.visible = !UFO2_AIRPORT_ARROW_SHAPE.visible;         
                UFO2_AIRPORT_PLANET_SHAPE.alpha = 1.0;
            }

            lastTrackBlinkDate = curTime;
        }
    } else {
        UFO1_AIRPORT_ARROW_SHAPE.visible = false; 
        UFO2_AIRPORT_ARROW_SHAPE.visible = false;

        UFO1_AIRPORT_PLANET_SHAPE.alpha = 0.5;
        UFO2_AIRPORT_PLANET_SHAPE.alpha = 0.5;
    }
                
                
    // 2. Game Engine
    // Nested loop are used to increase performance (reducing cycles)
                
    var is_to_ring_alarm = false;

    // 2.1 Move all elements according with drawed route
    for(id in mapIdDisplayObject) {
        var target = mapIdDisplayObject[id];
        //alert('Id is: ' + id + ', value is: ' + target);

        if(target == mouseTarget) {
            //alert('Id is: ' + mouseTarget.id + ', value is: ' + mouseTarget);
            continue;
        }

        // move target to the next route point
        target.move();

        //alert('New Target (' + target.toString() + ') position. X:' + key.x + ' Y:' + key.y);

        // 2.2 Check if it was reached to the objective - landing
        // and increase score it is the case


        // 2.3 Another/Nested Loop
        // 1. Check if this air plane crashes!
        // 2. Check if is on target
        if((!isDead) && (target.isActive)) {
            // 2.3.1 - Cohesion detector
            var isNormalMode = true;
            for(otherId in mapIdDisplayObject) {
                //var otherTargetPositions = mapPositions[otherId];
                var otherTarget = mapIdDisplayObject[otherId];

                if( (target == otherTarget) || (! otherTarget.isActive) ) {
                    continue;
                }
                            
                if(target.hitRadius(otherTarget.bitmap.x, otherTarget.bitmap.y, otherTarget.hit)) {
                    target.changeToWarningMode(otherTarget.hit*4);
                    otherTarget.changeToWarningMode(otherTarget.hit*4);
                                
                    GameOver(target, otherTarget);  
                                
                    return;

                } else if(target.hitRadius(otherTarget.bitmap.x, otherTarget.bitmap.y, otherTarget.hit*4)) {
                    //alert("true! change to warning mode...");
                    isNormalMode = false;
                }
            }

            if(isNormalMode) {
                target.changeToNormalMode();
            } else {
                target.changeToWarningMode(otherTarget.hit*4);
                            
                is_to_ring_alarm = true;
            }


            
            /*var array = target.getLastPositions(1);
            var lastRoutePoint = null;
            if(array.length != 0) {
                lastRoutePoint = array[0];
            }*/
            
            // 2.3.2 - Check if the airplane is on target/airport
            // If so, set it for landing
            /*if( (target.type == UFO.TYPE1) && (target.hitRadius(UFO1_AIRPORT.x, UFO1_AIRPORT.y, UFO1_AIRPORT.radius)) && 
                ((!lastRoutePoint) || (hitRadius(lastRoutePoint.x, lastRoutePoint.y, UFO1_AIRPORT.x, UFO1_AIRPORT.y, UFO1_AIRPORT.radius))) ) {*/
            if( (target.type == UFO.TYPE1) && (target.hitRadius(UFO1_AIRPORT.x, UFO1_AIRPORT.y, UFO1_AIRPORT.radius)) 
                && (target.isAirportRouteTraced) ) {
                    
                //alert(target.isAirportRouteTraced);
                target.land(UFO1_AIRPORT_ROUTE);

                increaseScore(1);

            } else if( (target.type == UFO.TYPE2) && (target.hitRadius(UFO2_AIRPORT.x, UFO2_AIRPORT.y, UFO2_AIRPORT.radius)) 
                && (target.isAirportRouteTraced) ) {
                    
                //alert(target.isAirportRouteTraced);    
                target.land(UFO2_AIRPORT_ROUTE);

                increaseScore(1);
            }

        }

        // 2.4. Remove airplanes which has already landed
        if(target.isToDelete) {
            delete mapIdDisplayObject[id]; 
            stage.removeChild(target);           
        }
    }

    if(is_to_ring_alarm && audio_effects_enabled && audio_alarm != null) {
        audio_alarm.play();
    } else if (audio_alarm != null) {
        audio_alarm.pause();
    }

    // 3. Create air planes
    curTime = new Date();

    if( (curTime.getTime() - last_airplane_created.getTime() > last_create_airplanes_delay_time) || (mapIdDisplayObject.length == 0) ) {
        if(!isDead) {
            addUFO(TICKS_BEFORE_ACTIVE_START_COUNTER);
        }
        last_airplane_created = curTime;
    }
                
    //DrawSun();
    BlinkSomeStars();
    
    //Update the display list (draw everything)
    stage.update();
}

            
function increaseScore(value) {
    score += value;
                
    /*if((score > 0) && (score%10 == 0)) {
        last_create_airplanes_delay_time = last_create_airplanes_delay_time * factor;
                    
        if(last_create_airplanes_delay_time <= 3500) {
            factor = 0.95;
        }
    }*/
    
    var interval = CREATE_UFO_DELAY_TIME * Math.pow(0.95,Math.floor(Math.sqrt(score)));
    last_create_airplanes_delay_time = Math.round((Math.random() + 0.5) * interval);

    //trust the field will have a number and add the score
    scoreFieldValue.text = score.toString();
}
            
            
function GameOver(airplane1, airplane2) {
    if(audio_alarm != null) {
        audio_alarm.pause();
    }
                
    airplane1.explode();
    airplane2.explode();
                
    if(audio_effects_enabled && audio_explosion != null) {
        audio_explosion.play();
    }
                
    isDead = true;

    /*var img_button = document.getElementById("img_play");
    img_button.src = "img/audio/play.png";
    img_button.title = "Play";*/
                
    messageField1.text = "Game Over. Your score is...  " + score + "!";
    messageField1.color = "#FF0000";
    //messageField1.font = "bold 24px Arial";
                
    if(score == 0) {
        messageField2.text = "\n Drag and Drop UFO to the right planet!";
                    
    } else if(score < 50) {
        messageField2.text = "\n Tip: Try to define common routes for each UFO type.";
                    
    } else if(score < 100) {
        messageField2.text = "\n Great result! Keep going...";
                    
    } else if(score < 200) {
        messageField2.text = "\n Uauu! Amazing result! You are a pro...";
                    
    } else {
        messageField2.text = "\n Beautiful! Are you an Alien?!? :)";
    }
    
    scoreField.alpha = 0.5;   
    scoreFieldValue.alpha = 0.5;
    UFO1_AIRPORT_PLANET_SHAPE.alpha = 0.5;
    UFO2_AIRPORT_PLANET_SHAPE.alpha = 0.5;
    
    for(id in mapIdDisplayObject) {
        var target = mapIdDisplayObject[id];
        target.bitmap.alpha = 0.5;
    }
    
    messageContainer.visible = true;
    
    //messageField2.color = "#0000FF";
                
    //messageField3.text = "Press \"Play\" to start a new game!";  
                
    //watchStart();
    //stage.addChild(messageField1);
    //stage.addChild(messageField2);
    //stage.addChild(messageField3);
    
    // AND Remove ticker listener...               
    //Ticker.removeListener(window);
    
    stage.update(); 	//update the stage to show text
    
    alert("Game Over. Your score is...  " + score + "!");
    publish_Results(score);
    stage.update(); 	//update the stage to show text
    
    canvas.onclick = PlayButtonHandler;

    //drawScoreTable();
    //stage.update();
    
    //alert("You lose! Score:" + score);
    //Update the display list (draw everything)
}           
            
function publish_Results(score) {
    var currentMaxScore = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if( (!currentMaxScore) || (score > currentMaxScore) ) {
        localStorage.setItem(LOCAL_STORAGE_KEY,score);
        messageField2.text = "Your Current Max Score is: " + score;
    }
}
        

/**********************************
            /** MOUSE HANDLERS
 **********************************/
// on mouse move, update the stage's mouseX/mouseY:
function onMouseMove(e) {
    if(!e){
        e = window.event;
    }

    /*stage.mouseX = e.pageX-canvas.offsetLeft;
    stage.mouseY = e.pageY-canvas.offsetTop;*/

    //console.log("Mouse Move position:" + stage.mouseX + "," + stage.mouseY);

    if((!isDead) &&(dragStarted) && (mouseTarget)) {
        // Add route points
        mouseTarget.addRoutePoint(stage.mouseX, stage.mouseY);

        if( (mouseTarget.type == UFO.TYPE1) && (hitRadius(stage.mouseX, stage.mouseY, mouseTarget.hit, UFO1_AIRPORT.x, UFO1_AIRPORT.y, UFO1_AIRPORT.radius)) ) {
            mouseTarget.setAirportRouteTraced(true);

        } else if((mouseTarget.type == UFO.TYPE2) && (hitRadius(stage.mouseX, stage.mouseY, mouseTarget.hit, UFO2_AIRPORT.x, UFO2_AIRPORT.y, UFO2_AIRPORT.radius)) ) {
            mouseTarget.setAirportRouteTraced(true);
                        
        } else {
            mouseTarget.setAirportRouteTraced(false);
        }
    }
}

// set flag to indicate we want to drag whatever is under the mouse:
function onMouseDown(e) {
    if(!e){
        e = window.event;
    }

    /*stage.mouseX = e.pageX-canvas.offsetLeft;
    stage.mouseY = e.pageY-canvas.offsetTop;*/
    
    if( (!isDead) && (! mouseTarget) ) {
        // If any target is selected and user presses mouse...
        // check is there is any target in that position calling an onMouseOver method
        // If the user presses a target on a not yet detected onMouseOver... 
        // target will be selected!
        onMouseOver(e);
    }
                
    if((!isDead) && (mouseTarget) && (mouseTarget.isActive) ) {
        dragStarted = true;

        // Clear last route draw
        mouseTarget.clearRoute();

        mouseTarget.setAirportRouteTraced(false);

        // set up the first point in the new draw, and choose a random color:
        startPt = mouseTarget.routeShape.globalToLocal(stage.mouseX,stage.mouseY);
        mouseTarget.addRoutePoint(startPt.x, startPt.y);

        // Add first route point
        //mouseTarget.addRoutePoint(startPt.x, startPt.y);

        // clear the cache, so the vector data is drawn each tick:
        //lineShape.uncache();
    }
}

// set flag to indicate we no longer want to drag:
function onMouseUp(e) {
    dragStarted = false;
                

    // Check if a mouseOut is miss
    /*try {
                    // this will return the top-most display object under the mouse position:
                    var target = stage.getObjectUnderPoint(event.stageX, event.stageY);
                } catch (e) {
                    //Ticker.removeListener(window);
                    alert("An error occurred because this browser does not support reading pixel data in local files. Please read 'SECURITY_ERROR_README.txt' included with the EaselJS for details");
                }*/

    //if( (! target) && (mouseTarget) ) {
    if( (!isDead) &&(mouseTarget) ) {
        //alert("onMouseUp");
        // cache the vector data to a saved canvas, so we don't have to render it each tick:
        //var lineShape = mapLineShape[mouseTarget.id];
        //lineShape.cache(-800,-800,2000,2000);

        onMouseOut(e);
    }
}

// scale Display Objects on mouseOver / Out:
/*function onMouseOver(target){
                //target.scaleX = target.scaleY = target.scale * 1.1;
                target.mouseOver();
            }

            function onMouseOut(target){
                //target.scaleX = target.scaleY = target.scale;
                target.mouseOut();
            }*/

function onMouseOver(e) {
    if(!e){
        e = window.event;
    }
    
    /*alert("onMouseOver:x="+e.stageX+",y="+e.stageY);
    for(id in mapIdDisplayObject) {
        var target = mapIdDisplayObject[id];
        alert("Object:"+target+";  x="+target.bitmap.x+",y="+target.bitmap.y);
    }*/
            
    if( (!isDead) && (!dragStarted) ) {
        try {
            // this will return the top-most display object under the mouse position:
            var object = stage.getObjectUnderPoint(e.stageX, e.stageY);
            //var object = stage.getObjectUnderPoint(stage.mouseX, stage.mouseY);            
            
        } catch (exception) {
            //Ticker.removeListener(window);
            //alert("An error occurred because this browser does not support reading pixel data in local files. Please read 'SECURITY_ERROR_README.txt' included with the EaselJS for details");
        }

        if( (object) && (object.parent.isActive) ) {
            mouseTarget = object.parent;
            mouseTarget.mouseOver();
            
            cursor_pointer();
        }
    }
}

function onMouseOut(e) {
    if(!e){
        e = window.event;
    }
                
    // My onMouseOut event...
    // if we were dragging, but are not anymore, call mouseOut with the old target:
    /*if(show) {
                alert(dragStarted);
                }*/
    if((!isDead) && (!dragStarted) && (mouseTarget) ) {
        mouseTarget.mouseOut();
        mouseTarget = null;

        cursor_clear();
        
        //var array = mapPositions[mouseTarget.id];
        //alert(mouseTarget.positions.join("+"));
        //alert("onMouseOut");
    }
                
}
 
 
function touchHandler(event)
{
    var touches = event.changedTouches,
    first = touches[0],
    type = "";
    switch(event.type)
    {
        case "touchstart":
            type = "onMouseDown";
            break;
        case "touchmove":
            type="onMouseMove";
            break;        
        case "touchend":
            type="onMouseUp";
            break;
        default:
            return;
    }

    //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
        first.screenX, first.screenY, 
        first.clientX, first.clientY, false, 
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
            
/**********************************
            /** HTML TAGS - JAVASCRIPT HANDLERS
 **********************************/
            
function PlayButtonHandler() {  
    //alert(isDead);
    //var img_button = document.getElementById("img_play");

    if(isDead) {
        handleClick();
        //img_button.src = "img/audio/pause.png";
        //img_button.title = "Pause";
                    
    } else if(Ticker.getPaused()) {
        Ticker.setPaused(false);
        playShape.visible = false;
        pauseShape.visible = true;
        stage.update();
        //img_button.src = "img/audio/pause.png";
        //img_button.title = "Pause";
                    
    } else if(! Ticker.getPaused()) {
        Ticker.setPaused(true);
        //img_button.src = "img/audio/play.png";
        //img_button.title = "Play";
        playShape.visible = true;
        pauseShape.visible = false;
        stage.update();
    }
    
    
}

function ChangeSpeedButtonHandler() {  
    //alert(isDead);
                
    //var img_button = document.getElementById("img_speed");
                
    //Ticker.setInterval(75); // Default is 50...
    if(Ticker.getInterval() == 50) {
        //img_button.src = "img/audio/rewind.png";
        //img_button.title = "Decrease Speed";
          
        forwardShape.visible = false;
        rewindShape.visible = true;
        
        Ticker.setInterval(25); // Default is 50...
            
    } else {
        //img_button.src = "img/audio/forward.png";
        //img_button.title = "Increase Speed";
        
        forwardShape.visible = true;
        rewindShape.visible = false;
                    
        Ticker.setInterval(50); // Default is 50...
    }
    
    stage.update();
}
            
function AudioButtonHandler() {  
    //alert(isDead);
    var img_button = document.getElementById("img_audio");

    // Stop or enable audio by changing audio flag
    audio_playing = !audio_playing;
                
    if(audio_playing) {
        img_button.src = "img/audio/audio_on.png";
        img_button.title = "Audio enabled";
                    
        audio.play();
                    
    } else {
        img_button.src = "img/audio/audio_off.png";
        img_button.title = "Audio disable";
                    
        audio.pause();
    }
}
            
function AudioEffectsButtonHandler() {  
    //alert(isDead);
    var control = document.getElementById("audio_effects");

    //alert("AudioEffectsButtonHandler");
    // Stop or enable audio by changing audio flag
    audio_effects_enabled = control.checked;
}
            
function cursor_pointer() {
    document.body.style.cursor = 'pointer';
}

function cursor_clear() {
    document.body.style.cursor = 'default';
}