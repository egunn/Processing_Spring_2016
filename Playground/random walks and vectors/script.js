//declare an empty array to hold the walker(s)
var walkers = [];

//create some variables with which to populate the walkers
var walkerX, walkerY;

//write a function to construct the walker objects
function Walker(x,y){
    //set x and y parameters
    this.x = x;
    this.y = y;
    
    this.display = function() {
        stroke(0);
        //point(this.x,this.y);
        ellipse(this.x,this.y,5,5);
    }
    
    this.randomWalk = function() {
        //console.log('test');
        //choose a random value between -1 and 1 for x and y; this will determine whether the walker steps right, left, or stays put. (Note that this does not work without converting the random number to an int before subtracting - otherwise, it moves consistently down and to the right, with only minor fluctuations!)
        var stepX = int(random(3))-1;
        var stepY = int(random(3))-1;
        this.x += stepX;
        this.y += stepY;
    }
    
    this.walkRight = function() {
        r = random(1);
        
        //40% chance of moving right
        if (r<0.4) {
            this.x = x++;
        }
        //20% chance of moving left
        else if (r<0.6) {
            this.x = x--;
        }
        //20% chance of moving down
        else if (r<0.8) {
            this.y = y++;
        }
        //20% chance of moving up
        else {
            this.y = y--;
        }
    }
    
    //declare a variable to index time for Perlin noise function
    var tX=500, tY=350;
    
    this.walkPerlin = function() {
        //map the value of the noise function onto the width and height of the screen
        //map(value, current min, current max, new min, new max)
        this.x = map(noise(tX),0,1,width,0)
        this.y = map(noise(tY),0,1,0,height)
        
        //increment t
        tX += .01;
        tY += .01;
    }
    
    
}


function vector(x,y) {
    this.x = x;
    this.y = y;
    
    this.add = function(v) {
        this.x = this.x+ v.x;
        this.y = this.y+ v.y;
    }
    
    this.sub = function(v) {
        this.x = this.x - v.x;
        this.y = this.y - v.y;
    }
    
    //declare a variable to index time for Perlin noise function
    var tX=500, tY=350;
    
    this.walkerPerlinVector = function() {
        this.x = this.x+noise(tX);
        this.y = this.y+noise(tY);
    
        //increment t
        tX += .01;
        tY += .01;
    }
    
    this.walkPerlinInAPen = function() {
 
    }
    
}

//set up the canvas - this section runs only once
function setup() {
    createCanvas(1024,768);
    //stroke('none');
    //fill(155);
    //set the canvas to white
    background(255);
    test = new Walker(500,350);
    
    loc = new vector(100,100);
    vel = new vector(2.5,5);
    cent = new vector(width/2, height/2);
}

//the draw function runs many times per second (30?) - anything in here executes continuously
function draw() {
    
    //test.display();
    //test.walkPerlin();
    loc.walkerPerlinVector();
    
    loc.add(vel);
        if ((loc.x > width)|| (loc.x<0)){
            vel.x = vel.x*-1;   
        }
        if ((loc.y > height)|| (loc.y<0)){
            vel.y = vel.y*-1;   
        }
    
    stroke('black');
    fill('175');
    
    //loc.x is growing too fast, because subtracts center value from vector each time draw is run! Need to fix this first!
   // println(loc.x);
    loc.sub(cent);

    rect(loc.x,loc.y,5,5);
    line(loc.x,loc.y, 0, 0);
    //println(location);
}