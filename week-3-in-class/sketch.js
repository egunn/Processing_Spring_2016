//var oneParticle;

//empty array with no particles in it (yet)
var particleSystem = []; 

//run this to make sure that the sound is loaded into the browser memory before you need it.
function preload() {
    expFc = loadSound("explosion.m4a");
}

//runs once, at page load.
function setup() {
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth,windowHeight);
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    //hue(0-360) saturation(0-100) brightness transparency
    colorMode(HSB,360,100,100,1);
}


//---------------------------------------------------------

//runs 30x/second, as set by frame rate
function draw() {
    //re-draw background each cycle
    background(0);
    
    //go through the particle system and check if any particles are dead (start from the end, otherwise cutting components out of the array will cause problems)
    for(var i = particleSystem.length-1; i>=0; i--) {
        //grab one particle from the system
        var p = particleSystem[i];
        
        //check if the particle is dead
        if(p.areYouDeadYet()){
            //if it's dead, cut out the array element at index 1, and one element long
            particleSystem.splice(i,1);

            //if there are fewer than 1000 particles in the system, and all of the particles are outside of the screen, make a new particle system at the position where the last particle died
            if (particleSystem.length < 1000  && p.position.x < width && p.position.x > 0 && p.position.y > 0 && p.position.y < height){
                createMightyParticles(p.position);
            }
        }
        //if it's not dead yet, then draw it and update for the next cycle
        else{
            p.draw();
            p.update();
        }
    }

}

//---------------------------------------------------------

function mouseClicked() {
    //create a new system of particles each time the mouse is clicked.
    createMightyParticles();
}

//this function works with or without arguments (use no argument in general, use argument for auto-regenerate)
function createMightyParticles(initialPos) {
    //play the loaded sound file when the function is called
    expFc.play();
    
    for(var i=0;i<200;i++){
        //create a variable to center the color scale around
        var hueSeed;
        
        //if it's the first particle in the system, set the value of hueSeed to a random # between 20 and 340 (this will set the color for the whole system)
        if(i==0){
            hueSeed = random(20,340);
        }
        
        //Set the hue for each particle in the series to be within 20 units of the hueSeed color (so that they're all different shades of yellow, blue, or whatever)
        var hue = random(hueSeed-20,hueSeed+20);
        var pos;
        
        //if no initial position is given, then use the mouse position to set the initial position of the particle system
        if (!initialPos){
            pos = createVector(mouseX,mouseY);
        }
      
        //otherwise, use the value of the initial position passed from the calling function
        else {
            pos = initialPos.copy();
        }
      
        //make a circular system of particles by creating a unit vector and then rotating and scaling it randomly
        var vel = createVector(0,1);
        vel.rotate(random(0,TWO_PI));
        //without the multiplier, particles move in different directions, but at same speed (makes an expanding ring)
        vel.mult(random(1,10));
        
        //make a new particle using the position, velocity, and hue values determined above
        var newBorn = new Particle(pos,vel,hue);
        //add the new particle to the particle system array
        particleSystem.push(newBorn);
        
    }
}

//function to resize window every time window size is changed manually
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


//use uppercase to describe an object
var Particle = function(position,velocity,hue) {
    //store position and velocity inside the object
    //create a copy of the original value in case you want to use it later
    this.position = position.copy();
    this.velocity = velocity.copy();
    
    //create an acceleration vector rotated to point downward, and store it in the object
    var accel = createVector(0,.4);
    accel.rotate(0,PI);
    //console.log(accel);
    this.acceleration = accel;
    
    //give the particle a random size and a lifespan
    this.size = random(3,10);
    //store initial lifespan
    var initialLifeSpan = random(20,100);
    this.lifeSpan = initialLifeSpan;
    this.hue = random(hue-15,hue+15);
    
    this.update = function() {
        //reduce its lifeSpan (same as this.lifeSpan = this.lifeSpan-1) or -=2 if you want to subtract 2 each time
        this.lifeSpan--;
        //position is a vector; add a vector using p5.js add function. Stores result in the original vector.
        //update the velocity and position vectors  
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        
    }
    
    //function needs to draw itself
    this.draw = function() {
        //turn off the stroke for the particles
        noStroke();
        //map the transparency to the lifespan of the particle
        var transparency = map(this.lifeSpan,0,initialLifeSpan,0,1);    
        fill(this.hue,100,100,transparency);
        //turn on stroke to draw a line, and give it the same color as the particle
        stroke(this.hue,100,100,transparency);
        //draw a line trailing behind the particle, using the velocity to calculate where it was in the previous step
        line(this.position.x,
             this.position.y,
             this.position.x-3*this.velocity.x,
             this.position.y-3*this.velocity.y);
        //turn off the stroke again
        noStroke();
        //draw the particle itself (better to do this after the line, so that the particle draws on top)
        ellipse(this.position.x,
                this.position.y,
                this.size,
                this.size);
    }
    
    //check if the particle is "dead"
    this.areYouDeadYet = function() {
                
        return this.lifeSpan <= 0;
        
    }
