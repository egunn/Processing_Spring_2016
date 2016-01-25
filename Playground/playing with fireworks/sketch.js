//var oneParticle;

//empty array with no particles in it (yet)
var particleSystem = []; 

function setup() {
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth,windowHeight);
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    //hue(0-360) saturation(0-100) brightness transparency, from 
    colorMode(HSB,360,100,100,100);

}

//var value = 0;

//---------------------------------------------------------

function draw() {
    //re-draw background each cycle
    background(0);
        
    for(var i = particleSystem.length-1; i>=0; i--) {
        var p = particleSystem[i];
        //console.log('for loop')
        if(p.areYouDeadYet()){
            //cut out the array element at index 1, and one element long
            particleSystem.splice(i,1);
            p.update();
            p.draw();
            console.log('dead particle')
        }
        else{
           console.log("not dead");
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

function createMightyParticles() {
    for(var i=0;i<200;i++){
        var hue = random(20,30);
        var pos = createVector(mouseX,mouseY);
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
    //create a copy of the original value in case you want to use it laster
    this.position = position.copy();
    this.velocity = velocity.copy();
    //and give it a size and lifespan
    this.size = 10;
    this.lifeSpan = random(20,80);
    this.hue = random(hue-15,hue+15);
    this.gravity = createVector(0,random(5,15));
    this.counter = 0;
    
    this.update = function() {
        //console.log('update runs');
        //reduce its lifeSpan (same as this.lifeSpan = this.lifeSpan-1) or -=2 if you want to subtract 2 each time
        this.lifeSpan--;
        this.counter++;
        //position is a vector; add a vector using p5.js add function. Stores result in the original vector.
        
        console.log(mag(position.sub(this.position).x,position.sub(this.position).y));
        
        this.position.add(velocity); 
        
        if (mag(position.sub(this.position).x,position.sub(this.position).y) > 5000)
            {
                //if(this.lifeSpan < 20){
                    this.position.add(this.gravity);
                //}
                
            }
        
        //console.log(this.position.y)
    }
    
    //function needs to draw itself
    this.draw = function() {
        //console.log('draw runs');
        noStroke();
        //fill(0,0,random(0,255));
        fill(this.hue,random(50,100),random(50,100));
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
}