var canvas = document.getElementById("surface");
var ctx = canvas.getContext("2d");

var colors = ["red", "blue", "green", "orange", "purple"];
var tableSize = 6;

function Render(context) {
    this.context = context;
    this.objects = [];

    this.draw = function () {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            obj.draw(this.context);
        }
    }

    this.addObject = function (object) {
        this.objects.push(object);
    }
}

function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.color = "blue";

    this.draw = function (context) {
        context.fillStyle = this.color;
        context.moveTo(0, 0);
        context.fillRect(this.x, this.y, this.w, this.h);

    }
}

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.color = "blue";

    this.draw = function (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.fill()
        context.strokeRect(this.x, this.y, this.w, this.h);
    }
}


function Line(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.color = "blue";

    this.draw = function (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.lineTo(this.x1, this.y1);
        context.lineTo(this.x2, this.y2);
        context.stroke()
    }
}


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

function objMatches(obj, x, y) {
    var nequals = 0;
    for (var i = x - 2; i <= x + 2; i++) {
        if (i < 0 || i == x) continue;
        if (i >= tableSize - 1) break;
        nequals++;
        var sibling = places[i][y];
        if (sibling == null || sibling.color != obj.color) {
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
        if (sibling == null || sibling.color != obj.color) {
            nequals = 0;
        }

        if (nequals >= 2) {
            return true;
        }
    }

    return false;
}

for (var i = 0; i < tableSize; i++) {
    for (var j = 0; j < tableSize; j++) {
        var obj = new Rect(i * cellW + 0.1 * cellW, j * cellH + 0.1 * cellH, 0.8 * cellW, 0.8 * cellH);

        do {
            var colorIdx = Math.floor(Math.random() * (5 - 0));
            obj.color = colors[colorIdx];
        } while (objMatches(obj, i, j));

        places[i][j] = obj;
        render.addObject(obj);

    }
}

render.draw();

var mouseIsDown = false;
var selectedCandy = null;

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

canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mousemove", mouseMove);