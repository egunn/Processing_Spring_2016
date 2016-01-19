//var oneParticle;

//empty array with no particles in it (yet)
var particleSystem = []; 

function setup() {
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth,windowHeight);
    
    //set background color
    //background(255,255,0);
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    //hue(0-360) saturation(0-100) brightness transparency, from 
    colorMode(HSB,360,100,100,100);
    
    //create initial position and velocity vectors
    //var pos = createVector(width/2,height/2);
    //var pos2 = createVector(width/4,height/3);
    //no x component, y positive so particle falls
    //var vel = createVector(0,5);
    
    //oneParticle = new Particle(pos,vel);
    //twoParticle = new Particle(pos2,vel);
    
    
    //console.log(particleSystem);
}

//var value = 0;

//---------------------------------------------------------

function draw() {
    //re-draw background each cycle
    background(0);
    //blendMode(OVERLAY);
    
    //console.log(oneParticle);
    //oneParticle.update();
    //console.log(oneParticle);
    //oneParticle.draw();
    
    //twoParticle.update();
    //twoParticle.draw();
    
    //particle with size, mass, position in space, and a velocity. Store properties in an object, created with a function. 
    
    /*function mouseClicked() {
        if(value==0){
            value = 255;
        } else {
            value = 0;
        }
    }*/
            
    //println(value);
    /*fill(value);
    ellipse(mouseX,mouseY,5,5);*/
    
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
    //iterate through the particleSystem array and run update and draw functions for each.
   /* particleSystem.forEach(function(p){
        //before updating the particle, check whether it's dead. If so, remove from the array using array.splice(index,1).
        
        
        p.update();
        p.draw();
    })*/
    
    /*for(var i=0;i<array.length;i++){
        var el = array[i];
        //if to check if alive
        //but, because it only reads length once and length changes with splice, will end with error. Instead, run backward from the end.
    }*/
    

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
    this.lifeSpan = random(20,100);
    this.hue = random(hue-15,hue+15);
    
    this.update = function() {
        //console.log('update runs');
        //reduce its lifeSpan (same as this.lifeSpan = this.lifeSpan-1) or -=2 if you want to subtract 2 each time
        this.lifeSpan--;
        //position is a vector; add a vector using p5.js add function. Stores result in the original vector.
        this.position.add(velocity);   
        //console.log(this.position.y)
    }
    
    //function needs to draw itself
    this.draw = function() {
        //console.log('draw runs');
        noStroke();
        //fill(0,0,random(0,255));
        fill(this.hue,100,100);
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