(function() {
    canvasElement.Classes = {
        canvas1: "canvas1",
        canvasContainer: "canvas-holder",
        navigator: "navigators",
    };

    // This is 1 solo blue
    function Circle (x, y, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = 15;
        this.color = color;
    }
    
    Circle.prototype = {
        draw: function (ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        },

        update: function () {

        }
    }

    function Path () {

    }
    // Canvas Object.
    function canvasElement(questions) {
        
        this.width = window.innerWidth;
        this.height = window.innerHeight -  ($("."+canvasElement.Classes.navigator).height() + 16);
        this.canvas = null;
        this.ctx = null;
        this.questions = questions;
        this.fps = 50;
        this.radius = 30;

        // Many red
        this.redList = [];
        
        // Only 1 blue
        this.blue;

        this.score = [];
        this.questionLength = 0;
        this.currentIndex = 0;
        this.currentQuestion = 0;

        this.init();

    }

    canvasElement.prototype = {
        init: function () {
            this.createCanvas();
            this.drawBackground();
        },

        startGame: function () {
            this.blue = new Circle(this.width/2, this.height/2, "blue", 0, 0);
            this.drawPath(this.ctx);

            this.update();
        },
        
        drawPath: function (context) {
            context = this.canvas.getContext("2d");
            context.beginPath();
            context.fillStyle = "red";
            context.fillRect(this.blue.x - this.blue.radius, this.blue.y + this.blue.radius - 3, 400, 30);
            context.fill();
            context.closePath();
        },

        // This will be man animate of the object canvas.. 
        update: function () {
            requestAnimationFrame(this.update.bind(this));
            this.drawBackground();
            this.drawPath(this.ctx);

            this.blue.draw(this.ctx);
            this.blue.x += 1;

            console.log(this.blue.x);
        },

        drawBackground: function() {
            this.ctx.clearRect(0,0, this.width, this.height);
            this.ctx.fillStyle = "#834b9a";
            this.ctx.fillRect(0,0,this.width, this.height);
            this.ctx.fill();
        },

        createCanvas: function () {
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.className = canvasElement.Classes.canvas + " border";
            this.ctx = this.canvas.getContext("2d");

            $("."+canvasElement.Classes.canvasContainer).append(this.canvas);
        }
    }

    function call_swal(obj, call_func) {
        swal({
            title: obj.title,
            text: obj.description, //"Click the button to start the game",
            button:  obj.btnText,// "Start the Game!",
            closeOnClickOutside: false
            }).then((value) => {
                call_func();
        });
    }

    $(window).on("load", function () {

        var questions = [
            {coordinate: ""}
        ];

        window["canvasElement"] = new canvasElement(questions);

        call_swal({
            title: "",
            description: " Some instructions",
            btnText: "Start the Game"
        }, function (value) {
            window["canvasElement"].startGame();
        });
    })
})()