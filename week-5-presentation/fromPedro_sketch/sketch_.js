var systems;

function setup() {
    createCanvas(710, 400);
    systems = [];
}

function draw() {
    background(51);
    background(0);
    for (i = 0; i < systems.length; i++) {
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
var Particle = function (position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255.0;
};

Particle.prototype = {
    run: function () {
        this.update();
        this.display();
    },
    update: function () {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lifespan -= 2;
    },
    display: function () {
        stroke(200, this.lifespan);
        strokeWeight(2);
        fill(127, this.lifespan);
        ellipse(this.position.x, this.position.y, 12, 12);
    },
    isDead: function () {
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }
}


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


var CrazyParticle = function (origin) {
    //calls the parent-s constructor.
    Particle.call(this, origin);
    this.theta = 0.0;
    
    this.update = function(){
        //call's the same parent method (this is ugly)
        Particle.prototype.update.call(this);
        this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
    }
    
    this.display = function(){
        //calls the same parent's method (this is ugly)
        Particle.prototype.display.call(this);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.theta);
        stroke(255, this.lifespan);
        line(0, 0, 25, 0);
        pop();
    }
};

CrazyParticle.prototype = Particle.prototype;


