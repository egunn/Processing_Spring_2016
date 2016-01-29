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
    
    //create object functionality
    this.draw = function(){
        noStroke();
        fill(this.fillColor);
        ellipse(this.pos.x, this.pos.y, size, size);        
    }
    
    this.update = function(){
        
        if (this.partType){
            this.vel = this.vel.rotate(PI/20);
            this.vel.mult(1.007);
        }
        this.pos.add(this.vel);
        
    }
}


/*********************************************************/

//declare the child function
function FastParticle() {
    //tell it to use the GeneralParticle constructor (apply is a built-in function, similar to call, but can accept any number of arguments in the parentheses. When no arguments need to be passed, use the built in arguments parameter instead)
    GeneralParticle.apply(this,arguments);
    
    //multiply the particle speed by 10
    //this.vel = this.vel.mult(1.5);
    
    fastVel = createVector(0,20);
    this.vel = fastVel.rotate(random(0,TWO_PI));
    
    this.fillColor = "red";
    
    this.partType = "fast";
    //accel = createVector(0.01,0);
    //this.accel = accel;
}   

/**********************************************************/


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
    for(i=0;i<10;i++){
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
        p.update();
    }
    
}