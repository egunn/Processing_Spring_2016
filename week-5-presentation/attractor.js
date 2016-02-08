//***************************************************************
//Attractor Functions
//***************************************************************

var GeneralAttractor = function(pos,s){
   
    var pos = pos.copy();
    var strength = s;
    //calculate translation vector to allow the attractors to move randomly
    var transl = createVector(0,1).mult(.2).rotate(TWO_PI*Math.random());
    
    //draw the attractors
    this.draw = function(v) {
        
        noStroke();
        
        //select the attractors with positive strength values (discriminates between 
        //GeneralAttractors and AttractorAs - later, implement switch statement
        //to distinguish multiple attractor types and behaviors)
        if (abs(strength)==strength){
            fill(180,60,75); //set color
            
            //scale ellipse based on attractor strength
            ellipse(pos.x,pos.y,1.5*strength,1.5*strength);
            
            //draw circles of the same color around the attractor, 
            //change radius with strength
            strokeWeight(0.25);
            stroke(180,100,50);
            noFill();
            ellipse(pos.x,pos.y,strength*5,strength*5);
            ellipse(pos.x,pos.y,strength*15,strength*15);
        }
        //if attractor strength is negative, color and scale circles differently
        else {
            fill(320,90,95);
            ellipse(pos.x,pos.y,strength,strength);
            strokeWeight(0.25);
            stroke(320,90,55);
            noFill();
            ellipse(pos.x,pos.y,strength*2,strength*2);
            ellipse(pos.x,pos.y,strength*8,strength*8);
        }
        
    }
    
    //update the attractor position and strength 
    this.update = function(v) {
        
        //keep them inside the window - if they leave, reverse the direction of their
        //translation, and give it a random rotation
        if (pos.x < canvasWidth && pos.x > 0 && pos.y > 0 && pos.y < height){
            pos = pos.add(transl);
        }
        else {
            transl = transl.mult(-1).rotate(Math.random()*PI/4);
            pos = pos.add(transl);
        }
        
        //set the strength within a given range        
        if (abs(strength)==strength){
            strength = strength+(Math.random()-.5);
            strength = constrain(strength,2,6);
        }
        else {
            strength = strength+(Math.random()-.5);
            strength = constrain(strength,-6,-2);
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
