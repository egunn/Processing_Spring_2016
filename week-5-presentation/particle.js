//*******************************************************
//Create Particle System
//*******************************************************

//this function works with or without arguments (no argument for general use, 
//but required for auto-regenerate)
function createMightyParticles(initialPos) {

    //make 10 particles when the mouse is clicked
    for(var i=0;i<10;i++){
        
        //this section is used to create variable-color particles
        //not needed in this version, but left in for future expansion
        /*
        //create a variable to center the color scale around
        var hueSeed;
        
        //if it's the first particle in the system, set the value 
        //of hueSeed to a random # between 20 and 340 (this will 
        //set the color for the whole system)
        //if(i==0){
            //change to constant color for now
            //hueSeed=(50);
            //hueSeed = random(20,340);
        //}
        
        //Set the hue for each particle in the series to be within 20 units 
        //of the hueSeed color (so that they're all different shades of 
        //yellow, blue, or whatever)
        var hue = hueSeed;//random(hueSeed-20,hueSeed+20);*/
        
        var hue; //not initiated - use in future version
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
        particleSystem.push(newBornA);
        
    }
}



//*******************************************************
//Create Particle Function
//*******************************************************

//create a Particle object
var Particle = function(pp,vv,hue) {
    
    //store position and velocity inside the object
    //create a copy of the original value in case you want to use it later
    var position = pp.copy();
    var velocity = vv.copy();
    var typeA = false;
    //set maximum velocity for particles
    var speedLimit = 2.5;
    
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
  
        //keep the velocity from exceeding speedLimit (limits influence of
        //acceleration)
        velocity.limit(speedLimit);
        
        //go through attractor array and update particles accordingly
        attractors.forEach(function(A){
            
            //create a new vector att that points from the particle to the 
            //attractor. 
            var att = p5.Vector.sub(A.getPos(),position);
            
            //scale the new vector according to the distance^2. 
            var distanceSq = att.magSq();
            
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
        
        //This function is an attempt at creating autonomy, as outlined in the 
        //Nature of Code. The effect is there, but not as dramatic as I'd expected. 
        //Needs further examination!
        
        //tell particle to seek the center of the screen:
        var newAcc = this.seek(createVector(width/2,height/2));
        
        //position is a vector; add a vector using p5.js add function. 
        //Stores result in the original vector.
        //update the veocity and position vectors depending on type
        if (typeA){
    
            //use newAcc to account for the force added in particle autonomy mode
            //(should be attracted to the center of the screen)
            velocity.add(newAcc.mult(-1));
            
            //reset acceleration to zero
            newAcc.mult(0);
            
            //invoke speedLimit
            velocity.limit(speedLimit);
            
            //update position
            position.add(velocity);
        }
        else{
            //do not add seek velocity to GeneralParticles (teal) - just use 
            //default behavior
            velocity.add(acceleration);
            acceleration.mult(0);
            position.add(velocity); 
        }

    }
    
    //tell the particle to draw itself (color set here, for now)
    this.draw = function() {

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
        
        //turn off the stroke for drawing particles
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
    
    
    this.getVectors = function() {
        var objPos = position.copy();
        var objVel = velocity.copy();
        var objAcc = acceleration.copy();
        return {objPos,objVel,objAcc};
    }
    
    this.setTypeA = function() {
        typeA = true;
    }
    

    //make particle "want" to move in a particular direction
    //input current position vector, and particle target vector.
    this.seek = function(target) {
        var vectorsIn = this.getVectors();

        var desired = vectorsIn.objPos.sub(target);
        desired.normalize();
        
        //doesn't appear to actually do anything
        desired.mult(speedLimit);
        
        var steer = desired.sub(vectorsIn.objVel);
        
        //theoretically, this number should control the strength of "preference" for
        //the target location. Doesn't seem to do much.
        steer.limit(10);
        
        updatedVectors = applyForce(this,steer);
        
        //console.log(updatedVectors.newAcc);
        //should return three new pos, accel, veloc vectors to the function space. 
        //What to do with them? For now, just return newAcc for the update function
        
        return updatedVectors.newAcc;
 
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

