//***************************************************************
//Investors
//***************************************************************

var Investor = function (n, s) {
    this.name = n;
    this.sum = s;
    this.pos = createVector(0, 0);
    this.radius = sqrt(this.sum) / 6000;
    this.defaultRadius = this.radius;

    
    
    
    
    
    
    
    
    
    
    
    
        this.drawInvestors = function () {
        //fill(190,100,90,.7);
        fill(169, 100, 60, .95);

        //call prototype function for shared features
        this.drawParticles(this);
    }
    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    this.updateInvestors = function() {
      
        function checkMouse(instance) {
            var mousePos = createVector(mouseX, mouseY);

                if (mousePos.dist(instance.pos) <= instance.defaultRadius) {
                    instance.incRadius(instance);
                    //instance.hue = 60;
                    isMouseOver = true;
                    
                    selectedInvestor = instance;
                    
                    topConnections.forEach(function(d,i){

                        
                        
                        if (d.investor.name == selectedInvestor.name){
                            
                            var tempCompany = d.company;
                            d.investor.pos = selectedInvestor.pos;
                            
                            companySystem.forEach(function(d){
                                //console.log(tempCompany);
                                if (d.name == tempCompany.name){
                                    topConnections[i].company.pos = d.pos;
                                    d.hue = 340;
                                };
                            })
                            
                            d.drawConnections();
                            //d.company.drawCompanies();
                            //d.investor.drawInvestors();
                            //d.investor.drawLabels();

                        }
                    });    
                } 

 
            
            
            
            
             else {
                    instance.hue = 130;
                    isMouseOver = false;
                    if (instance.radius - instance.defaultRadius > 4) {
                        instance.radius -= 4;
                        selectedInvestor = null;
                    }
                    else if (instance.radius - instance.defaultRadius < 4 && instance.radius - instance.defaultRadius > 1) {
                        instance.radius -= 1;
                    }
                    else {
                        instance.radius = instance.defaultRadius;
                    }
                    
                }

            //} 
        
            
        }
        
        
        
        
        
        
        

        
        checkMouse(this);
        
    }


}

Investor.prototype = Particle;