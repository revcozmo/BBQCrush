
    
function Defered(func){

    this.status = "waiting";
    this.error = null;
    this.result = null;
    this.notifiers = [];
    
    if (func){
        this.notifiers.push(func);
    }
    
    var self = this;

    this.failed = function(error){
        self.status = "failed";
        self.error = error;
        
        for (var i = 0 ; i < self.notifiers.length ; i++){
            self.notifiers[i](error, null);
        }
        
    }
    this.resolved = function(value){
        self.status = "resolved";
        self.result = value;
        
        for (var i = 0 ; i < self.notifiers.length ; i++){
            self.notifiers[i](null, value);
        }
    
    }
    
    this.notifyMe = function(func){
        self.notifiers.push(func);
    }
}


function AllDefered(arr, func){
    
    var defereds = arr;
    var self = this;
    var notif = function(err, val){
        if (defereds.length == 0){
            return;    
        }
        
        if (err){
            func(err, null);
            defereds = [];
        }
        
        
        for (var i = 0; i < defereds.length ; i++){
            if (defereds[i].status != "resolved"){
                break;
            }
        }
        
        func(null, defereds.map(function(el){
            return el.result;
        }));
    }
    
    for (var i = 0; i < defereds.length ; i++){
        if (defereds[i].status == "failed"){
            notif(defereds[i].error || new Error("unknown error"), null);
            
            break;
        }
        defereds[i].notifyMe(notif);
        if (defereds[i].status != "waiting"){
            notif(defereds[i].error, defereds[i].result)
        }
        
    }
    
    
    
}
    
