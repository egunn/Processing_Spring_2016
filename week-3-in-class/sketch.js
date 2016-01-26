//var oneParticle;

//empty array with no particles in it (yet)
var particleSystem = []; 

function preload() {
    expFc = loadSound("explosion.m4a");
}

function setup() {
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth,windowHeight);
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    //hue(0-360) saturation(0-100) brightness transparency, from 
    colorMode(HSB,360,100,100,1);
}

//var value = 0;

//---------------------------------------------------------

function draw() {
    //re-draw background each cycle
    background(0);
    //blendMode(OVERLAY);
    
    for(var i = particleSystem.length-1; i>=0; i--) {
        var p = particleSystem[i];
        //console.log('for loop')
        if(p.areYouDeadYet()){
            //cut out the array element at index 1, and one element long
            particleSystem.splice(i,1);
            //p.update();
            //p.draw();
            if (particleSystem.length < 1000  && p.position.x < width && p.position.x > 0 && p.position.y > 0 && p.position.y < height){
                
                //if (this.areYouDeadYet==false){
                    createMightyParticles(p.position);
                //}
            }
           // console.log('dead particle')
        }
        else{
           //console.log("not dead");
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

//create function that works with or without arguments (use no argument in general, use argument for auto-regenerate)
function createMightyParticles(initialPos) {
    expFc.play();
    
    for(var i=0;i<200;i++){
        //give start and end range for hue value 
        //green primary is at 120, blue primary at 240, red at 360.
        var hueSeed
        
        if(i==0){
            hueSeed = random(20,340);
        }
        var hue = random(hueSeed-20,hueSeed+20);
        var pos;
        
        //if no initial position
        if (!initialPos){
            pos = createVector(mouseX,mouseY);
        }
      
        else {
            pos = initialPos.copy();
        }
      
        //this version creates a square, because vector random, based on square.
        //var vel = createVector(random(-5,5),random(-5,5));
        
        //instead, create a unit vector and rotate and scale it randomly
        var vel = createVector(0,1);
        vel.rotate(random(0,TWO_PI));
        //without the multiplier, move in different directions, but at same speed (makes an expanding ring)
        vel.mult(random(1,10));
        
        var newBorn = new Particle(pos,vel,hue);
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
    
    var accel = createVector(0,.4);
    accel.rotate(0,PI);
    //console.log(accel);
    this.acceleration = accel;
    
    //and give it a size and lifespan
    this.size = random(3,10);
    //store initial lifespan
    var initialLifeSpan = random(20,100);
    this.lifeSpan = initialLifeSpan;
    this.hue = random(hue-15,hue+15);
    
    this.update = function() {
        //reduce its lifeSpan (same as this.lifeSpan = this.lifeSpan-1) or -=2 if you want to subtract 2 each time
        this.lifeSpan--;
        //position is a vector; add a vector using p5.js add function. Stores result in the original vector.
         
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        
        //console.log(this.position.y)
    }
    
    //function needs to draw itself
    this.draw = function() {
        //console.log('draw runs');
        noStroke();
        //fill(0,0,random(0,255));
        var transparency = map(this.lifeSpan,0,initialLifeSpan,0,1);    
        fill(this.hue,100,100,transparency);
        stroke(this.hue,100,100,transparency);
        line(this.position.x,
             this.position.y,
             this.position.x-3*this.velocity.x,
             this.position.y-3*this.velocity.y);
        noStroke();
        ellipse(this.position.x,
                this.position.y,
                this.size,
                this.size);
    }
    
    this.areYouDeadYet = function() {
        //if(this.lifeSpan <= 0) {return true;}
        //else {return false;}
        //console.log('dead test');
        //return this.lifeSpan <= 0 ? true : false;
        
        return this.lifeSpan <= 0;
        
    }
    
    //to call function and make a new object, use var particle = new Particle(myPosition,myVelocity);
    
}