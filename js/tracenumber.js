(function() {

    var CLASSES = {
        barContainer: "bar-container",
        navigatorHolder: "navigators",
        progressDiv: "myProgress",
        progressBar: "myBar",
        progressBarTimerSpan: "timerSpan",
        totalScoreSpan:"score-holder",
        score: "score",
        totalQuestionLengthSpan:"totalQuestionSpan",
        currenQuestionSpan:"currenQuestion"
    }

    var canvas,context;
    var questionsCollected = [];
    var corrects = [];
    var mistakes = [];
    var questionsLength = 0;
    var currentQuestionIndex = 0;
    var score = 0;
    var timer = 60;
    var timerStatus = null;
    
    var questions = [
        {   operation: ["36*1", "12*3","4*2","30+6","24*2"],
            target: 36,
        },
        {   operation: ["36*1", "12*3","4*2","30+6","24*2"],
            target: 36,
        }
    ]
    
    canvas = document.querySelector(".canvas");
    context = canvas.getContext("2d");
    canvas.width =  $(".canvasContainer").width();
    canvas.height = (window.innerHeight - ($("."+CLASSES.navigatorHolder).height() + $(".target-holder").height()*2 + 4));
    
    // Correct Circle
    function Correct (x,y,text,bg) {
        this.x =x;
        this.y = y;
        this.radius =60;
        this.bg = bg;
        this.text = text;
    }

    Correct.prototype = {

        draw: function (c) {
    
            c.save();        
            c.beginPath();
            c.fillStyle = this.bg;
            c.arc(this.x, this.y, this.radius, 0, 2*Math.PI); 
            c.fill();
    
            c.beginPath();
            c.font = "30px Comic Sans MS";
            c.fillStyle = "white";
            c.textAlign = "center";
            c.fillText(this.text, this.x, this.y + (Math.round(parseInt(c.font)/2)));
    
            c.restore();
        },
    }
    // End Correct Circle 

    function Circle (x,y,radius,dx,dy, text, bg) {
    
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.text = text.replace("*", "x");
        this.fontSize = 1;
        this.bg = bg;    
    }
    
    Circle.prototype = {
        update:function () {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
    
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            } 
    
            this.x += this.dx;
            this.y += this.dy;
    
            this.updateRadius();
        },
    
        draw: function (c) {
    
            c.save();        
            c.beginPath();
            c.fillStyle = this.bg;
            c.arc(this.x, this.y, this.radius, 0, 2*Math.PI); 
            c.fill();
    
            c.beginPath();
            c.font = this.fontSize+"px Comic Sans MS";
            c.fillStyle = "white";
            c.textAlign = "center";
            c.fillText(this.text, this.x, this.y + (Math.round(parseInt(c.font)/2)));
    
            c.restore();
        },
    
        updateRadius:function () {
            if (this.radius < 50) {
                this.radius += this.radius * 0.1;
            } else if(this.radius == 50) { 
                this.radius = 1;
            } 
    
            if (this.fontSize < 30) {
                this.fontSize += this.fontSize * 0.1;
            }
        },
    }
    
    function question (index) {
        getTargetValue(questions[index].target)

        var random = 0;
    
        if (questionsCollected.length <= 0) {
    
            random = getRandom(index);
    
            for (var j = 0 ; j<random; j++) {
                var overalapping = false;
                var radius = 50;
                var x = (Math.random() * canvas.width);
                var y = (Math.random() * canvas.height);
                var dx = (Math.random() < 0.5 ? -0.01 : 0.01);
                var dy = (Math.random() < 0.5 ? -0.01 : 0.01);
                var randomColor = randomColors();
                var circle = new Circle(x, y, radius, dx, dy, questions[index].operation[j], randomColor);
                // wall collision detection...
                if (circle.x + circle.radius > canvas.width) {
                    circle.x = (circle.x - circle.radius);
                }
    
                if (circle.x - circle.radius < 20) {
                    circle.x = circle.x + circle.radius;
                }
    
                if (circle.y + circle.radius > canvas.height) {
                    circle.y = (circle.y - circle.radius);
                }
    
                if (circle.y - circle.radius < 20) { 
                    circle.y = circle.y + circle.radius;
                }
    
                for (var j = 0; j<questionsCollected.length; j++) {
                    if (distance(questionsCollected[j], circle) < questionsCollected[j].radius + circle.radius) {              
                        overalapping = true;
                        break;
                    }
                }
    
               if (!overalapping) {
                    questionsCollected.push(circle);
               }
            };
    
        } else {
            
            if (questionsCollected.length < questions[index].operation.length) {
                var overalapping = false;
                random = getRandom(index);
                var radius = 50;
                var x = (Math.random() * canvas.width);
                var y = (Math.random() * canvas.height);
                var dx = (Math.random() < 0.5 ? -0.01 : 0.01);
                var dy = (Math.random() < 0.5 ? -0.01 : 0.01);
                var randomColor = randomColors();
                var circle = new Circle(x, y, radius, dx, dy, questions[index].operation[random], randomColor);
                // wall collision detection...
                if (circle.x + circle.radius > canvas.width) {
                    circle.x = (circle.x - circle.radius);
                }
    
                if (circle.x - circle.radius < 20) {
                    circle.x = circle.x + circle.radius;
                }
    
                if (circle.y + circle.radius > canvas.height) {
                    circle.y = (circle.y - circle.radius);
                }
    
                if (circle.y - circle.radius < 20) { 
                    circle.y = circle.y + circle.radius;
                }
    
                for (var j = 0; j<questionsCollected.length; j++) {
                    if (distance(questionsCollected[j], circle) < questionsCollected[j].radius + circle.radius) {              
                        overalapping = true;
                        break;
                    }
                }
    
               if (!overalapping) {
                    questionsCollected.push(circle);
               }
            }
        
        }
    
    }
    
    function distance (obj2, obj1) {
        return Math.sqrt(Math.pow(Math.abs(obj2.x - obj1.x), 2) + Math.pow(Math.abs(obj2.y - obj1.y), 2));
    }

    function getTargetValue(value) {
        $(".target-value").text(value);
    }
    
    function getRandom (index) {
      return  Math.floor(Math.random() * questions[index].operation.length) == questions[index].operation.length 
            ? questions[index].operation.length - (Math.floor(Math.random() * questions[index].operation.length))
            : (Math.floor(Math.random() * questions[index].operation.length));
    }
    
    function randomColors () {
        var red = Math.floor(Math.random() * 255);
        var green = Math.floor(Math.random() * 255);
        var blue = Math.floor(Math.random() * 255);
        return "rgb("+red+","+green+"," +blue+" )"; 
    }
    
    $(".canvas").on("click", function(e){
    
        var x = e.clientX;
        var y = e.clientY;


        for (var j =0; j<questionsCollected.length; j++) {
            if(Math.abs(questionsCollected[j].x - x) + Math.abs(questionsCollected[j].y - y) < (questionsCollected[j].radius * 2)) {
            
                var correctX = questionsCollected[j].x;
                var correctY = questionsCollected[j].y;
                var objValue = questionsCollected[j].text.replace("x","*");
                questionsCollected.splice(j,1);

                // If evauated to be correct then add correct alert then replace the existing circle.
                if (parseInt(questions[currentQuestionIndex].target) == eval(objValue)) {
                    score +=1;
                    updateNavDivs ();
                    corrects.push(new Correct(correctX,correctY,"Correct!","green"));
                } else {
                    mistakes.push(new Correct(correctX,correctY,"Wrong!","red"));
                }
        
            }
        }
    });
    
    
    function loop () {
        
        if (questionsCollected.length > 0) {
            loadCanvasBg ();
    
            for (var i =0; i<questionsCollected.length; i++) {
                questionsCollected[i].draw(context);
                questionsCollected[i].update();

            }
        }

    }

    function updateNavDivs () {
        $("."+CLASSES.totalScoreSpan).text(score);
        $("."+CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
        $("."+CLASSES.score).children('.material-icons').addClass('animated bounceInDown ');
    }

    function correctAndMistakeLoop() {
       if (corrects.length > 0) {
            for (var i =0; i<corrects.length; i++) {
                corrects[i].draw(context);
            }
        }

        if (mistakes.length > 0) {
            for (var i =0; i<mistakes.length; i++) {
                mistakes[i].draw(context);
            }
        }
    }
    
    function updateTimer () {

        var progressBar = document.querySelector("." + CLASSES.progressBar);
        var progressBarSpan = document.querySelector("." + CLASSES.progressBarTimerSpan);

        timer = timer - 1;

        progressBar.style.width = timer + "px";
        progressBarSpan.innerHTML = (timer) < 10 ? "0" + (timer) : (timer);

        if (timer <= 0) {
            progressBarSpan.innerHTML = 0;
            clearInterval(timerStatus);

            if ((currentQuestionIndex + 1) < questions.length) {
                startTheGame(currentQuestionIndex + 1);
                    
            } else {
                console.log("Reload Another Game");
            }
            return;
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
    
    function loadCanvasBg () {
        context.clearRect(0,0, canvas.width, canvas.height);
        context.fillStyle = "#834b9a"
        context.fillRect(0,0, canvas.width,canvas.height);
    }

    function createRoundsDiv () {
        var navigatorHolder = document.querySelector("."+CLASSES.navigatorHolder);
        var barcontainer = document.createElement("div");
        var totalQuestionSpan = document.createElement("span");
        var currenQuestion = document.createElement("span");
        var icon1 = document.createElement("i");
        
            icon1.className ="material-icons mx-2 py-1 md-light md-18";
            icon1.innerHTML = "feedback";

            totalQuestionSpan.className = CLASSES.totalQuestionLengthSpan + " l-h-2 text-light";
            totalQuestionSpan.innerHTML = " of " + questionsLength;

            currenQuestion.className = CLASSES.currenQuestionSpan + " font-weight-bold l-h-2 mx-1 text-light";
            currenQuestion.innerHTML = currentQuestionIndex + 1;

            barcontainer.className = "bar-container mx-2 d-flex text-light";
            barcontainer.appendChild(icon1);
            barcontainer.appendChild(currenQuestion);
            barcontainer.appendChild(totalQuestionSpan);
            navigatorHolder.appendChild(barcontainer);
    }

    function  createCounterDiv () {
        var navigatorHolder = document.querySelector("."+CLASSES.navigatorHolder);
        var barcontainer = document.createElement("div");
        var progressDiv = document.createElement("div")
        var progressBar = document.createElement("div");
        var icon = document.createElement("i");
        var timerSpan = document.createElement("span");
            
            timerSpan.className = CLASSES.progressBarTimerSpan + " pl-2 text-white";
            timerSpan.innerHTML = timer;

            icon.className = "material-icons mx-1 md-light md-18";
            icon.innerHTML = "av_timer";
    
            barcontainer.className = "bar-container mx-2 d-flex";
            progressDiv.className = CLASSES.progressDiv;
            progressBar.className = CLASSES.progressBar;
        
            progressDiv.appendChild(progressBar);
            barcontainer.appendChild(icon);
            barcontainer.appendChild(progressDiv);
            barcontainer.appendChild(timerSpan);
            navigatorHolder.appendChild(barcontainer);
    }

    function createScoreDiv () {
        var navigatorHolder = document.querySelector("."+CLASSES.navigatorHolder);
        var barcontainer = document.createElement("div");
        var icon2 = document.createElement("i");
        var score = document.createElement("span");

            score.className = CLASSES.totalScoreSpan + " p-1 l-h font-weight-bold text-light";
            score.innerHTML = 0;
           
            icon2.className = "material-icons mx-2 score py-2 md-light md-18";
            icon2.innerHTML = "star";
            barcontainer.className = "bar-container mx-2 d-flex";
        
            barcontainer.appendChild(icon2);
            barcontainer.appendChild(score);
            navigatorHolder.appendChild(barcontainer);
    }
    
    window.onload = function () {
        loadCanvasBg ();
        createRoundsDiv ();
        createCounterDiv ();
        createScoreDiv ();

        call_swal({
            title:"",
            description:"The aim of the game is to pop the bubbles that match the target number.",
            btnText:"Play",
        }, function(){
            startTheGame(0);
        })
    }
    

    function startTheGame (index) {
        loadCanvasBg ();
        timer = 60;
        currentQuestionIndex = index;
        questionsLength = questions.length;
        $("."+CLASSES.currenQuestionSpan).text(currentQuestionIndex + 1);
        $("."+CLASSES.totalQuestionLengthSpan).text(" of " + questionsLength);

        questionsCollected = [];
        mistakes = [];
        corrects = [];
    
        setInterval(function() {question(index)}, 1000); // this will que... for next button
        setInterval(function(){
            loop();
            correctAndMistakeLoop();
        }, 1000/500);
        getTargetValue();
    
        setInterval(function() {
            questionsCollected.splice(0,1);
        }, 2500);

        // Correct Wrong Interval;
        setInterval(function() {
            if (corrects.length > 0) {
                corrects.splice(0,1);
            }

            if (mistakes.length >0) {
                mistakes.splice(0,1);
            }
        }, 1000);

        timerStatus = setInterval(function () {
            updateTimer ();
        }, 300);
    }
    
    })()