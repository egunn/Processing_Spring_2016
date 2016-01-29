//following https://zipcon.net/~swhite/docs/computers/languages/object_oriented_JS/inheritance.html
//in addition to The Nature of Code

//declare the parent function
function GeneralParticle(){
    //set base variables
    var size = 10;
    var xPos = 250;
    var yPos = 250;
    var fillColor = 200;//random(50,200);
    
    //create position and velocity vectors
    var pos = createVector(xPos,yPos);
    var vel = createVector(0,1);
    vel.rotate(random(0,TWO_PI));
    
    //set the object properties
    this.size = size;
    this.xPos = xPos;
    this.yPos = yPos;
    this.pos = pos;
    this.fillColor = fillColor;
    this.vel = vel;
    this.accel = createVector(0,0);
    this.mass = 2;
    
    //create object functionality
    this.draw = function(){
        
        //turn on stroke to draw a line, and give it the same color as the particle
        stroke(this.fillColor);
        //draw a line trailing behind the particle, using the velocity to calculate where it was in the previous step
        line(this.pos.x,
             this.pos.y,
             this.pos.x-2*this.vel.x,
             this.pos.y-2*this.vel.y);
        //turn off the stroke again
        noStroke();
 
        //draw the particle
        fill(this.fillColor);
        ellipse(this.pos.x, this.pos.y, size, size); 
        line()
    }
    
    this.update = function(){
        
        //check whether fastParticle indicator exists (not currently checking value; that can be added later). If it does, then rotate the velocity vector and multiply by slightly more than one to increase radius (otherwise, particles swirl in a constant loop)
        if (this.partType){
            this.vel = this.vel.rotate(PI/18);
            this.vel.mult(1.007);
        }
        this.pos.add(this.vel);
        
    }
    
    this.applyForce = function(force) {
        //console.log(this.accel);
        this.accel = this.accel.add(force);
    }
}


/*********************************************************/

//declare the child function
function FastParticle() {
    //tell it to use the GeneralParticle constructor (apply is a built-in function, similar to call, but can accept any number of arguments in the parentheses. When no arguments need to be passed, use the built in arguments parameter instead)
    GeneralParticle.apply(this,arguments);
    
    //multiply the particle speed by 10
    //this.vel = this.vel.mult(1.5);
    
    //reset velocity, fillColor. Create partType variable to use in update function to check particle type
    this.vel = this.vel.mult(20);
    this.fillColor = "red";
    this.partType = "fast";
}   

/**********************************************************/

//set global clicked variable to track whether mouse has been clicked
var clicked;
var attractor;

function mouseClicked() {
    //CreateAttractor();
    
    clicked = true;
    attractor = new CreateAttractor();
    //console.log("clicked!");
    
}

function CreateAttractor() {
    
    this.pos = createVector(mouseX,mouseY);
    this.mass = 10;
    
    this.draw = function(){
        fill("black");
        ellipse(this.pos.x,this.pos.y,5,5);
        //console.log(attractor);
    }   
    
    //receive a particle object and return a force vector for particle.applyForce().
    this.attract = function(particle){
        var force = this.pos.sub(particle.pos); 
        var dist = force.mag();
        dist = constrain(dist,2,2000);
        force.normalize();
        
        strength = (9.8 * this.mass * particle.mass)/(dist*dist);
        
        force.mult(strength);
        
        //console.log(force);
        
        return force;
    }
}

//set up the canvas - this section runs only once
function setup() {

    createCanvas(1024,768);
    stroke('none');
    fill(155);

    //create empty particle array (no var, so global scope)
    particleArray = [];
    
    //fill the array with GeneralParticles
    for(i=0;i<10;i++){
        var newParticle = new GeneralParticle();
        particleArray.push(newParticle);
    }
    
    //set up the inheritance relationship (has to be done in the setup function - otherwise, breaks random, createVector, etc.)
    FastParticle.prototype = new GeneralParticle();
     
    //add FastParticles to the array
    for(i=0;i<5;i++){
        var newParticle = new FastParticle();
        particleArray.push(newParticle);
    }
    
    //f = new FastParticle();
}


function draw() {

    //set the canvas to white
    background(255);
    
    //draw each particle in the particleArray. Once drawn, update.
    for(i=0;i<particleArray.length;i++){
        var p = particleArray[i];
        p.draw();
        
        //if an attractor exists, call the attractor.attract(particle) function and pass it particle p. The function should return a force vector, which should then be used on the particle using particle.applyForce(force). 
        if (clicked) {
            temp = attractor.attract(p);
            //console.log(temp);
            p.applyForce(temp);
        }
        p.update();
    }
    
            
    if (clicked){
//******Check why attractor position is updating!! Shows up at 0,0 rather than mouse click location...overwriting something?        
        console.log(attractor.pos);
        attractor.draw();
    }
    
}