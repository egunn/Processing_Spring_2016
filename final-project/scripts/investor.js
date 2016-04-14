//***************************************************************
//Investors
//***************************************************************

var Investor = function (n, s) {
    this.name = n;
    this.sum = s;
    this.pos = createVector(50, 50);
    this.radius = sqrt(this.sum) / 6000;
    this.defaultRadius = this.radius;
    this.alpha = .8;
    this.hue = 169;
    this.connected = false;
    
    
    
    
    
    
    
    
    
    
    
    
        this.drawInvestors = function () {
        //fill(190,100,90,.7);
        
        fill(this.hue, 100, 55, this.alpha);
        

        //call prototype function for shared features
        this.drawParticles(this);
    }
    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    this.updateInvestors = function() {
      
        function checkMouse(instance) {
            var mousePos = createVector(mouseX, mouseY);

                if (mousePos.dist(instance.pos) <= instance.defaultRadius) {
                    instance.incRadius(instance);
                    //instance.hue = 60;
                    instance.alpha = .9;
                    isMouseOver = true;
                    
                    selectedInvestor = instance;
                    
                    companySystem.forEach(function(g){
                        g.connected = false;
                    })
                    
                    topConnections.forEach(function(d,i){

                        var invIndex = i;
                        
                        if (d.investor.name == selectedInvestor.name){
                            
                            var tempCompany = d.company;
                            d.investor.pos = selectedInvestor.pos;
                            
                            companySystem.forEach(function(f){
                                //console.log(tempCompany);
                                if (f.name == tempCompany.name){
                                    topConnections[invIndex].company.pos = f.pos;
                                    f.connected = true;
                                }
                                //else { f.connected = false;}
                            })
                            
                            d.drawConnections();
                            //d.company.drawCompanies();
                            //d.company.drawCompanies();
                            //d.investor.drawInvestors();
                            //d.investor.drawLabels();

                        }
                    });    
                } 

 
            
            
            
            
                 else {

                    
                    if(selectedCompany){
                        if (instance.connected == false){
                            //instance.hue = 285;
                            if (instance.alpha - .1 > 0){
                                instance.alpha -= .2;
                            }
                            else {
                                instance.alpha = .1;
                            }
                        }         
                        else {//instance.hue = 285;
                            instance.alpha = .9;}
                    }
                    else { 
                        
                        //isMouseOver = false;
                        
                        if (instance.alpha < .9){
                            instance.alpha += .1;
                        }
                        else {
                            instance.alpha = .9;
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

                }

            //} 
        
            
        }
        
        
        
        
        
        
        
        checkMouse(this);
        
    }


}

Investor.prototype = Particle;