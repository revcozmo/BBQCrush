var surface = document.getElementById("surface");
var background = document.getElementById("background");
var bg = background.getContext("2d");
var ctx = surface.getContext("2d");
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
        places2[piecesData.x1][piecesData.y1] = places[piecesData.x2][piecesData.y2] ;
        places2[piecesData.x2][piecesData.y2] = places[piecesData.x1][piecesData.y1] ;
        
        var pieces = piecesEatten(places2);
        if (pieces.legth > 0){
            
            
            console.log("foi!")
            
            var interval = setInterval(function(){
                clearInterval(interval);
            }, 100);
            
        } else {
            console.log("num foi");
        }
        
        
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
}