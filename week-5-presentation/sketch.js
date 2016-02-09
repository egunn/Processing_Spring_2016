//Polymorphism was based on the examples in the Nature of Code by Daniel Shiffman, 
//and translated to p5.js partly with the help of the code posted at //https://zipcon.net/~swhite/docs/computers/languages/object_oriented_JS/inheritance.html

//*******************************************************
//Create global variables
//*******************************************************

var particleSystem = []; 
var attractors = [];


//*******************************************************
//Setup canvas 
//*******************************************************

//runs once, at page load.
function setup() {
    //store window width and height for sizing the canvas later
    canvasWidth = windowWidth-125;
    canvasHeight = windowHeight-200;
    
    //calculate constant attractor and particle density, based on screen size
    attractorDensity = Math.floor(1/13000*canvasWidth*canvasHeight);
    particleNumberLimit = Math.floor(1/8000*canvasWidth*canvasHeight);
    
    //associate canvas with #canvas object in the DOM
    var canvas = createCanvas(canvasWidth,canvasHeight);
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    //set color mode hue(0-360) saturation(0-100) brightness transparency
    colorMode(HSB,360,100,100,1);
    
    //and background color
    background(240,100,15,0.2);
    
    //create a set of GeneralAttractors with the right density
    for (var i=0; i<attractorDensity; i++){
        
        //create a new instance, push it into the attractors array
        var at = new GeneralAttractor(createVector
            (canvasWidth*Math.random(),canvasHeight*Math.random()),5);
        attractors.push(at);
    }

    //add a group of AttractorA attractors as well
    for (var i=0; i<attractorDensity; i++){
        
        var attA = new AttractorA(createVector
            (canvasWidth*Math.random(),canvasHeight*Math.random()),5);
        attractors.push(attA);
    }
    
}


//*******************************************************
//Resize canvas every time window size is changed manually
//*******************************************************

function windowResized() {
    resizeCanvas(canvasWidth, canvasHeight);
    canvasWidth = windowWidth-100;
    canvasHeight = windowHeight-120;
    background(240,100,15,0.2);
}


//*******************************************************
//Draw canvas 
//*******************************************************

//runs 30x/second, as set by frame rate
function draw() {
    //re-draw semi-transparent background each cycle
    background(240,100,15,0.2);
    
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

            //if there are fewer particles in the system than expected, or they 
            //are all outside of the screen, make a new particle 
            //system at the position where the last particle died
            if (particleSystem.length < particleNumberLimit  && p.getPos().x < canvasWidth 
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
    
    //go through the attractors array and update each one
    for(var i = attractors.length-1;i>=0;i--){
        
        var v = attractors[i];
        v.update();
        
    }
     
    //run through the attractors array, and draw each one
    attractors.forEach(function(at) {
        at.draw(at.getStrength());
    });

}


//*******************************************************
//Mouse clicked function
//*******************************************************

function mouseClicked() {
    //create a new system of particles each time the mouse is clicked inside the canvas.
    if (mouseX>0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight){
        createMightyParticles();
    }
}


//generic function to apply an input force vector to an object
//(added to support further particle/attractor generalization later)
function applyForce(object, force) {
    var vectors = object.getVectors();

    newPos = vectors.objPos;
    newVel = vectors.objVel;
    newAcc = vectors.objAcc.add(force);
    
    return {newPos,newVel,newAcc};
}