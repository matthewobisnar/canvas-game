(function() {

    wordCorrection.CLASSES = {
        navigatiorContainer: "btnContainer",
        progressDiv: "myProgress",
        progressBar: "myBar",
        progressBarTimerSpan: "timerSpan",
        totalQuestionLengthSpan: "totalQuestionSpan",
        currenQuestionSpan: "currenQuestion",
        totalScoreSpan: "score-holder",
        canvasContainer: "canvasContainer",
        canvas: "canvas",
        score: "score",
        mistakesRemaing: "mistakes",
        mistakesAttempt: "heart-r"
    };

    wordCorrection.SWAL = {
        start_game: {
            title:"",
            btnText: "Play",
            description: "Click the button to start the game",
        },
        instruction: {
            title:"Your Task",
            btnText: "Start the Game",
            description: `For this game you will be shown a number of documents that need proofreading.

            The errors will be scattered throughout the text and may include typos, missing words or punctuation, grammatical errors etc.`,
        },
        nextQue: { 
            title: "Time's up! Continue to next question.", 
            text:"",
            button:"OK"
        }, 
    }

    function wordCorrection(opt_states) {

        // Add questions here ...
        this.states = opt_states;
        this.currentQuestionIndex = 0;
        this.wordMatch = [];
        this.words = null;
        this.wordMatchLength = 0;
        this.mistakesAttempt = 3;
        this.mistakesRemaing = 0;
        this.timer = 60;
        this.timerStatus = null;
        this.totalScores = true;
    
        this.createCanvas();
        this.canvas = document.querySelector("." + wordCorrection.CLASSES.canvas);

        if (this.canvas !== null) {
            this.canvasCtx = null;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
           
            $(window).on("resize", function(e){
                $("."+wordCorrection.CLASSES.canvas).css({"min-height": (window.innerHeight - (document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer).clientHeight + 15)) + "px"});
            })

        } else {
            console.log("Cannot load canvas.");
            return;
        }
    }
    // add methods of wordCorrection here..
    wordCorrection.prototype = {
        
        startGame: function (state) {
           
            this.enableTimer = state;
            // load length of the game. and first index.
            this.wordMatchLength = this.states.stages.length;
            this.totalScores = 0;
            
            this.gameQue(0);
        },

        gameQue: function (i) {

            this.currentQuestionIndex = i;
            this.mistakesAttempt = 3;

            if (this.currentQuestionIndex < this.wordMatchLength) {
                
                // Load question.
                this.canvas.innerHTML = this.states.stages[this.currentQuestionIndex].paragraph;
                this.wordMatch = this.states.stages[this.currentQuestionIndex].incorrect;
                this.mistakesRemaing = this.wordMatch.length;
                this.mistakesAttempt = 3;
                this.updateNavigationDivs();

                this.words = this.canvas.innerHTML.split(/\s+/);

                $(".canvas").addClass("animated fadeIn").html("<div class='options'><a href='index.html'><button class='btn btn-sm'><i class='material-icons text-secondary'>home</i></button></a><button class='instructionClass btn btn-sm' data-toggle='modal' data-target='#exampleModalCenter'><i class='material-icons text-secondary'>info</i></button></div><div class='test-wrap p-5'><p><span class='targets'>" + this.words.join( "</span> <span>" ) + "</span></p></div>");
                $("span").addClass("targets animated");
                $("<button class='btn btn-sm' id='vol_control'><i class='material-icons text-secondary'>volume_up</i></button>").appendTo(".options");
                // Add Event click per word.
                $(".canvas p .targets").on( "click", this.evaluateWords.bind(this));

                $(".anskeys ul").empty();
                this.wordMatch.forEach(function(item){
                    $("<li><span>"+item+"</span></li>").appendTo(".anskeys ul");
                });
                // Update Timer..
                if (this.enableTimer == true) {
                    this.timerStatus = setInterval(this.updateTimer.bind(this), 1000);
                }

            } else {
                this.currentQuestionIndex = 0;
                console.log("Game stops.");
                return;
            }
        },

        evaluateWords: function(e) {
            var self = this;
            var contain_answers = false;

            
            this.wordMatch.forEach(function(item){

               if (e.target.innerHTML == item) {
                    contain_answers = true; 
                    return;
               }
            });
            
            if (contain_answers == true) {
                if (!$(e.currentTarget).hasClass("correct")) {
                    $(e.currentTarget).addClass("correct");
                   
                    this.totalScores+= 1;
                    this.mistakesRemaing -= 1;
                   
                    if (this.totalScores > 0) {
                        if(!$("."+wordCorrection.CLASSES.score).hasClass("t-y")) {
                            $("."+wordCorrection.CLASSES.score).addClass("t-y");
                        }
                        $("."+wordCorrection.CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
                        $("."+wordCorrection.CLASSES.score).children('.material-icons').addClass('animate-like');
                    }
                    // Update output Score..
                    $("."+wordCorrection.CLASSES.totalScoreSpan).text(this.totalScores);
                    $("."+ wordCorrection.CLASSES.mistakesRemaing).text(this.mistakesRemaing);

                    if (this.mistakesRemaing <= 0) {
                        
                        clearInterval(this.timerStatus);
                        this.currentQuestionIndex += 1;

                        if (this.enableTimer == false) {
                            call_swal({
                                title: "Good job! You are now ready to take the exercise. ",
                                btnText:"Next"
                            }, function() {
                               self.enableTimer = true;
                               self.gameQue(self.currentQuestionIndex);
                            });
                        } else {
                            call_swal({
                                title: "0 Remaining Mistakes",
                                description: "Proceed to question " + parseInt(self.currentQuestionIndex + 1),
                                btnText:"Next"
                            }, function() {
                               self.gameQue(self.currentQuestionIndex);
                            });
                        }
                    }
                }
            } else {

                if ($(e.currentTarget).hasClass("wrong")) { return; }

                this.mistakesAttempt -= 1;
                var heartLife = $(".r-"+(3 - (this.mistakesAttempt + 1)));
                if (heartLife.hasClass("t-r")) {
                    
                    heartLife.html(' <i class="material-icons dead-h md-18">favorite</i>');
                    heartLife.children('.material-icons').addClass('animate-loss');
                    $(e.currentTarget).addClass("wrong shake");

                    $(e.currentTarget).on("mouseleave", function() {
                        $(this).removeClass("wrong shake");
                    });
                }

                if (this.mistakesAttempt <= 0) {

                    if (this.enableTimer) {
                        // dead..
                        clearInterval(this.timerStatus);
                        swal({
                            title: "Game Over! Total Score: " + this.totalScores,
                            text: "Do you want to reset the game?",
                            allowOutsideClick: false,
                            buttons: true,
                            dangerMode: true,
                          }).then((willDelete) => {
                            if (willDelete) {
                                window.location.reload();
                            } else {
                                window.location.href ="index.html";
                            }
                          });
                    } else {
                        // dead..
                        clearInterval(this.timerStatus);
                        
                        swal({
                            title:"Total Score: " + this.totalScores,
                            text: "Take exercise anyway?",
                            closeOnClickOutside: false,
                            allowOutsideClick: false,
                            buttons: {
                                cancel: "Cancel",
                                catch: {
                                  text: "Take Excercise",
                                  value:  true,
                                },
                              },
                            dangerMode: true,
                          }).then((response) => {

                            switch (response) {                        
                                case true:
                                    self.enableTimer = true;
                                    self.gameQue(self.currentQuestionIndex + 1);
                                  break;
                                default :
                                    window.location.href ="index.html";
                              }

                          });
                    }

                    return;
                }
            }

        },

        updateTimer: function () {

            var localthis = this;
            var progressBar = document.querySelector("." + wordCorrection.CLASSES.progressBar);
            var progressBarSpan = document.querySelector("." + wordCorrection.CLASSES.progressBarTimerSpan);

            this.timer = this.timer - 1;

            progressBar.style.width = this.timer + "px";
            progressBarSpan.innerHTML = (this.timer) < 10 ? "0" + (this.timer) : (this.timer);

            if (this.timer <= 0) {
                progressBarSpan.innerHTML = 0;
                clearInterval(this.timerStatus);

                if ((localthis.currentQuestionIndex + 1) < localthis.wordMatchLength) {
                    call_swal(wordCorrection.SWAL.nextQue, function () {
                        localthis.gameQue(localthis.currentQuestionIndex + 1);
                    });   
                } else {

                    swal({
                        title: "Total Score: " + this.totalScores,
                        allowOutsideClick: false,
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            window.location.href ="index.html";
                        }
                    });

                    //window.location.href = "index.html";
                    console.log("Reload Another Game");
                }
                return;
            }
        },

        updateNavigationDivs: function() {
            this.timer = 60;
            $("." + wordCorrection.CLASSES.progressBarSpan).text(this.timer);
            $("." + wordCorrection.CLASSES.mistakesRemaing).text(this.mistakesRemaing);
            $("." + wordCorrection.CLASSES.currenQuestionSpan).text(this.currentQuestionIndex + 1);

            for (var i = 0; i<3; i++) {
                $(".r-"+i).addClass("t-r").remove("i").text("favorite");
            }
        },

        // ==========Create Document Divs =========
        createCanvas: function () {

            // Create Canvas Element..
            var canvas = document.createElement("div");
                canvas.className = wordCorrection.CLASSES.canvas + " border bg-white";
                canvas.style.minHeight = (window.innerHeight - (document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer).clientHeight + 55)) + "px";


            document.querySelector("."+wordCorrection.CLASSES.canvasContainer).appendChild(canvas);
            
            this.createMistakeAppempt();
            this.createQuestionCounter();
            this.createProgressbar();
            this.createScoreDiv ();
            this.createMistakeWordDiv();
        },

        createButtons: function () {
            var buttons = document.createElement("button");
                buttons.className = " btn btn-sm";
                buttons.innerHTML = "Click Buttons"
                document.querySelector("."+wordCorrection.CLASSES.canvas).appendChild(buttons);
        },

        createProgressbar : function () {
            this.createButtons();
            var btnContainer = document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer);
            var barcontainer = document.createElement("div");
            var progressDiv = document.createElement("div")
            var progressBar = document.createElement("div");
            var icon = document.createElement("i");
            var timerSpan = document.createElement("span");
                
                timerSpan.className = wordCorrection.CLASSES.progressBarTimerSpan + " pl-2 text-white";
                timerSpan.innerHTML = this.timer;

                icon.className = "material-icons mx-1 md-light md-18";
                icon.innerHTML = "av_timer";
        
                barcontainer.className = "bar-container mx-2 d-flex";
                progressDiv.className = wordCorrection.CLASSES.progressDiv;
                progressBar.className = wordCorrection.CLASSES.progressBar;
            
                progressDiv.appendChild(progressBar);
                barcontainer.appendChild(icon);
                barcontainer.appendChild(progressDiv);
                barcontainer.appendChild(timerSpan);
                btnContainer.appendChild(barcontainer);
        },

        createQuestionCounter: function () {

            var btnContainer = document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer);
            var barcontainer = document.createElement("div");
            var totalQuestionSpan = document.createElement("span");
            var currenQuestion = document.createElement("span");
            var icon1 = document.createElement("i");
            
                icon1.className ="material-icons mx-2 py-1 md-light md-18";
                icon1.innerHTML = "feedback";

                totalQuestionSpan.className = wordCorrection.CLASSES.totalQuestionLengthSpan + " l-h-2 text-light";
                totalQuestionSpan.innerHTML = " of " + (this.states.stages.length);
    
                currenQuestion.className = wordCorrection.CLASSES.currenQuestionSpan + " font-weight-bold l-h-2 mx-1 text-light";
                currenQuestion.innerHTML = this.currentQuestionIndex + 1;
    
                barcontainer.className = "bar-container mx-2 d-flex text-light";
                barcontainer.appendChild(icon1);
                barcontainer.appendChild(currenQuestion);
                barcontainer.appendChild(totalQuestionSpan);
                btnContainer.appendChild(barcontainer);
        },

        createScoreDiv: function () {
            var btnContainer = document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer);
            var barcontainer = document.createElement("div");
            var icon2 = document.createElement("i");
            var score = document.createElement("span");
    
                score.className = wordCorrection.CLASSES.totalScoreSpan + " p-1 l-h font-weight-bold text-light";
                score.innerHTML = 0;
               
                icon2.className = "material-icons mx-2 score py-2 md-light md-18";
                icon2.innerHTML = "star";

                barcontainer.className = "bar-container mx-2 d-flex";
            
                barcontainer.appendChild(icon2);
                barcontainer.appendChild(score);
                btnContainer.appendChild(barcontainer);
        },

        createMistakeWordDiv: function () {
            var btnContainer = document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer);
            var barcontainer = document.createElement("div");
            var mistakes = document.createElement("span");
            var staticText = document.createElement("small");
                
            staticText.className = " p-1 l-h-3 text-muted text-light";
            staticText.innerHTML = "Remaning Mistake(s)"
            mistakes.className = wordCorrection.CLASSES.mistakesRemaing + " p-1 l-h font-weight-bold text-light";
            mistakes.innerHTML = this.mistakesRemaing;

            barcontainer.className = "bar-container bg-dark mx-3 d-flex text-right";
            barcontainer.appendChild(mistakes);
            barcontainer.appendChild(staticText);
            btnContainer.appendChild(barcontainer);
        },

        createMistakeAppempt: function () {
            var btnContainer = document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer);
            var barcontainer = document.createElement("div");
            var heartIcons = [];

            for (var i =0; i<3; i++) {
                heartIcons.push(document.createElement("span"));
                heartIcons[i].className = "r-"+ i +" material-icons mx-1 t-r heart-r py-2 md-light md-18";
                heartIcons[i].innerHTML = "favorite"

                barcontainer.appendChild(heartIcons[i]);
            }
            barcontainer.className = "bar-container hearts mx-3 d-flex text-right";
            btnContainer.appendChild(barcontainer);
        }

    }

    // ================ Create Dom Buttons =================
    function createButtons (className, event,call_func, placeholder, createContainer = null) {
        var buttons = document.createElement("button");
            buttons.className = className;
            buttons.innerHTML = placeholder;
            buttons.addEventListener(event, call_func, false);

            if (createContainer) {
                var container = document.createElement("div");
                container.className = "buttonContainer";
                document.querySelector(createContainer).appendChild(buttons)
            } else {
                document.body.appendChild(buttons);
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
        var states = {};
            states.stages = [];

        var data = {};
            data.game_level_category_code = "tL2OH9B4QxIyzcTF";
            data.game_level_status = 1;
            data.limit = 30;
        
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
                    states.stages.push(JSON.parse(item.game_level_content));
                });
            }
                    

        
        $(document).on("click", "#nexx", function(){
            window["wordCorrection"].gameQue(window["wordCorrection"].currentQuestionIndex + 1);
        })

        var intro = introJs();
            intro.setOptions({
                showBullets: false,
                exitOnEsc: false,
                overlayOpacity: 0,
                exitOnOverlayClick: false,
                showStepNumbers:false,
                steps: [
                    { 
                        intro: "This exercise gives you various selections that require proofreading.."
                    },
                    { 
                        intro: "Your task is to identify the errors - misspells, typos, grammar and punctuation, that have been strewn throughout the selection."
                    },
                    { 
                        element: ".test-wrap",
                        intro: "Identify an error in the selection."
                    },
                    { 
                        element: "."+wordCorrection.CLASSES.mistakesRemaing,
                        intro: "There is an error counter on the right side of the screen. Make sure to refer how many errors are still left."
                    },
                    { 
                        element: ".hearts",
                        intro: "When you select a word, punctuation or grammar that is NOT an error, it will result in an incorrect mark. Three incorrect marks will result to a default and you&apos;ll have to move to the next selection. "
                    },
                    { 
                        intro: "Longer selections will require you to scroll down the page to be able to read the entire document. "
                    },
                    { 
                        intro: "Now, go ahead and try clicking a word that&apos;s not an error below. When done, identify the remaining errors in the selection.",
                    },
                ]
            });

            intro.oncomplete(function(){
                // Declare Instance of the object.
                window["wordCorrection"] = new wordCorrection(states);
                window["wordCorrection"].startGame(false);
            });
            
            intro.onexit(function(){
                window["wordCorrection"].startGame(true);
                window["wordCorrection"].gameQue(1);
            });


            var sound = new Howl({
                src: ['assets/audio/Crystal - Vibe Tracks Royalty Free Music - No Copyright Music YouTube Music.mp3'],
                loop: true,
              });

            $(document).ready(function() {

                setTimeout(function() {
                    $("#wrapper").hide();
                    $(".introduction-farm").addClass("d-block");
                    
                    if ( $(".introduction-farm").hasClass("d-block")) {
                        setTimeout(function() {
                            sound.play();
                            intro.start();

                              $(document).on("click","#vol_control", function () {
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

                        }, 1000);
                    }
                },2000)
            })

    }
})();