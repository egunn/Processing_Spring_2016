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

    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng), sin(tempAng));

    this.pos.div(this.radius);
    this.pos.mult(1000);
    this.pos.set(this.pos.x + width / 2, this.pos.y + height / 2);

    var acceleration = createVector(0, 0);

    this.hue = 310;//100;

    this.drawCompanies = function () {
        if(!mouseListener){
            //set fill color for company bubble
            fill(this.hue, 100, 85, .8); //90
            
            //call prototype function for shared features
            this.drawParticles(this);
            
        }
        else if(mouseListener){  //(if a company or investor is clicked on)
          
//**********if the company isn't the selected company, set its transparency to .1
//**********if the company is the selected one, increase its radius and show its label
            
            /*
            //eliminate transparency, set constant radius, and make text white
            fill(this.hue, 90, 85, 1); //85
            //this.radius = 55; //(maxRadius value)  
            this.drawParticles(this);
            */
        }
       
    }
    
    
    this.updateCompanies = function () {    

        
        function checkMouse(instance) {
            var mousePos = createVector(mouseX, mouseY);

            //if the mouse is over the company
            if (mousePos.dist(instance.pos) <= instance.radius) {
                instance.incRadius(instance);
                instance.hue = 340;//60;
                isMouseOver = true;
                
                //save the company in a temp variable
                var selectedCompany = instance;
                    
                    //go through the topConnections array
                    topConnections.forEach(function(d,i){
                        
                        var connectIndex = i;
                        
                        //and look to see if the selected company matches the company in the topConnections array
                        if (d.company.name == selectedCompany.name){
                            
                            var tempInvestor = d.investor;
                            
                            //set the connection company pos to that of the selected company
                            d.company.pos = selectedCompany.pos;
                            
                            /*
                            //go through the investorSystem array
                            investorSystem.forEach(function(d){
                                
                                //check whether the investor is there
                                if (d.name == tempInvestor.name){
                                    d.hue = 240;
                                };
                                
                            })*/
                            
                            var foundInvest = investorSystem.find(function (investor){
                            topConnections[connectIndex].investor.pos = tempInvestor.pos;    
                             return investor.name == tempInvestor.name;
                                
                            });
                            
                            
                            if (foundInvest) {
                                d.drawConnections();}
                            //d.company.updateCompanies();
                            //d.investor.updateInvestors();
                            //d.investor.drawLabels();

                        }
                    });                  
                
                
            }          
            
            
 
            
 
            
            
            
            
            else {
                //if (!mouseListener) {  //if nothing is selected
                    instance.hue = 270;//130;
                    isMouseOver = false;
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
        checkMouse(this);
    
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
        
        
        this.updateParticles();

        //update the velocity and position vectors  
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

        
        checkMouse(this);

    }

}

//Assigns Particle as a prototype of Company
Company.prototype = Particle;