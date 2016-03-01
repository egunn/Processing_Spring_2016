//************Add text legend with mouse-over capability for categories??

//var oneParticle;

var table;
var table2;
//input all companies as properties in the aggregated object - more efficient here than making each company its own object and //accessing/indexing properties.
var aggregated = {};

//create global to store length of categoryList array (to update color map)
var numCategories = [];

//callback function that forces processing to wait until file loads before running rest of code.
function preload(){
    //load company and investment data
    table=loadTable("data/investments_clean.csv","csv","header");
    //load company category information (columns are "name" and "category_code")
    table2=loadTable("data/companies_categories.csv","csv","header");
}

//empty array with no particles in it (yet)
var particleSystem = []; 
var attractors = [];

//***************************************************************
//SETUP
//***************************************************************

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
    var at = new Attractor(createVector(width/2,height/2),1);
    
    attractors.push(at);
    
    //print(table2.getRowCount()+ "total rows in table");
    
    //console.log(table2.getString(10,"name"));
    
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
            //check whether the aggregated object has a property with the value cname
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
        //company.category = aggregated[category];
        aAggregated.push(company);
    });

    
    //call sort function on an array, give it an anonymous function that looks at 
    //every pair of elements in the array
    aAggregated = aAggregated.sort(function(companyA,companyB){
        //sorts in descending order
        return companyB.sum - companyA.sum;
    })
    
    //save top 200 companies
    aAggregated = aAggregated.slice(0,200);

    //array to hold a list of unique category names (start with uncategorized, which we'll use to 
    //label companies that do not have a category stored in the original data table)
    categoryList = ['uncategorized'];
    
    //console.log(aAggregated.length);
    
    //go through companies stored in aAggregated and look up each company name
    for (var i=0; i<aAggregated.length;i++){
        //in the category array (table2)  
        //findRows() takes the string you want to find, and the column name to look in,
        //and returns the entire row of table array objects
        var foundCategory = table2.findRows(aAggregated[i].name,"name");
        
   
        //save the category array for the company named in the aggregated data object for the company.
        if (foundCategory.length>0){
            
            //Look in the categoryList array and see if the category is already stored there.
            //If it isn't, push the category information stored in the row of the table corresponding 
            //to the company name into the categoryList array
            if( !categoryList.find(function(d){
                //check whether foundCategory is inside the categoryList array
                if(d == foundCategory[0].get("category_code")) return true;
                    else return false;
                })){
            
                categoryList.push(foundCategory[0].get("category_code"));
            }
            
            //store the found category in the company object from the aAggregated array.
            aAggregated[i].category = foundCategory[0].get("category_code");
            
            //store an arbitrary category number, based on position in the categoryList array
            //(use to assign color later)
            aAggregated[i].categoryNumber = categoryList.indexOf(foundCategory[0].get("category_code"));
                                                                
        } 
        else{
            aAggregated[i].category = 'uncategorized';
        }
    }
    
    //top company
    //print(aAggregated[0].name+ ":" + aAggregated[0].sum + " ,"+ aAggregated[0].categories)
    //console.log(attractors[9].getPos());
    //console.log(categoryList.length);
 
    //save length of categoryList array for use in writing color map in Particle function.
    numCategories = categoryList.length;
    
    //create particles
    for(var i=0;i<100;i++){
        //create new particle, pass information about company name, total invested,
        //category name, and category number.
        var p = new Particle(aAggregated[i].name,aAggregated[i].sum,aAggregated[i].category,        
                aAggregated[i].categoryNumber);
        particleSystem.push(p);
    }
    

}


//***************************************************************
//DRAW
//***************************************************************

//runs 30x/second, as set by frame rate
function draw() {
    //re-draw background each cycle
    background(0);
   // blendMode(EXCLUSION);
    
    /*
    textSize(20);
    textAlign(LEFT);
    text("Top funded companies in 2013",50,80);*/

    //run collision minimization 3x before giving me the results
    for(var STEPS = 0; STEPS < 4; STEPS++) {
    
        //pairwise comparison - save unique pair  particle a and b to compare to see if they are intersecting
        //if intersecting, adjust by precise amount needed to remove overlap.
        for(var i=0;i<particleSystem.length-1;i++){
            for(var j=i+1;j<particleSystem.length;j++){
                var pa = particleSystem[i];
                var pb = particleSystem[j];

                var ab= p5.Vector.sub(pb.pos,pa.pos);
                //distSq
                var distSq = ab.magSq();

                //since working with distance squared, also square the sum (faster than taking sqrt)
                //if particles intersect
                if(distSq <=sq(pa.radius+pb.radius)){
                    var dist = sqrt(distSq);
                    //calculate the overlap distance
                    var overlap = (pa.radius+pb.radius)-dist;
                    //normalize the ab vector
                    ab.div(dist);
                    //scale it by the overlap distance
                    ab.mult(overlap*0.5);
                    //add the ab vector to the position of particle b
                    pb.pos.add(ab);
                    //reverse the direction of the ab vector
                    ab.mult(-1);
                    //add it to the position of particle a
                    pa.pos.add(ab);
                    
                    //"dumping" velocity - add friction when there are collisions. If overlapping, don't move as fast. 
                    //replaces limit function, which is computationally expensive
                    pa.vel.mult(0.97);
                    pb.vel.mult(0.97);
                }
            }
        }
    }
    
    
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


//***************************************************************
//PARTICLE
//***************************************************************

//use uppercase to describe an object
var Particle = function(n, s, c, cn) {
    //store position and velocity inside the object
    //create a copy of the original value in case you want to use it later
    
    this.vel = createVector(0,0);
    this.accel = createVector(0,0);
    this.name = n;
    this.sum = s;
    this.category = c;
    this.categoryNumber = cn;
    
    //set particle radius
    this.radius = sqrt(s)/4000;
    var initialRadius = this.radius;
        
    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng),sin(tempAng));
    
    this.pos.div(this.radius);
    this.pos.mult(1000);
    this.pos.set(this.pos.x + width/2, this.pos.y + height/2);

    var acceleration = createVector(0,0);
    
    //give the particle a random size and a lifespan
    var pSize = random(3,10);
    //store initial lifespan
    var initialLifeSpan = random(20,100);
    this.lifeSpan = initialLifeSpan;
    //turn off color variation for now
    //this.hue = random(hue-15,hue+15);

    //create color map based on the number of categories found.
    var hue = map(this.categoryNumber,0,numCategories,0,360);    
    this.hue = hue;
    
    this.update = function() {
        
        //checkMouse is defined as private function. (Remember to reset mouseOver variable). 
        //this.draw is a public function; checkMouse is a private function. 
        //With something that uses this, it "knows" it's inside a particle 
        //instance. Private functions do not have a context for where they 
        //are - don't know what "this" is. When it is called, pass it 
        //"this": checkMouse(this);
        
        function checkMouse(instance) {
            var mousePos = createVector(mouseX,mouseY);
            if(mousePos.dist(instance.pos)<=instance.radius){
                //console.log("mouseOver");
                incRadius(instance);
                instance.hue=345;
                isMouseOver = true;
            }
            else{
                instance.hue=hue;
                isMouseOver = false;
                if(instance.radius>initialRadius){
                    instance.radius-=4;
                }
            }
        }
        
        var maximumRadius = 62;
        
        function incRadius(instance){
            instance.radius+=4;
            if(instance.radius>maximumRadius){
                instance.radius = maximumRadius;
                fill(255); 
                textSize(14);
                textAlign(CENTER);
                if(textWidth(instance.name)<2*maximumRadius-20){
                    text(instance.name,instance.pos.x,instance.pos.y-3); 
                    textSize(11);
                    text("($"+nfc(instance.sum,0)+")",instance.pos.x,instance.pos.y+13);
                }
                else {
                    twoLines = split(instance.name," ");
                    text(twoLines[0],instance.pos.x,instance.pos.y-12);
                    text(twoLines[1],instance.pos.x,instance.pos.y+3);
                    textSize(11);
                    text("($"+nfc(instance.sum,0)+")",instance.pos.x,instance.pos.y+18);
                }
                
            }

        }
        
        
        //reduce its lifeSpan (same as this.lifeSpan = this.lifeSpan-1) or -=2 if you want to subtract 2 each time
        this.lifeSpan--;

        //keep the velocity from exceeding a value of 3 (limits influence of acceleration)
       // velocity.limit(3);
      
        //go through attractor array and update particles accordingly
        attractors.forEach(function(A){
            //create a new vector att that points from the particle to the attractor. Using a.pos.sub(position) doesn't work, because             
            //it changes the position vector of A itself
            //console.log(A.getPos());
            var att = p5.Vector.sub(A.getPos(),this.pos);
            //scale the new vector according to the distance^2. 
            var distanceSq = att.magSq();
            //don't need to calc the distance itself; use the magnitude squared b/c less computationally intensive to use the non-sqrt              
            //function.
            if(distanceSq>1){
                //multiply by the size to attract based on particle size 
                //att.div(distanceSq*pSize);
                att.normalize();
                att.div(10);
                //multiply or divide depending on the result of the distance calc. Threshold at 1 so that particles don't accelerate to infinity
                att.mult(1*A.getStrength());
                //add this vector to the particle acceleration
                //att.mult(this.radius*this.radius/10);
                //***********commenting out this line keeps graphic static - not sure why?
                this.accel.add(att);
            }
        //tell it who "this" is - want it to be the object that it is inside (particle), rather than the one that was input (attractor)    
        },this);
        
        
        checkMouse(this);
        
        //position is a vector; add a vector using p5.js add function. Stores result in the original vector.
        //update the veocity and position vectors  
        //this.vel.limit(1);
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);
        
    }
    
    //function needs to draw itself
    this.draw = function() {
        //turn off the stroke for the particles
        noStroke();
        //map the transparency to the lifespan of the particle
        //var transparency = map(this.lifeSpan,0,initialLifeSpan,0,1);    
        //fill(100,100,100,0.8);
        //console.log(this.hue);
        fill(this.hue,75,100,0.8);    
        
        //draw the particle itself (better to do this after the line, so that the particle draws on top)
        ellipse(this.pos.x,
                this.pos.y,
                this.radius*2,
                this.radius*2);
        

    }
    

}


//***************************************************************
//ATTRACTOR
//***************************************************************

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