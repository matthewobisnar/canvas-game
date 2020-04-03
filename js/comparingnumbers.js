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

    function Circles (x, y, radius, bg, color, text) {
        this.x = x;
        this.y = y;
        this.radius= radius;
        this.bg = bg;
        this.color = color;
        this.text = text.replace("*","x");

        this.font = "20px Comic Sans MS";
        this.textAlign = "center";

    }

    Circles.prototype = {
        draw: function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x , this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.bg;
            ctx.fill();
            ctx.closePath();
    
            ctx.beginPath();
            ctx.arc(this.x , this.y, this.radius - 5, 0, 2 * Math.PI);
            ctx.strokeStyle= this.color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.font = this.font;
            ctx.fillStyle = this.color;
            ctx.textAlign = this.textAlign;

            // ADD QUESTONS HERE ..
            ctx.fillText(this.text, this.x, this.y + (Math.round(parseInt(ctx.font)/2)));
            ctx.closePath();
        },

        update: function () {
            if (this.radius  < 40) {
                this.radius  += this.radius  * 0.1;
            } else if(this.radius  == 40) { 
                this.radius  = 1;
            }
        }
    }

    function CompareNumbers(payload_questions) {
        
        this.compareQuestions = payload_questions;
        this.currentIndexQue = 0;
        this.timer = 60;
        this.timerStatus = null;
        this.totalScores = 0;
        this.animteCirles = null;

        this.canvas1 = null;
        this.context1 = null;
        this.circles1 = [];
        this.numCompare1 = null;

        this.canvas2 = null;
        this.context2 = null;
        this.circles2 = [];
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
            this.circles1 = [];
            this.circles2 = [];

            this.currentIndexQue = index;
           // this.timerStatus = null;
            clearInterval(this.animteCirles);
            clearInterval(this.timerStatus);

            if (this.currentIndexQue < this.compareQuestions.stages.length ) {
                this.numCompare1 = this.compareQuestions.stages[this.currentIndexQue].combinations[1];
                this.numCompare2 = this.compareQuestions.stages[this.currentIndexQue].combinations[2];
                this.timer = 60;
                this.updateDivs();
                
                // Draw random Circles here..
                this.circles1 =  this.drawCircles(this.canvas1, this.numCompare1, {bg:"white", color: "#f15349"}); // compare 1
                this.circles2 = this.drawCircles(this.canvas2, this.numCompare2, {bg:"#f15349", color: "white"});
            
                this.animteCirles = setInterval(this.update.bind(this), 20);
               
                if(this.currentIndexQue != 0) {
                    this.timerStatus = setInterval(this.updateTimer.bind(this), 800);
                }

            } else {
                this.currentQuestionIndex = 0;
                swal({
                    title: "Total Score: " + this.totalScores,
                    allowOutsideClick: false,
                }).then(() => {
                 //   if (willDelete) {
                        window.location.href ="index.html";
                   // }
                });
                return;
            }
        },

        update: function () {
            this.context1.clearRect(0,0,this.canvas1.width, this.canvas1.height);
            this.context2.clearRect(0,0,this.canvas2.width, this.canvas2.height);

            
            // Draw Initial Canvas2..
            this.context2.beginPath();
            this.context2.rect(0, 0, this.canvas2.width, this.canvas2.height);
            this.context2.fillStyle = "#603664";
            this.context2.fill();
            
            // Draw Initial Canvas2..
            this.context1.beginPath();
            this.context1.rect(0, 0, this.canvas2.width, this.canvas2.height);
            this.context1.fillStyle = "#603664";
            this.context1.fill();

            for (var c1 = 0; c1<this.circles1.length; c1++) {
                this.circles1[c1].update();
                this.circles1[c1].draw(this.context1);
            }

            for (var c2 = 0; c2<this.circles2.length; c2++) {
                this.circles2[c2].update();
                this.circles2[c2].draw(this.context2);
            }
        },

        evaluate: function(param){

            var target = $(param).prop("class").split(" ");

            var Compare1 = 0;
            var Compare2 = 0;
            var que = this.currentIndexQue;
            var self = this;
            var title = "";
            var description = "";

            for (var i =0; i<this.numCompare1.length; i++) {
                Compare1 += eval(this.numCompare1[i].replace(/x/g,"*"));
            }

            for (var i =0; i<this.numCompare2.length; i++) {
                Compare2 += eval(this.numCompare2[i].replace(/x/g,"*"));
            }

            if (target.includes(CompareNumbers.CLASSES.canvas1)) {
                if (Compare1 > Compare2) {
                    
                    this.totalScores += 1;
                    $("."+CompareNumbers.CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
                    $("."+CompareNumbers.CLASSES.score).children('.material-icons').addClass('animated bounceInDown');
                    $("."+CompareNumbers.CLASSES.totalScoreSpan).text(this.totalScores);
                    title = "Good job! You are now ready to take the exercise.";
                    description = "";
        
                } else {
                    title = "Opps! Wrong Answer";
                    description = "Take exercise anyway?";
        
                    $("."+CompareNumbers.CLASSES.canvas1).addClass("shake");
                    $("."+CompareNumbers.CLASSES.canvas1).on("mouseleave", function() {
                        $(this).removeClass("shake");
                    });
                }
            } else if (target.includes(CompareNumbers.CLASSES.canvas2)) {
                if (Compare2 > Compare1) {
                    this.totalScores += 1;
                    title = "Good job! You are now ready to take the exercise.";
                    description = "";
                    $("."+CompareNumbers.CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
                    $("."+CompareNumbers.CLASSES.score).children('.material-icons').addClass('animated bounceInDown');
                    $("."+CompareNumbers.CLASSES.totalScoreSpan).text(this.totalScores);

                } else {
                    title = "Opps! Wrong Answer";
                    description = "Take exercise anyway?";
                    $("."+CompareNumbers.CLASSES.canvas2).addClass("shake");
                    $("."+CompareNumbers.CLASSES.canvas2).on("mouseleave", function() {
                        $(this).removeClass("shake");
                    });
                }
            } else if (target.includes(CompareNumbers.CLASSES.btnEqual)) {
                if (Compare2 === Compare1) {
                    this.totalScores += 1;
                    title = "Good job! You are now ready to take the exercise.";
                    description = "";
                    $("."+CompareNumbers.CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
                    $("."+CompareNumbers.CLASSES.score).children('.material-icons').addClass('animated bounceInDown ');
                    $("."+CompareNumbers.CLASSES.totalScoreSpan).text(this.totalScores);

                } else {
                    title = "Opps! Wrong Answer";
                    description = "Take exercise anyway?";
                    $("."+CompareNumbers.CLASSES.btnEqual).addClass("hake");
                    $("."+CompareNumbers.CLASSES.btnEqual).on("mouseleave", function() {
                        $(this).removeClass("shake");
                    });
                }
            }

            clearInterval(this.timerStatus);

            if (self.currentIndexQue == 0) {
                call_swal({
                    title: title,
                    description: description,
                    btnText:"Take Exercise",
                }, function(){
                    setTimeout(function() {
                        self.GameQue(1);
                    }, 1000)
                })
            } else {
                setTimeout(function() {
                    self.GameQue(que+1);
                }, 1000);
            }
        },

        updateDivs: function() {
            var index = this.currentIndexQue;
            $("." + CompareNumbers.CLASSES.progressBarSpan).text(this.timer);
            $("." + CompareNumbers.CLASSES.currenQuestionSpan).text(index+1);
        },

        drawCircles: function (canvas, numQuestions, settings) {
            var circles = [];

            for (var i=0; i<numQuestions.length; i++) {

                var x = (canvas.width) * Math.random();
                var y = (canvas.height) * Math.random();
                var overlapping = false;
                var radius = 20;
                var bg = settings.bg;
                var color = settings.color;
                var numtext = numQuestions[i];
                var circle = new Circles (x, y, radius, bg, color, numtext); 
                
                // wall collision detection...
                if (circle.x + 40 > canvas.width) {
                    circle.x = (circle.x - 40) - 100;
                }
    
                if (circle.x - 40 < 20) {
                    circle.x = circle.x + 35 + 100;
                }
    
                if (circle.y + 40 > canvas.height) {
                    circle.y = (circle.y - 40) - 100;
                }
    
                if (circle.y - 40 < 20) {
                    circle.y = circle.y + 40 + 100;
                }
                
                for (var j=0; j<circles.length; j++) {
                    var otherCircles = circles[j];
    
                    var d = this.distance(circle.x, circle.y, otherCircles.x, otherCircles.y);

                    if (d < (otherCircles.radius*2 + circle.radius*2)) {
                        console.log(d < (otherCircles.radius*2 + circle.radius*2));
                        overlapping = true;
                        break;
                    }
                }


                if (overlapping == false) {
                    circles.push(circle);
                    overlapping = false;
                }
            }

            return circles;
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
                    swal({
                        title: "Total Score: " + this.totalScores,
                        allowOutsideClick: false,
                        buttons: true,
                        dangerMode: true,
                    }).then(() => {
                        window.location.href ="index.html";
                    });
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
        var stages = {};
            stages.stages = [];

        var data = {};
            data.game_level_category_code = "a6PKgVZguCjoz80m";
            data.game_level_status = 1;
            data.limit = 50;

            $.ajax({
                url: "https://api.firefighteraptitudetest.com.au/api/v1/game/game-levels",
                type:"POST",
                data: data,
                async:false,
                cache: false,
                dataType: "json",
                crossDomain: true,
                processData: true,
                success:function(result) {
                    if (result.status == true) {
                        fetchquestiolist(result["content"]["data"]);
                    }
                },
                error: function (error) {
                    console.log("There is an error with the server response. Please coordinate with your System's Administrator.");
                }
            });

            function fetchquestiolist($param) {
                $param.forEach(function(item, index) {
                    stages.stages.push(JSON.parse(item.game_level_content));
                });
            }

        window["CompareNumbers"] = new CompareNumbers(stages);

        // call_swal({
        //     title:"",
        //     description:"Click the button to start the game",
        //     btnText:"Play",
        // }, function(){
        //     window["CompareNumbers"].startGame();
        // })

        var intro = introJs();
        intro.setOptions({
            showBullets: false,
            exitOnEsc: false,
            overlayOpacity: 1,
            exitOnOverlayClick: false,
            showStepNumbers:false,
            steps: [
                { 
                    intro: "Your attention to details and quick calculating skills will be put to the test."
                },
                { 
                    element:".canvas-1",
                    intro: "2 sets of values will be displayed on the screen. Select the one with higher value.",
                    position: "ottom-middle-aligned",
                    displayStep: 4
                },{
                    element:".canvas-2",
                    intro: "Select the one with higher value.",
                    position: "bottom-middle-aligned",
                    displayStep: 4
                },
                {
                    element:".btn-equal",
                    intro: "If the values are the same, click on the equal sign below. Now practice!"
                }
            ]
        });

       window["CompareNumbers"].startGame();
        $(".container-fluid").hide();

        var sound = new Howl({
            src: ['assets/audio/Crystal - Vibe Tracks Royalty Free Music - No Copyright Music YouTube Music.mp3'],
            loop: true,
          });

        $(document).ready(function() {

            setTimeout(function() {
                $("#wrapper").hide();
                $(".container-fluid").show();
                $(".container-fluid").addClass("d-block");

                if ($(".container-fluid").hasClass("d-block")) {
                    setTimeout(function() {
                        var currentState = 0;
                        intro.start();
                        sound.play();
                        if (typeof sessionStorage.getItem("mute") == "undefined") {
                                sessionStorage.setItem('mute', false);
                                $("i", $("#vol_control")).text("volume_up");
                        } else {
                                var isTrue = sessionStorage.getItem("mute") == "true" ? true: false;
                                if (isTrue == true) {
                                    $("i", $("#vol_control")).text("volume_mute");
                                 } else {
                                    $("i", $("#vol_control")).text("volume_up");
                                 }
                                sound.mute(isTrue);
                        }
                        
                        $("#vol_control").on("click", function () {
                            if ($("i", this).text() == "volume_up") {
                                $("i", this).text("volume_mute");
                                sessionStorage.setItem('mute', true);
                            } else {
                                $("i", this).text("volume_up");
                                sessionStorage.setItem('mute', false);
                            }
                            
                            var isTrue = sessionStorage.getItem("mute") == "true" ? true: false;
                            sound.mute(isTrue);
                        });
            
                        intro.oncomplete(function() {
                            window["CompareNumbers"].startGame();

                            $("."+CompareNumbers.CLASSES.canvas1).bind("click", function() { 
                                window["CompareNumbers"].evaluate($(this))
                            });
                    
                            $("."+CompareNumbers.CLASSES.canvas2).bind("click", function() {
                                window["CompareNumbers"].evaluate($(this))
                            });
                    
                            $("."+CompareNumbers.CLASSES.btnEqual).bind("click", function(){
                                window["CompareNumbers"].evaluate($(this))
                            });
                        });

                        intro.onbeforeexit(function() {
                            if (currentState < intro._options.steps.length - 1) { 
                                window["CompareNumbers"].startGame();
                                window["CompareNumbers"].GameQue(1);

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
                        });
            
                        //$('.introjs-skipbutton').hide();
            
                        intro.onafterchange(function(){          
                            if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
                                $('.introjs-skipbutton').show();
                            } 
                        });
            
                    }, 1000);
                }

            },2000)
        })

    }
})();