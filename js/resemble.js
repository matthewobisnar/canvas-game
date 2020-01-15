(function () {

    var canvas1, ctx1, width1, height1;
    var canvas2, ctx2, width2, height2;
    
    var bigBox1 = [];
    var bigBox2 = [];
    var draggableBoxes = [];
    var currentQuestionIndex = 0;

    var questions = [
        {
            question_1: [],
            answer:[
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [3, 3, 3, 3, 3, 3, 3, 3, 3],
                [4, 4, 4, 4, 4, 4, 4, 4, 4],
            ],
            sizeBox:70,
            WidthPath: 3,
        },{
            question_2: [],
            answer:[
                [1, 1, 1, 1],
                [2, 2, 2, 2],
                [3, 3, 3, 3],
                [4, 4, 4, 4],
            ],
            sizeBox:70,
            WidthPath: 2,
        }
    ];

    function Box (x,y, size, color, isdraggable, text) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.isdraggable = isdraggable;
        this.text = text;
    }

    Box.prototype = {
        draw: function (ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);

            if (!this.isdraggable) {
                ctx.strokeStyle = "#9125d4";
                ctx.lineWidth = 1;
                ctx.strokeRect(this.x, this.y, this.size, this.size);
            }

            ctx.fill();
            ctx.closePath();

            // ctx.beginPath();
            // ctx.font = "25px Comic Sans MS";
            // ctx.fillStyle = "white";
            // ctx.textAlign = "center";
            // // ADD QUESTONS HERE ..
            // ctx.fillText(this.text, this.x, this.y + (Math.round(parseInt(ctx.font)/2)));
            // ctx.closePath();

        }
    }

    function canvas () {
        canvas1 = document.querySelector(".canvas1");
        canvas1.width = width1 = $(".canvas-container1").width();
        canvas1.height = height1 = window.innerHeight - $(".navigators").height();
        ctx1 = canvas1.getContext("2d");

        canvas2 = document.querySelector(".canvas2");
        canvas2.width = width2 = $(".canvas-container2").width();
        canvas2.height = height2 = window.innerHeight - $(".navigators").height();
        ctx2 = canvas2.getContext("2d");
    }

    function renderBackground(index) {
        currentQuestionIndex = index;
        bigBox = [];
        var W = [];
        var H = [];
        var w = 1;
        var h = 1;

        // Fill Rect..
        ctx1.clearRect(0, 0, $(".canvas-container1").width(), $(".canvas-container1").height());
        ctx2.clearRect(0, 0, $(".canvas-container2").width(), $(".canvas-container2").height());
        
        ctx1.beginPath();
        ctx1.fillStyle = "#562971";
        ctx1.fillRect(0, 0, $(".canvas-container1").width(), $(".canvas-container1").height());
        ctx1.closePath();

        ctx2.beginPath();
        ctx2.fillStyle = "#562971";
        ctx2.fillRect(0, 0, $(".canvas-container2").width(), $(".canvas-container2").height());
        ctx2.closePath();
        
        for (var i=0; i<Math.pow(questions[currentQuestionIndex].WidthPath,2); i++) {
            
            W.push(w*questions[currentQuestionIndex].sizeBox);
            w += 1;

            for (var j=0; j<questions[currentQuestionIndex].WidthPath; j++) {
                H.push(h*questions[currentQuestionIndex].sizeBox);
            }

            h+=1;
            if (w > questions[currentQuestionIndex].WidthPath) {
                w = 1;
            }
        }

        // Remove Existing length
        H.splice(W.length);

        for (var i=0; i<Math.pow(questions[currentQuestionIndex].WidthPath,2); i++) {
            var width = $(".canvas-container1").width()/2 - (questions[currentQuestionIndex].sizeBox*questions[currentQuestionIndex].WidthPath);
            var height = $(".canvas-container1").height()/2 - (questions[currentQuestionIndex].sizeBox*questions[currentQuestionIndex].WidthPath);
            var color = "#3b2350";
            var isDraggable = false;

            bigBox1.push(new Box(width + W[i], height + H[i], questions[currentQuestionIndex].sizeBox, color, isDraggable, i));
            bigBox2.push(new Box(width + W[i], height + H[i], questions[currentQuestionIndex].sizeBox, color, isDraggable, i));

            bigBox1[i].draw(ctx1);
            bigBox2[i].draw(ctx2);
        }

    }

    function rectBox () {
        draggableBoxes = [];
        for (var i =0; i<3; i++) {
            var distance = 200;
            var width =  ($(".canvas-container1").width()/2 + 130) - (i*distance);
            var height = $(".canvas-container1").height()/2 + distance;
            var color = "#3b2350";
            var size = questions[currentQuestionIndex].sizeBox;
            var isDraggable = true;

            draggableBoxes.push(new Box(width, height, size, color, isDraggable, i));
        }
    }

    function draw () {
        for (var i =0; i<draggableBoxes.length; i++) {
            draggableBoxes[i].draw(ctx2);
        }
    }

    function start (index) {
        renderBackground(index);
        rectBox ();
        draw ();
    }



    window.onload = function () {
        canvas ();
        start (0);
    }
    
})();