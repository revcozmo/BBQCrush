


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

