//empty array with no particles in it (yet)
var particleSystem = []; 
var attractors = [];

//*******************************************************
//Setup canvas 
//*******************************************************

//runs once, at page load.
function setup() {
    //store window width and height for sizing the canvas later
    canvasWidth = windowWidth-100;
    canvasHeight = windowHeight-120;
    
    //associates canvas with #canvas object
    var canvas = createCanvas(canvasWidth,canvasHeight);
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    background(0);
    
    //hue(0-360) saturation(0-100) brightness transparency
    colorMode(HSB,360,100,100,1);
    
    //create set of 10 GeneralAttractors
    for (var i=0; i<10; i++){
        //var at = new GeneralAttractor(createVector
          //  (canvasWidth*Math.random(),canvasHeight*Math.random()),Math.random()*5);
        //straight line down center of window
        var at = new GeneralAttractor(createVector(canvasWidth/2,
        (i+1)*canvasHeight/11),7);
        attractors.push(at);
    }

    //add a few copies of an AttractorA (negative attraction)
    for (var i=0; i<10; i++){
        //var attA = new AttractorA(createVector
        //(canvasWidth*Math.random(),canvasHeight*Math.random()),5);
    
        var attA = new AttractorA(createVector(canvasWidth/3,
        (i/2)*canvasHeight/11),7);
        attractors.push(attA);
    }
    
}

//function to resize window every time window size is changed manually
function windowResized() {
    resizeCanvas(canvasWidth, canvasHeight);
    canvasWidth = windowWidth-100;
    canvasHeight = windowHeight-120;
    background(0);
}

//*******************************************************
//Draw canvas 
//*******************************************************

//runs 30x/second, as set by frame rate
function draw() {
    //re-draw background each cycle
    background(0,0,0,0.2);
   // blendMode(EXCLUSION);
    
    //go through the particle system and check if any particles are dead 
    //(start from the end, otherwise cutting components out of the array 
    //will cause problems)
    for(var i = particleSystem.length-1; i>=0; i--) {
        //grab one particle from the system
        var p = particleSystem[i];
        
        //check if the particle is dead
        if(p.areYouDeadYet()){
            //if it's dead, cut out the array element at index 1, 
            //and one element long
            particleSystem.splice(i,1);

            
            //if there are fewer than 1000 particles in the system, and all 
            //of the particles are outside of the screen, make a new particle 
            //system at the position where the last particle died
            if (particleSystem.length < 150  && p.getPos().x < canvasWidth 
                && p.getPos().x > 0 && p.getPos().y > 0 && p.getPos().y < height){
               
                createMightyParticles(p.getPos());
            }
        }
        
        //if it's not dead yet, then draw it and update for the next cycle
        else{
            p.draw();
            p.update();
        }
    }
    
    /*
    //make sure that the mouse is pressed inside the canvas. If it is, 
    //then run the createMightyParticles function as long as the mouse 
    //button is held down
    if(mouseIsPressed && mouseX>0 && mouseX < canvasWidth
      && mouseY > 0 && mouseY < canvasHeight){
        createMightyParticles();
    }*/
       
    //run through the attractors array, and draw each one
    attractors.forEach(function(at) {
        at.draw(at.getStrength());
    });

}


function mouseClicked() {
    //create a new system of particles each time the mouse is clicked.
    if (mouseX>0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight){
        createMightyParticles();
    }
}


//*******************************************************
//Create Particle System
//*******************************************************

//this function works with or without arguments (use no argument in general, use argument for auto-regenerate)
function createMightyParticles(initialPos) {
    //play the loaded sound file when the function is called
    //expFc.play();
    
    //make 20 particles (for mouseClicked version - mousePressed 
    //creates them continuously as long as the mouse is held)
    for(var i=0;i<10;i++){
        //create a variable to center the color scale around
        var hueSeed;
        
        //if it's the first particle in the system, set the value 
        //of hueSeed to a random # between 20 and 340 (this will 
        //set the color for the whole system)
        if(i==0){
            //change to constant color for now
            //hueSeed=(50);
            //hueSeed = random(20,340);
        }
        
        //Set the hue for each particle in the series to be within 20 units 
        //of the hueSeed color (so that they're all different shades of 
        //yellow, blue, or whatever)
        var hue = hueSeed;//random(hueSeed-20,hueSeed+20);
        var pos;
        
        //if no initial position is given, then use the mouse position to 
        //set the initial position of the particle system
        if (!initialPos){
            pos = createVector(mouseX,mouseY);
        }
      
        //otherwise, use the value of the initial position passed from the 
        //calling function
        else {
            pos = initialPos.copy();
        }
      
        //make a circular system of particles by creating a unit vector and 
        //then rotating and scaling it randomly
        var vel = createVector(0,1);
        vel.rotate(random(0,TWO_PI));
        
        //without the multiplier, particles move in different directions, but 
        //at same speed (makes an expanding ring)
        vel.mult(random(1,2));
        
        //make a new particle using the position, velocity, and hue values 
        //determined above
        var newBorn = new Particle(pos,vel,hue);
        //add the new particle to the particle system array
        particleSystem.push(newBorn);
        
        var newBornA = new ParticleA(pos,vel,hue);
        //console.log(test);
        particleSystem.push(newBornA);
        
    }
}


//*******************************************************
//Create Particle Prototype
//*******************************************************

//use uppercase to describe an object
var Particle = function(pp,vv,hue) {
    //store position and velocity inside the object
    //create a copy of the original value in case you want to use it later
    var position = pp.copy();
    var velocity = vv.copy();
    var typeA = false;
    
    /*
    //gravity - create an acceleration vector rotated to point downward, 
    //and store it in the object
    var accel = createVector(0,.4);
    accel.rotate(0,PI);
    //console.log(accel);
    var acceleration = accel;*/
    
    //create an acceleration vector with an initial value of zero
    var acceleration = createVector(0,0);
    
    //give the particle a random size and a lifespan
    var pSize = random(3,10);
    //store initial lifespan
    var initialLifeSpan = random(80,200);
    this.lifeSpan = initialLifeSpan;
    //turn off color variation for now
    //this.hue = random(hue-15,hue+15);
    var hue = 180;
    
    this.update = function() {
        //reduce its lifeSpan
        this.lifeSpan--;

        //keep the velocity from exceeding a value of 3 (limits influence of
        //acceleration)
       // velocity.limit(3);
      
        //go through attractor array and update particles accordingly
        attractors.forEach(function(A){
            //create a new vector att that points from the particle to the 
            //attractor. Using a.pos.sub(position) doesn't work, because it 
            //changes the position vector of A itself
            //console.log(A.getPos());
            var att = p5.Vector.sub(A.getPos(),position);
            //scale the new vector according to the distance^2. 
            var distanceSq = att.magSq();
            //don't need to calc the distance itself; use the magnitude squared b/c
            //less computationally intensive to use the non-sqrt function.
            
            //Threshold at 1 so that particles don't accelerate to infinity
            if(distanceSq>1){
                //multiply by the size to attract based on particle size 
                att.div(distanceSq*pSize);
                
                //multiply or divide depending on the result of the distance calc.
                att.mult(5*A.getStrength());
                //add this vector to the particle acceleration
                acceleration.add(att);
            }
            
        });
        
        //position is a vector; add a vector using p5.js add function. 
        //Stores result in the original vector.
        //update the veocity and position vectors 
        if (typeA){
            velocity.add(acceleration.mult(-1));
            acceleration.mult(0);
            position.add(velocity);
        }
        else{
            velocity.add(acceleration);
            acceleration.mult(0);
            position.add(velocity); 
        }

    }
    
    //particle needs to draw itself
    this.draw = function() {
        //turn off the stroke for the particles
        noStroke();
        //map the transparency to the lifespan of the particle
        var transparency = map(this.lifeSpan,0,initialLifeSpan,0,1); 
        if (typeA){
            hue = 300;
        }
        fill(hue,100,100,transparency);
        //turn on stroke to draw a line, and give it the same color as the particle
        stroke(hue,100,100,transparency);
        //draw a line trailing behind the particle, using the velocity to 
        //calculate where it was in the previous step
        line(position.x,
             position.y,
             position.x-3*velocity.x,
             position.y-3*velocity.y);
        //turn off the stroke again
        noStroke();
        //draw the particle itself (better to do this after the line, 
        //so that the particle draws on top)
        ellipse(position.x,
                position.y,
                pSize,
                pSize);
    }
    
    //check if the particle is "dead"
    this.areYouDeadYet = function() {
                
        return this.lifeSpan <= 0;
        
    }
    
    this.getPos = function() {
        return position.copy();
    }
    
    
    this.setTypeA = function() {
        typeA = true;
    }
    
}


//Declare child particle prototype
function ParticleA(pos,vel,hue) {
    //tell it to use GeneralAttractor constructor (use arguments when 
    //there are no function arguments to pass)
    Particle.apply(this,arguments);
    
    //update the strength of the attractor using the updateStrength 
    //function in the GeneralAttractor method
    this.setTypeA();
}


//***************************************************************
//Attractor Prototypes
//***************************************************************

var GeneralAttractor = function(pos,s){
    var pos = pos.copy();
    var strength = s;
    
    this.draw = function(v) {
        noStroke();
        if (abs(strength)==strength){
            fill(0,100,100);
            ellipse(pos.x,pos.y,strength,strength);
        }
        else {
            fill(255,255,255);
            ellipse(pos.x,pos.y,strength,strength);
        }
        
    }
    
    this.getStrength = function() {
        return strength;
    }
        
    this.invertStrength = function(strengthIn) {
        strength = -strengthIn;
    }
        
    this.getPos = function() {
        return pos.copy();
    }
}

//Declare child attractor prototype
function AttractorA(pos,s) {
    //tell it to use GeneralAttractor constructor (use arguments when 
    //there are no function arguments to pass)
    GeneralAttractor.apply(this,arguments);
    
    //update the strength of the attractor using the updateStrength 
    //function in the GeneralAttractor method
    this.invertStrength(s);
}