//***************************************************************
//Company
//***************************************************************

var Company = function (n, s) {
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.name = n;
    this.sum = s;
    this.radius = sqrt(s) / 4000;
    this.defaultRadius = this.radius;
    this.connected = false;

    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng), sin(tempAng));

    this.pos.div(this.radius);
    this.pos.mult(1000);
    this.pos.set(this.pos.x + width / 2, this.pos.y + height / 2);

    var acceleration = createVector(0, 0);

    this.hue = 285;//purple
    this.alpha = .8;

    this.drawCompanies = function () {
            //update fill color for company bubble
            fill(this.hue, 100, 75, this.alpha); 
            
            //call prototype function to draw ellipse
            this.drawParticles(this);
                   
    }
    
    
    this.updateCompanies = function () {    

        
        function checkMouse(instance) {
            var mousePos = createVector(mouseX, mouseY);

            //if the mouse is over the company
            if (mousePos.dist(instance.pos) <= instance.radius) {
                instance.incRadius(instance);
                instance.hue = 325;//60;
                instance.alpha = .9;
                isMouseOver = true;
                
                //save the company in a temp variable
                selectedCompany = instance;
                
                investorSystem.forEach(function(g){
                    g.connected = false;
                })
                    
                selectedLabels = [];
                
                    //go through the topConnections array
                    topConnections.forEach(function(d,i){
                        
                        var connectIndex = i;
                        
                        //and look to see if the selected company matches the company in the topConnections array
                        if (d.company.name == selectedCompany.name){
                            //if (d.investor) {
                                var tempInvestor = d.investor;

                                //set the connection company pos to that of the selected company
                                d.company.pos = selectedCompany.pos;
                            
                                investorSystem.forEach(function(f){
                                    
//**********************************Adding this caused some investors not to have values for some reason - lines to upper right corner.                                    
                                    //check to see if this is a duplicate (same investor invests multiple times)
                                    var checkInv = selectedLabels.find(function(m){
                                        if (m.investor.name == tempInvestor.name){
                                            return true;
                                        }  
                                    })
                                    
                                    if (f.name == tempInvestor.name){
                                        topConnections[connectIndex].investor.pos = f.pos;
                                        f.connected  = true;
                                                                                
                                        //create labels and store                                                          
                                        var label = new CollisionLabels(f, selectedCompany);
                                            
                                        if (!checkInv){
                                            selectedLabels.push(label);   
                                        }
                                        
                                    }
                                    //else{ f.connected = false;}
                                                                        
                                    checkInv = false;   
                                })
                                
                                    //draw labels and connections
                                    //selectedLabels.forEach(function(l) {l.draw(l);});
                                    d.drawConnections();
                                    
                                    //d.investor.drawInvestors();
                            //}
                        }
                        
                        });           
                
                
            }          
            
            
 
            
 
            
            
           
            
            else {
                
                //if an investor is selected, gray out all of the companies except those connected to the investor
                    if(selectedInvestor){
                        //console.log(instance.connected);
                        if (instance.connected == false){
                            if(instance.alpha - .3 > 0) {
                                instance.hue = 285;
                                instance.alpha -= .2;
                            }
                            else { 
                                instance.hue = 285;
                                instance.alpha = .3;
                            }
                        }         
                        else {instance.hue = 285;
                            instance.alpha = .8;}
                    }
                    else {
                        
                        //isMouseOver = false;
                        
                        if ( instance.alpha < .8){
                            instance.hue = 285;
                            instance.alpha += .1;
                        }
                        else{
                            instance.hue = 285;
                            instance.alpha = .8;
                        }
                        
                    }
                
                
                    
                
                    if (instance.radius - instance.defaultRadius > 4) {
                        instance.radius -= 4;
                        
                    }
                    else if (instance.radius - instance.defaultRadius < 4 && instance.radius - instance.defaultRadius > 1) {
                        instance.radius -= 1;
                    }
                    else {
                        instance.radius = instance.defaultRadius;
                    }
                    
               // }

           }

        }       
        
        
        
        
        
        

        
        //if (!mouseListener) {checkMouse(this)};
        //checkMouse(this);
    
        //go through attractor array and update Company particles accordingly
        attractors.forEach(function (A) {
            //create a new vector att that points from the particle to the attractor. Using
            //a.pos.sub(position) doesn't work, because it changes the position vector of A itself
            //console.log(A.getPos());
            var att = p5.Vector.sub(A.getPos(), this.pos);
            //scale the new vector according to the distance^2. 
            var distanceSq = att.magSq();
            //don't need to calc the distance itself; use the magnitude squared b/c less 
            //computationally intensive to use the non-sqrt function.
            if (distanceSq > 1) {
                //multiply by the size to attract based on particle size 
                //att.div(distanceSq*pSize);
                att.normalize();
                att.div(10);
                //multiply or divide depending on the result of the distance calc. 
                //Threshold at 1 so that particles don't accelerate to infinity
                att.mult(1 * A.getStrength());
                //add this vector to the particle acceleration
                //att.mult(this.radius*this.radius/10);
                this.accel.add(att);
            }
            //tell it who "this" is - want it to be the object that it is inside (particle), 
            //rather than the one that was input (attractor)    
        }, this);
        
        
        //this.updateParticles();

        //update the velocity and position vectors  
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        
        checkMouse(this);

    }

}

//Assigns Particle as a prototype of Company
Company.prototype = Particle;