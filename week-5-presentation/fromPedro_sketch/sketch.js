"use strict";
var systems;

function setup() {
    createCanvas(710, 400);
    systems = [];
}

function draw() {
    background(51);
    background(0);
    for (var i = 0; i < systems.length; i++) {
        systems[i].run();
        systems[i].addParticle();
    }
    if (systems.length == 0) {
        fill(255);
        textAlign(CENTER);
        textSize(32);
        text("click mouse to add particle systems", width / 2, height / 2);
    }
}

function mousePressed() {
    this.p = new ParticleSystem(createVector(mouseX, mouseY));
    systems.push(p);
}

// A simple Particle class
class Particle {
    constructor(position){
        this.acceleration = createVector(0, 0.05);
        this.velocity = createVector(random(-1, 1), random(-1, 0));
        this.position = position.copy();
        this.lifespan = 255.0;  
    }
    run(){
        this.update();
        this.display();
    }
    update(){
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lifespan -= 2;
    }
    display(){
        stroke(200, this.lifespan);
        strokeWeight(2);
        fill(127, this.lifespan);
        ellipse(this.position.x, this.position.y, 12, 12);
    }
    isDead(){
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }
    
};


var ParticleSystem = function (position) {
    this.origin = position.copy();
    this.particles = [];
    this.addParticle = function () {
        // Add either a Particle or CrazyParticle to the system
        if (int(random(0, 2)) == 0) {
            p = new Particle(this.origin);
        } else {
            p = new CrazyParticle(this.origin);
        }
        this.particles.push(p);
    }

    this.run = function () {
        for (var i = this.particles.length - 1; i >= 0; i--) {
            var p = this.particles[i];
            p.run();
            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
};


class CrazyParticle extends Particle {
    constructor(position){
        super(position);
        this.theta = 0.0;
    }
    update(){
        super.update();
        this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
    }
    display(){
        super.display();
        push();
        translate(this.position.x, this.position.y);
        rotate(this.theta);
        stroke(255, this.lifespan);
        line(0, 0, 25, 0);
        pop();
    }
};



