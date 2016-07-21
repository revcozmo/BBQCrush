var canvas = document.getElementById("surface");
var ctx = canvas.getContext("2d");
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
    var cellW = canvas.width / tableSize;
    var cellH = canvas.height / tableSize;
    for (var i = 1; i < tableSize; i++) {
        render.addObject(new Line(0, i * cellH, canvas.height, i * cellH));
        render.addObject(new Line(i * cellW, 0, i * cellW, canvas.width));
    }
    var places = new Array(tableSize);
    for (var i = 0; i < 10; i++) {
        places[i] = new Array(tableSize);
    }
    for (var i = 0; i < tableSize; i++) {
        for (var j = 0; j < tableSize; j++) {
            var obj = null;
            do {
                var foodIdx = Math.floor(Math.random() * (5 - 0));
                obj = new Food(imageFoods[foodIdx], i * cellW + 0.1 * cellW, j * cellH + 0.1 * cellH, 0.8 * cellW, 0.8 * cellH);
                obj.type = foods[foodIdx];
            } while (objMatches(obj, i, j));
            places[i][j] = obj;
            render.addObject(obj);
        }
    }
    render.draw();
    var mouseIsDown = false;
    var selectedCandy = null;
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    
    function objMatches(obj, x, y) {
    var nequals = 0;
    for (var i = x - 2; i <= x + 2; i++) {
        if (i < 0 || i == x) continue;
        if (i >= tableSize - 1) break;
        nequals++;
        var sibling = places[i][y];
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
        var sibling = places[x][j];
        if (sibling == null || sibling.type != obj.type) {
            nequals = 0;
        }
        if (nequals >= 2) {
            return true;
        }
    }
    return false;

    }
    
    function mouseDown(event) {
    mouseIsDown = true;
    var i = Math.floor(event.x / cellW);
    var j = Math.floor(event.y / cellH);
    selectedCandy = {
        x: i
        , y: j
        , candy: places[i][j]
    }
}

function mouseMove(event) {
    if (mouseIsDown && selectedCandy != null) { // And have a selected candy
        console.log(selectedCandy);
    }
}

function mouseUp(event) {
    mouseIsDown = false;
    selectedCandy = null;
}


}

