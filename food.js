


function Food(img, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;

    this.type = "Food";

    this.draw = function (context) {
        context.moveTo(0, 0);
        context.clearRect(this.x, this.y, this.w, this.h);
        if (this.highlighted){
            context.fillStyle = "yellow";
            context.fillRect(this.x, this.y, this.w, this.h);
        }
        context.drawImage(this.img, this.x, this.y, this.w, this.h);
        
    }
}
