
var particleSystem = [];

function setup(){
    var canvas = createCanvas(windowWidth,                      windowHeight);
    frameRate(30);
    
    
    colorMode(HSB, 360, 100, 100, 100);

}


function draw(){
    background(0);
    blendMode(SCREEN);
    
    for(var i=particleSystem.length-1; i>=0; i--){
        var p = particleSystem[i];
        if(p.areYouDeadYet()){
            //removes the particle from the array
            particleSystem.splice(i, 1);
        }else{
            //updates and renders the particle
            p.update();
            p.draw();
            
        }
        
    }
   

    
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

}


var Particle = function(position, velocity, hue){
    this.position = position.copy();
    this.velocity = velocity.copy();
    this.size = 10;
    this.lifeSpan = random(20, 100);
    this.hue = random(hue-15, hue+15);
    
    this.update = function(){
        this.lifeSpan--; // this.lifeSpan =                                 this.lifeSpan - 1;
        this.position.add(velocity);
        
    }  
    
    this.draw = function(){
        noStroke();
        fill(this.hue, 100, 100);
        ellipse(this.position.x, 
                this.position.y,
                this.size,
                this.size);
        
    }
    this.areYouDeadYet = function(){
        return this.lifeSpan <= 0;
    }
}

function createMightyParticles(){
    var hue = random(20, 300);
    for(var i=0; i<200; i++){
        var pos = createVector(mouseX,                                        mouseY);
        var vel = createVector(0,1);
        vel.rotate(random(0, TWO_PI));
        vel.mult(random(1, 10));
        
        var newBorn = new Particle(pos, vel, hue);
        particleSystem.push(newBorn);
        
    }
    
}

function mouseClicked(){
    //we will create a mighty system of particles here
    createMightyParticles();
    
}


//*var particle = new Particle(myposition,                                     myvelocity);*/