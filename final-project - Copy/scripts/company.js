//***************************************************************
//Company
//***************************************************************

var Company = function (n, s) {
    //set up base properties 
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.name = n;
    this.sum = s;
    this.radius = sqrt(s) / 4000;
    this.defaultRadius = this.radius;  //used for determining what size to reset to after radius increased on highlight
    this.connected = false;            //check whether it has connections to draw
    this.hue = 285;
    this.alpha = .8;
    
    //calc and store initial position and acceleration
    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng), sin(tempAng));
    this.pos.div(this.radius);
    this.pos.mult(1000);
    this.pos.set(this.pos.x + width / 2, this.pos.y + height / 2);

    var acceleration = createVector(0, 0);


    this.drawCompanies = function () {
            //update fill color for company bubble
            fill(this.hue, 100, 75, this.alpha); 
            
            //call prototype function to draw ellipse
            this.drawParticles(this);
                   
    }
    
    
    this.updateCompanies = function () {    
        
        //check whether mouse is over particle. If so, increase size, add label, update connections and investor displays
        function checkMouse(instance) {
            var mousePos = createVector(mouseX, mouseY);

            if (mousePos.dist(instance.pos) <= instance.radius) {
                instance.incRadius(instance);
                instance.hue = 325;//60;
                instance.alpha = .9;
                isMouseOver = true;
                
                selectedCompany = instance;  //used to pass information to investor system and labels for updating
                
                //reset connection values for investors
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
                                                                                                        
                                    checkInv = false;   
                                })
                                
                                    //draw connections
                                    d.drawConnections();
                                   
                        }
                        
                        });           
                
                
            }                  
            
           
            
            else {
                
                //if an investor is selected, gray out all of the companies except those connected to the investor
                if(selectedInvestor){
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

                    if ( instance.alpha < .8){
                        instance.hue = 285;
                        instance.alpha += .1;
                    }
                    else{
                        instance.hue = 285;
                        instance.alpha = .8;
                    }
                        
                }
                
                
                //decrease radii if not highlighted

                if (instance.radius - instance.defaultRadius > 4) {
                    instance.radius -= 4;

                }
                else if (instance.radius - instance.defaultRadius < 4 && instance.radius - instance.defaultRadius > 1) {
                    instance.radius -= 1;
                }
                else {
                    instance.radius = instance.defaultRadius;
                }

           }

        }       
        
        

        //go through attractor array and update Company particles accordingly
        attractors.forEach(function (A) {
            var att = p5.Vector.sub(A.getPos(), this.pos); 
            var distanceSq = att.magSq();
    
            if (distanceSq > 1) {
                att.normalize();
                att.div(10);
                att.mult(1 * A.getStrength());
                this.accel.add(att);
            }
  
        }, this);
        

        //update the velocity and position vectors  
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        
        checkMouse(this);

    }

}

//Assigns Particle as a prototype of Company
Company.prototype = Particle;