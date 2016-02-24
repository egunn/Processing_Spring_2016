//var oneParticle;

var table;
//input all companies as properties in the aggregated object - more efficient here than making each company its own object and accessing/indexing properties.
var aggregated = {};

//callback function that forces processing to wait until file loads 
//before running rest of code.
function preload(){
    table=loadTable("data/investments_clean.csv","csv","header");
}



//empty array with no particles in it (yet)
var particleSystem = []; 
var attractors = [];


//runs once, at page load.
function setup() {
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth,windowHeight);
    var width = windowWidth;
    var height = windowHeight;
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    background(0);
    
    //hue(0-360) saturation(0-100) brightness transparency
    colorMode(HSB,360,100,100,1);
    
    //create attractor 
    var at = new Attractor(createVector(width/2,height/2),5);
    
    attractors.push(at);
    
    print(table.getRowCount()+ "total rows in table");
    
    
    //for each row in table, grab name of company and amount in USD.
    //Look for company inside object file. If it exists, add USD to amount that was there.
    for (var r=0;r<table.getRowCount();r++){
        var cname = table.getString(r,"company_name");
        var invested = table.getString(r,"amount_usd");

        //convert string to integer to check for empty columns. Store in variable. 
        invested = parseInt(invested);

        //if it can't convert, returns NaN
        if(!isNaN(invested)){
            //if it has a property with cname (eg Facebook) 
            //Object key is company name
            if(aggregated.hasOwnProperty(cname)){
                //add invested amount to value
                aggregated[cname]+=invested;
            }
            else {
                //otherwise, add a new property with the invested amount
                //have to use aggregated[] format b/c cname has spaces in it
                //can't do aggregated.Google Inc w/ a space
                aggregated[cname] = invested;
            }
        }
    }
    
    //create an empty array
    var aAggregated =[];
    
    //Object is the master of all objects in JS 
    //get an array of all the properties in the object - gives a list of all 
    //the keys in the object. In this case, that's all the company names
    //For each company, 
    Object.keys(aggregated).forEach(function(key){
        //create a new object called entry
        var company = {};
        
        //store name and sum here 
        company.name = key;
        company.sum = aggregated[key]
        aAggregated.push(company);
    });

    
    //call sort function on an array, give it an anonymous function that looks at 
    //every pair of elements in the array
    aAggregated = aAggregated.sort(function(companyA,companyB){
        //sorts in descending order
        return companyB.sum - companyA.sum;
    })
    
        
    //top company
    print(aAggregated[0].name+ ":" + aAggregated[0].sum)
    //console.log(attractors[9].getPos());
}


//---------------------------------------------------------

//runs 30x/second, as set by frame rate
function draw() {
    //re-draw background each cycle
    background(0,0,0,0.0002);
   // blendMode(EXCLUSION);
    
  //go through the particle system and check if any particles are dead (start from the end, otherwise cutting components out of the array will cause problems)
    for(var i = particleSystem.length-1; i>=0; i--) {
        //grab one particle from the system
        var p = particleSystem[i];


        p.draw();
        p.update();
        
    }
       
    attractors.forEach(function(at) {
        at.draw();
    });

}




//function to resize window every time window size is changed manually
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


//use uppercase to describe an object
var Particle = function(pp,vv,hue) {
    //store position and velocity inside the object
    //create a copy of the original value in case you want to use it later
    var position = pp.copy();
    var velocity = vv.copy();
    
    /*
    //create an acceleration vector rotated to point downward, and store it in the object
    var accel = createVector(0,.4);
    accel.rotate(0,PI);
    //console.log(accel);
    var acceleration = accel;*/
    var acceleration = createVector(0,0);
    
    //give the particle a random size and a lifespan
    var pSize = random(3,10);
    //store initial lifespan
    var initialLifeSpan = random(20,100);
    this.lifeSpan = initialLifeSpan;
    //turn off color variation for now
    //this.hue = random(hue-15,hue+15);
    this.hue = 180;
    
    this.update = function() {
        //reduce its lifeSpan (same as this.lifeSpan = this.lifeSpan-1) or -=2 if you want to subtract 2 each time
        this.lifeSpan--;

        //keep the velocity from exceeding a value of 3 (limits influence of acceleration)
       // velocity.limit(3);
      
        //go through attractor array and update particles accordingly
        attractors.forEach(function(A){
            //create a new vector att that points from the particle to the attractor. Using a.pos.sub(position) doesn't work, because it changes the position vector of A itself
            //console.log(A.getPos());
            var att = p5.Vector.sub(A.getPos(),position);
            //scale the new vector according to the distance^2. 
            var distanceSq = att.magSq();
            //don't need to calc the distance itself; use the magnitude squared b/c less computationally intensive to use the non-sqrt function.
            if(distanceSq>1){
                //multiply by the size to attract based on particle size 
                att.div(distanceSq*pSize);
                //multiply or divide depending on the result of the distance calc. Threshold at 1 so that particles don't accelerate to infinity
                att.mult(10*A.getStrength());
                //add this vector to the particle acceleration
                acceleration.add(att);
            }
            
        });
        
         //position is a vector; add a vector using p5.js add function. Stores result in the original vector.
        //update the veocity and position vectors  
        velocity.add(acceleration);
        acceleration.mult(0);
        position.add(velocity);
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
        line(position.x,
             position.y,
             position.x-3*velocity.x,
             position.y-3*velocity.y);
        //turn off the stroke again
        noStroke();
        //draw the particle itself (better to do this after the line, so that the particle draws on top)
        ellipse(position.x,
                position.y,
                pSize,
                pSize);
    }
    
    //check if the particle is "dead"
    /*this.areYouDeadYet = function() {
                
        return this.lifeSpan <= 0;
        
    }*/
    
    this.getPos = function() {
        return position.copy();
    }
}

var Attractor = function(pos,s){
    var pos = pos.copy();
    var strength = s;
    
    this.draw = function() {
        noStroke();
        fill(0,100,100);
        ellipse(pos.x,pos.y,strength,strength);
    }
    
    this.getStrength = function() {
        return strength;
    }
        
    this.getPos = function() {
        return pos.copy();
    }
}