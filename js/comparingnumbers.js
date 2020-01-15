(function(){
    // https://spicyyoghurt.com/tools/easing-functions
    CompareNumbers.CLASSES = {
        canvas1: "canvas-1",
        canvas2: "canvas-2",
        barContainer: "bar-container",
        navigatorHolder: "navigators",
        progressDiv: "myProgress",
        progressBar: "myBar",
        progressBarTimerSpan: "timerSpan",
        totalScoreSpan:"score-holder",
        btnEqual: "btn-equal",
        score: "score",
        totalQuestionLengthSpan:"totalQuestionSpan",
        currenQuestionSpan:"currenQuestion"
    }

    function CompareNumbers(payload_questions) {
        
        this.compareQuestions = payload_questions;
        this.currentIndexQue = 0;
        this.timer = 60;
        this.timerStatus = null;
        this.totalScores = 0;
        this.answer = null;

        this.canvas1 = null;
        this.context1 = null;
        this.circles1 = [];
        this.numCompare1 = null;

        this.canvas2 = null;
        this.context2 = null;
        this.circles2 = null;
        this.numCompare2 = null;

        this.initiateElements();
    }

    CompareNumbers.prototype = {
        initiateElements: function () {
            this.createCanvas();
            this.createRoundsDiv();
            this.createCounterDiv();
            this.createScoreDiv();
            this.createEqualButton();
        },

        startGame: function () {
            this.currentIndexQue = 0;
            this.GameQue(0);
        },

        GameQue: function (index) {

            this.currentIndexQue = index;
            this.timerStatus = null;

            if (this.currentIndexQue < this.compareQuestions.stages.length ) {
                this.numCompare1 = this.compareQuestions.stages[this.currentIndexQue].combinations[1];
                this.numCompare2 = this.compareQuestions.stages[this.currentIndexQue].combinations[2];
                this.answer = this.compareQuestions.stages[this.currentIndexQue].answer;
                this.timer = 60;
                this.updateDivs();
                
                // Draw random Circles here..
                this.drawCircles(this.canvas1, this.context1, this.numCompare1, {bg:"white", color: "#f15349"}); // compare 1
                this.drawCircles(this.canvas2, this.context2, this.numCompare2, {bg:"#f15349", color: "white"});
    
                this.timerStatus = setInterval(this.updateTimer.bind(this), 200);
            } else {
                this.currentQuestionIndex = 0;
                console.log("Game stops.");
                return;
            }
        },

        evaluate: function(param){

            var target = $(param).prop("class").split(" ");
            var Compare1 = 0;
            var Compare2 = 0;
            var self = this;

            for (var i =0; i<this.numCompare1.length; i++) {
                Compare1 += eval(this.numCompare1[i]);
            }

            for (var i =0; i<this.numCompare2.length; i++) {
                Compare2 += eval(this.numCompare2[i]);
            }

            if (target.includes(CompareNumbers.CLASSES.canvas1)) {
                if (Compare1 > Compare2) {
                    
                    this.totalScores += 1;
                    $("."+CompareNumbers.CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
                    $("."+CompareNumbers.CLASSES.score).children('.material-icons').addClass('animated bounceInDown');
                    $("."+CompareNumbers.CLASSES.totalScoreSpan).text(this.totalScores);

                } else {
                    $("."+CompareNumbers.CLASSES.canvas1).addClass("shake");
                    $("."+CompareNumbers.CLASSES.canvas1).on("mouseleave", function() {
                        $(this).removeClass("shake");
                    });
                }
            } else if (target.includes(CompareNumbers.CLASSES.canvas2)) {
                if (Compare2 > Compare1) {
                    this.totalScores += 1;
                    $("."+CompareNumbers.CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
                    $("."+CompareNumbers.CLASSES.score).children('.material-icons').addClass('animated bounceInDown');
                    $("."+CompareNumbers.CLASSES.totalScoreSpan).text(this.totalScores);

                } else {
                    $("."+CompareNumbers.CLASSES.canvas2).addClass("shake");
                    $("."+CompareNumbers.CLASSES.canvas2).on("mouseleave", function() {
                        $(this).removeClass("shake");
                    });
                }
            } else if (target.includes(CompareNumbers.CLASSES.btnEqual)) {
                if (Compare2 === Compare1) {
                    this.totalScores += 1;
                    $("."+CompareNumbers.CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
                    $("."+CompareNumbers.CLASSES.score).children('.material-icons').addClass('animated bounceInDown ');
                    $("."+CompareNumbers.CLASSES.totalScoreSpan).text(this.totalScores);

                } else {
                    $("."+CompareNumbers.CLASSES.btnEqual).addClass("hake");
                    $("."+CompareNumbers.CLASSES.btnEqual).on("mouseleave", function() {
                        $(this).removeClass("shake");
                    });
                }
            }

            clearInterval(this.timerStatus);
            setTimeout(function() {
                self.GameQue(self.currentIndexQue + 1);
            }, 1000)
        },

        updateDivs: function() {
            $("." + CompareNumbers.CLASSES.progressBarSpan).text(this.timer);
            $("." + CompareNumbers.CLASSES.currenQuestionSpan).text(this.currentIndexQue + 1);
        },

        drawCircles: function(canvas, ctx, numQuestions, settings) {
            var circles = [];
            var numbers = [];
            
            ctx.clearRect(0,0, canvas.width, canvas.height);

            // Draw Initial Canvas1..
            ctx.beginPath();
            ctx.rect(0, 0, this.canvas1.width, this.canvas1.height);
            ctx.fillStyle = "#603664";
            ctx.fill();
            ctx.closePath();

            while (circles.length < numQuestions.length) {

                var circle = {
                    x: (canvas.width) * Math.random(),
                    y: (canvas.height) * Math.random(),
                    radius: 40,
                    PI: 2 * Math.PI,
                    bg: settings.bg,
                }
                // wall collision detection...
                if (circle.x + circle.radius > canvas.width) {
                    circle.x = (circle.x - circle.radius) - 100;
                }
    
                if (circle.x - circle.radius < 20) {
                    circle.x = circle.x + circle.radius + 100;
                }
    
                if (circle.y + circle.radius > canvas.height) {
                    circle.y = (circle.y - circle.radius) - 100;
                }
    
                if (circle.y - circle.radius < 20) {
                    circle.y = circle.y + circle.radius + 100;
                }
    
                var number = {
                    coordinateX : circle.x,
                    coordinateY :circle.y,
                    font : "25px Comic Sans MS",
                    textAlign: "center"
                }
    
                var overlapping = false;
                for (var j=0; j<circles.length; j++) {
                    var otherCircles = circles[j];
    
                    var d = this.distance(circle.x, circle.y, otherCircles.x, otherCircles.y);
                    if (d < otherCircles.radius + circle.radius) {
                        overlapping = true;
                        break;
                    }
                }
    
                if (!overlapping) {
                    circles.push(circle);
                    numbers.push(number);
                    overlapping = false;
                }
            }
            
            for (var i=0; i<circles.length; i++) {
                ctx.beginPath();
                ctx.arc(circles[i].x , circles[i].y, circles[i].radius, 0, 2 * Math.PI);
                ctx.fillStyle = circles[i].bg;
                ctx.fill();
                ctx.closePath();
     
                ctx.beginPath();
                ctx.arc(circles[i].x , circles[i].y, circles[i].radius - 5, 0, 2 * Math.PI);
                ctx.strokeStyle= settings.color;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.font = numbers[i].font;
                ctx.fillStyle = settings.color;
                ctx.textAlign = numbers[i].textAlign;
                // ADD QUESTONS HERE ..
                ctx.fillText(numQuestions[i], numbers[i].coordinateX, numbers[i].coordinateY + (Math.round(parseInt(ctx.font)/2)));
                ctx.closePath();
            }
    
            circlesList = [];
            numbers = [];
        },

        distance: function (x1,y1, x2,y2) {
            return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1-y2), 2));
        },

        updateTimer: function () {
            var localthis = this;
            var progressBar = document.querySelector("." + CompareNumbers.CLASSES.progressBar);
            var progressBarSpan = document.querySelector("." + CompareNumbers.CLASSES.progressBarTimerSpan);

            this.timer = this.timer - 1;

            progressBar.style.width = this.timer + "px";
            progressBarSpan.innerHTML = (this.timer) < 10 ? "0" + (this.timer) : (this.timer);

            if (this.timer <= 0) {

                progressBarSpan.innerHTML = 0;
                clearInterval(this.timerStatus);
                
                if ((localthis.currentIndexQue + 1) < localthis.compareQuestions.stages.length) {
                        localthis.GameQue(localthis.currentIndexQue + 1);          
                } else {
                    console.log("Next Game Another Game");
                    return;
                }
                
                return;
            }
        },

        createCanvas: function() {
            this.canvas1 = document.createElement("canvas");
            this.canvas1.className = CompareNumbers.CLASSES.canvas1;
            this.canvas1.width =  $(".canvas-container1").width() - 10;
            this.canvas1.height = (window.innerHeight - ($("." + CompareNumbers.CLASSES.navigatorHolder).height() + 80));
            this.context1 = this.canvas1.getContext("2d");
           
            // Draw Initial Canvas1..
            this.context1.beginPath();
            this.context1.rect(0, 0, this.canvas1.width, this.canvas1.height);
            this.context1.fillStyle = "#603664";
            this.context1.fill();

            this.canvas2 = document.createElement("canvas");
            this.canvas2.className = CompareNumbers.CLASSES.canvas2
            this.canvas2.width = $(".canvas-container2").width() - 10;
            this.canvas2.height = (window.innerHeight - ($("." + CompareNumbers.CLASSES.navigatorHolder).height() + 80));
            this.context2 = this.canvas2.getContext("2d");

            // Draw Initial Canvas2..
            this.context2.beginPath();
            this.context2.rect(0, 0, this.canvas2.width, this.canvas2.height);
            this.context2.fillStyle = "#603664";
            this.context2.fill();
            
            $(".canvas-container1").append(this.canvas1);
            $(".canvas-container2").append(this.canvas2);
        },

        createRoundsDiv: function () {
            var navigatorHolder = document.querySelector("."+CompareNumbers.CLASSES.navigatorHolder);

            var barcontainer = document.createElement("div");
            var totalQuestionSpan = document.createElement("span");
            var currenQuestion = document.createElement("span");
            var icon1 = document.createElement("i");
            
                icon1.className ="material-icons mx-2 py-1 md-light md-18";
                icon1.innerHTML = "feedback";

                totalQuestionSpan.className = CompareNumbers.CLASSES.totalQuestionLengthSpan + " l-h-2 text-light";
                totalQuestionSpan.innerHTML = " of " + (this.compareQuestions.stages.length);
    
                currenQuestion.className = CompareNumbers.CLASSES.currenQuestionSpan + " font-weight-bold l-h-2 mx-1 text-light";
                currenQuestion.innerHTML = this.currentIndexQue + 1;
    
                barcontainer.className = "bar-container mx-2 d-flex text-light";
                barcontainer.appendChild(icon1);
                barcontainer.appendChild(currenQuestion);
                barcontainer.appendChild(totalQuestionSpan);
                navigatorHolder.appendChild(barcontainer);
        },

        createEqualButton: function () {
            var equalBtnContainer = document.querySelector(".equal-btn-container");
            var equalButton = document.createElement("button");

                equalButton.className = "btn "+CompareNumbers.CLASSES.btnEqual;
                equalButton.innerHTML = "="

                equalBtnContainer.appendChild(equalButton);
        },

        createCounterDiv: function () {
            var navigatorHolder = document.querySelector("."+CompareNumbers.CLASSES.navigatorHolder);
            var barcontainer = document.createElement("div");
            var progressDiv = document.createElement("div")
            var progressBar = document.createElement("div");
            var icon = document.createElement("i");
            var timerSpan = document.createElement("span");
                
                timerSpan.className = CompareNumbers.CLASSES.progressBarTimerSpan + " pl-2 text-white";
                timerSpan.innerHTML = this.timer;

                icon.className = "material-icons mx-1 md-light md-18";
                icon.innerHTML = "av_timer";
        
                barcontainer.className = "bar-container mx-2 d-flex";
                progressDiv.className = CompareNumbers.CLASSES.progressDiv;
                progressBar.className = CompareNumbers.CLASSES.progressBar;
            
                progressDiv.appendChild(progressBar);
                barcontainer.appendChild(icon);
                barcontainer.appendChild(progressDiv);
                barcontainer.appendChild(timerSpan);
                navigatorHolder.appendChild(barcontainer);
        },

        createScoreDiv: function () {
            var navigatorHolder = document.querySelector("."+CompareNumbers.CLASSES.navigatorHolder);
            var barcontainer = document.createElement("div");
            var icon2 = document.createElement("i");
            var score = document.createElement("span");
    
                score.className = CompareNumbers.CLASSES.totalScoreSpan + " p-1 l-h font-weight-bold text-light";
                score.innerHTML = 0;
               
                icon2.className = "material-icons mx-2 score py-2 md-light md-18";
                icon2.innerHTML = "star";
                barcontainer.className = "bar-container mx-2 d-flex";
            
                barcontainer.appendChild(icon2);
                barcontainer.appendChild(score);
                navigatorHolder.appendChild(barcontainer);
        }
    }

    // Call swal function ===
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
    

    window.onload = function () {
        var stages = { 
            "stages": [
                { 
                    "combinations": { 
                    "1": ["1", "2*2", "-4"], 
                    "2": ["1", "2*2", "-4"], 
                    "answer": "1", 
                    //"multiplier": [1, 2] 
                    } 
                }, 
                { 
                    "combinations": { "1": ["1", "1"], "2": ["3", "-2"], 
                    "answer": "1", 
                    "multiplier": [] 
                    } 
                }, 
                { 
                    "combinations": { "1": ["4", "1*2"], "2": ["3", "-2", "4", "1*2"], 
                    "answer": "2", 
                    "multiplier": [] 
                    } 
                },
                { 
                    "combinations": { "1": ["5", "1*2"], "2": ["5", "-2", "4", "1*2","-4"], 
                    "answer": "2", 
                    "multiplier": [] 
                    } 
                },
                { 
                    "combinations": { "1": ["1", "1*3"], "2": [ "-2", "4", "1*2"], 
                    "answer": "2", 
                    "multiplier": [] 
                    } 
                },
                { 
                    "combinations": { "1": ["5", "1*1"], "2": [ "-6", "1", "1*2"], 
                    "answer": "2", 
                    "multiplier": [] 
                    } 
                },
                { 
                    "combinations": { "1": ["5", "1*1","8"], "2": [ "-6", "1", "1*2","2"], 
                    "answer": "2", 
                    "multiplier": [] 
                    } 
                },
                { 
                    "combinations": { "1": ["5","2", "1*4","8"], "2": [ "-6", "1", "1*2","2"], 
                    "answer": "2", 
                    "multiplier": [] 
                    } 
                }      
            ]
        };

        window["CompareNumbers"] = new CompareNumbers(stages);

        call_swal({
            title:"",
            description:"Click the button to start the game",
            btnText:"Play",
        }, function(){
            window["CompareNumbers"].startGame();
        })

        $("."+CompareNumbers.CLASSES.canvas1).bind("click", function() { 
            window["CompareNumbers"].evaluate($(this))
        });

        $("."+CompareNumbers.CLASSES.canvas2).bind("click", function() {
            window["CompareNumbers"].evaluate($(this))
        });

        $("."+CompareNumbers.CLASSES.btnEqual).bind("click", function(){
            window["CompareNumbers"].evaluate($(this))
        });
    }
})();