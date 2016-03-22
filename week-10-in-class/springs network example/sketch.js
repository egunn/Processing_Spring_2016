
var particleSystem = [];
var springs = [];


function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    frameRate(30);
    background(0);
    
    //create 20 randomly sized particles
    for(var i = 0; i<20; i++){
        particleSystem.push(new Particle(random(3,15)));
    }
    
    for(var i = 0; i<50; i++){
        //pick two particles randomly
        //int function truncates decimals, so don't need to use particleSystem.length-1
        var pa=particleSystem[int(random(0,particleSystem.length))];
        var pb=particleSystem[int(random(0,particleSystem.length))];
        
        //create the spring between 2 particles with rest length with minimum > sum of radii
        var spring = new Spring(pa, pb, random(pa.radius + pb.radius, 100));
        
        springs.push(spring);
    }
    frameRate(30);
    background(0);
 }


function draw(){
    background(0);    
    
    collisions();
    
    springs.forEach(function(sp){
        sp.update();
        sp.draw();
    })
    
    particleSystem.forEach(function (p){
        p.update();
        p.draw();
    });

}

var Spring = function(pa, pb, length){
    this.a = pa;
    this.b = pb;
    this.restLength = length;
    this.strength = 0.01;
    
    //draw spring as line between two input particles.
    this.draw = function(){
        stroke(0,100,255);
        strokeWeight(map(this.restLength,0,60,5,0.1))
        line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
        
    }
    
    this.update = function(){
        //vector points from b to a
        var delta = p5.Vector.sub(this.a.pos, this.b.pos);
        var dist = delta.mag();
        var disp = 1 - this.restLength / dist;
        delta.mult(disp * 0.5 * this.strength);
        
        this.a.pos.sub(delta);
        this.b.pos.add(delta);
    }
    
}

function collisions() {
        /*checks for pairs of particles*/
    for(var STEPS = 0; STEPS<4; STEPS++){
        for(var i=0; i<particleSystem.length-1; i++){
            for(var j=i+1; j<particleSystem.length; j++){
                var pa = particleSystem[i];
                var pb = particleSystem[j];
                var ab = p5.Vector.sub(pb.pos, pa.pos);
                var distSq = ab.magSq();
                if(distSq <= sq(pa.radius + pb.radius)){
                    var dist = sqrt(distSq);
                    var overlap = (pa.radius + pb.radius) - dist;
                    ab.div(dist); //ab.normalize();
                    ab.mult(overlap*0.5);
                    pb.pos.add(ab);
                    ab.mult(-1);
                    pa.pos.add(ab);
                    
                    pa.vel.mult(0.97);
                    pb.vel.mult(0.97);

                }
            }
        }
    }
}


var Particle = function(radius){

    this.radius = radius;
    this.pos = createVector(random(0,width), random(0,height));
    this.vel = createVector(0, 0);
    var acc = createVector(0, 0);
    
    this.update = function(){
       
    }  
    
    this.draw = function(){
        noStroke();
        
        fill(230,230,0,200);
        ellipse(this.pos.x, 
                this.pos.y,
                this.radius*2,
                this.radius*2);     
    }
    
}


function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

}

