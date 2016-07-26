var surface = document.getElementById("surface");
var background = document.getElementById("background");
var bg = background.getContext("2d");
var ctx = surface.getContext("2d");

var scoreElement = document.getElementById("score");

var foods = ["beef", "chicken", "ribs", "sausage", "sausage2"];
var imageFoods = foods.map(function (food) {
    var img = new Image();
    img.src = "images/" + food + ".png";
    return img;
});
var alldefered = new AllDefered(imageFoods.map(function (imgfood) {
        var defered = new Defered();
        imgfood.onload = function () {
            defered.resolved(imgfood);
        };
        imgfood.onerror = function (err) {
            defered.failed(err || new Error("unknown error"));
        };
        return defered;
    }), function (err, values) {
        if (err) {
            alert("Error on loading one or more images. " + err.message);
        }
        else {
            game();
        }
    })
    //var colors = ["red", "blue", "green", "orange", "purple"];
var tableSize = 6;
var game = function () {
    var render = new Render(ctx);
    var cellW = surface.width / tableSize;
    var cellH = surface.height / tableSize;
    
    var score = 0;
    
    var bgRender = new Render(bg);
    for (var i = 1; i < tableSize; i++) {
        bgRender.addObject(new Line(0, i * cellH, surface.height, i * cellH));
        bgRender.addObject(new Line(i * cellW, 0, i * cellW, surface.width));
    }
    var places = new Array(tableSize);
    for (var i = 0; i < tableSize; i++) {
        places[i] = new Array(tableSize);
    }
    for (var i = 0; i < tableSize; i++) {
        for (var j = 0; j < tableSize; j++) {
            var obj = null;
            do {
                var foodIdx = Math.floor(Math.random() * (5 - 0));
                obj = new Food(imageFoods[foodIdx], i * cellW + 0.1 * cellW, j * cellH + 0.1 * cellH, 0.8 * cellW, 0.8 * cellH);
                obj.type = foods[foodIdx];
            } while (objMatches(obj, i, j, places));
            places[i][j] = obj;
            render.addObject(obj);
        }
    }
    
    bgRender.draw();
    render.draw();
    var mouseIsDown = false;
    var selectedPiece = null;
    surface.addEventListener("mouseup", mouseUp);
    surface.addEventListener("mousedown", mouseDown);
    surface.addEventListener("mousemove", mouseMove);

    function objMatches(obj, x, y, table) {
        var nequals = 0;
        for (var i = x - 2; i <= x + 2; i++) {
            if (i < 0 || i == x) continue;
            if (i >= tableSize - 1) break;
            nequals++;
            var sibling = table[i][y];
            if (sibling == null || sibling.type != obj.type) {
                nequals = 0;
            }
            if (nequals >= 2) {
                return true;
            }
        }
        nequals = 0;
        for (var j = y - 2; j <= y + 2; j++) {
            if (j < 0 || j == y) continue;
            if (j >= tableSize - 1) break;
            nequals++;
            var sibling = table[x][j];
            if (sibling == null || sibling.type != obj.type) {
                nequals = 0;
            }
            if (nequals >= 2) {
                return true;
            }
        }
        return false;
    }

    function piecesEatten(table){
        var ret = {};
        
        for (var i = 0; i < table.length ; i++){
            
            for(var j = 0; j < table[i].length; j++){
                if (i > 1){
                    if (table[i][j].type == table[i-1][j].type && table[i][j].type == table[i-2][j].type ){
                        ret[(i-2) + "_" + j] = {x: i-2, y: j};
                        ret[(i-1) + "_" + j] = {x: i-1, y: j};
                        ret[i + "_" + j] = {x: i, y: j};
                        
                    }
                }
                
                if (j > 1){
                    if (table[i][j].type == table[i][j-1].type && table[i][j].type == table[i][j-2].type ){
                        ret[i + "_" + (j-2)] = {x: i, y: j-2};
                        ret[i + "_" + (j-1)] = {x: i, y: j-1};
                        ret[i + "_" + j] = {x: i, y: j};
                        
                    }
                }
            }
            
        }
        
        return ret;
        
    }
    
    function switchPieces(piecesData){
        var places2 = [];
        for (var i = 0; i < places.length ; i++){
            places2.push( places[i].slice(0) );
            //places2[i] = new Array(places[i].length);
//            for (var j = 0; j < places[i].length ; j++){
//                places2[i,j] = places[i,j];
//            }
        }
        
        var obj1 = places2[piecesData.x1][piecesData.y1];
        var obj2 = places2[piecesData.x2][piecesData.y2];
        
        
        
        places2[piecesData.x1][piecesData.y1] = places[piecesData.x2][piecesData.y2] ;
        places2[piecesData.x2][piecesData.y2] = places[piecesData.x1][piecesData.y1] ;
        
        var pieces = piecesEatten(places2);
        
        
       
        var npieces = Object.keys(pieces).length;
        
        if (npieces > 0){
            
            score += npieces;
            
            updateScore();
            
            animateSwitch(obj1, obj2, false, function(){
                
                for (var property in pieces) {
                    if (pieces.hasOwnProperty(property)) {
                        var el = places2[pieces[property].x][pieces[property].y];
                        el.type = null;
                        el.img = new Image();
                    }
                }
                
                places = places2;
                render.draw();
                
                clearHightlight();
            
                do {
                    newPieces()
                
                    var pieces2 = piecesEatten(places);
        
        
       
                    var npieces2 = Object.keys(pieces2).length;

                    if (npieces2 > 0){
                        for (var property in pieces2) {
                            if (pieces2.hasOwnProperty(property)) {
                                var el = places[pieces2[property].x][pieces2[property].y];
                                el.type = null;
                                el.img = new Image();
                            }
                        }
                    }
                        
                }while(npieces2 > 0)
            
                
            });
            
            console.log("foi!");
            
            
            
        } else {
            
            animateSwitch(obj1, obj2, true, function(){
                clearHightlight();
            });
            
            console.log("num foi");
        }
        
        
    }

    function newPieces (){
        for (var i=0 ; i < places.length ; i++){
            var bottomEmpty = null;
            for(var j = places[i].length - 1; j >= 0 ; j--){
                var piece = places[i][j];
                
                if (piece.type == null){
                    if (bottomEmpty == null){
                        bottomEmpty = j;
                    }
                    render.removeObject(piece);
                } else {
                    if (bottomEmpty != null){
                        var emptyPiece = places[i][bottomEmpty];
                        places[i][bottomEmpty] = piece;
                        places[i][j] = "";
                        
                        bottomEmpty--;
                        
                        animateMove(piece, emptyPiece, function(){
                            
                        });
                    }
                }
                
                
            } 
            
            for (var j = 0; j < places[i].length && (places[i][j] == "" || places[i][j].type == null) ; j++){
                
                var foodIdx = Math.floor(Math.random() * (5 - 0));
                var obj = new Food(imageFoods[foodIdx], i * cellW + 0.1 * cellW, j * cellH + 0.1 * cellH, 0.8 * cellW, 0.8 * cellH);
                obj.type = foods[foodIdx];
                places[i][j] = obj;
                render.addObject(obj)
            } 
            
            
        }
        
        setTimeout(function(){
            redefinePositions();
            render.draw();
        }, 1000);
    }
    
    function clearHightlight(){
        for (var i = 0; i < places.length; i++){
            
            for (var j = 0 ; j < places[i].length ; j++){
                
                var obj = places[i][j];
                obj.highlighted = false;
                
            }
            
        }
        
        render.draw();
    }
    
    function redefinePositions(){
        for (var i = 0; i < places.length; i++){
            
            for (var j = 0 ; j < places[i].length ; j++){
                
                var obj = places[i][j];
                obj.x = i * cellW + 0.1 * cellW;
                obj.y = j * cellH + 0.1 * cellH; 
            }
            
        }
    }
    
    function animateSwitch(obj1, obj2, undo, finishCallback){
        
        var count = 5;
        
        var wholeRect = rectContainingPoints([{x: obj1.x, y: obj1.y},{x: obj1.x + obj1.w, y: obj1.y + obj1.h},
                                          {x: obj2.x, y: obj2.y},{x: obj2.x + obj2.w, y: obj2.y + obj2.h}]);
        
        var ox1 = obj1.x, dx1 = obj2.x, stepx1 = (dx1 - ox1)/count;
        var ox2 = obj2.x, dx2 = obj1.x, stepx2 = (dx2 - ox2)/count;
        var oy1 = obj1.y, dy1 = obj2.y, stepy1 = (dy1 - oy1)/count;
        var oy2 = obj2.y, dy2 = obj1.y, stepy2 = (dy2 - oy2)/count;
        
        
        var interval = setInterval(function(){
                count--;
                
                obj1.x += stepx1;
                obj1.y += stepy1;
                obj2.x += stepx2;
                obj2.y += stepy2;
                
            
                ctx.clearRect(wholeRect.x, wholeRect.y, wholeRect.w, wholeRect.h);
                
                if (count == 0){
                    
                    obj1.x = dx1;
                    obj1.y = dy1;
                    obj2.x = dx2;
                    obj2.y = dy2;
                    
                    clearInterval(interval);
                    if (undo){
                        animateSwitch(obj2, obj1, false, finishCallback);
                    } else {
                        finishCallback();
                    }
                }
                
                
            
                obj1.draw(ctx);
                obj2.draw(ctx);
                
            }, 100);
    }
    
    function animateMove(obj, rect, finishCallback){
        
        var count = 5;
        
        var wholeRect = rectContainingPoints([{x: obj.x, y: obj.y},{x: obj.x + obj.w, y: obj.y + obj.h},
                                          {x: rect.x, y: rect.y},{x: rect.x + rect.w, y: rect.y + rect.h}]);
        
        var ox = obj.x, dx = rect.x, stepx = (dx - ox)/count;
        var oy = obj.y, dy = rect.y, stepy = (dy - oy)/count;
        
        
        var interval = setInterval(function(){
                count--;
                
                obj.x += stepx;
                obj.y += stepy;
                
            
                ctx.clearRect(wholeRect.x, wholeRect.y, wholeRect.w, wholeRect.h);
                
                if (count == 0){
                    
                    obj.x = dx;
                    obj.y = dy;
                    
                    clearInterval(interval);
                    finishCallback();
                    
                }
                
                
            
                obj.draw(ctx);
                
                
            }, 100);
    }
    
    
    function mouseDown(event) {
        mouseIsDown = true;
        var i = Math.floor(event.offsetX / cellW);
        var j = Math.floor(event.offsetY / cellH);
        var piece = places[i][j];
        selectedPiece = {
            x: i
            , y: j
            , piece: piece
        }
        piece.highlighted = true;
        
        render.draw();
    }

    function mouseMove(event) {
        if (mouseIsDown && selectedPiece != null) { // And have a selected piece
            var swipeResult = detectSwipe(selectedPiece, event);
            if (swipeResult){
                switchPieces(swipeResult);
                mouseUp(null);
            }
            console.log(selectedPiece);
        }
    }
    
    function mouseUp(event) {
        
        //detectSwipe(selectedPiece, event);
        
        mouseIsDown = false;
        selectedPiece = null;
    }
    
    function detectSwipe(selPiece, event){
        if (!selPiece){
            return null;
        }
        
        var i = Math.floor(event.offsetX / cellW);
        var j = Math.floor(event.offsetY / cellH);

        if ((i !=  selPiece.x && j != selPiece.y) || i < 0 || j < 0 || i >= cellW || j >= cellH) {
            return null;
        }
        
        if (i > selPiece.x){
            //swipe right
            return {x1: selPiece.x, y1: selPiece.y, x2: i, y2:j, dir: "right"};
        } else if ( i < selPiece.x) {
            //swipe left
            return {x1: selPiece.x, y1: selPiece.y, x2: i, y2:j, dir: "left"};
        } else if (j > selPiece.y) {
            //swipe down
            return {x1: selPiece.x, y1: selPiece.y, x2: i, y2:j, dir: "down"};
        } else if (j < selPiece.y) {
            //swipe up
            return {x1: selPiece.x, y1: selPiece.y, x2: i, y2:j, dir: "up"};
        }
       
    }
    
    function rectContainingPoints(ptsArray){
        var x1, x2, y1, y2;
        ptsArray.forEach(function(el){
           if (isNaN(x1) || x1 > el.x){
               x1 = el.x;
           } 
            if (isNaN(x2) || x2 < el.x){
                x2 = el.x;
            } 
            if (isNaN(y1) || y1 > el.y){
                y1 = el.y;
            }
            if (isNaN(y2) || y2 < el.y){
                y2 = el.y;
            }
            
        });
        return {x: x1, y: y1, x2: x2, y2: y2, w: (x2-x1), h: (y2-y1)};
    }
    
    function updateScore(){
        scoreElement.innerHTML = score;    
    }
    
}