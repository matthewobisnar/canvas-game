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
        }        
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
        this.totalScores = 0;
    
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
        
        startGame: function () {
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

                this.words = this.canvas.innerHTML.split( /\s+/ );

                $(".canvas").addClass("animated fadeIn").html( "<p><span class='targets'>" + this.words.join( "</span> <span>" ) + "</span></p>" );
                $("span").addClass("targets animated");

                // Add Event click per word.
                $(".canvas p .targets").on( "click", this.evaluateWords.bind(this));
                // Update Timer..
                this.timerStatus = setInterval(this.updateTimer.bind(this), 1000);

            } else {
                this.currentQuestionIndex = 0;
                console.log("Game stops.");
                return;
            }
        },

        evaluateWords: function(e) {
            var self = this;

            if(this.wordMatch.includes(e.target.innerHTML) == true) {
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
                        call_swal({
                            title: "0 Remaining Mistakes",
                            description: "Proceed to question " + parseInt(self.currentQuestionIndex + 1),
                            btnText:"Next"
                        }, function() {
                           self.gameQue(self.currentQuestionIndex + 1);
                        });
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
                    // dead..
                    clearInterval(this.timerStatus);
                    call_swal({
                        title: "Game Over! Total Score: " + this.totalScores,
                        description: "Do you want to reset the game?",
                        btnText:"Reset"
                    }, function() {
                        window.location.reload();
                    });

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
            canvas.className = wordCorrection.CLASSES.canvas + " border p-5 bg-white";
            canvas.style.minHeight = (window.innerHeight - (document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer).clientHeight + 15)) + "px";
            document.querySelector("."+wordCorrection.CLASSES.canvasContainer).appendChild(canvas);
            
            this.createMistakeAppempt();
            this.createQuestionCounter();
            this.createProgressbar();
            this.createScoreDiv ();
            this.createMistakeWordDiv();
        },

        createProgressbar : function () {

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
            barcontainer.className = "bar-container mx-3 d-flex text-right";
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

        // Just add Questions Here...
        let states = {
            "stages": [{
                    "paragraph": "can you spot these avoidable mistsakes? <br/><br/>There are some puncstuation errors here as well, <br/>Also, the words are somethings not appropriate.",
                    "incorrect": ["somethings","well,","puncstuation", "mistsakes?"],
                },{
                    "paragraph": "Donec posuere mi nisi. Vestibulum feugiat purus lectus, sit amet tempor purus lobortis auctor. Aliquam ac ligula et elit efficitur aliquam. Aenean velit velit, mattis non nulla at, placerat fermentum turpis. Donec tincidunt ligula enim, et condimentum augue volutpat sed. Praesent a rhoncus libero. Nullam non metus sit amet augue feugiat mollis nec sed massa. Proin ac consectetur tellus. Duis lorem mauris, mattis vitae orci ac, sodales tempor odio.",
                    "incorrect": ["nisi", "Vestibulum", "feugiat"],
                },{
                    "paragraph": "Duis pharetra, sapien sed tincidunt commodo, purus enim placerat ante, ut mattis nunc sapien in nibh. Nulla pharetra, justo pulvinar mattis gravida, tortor mauris tristique urna, in luctus est arcu vitae enim. Sed ac enim arcu. Ut sit amet tellus erat. Phasellus auctor, eros vitae venenatis suscipit, lorem erat hendrerit dolor, id vehicula diam sem sit amet augue. Praesent ac mattis leo. Phasellus tempus lacus ac accumsan commodo.",
                    "incorrect": ["Duis", "Phasellus", "Praesent"],
                }]
            }

        // Declare Instance of the object.
        window["wordCorrection"] = new wordCorrection(states);

        // Call Swal
        call_swal(wordCorrection.SWAL.start_game, function() {
            call_swal(wordCorrection.SWAL.instruction, function(){
                window["wordCorrection"].startGame();
            });
        });

        // ===== CREATE BUTTON OBJECT =======
        // createButtons("btn btn-primary text-center start-btn", "click", function(e){    
        //     //Start the game..
        //     window["wordCorrection"].startGame();
        // }, "start", ".swal-button-container");

        // createButtons("btn btn-primary pause-btn", "click", function(){
        // Pause the game ....    
        // }, "pause", ".btnContainer");
    }
})();