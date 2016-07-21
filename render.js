

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

