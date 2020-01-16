(function() {

    // Navigator Classes
    var CLASSES = {
        navigatorHolder: "navigators",
        progressDiv: "myProgress",
        progressBar: "myBar",
        progressBarTimerSpan: "timerSpan",
        totalQuestionLengthSpan: "totalQuestionSpan",
        currenQuestionSpan: "currenQuestion",
        totalScoreSpan: "score-holder",
        score: "score",
    };

    var currentIndex = 0;
    var rotateObjective = 0;
    var timer = 60;
    var timerStatus = false;
    var score = 0;

    var questions = [
        {
            grid: 2,
            W: 70,
            answers: [
               [2,2,6,5],
               [3,2,6,2],
               [3,4,2,2],
               [2,4,2,5]
            ],
        },
        {
            grid: 3,
            W: 70,
            answers: [
                [6,5,6,3,4,3,6,5,6],
            ],
        },
        {
            grid: 3,
            W: 70,
            answers: [
               [2,5,3,2,4,6,2,5,3],
               [4,6,2,5,3,2,4,6,2],
               [2,2,2,5,6,5,3,4,3],
               [6,5,6,4,3,4,2,2,2]
            ],
        },
    ];

    var draggableBox = {
        numbers: 3,
        margin: 48,
    };

    function canvas (param, obj) {

            $("."+param).empty();

            // Add Parent Box...
            $("."+param).css({
                "margin": (window.innerHeight/2) - (questions[currentIndex].grid*questions[currentIndex].W/2) - (questions[currentIndex].W + draggableBox.margin)+ "px auto",
                "width": questions[currentIndex].grid*questions[currentIndex].W + "px",
                "display": "grid",
                "grid-template-columns":"repeat(" +questions[currentIndex].grid+ ", " + questions[currentIndex].W+ "px)",
                "grid-template-row": "repeat(" +questions[currentIndex].grid+ "," + questions[currentIndex].W + "px)",
            });
            
            if ( typeof obj.draggable != "undefine" && obj.draggable ) {
                $('.items').empty();

                for (var i=0; i<Math.pow(questions[currentIndex].grid, 2); i++) {
                    jQuery('<div/>', {
                        "class": 'boxes ui-widget-header num-'+ i,
                        "id": 'snaptarget',
                    }).appendTo('.'+param);
                }

                // ==== Activate Droppable ====
                for ( var i =0; i<Math.pow(questions[currentIndex].grid, 2); i++ ) {
                    $('.num-'+i).droppable ({
                        accept: ".draggable",
                        hoverClass: "hovered",

                        drop: function (event, ui) {
                            // Close Box..
                            if ($(this).children().length <= 0 ) { 
                                var el = ui.draggable.clone().removeAttr("style")
                                .removeClass("m-5 ui-draggable-dragging").addClass("isdropped")
                                .css({"position":"relative", "z-index": 1})
                                .appendTo($(this));
            
                                rotateBox3(el);
                                evaluate ();
                            }
                        }
                    });
                }

                // ===== Create Draggable Box =====
                for ( var i=0; i<draggableBox.numbers; i++ ) {
                    jQuery('<div/>', {
                        "class": 'draggable m-5 ui-widget-content drag-num-' + i,
                        "id":"draggable",
                    }).append("<p class='text-center num-p'>"+ (i+1) +"</p>").appendTo('.items');
                }

                // ==== Activate Draggable ====
                for ( var i=0 ;i<draggableBox.numbers; i++ ) {
                    $( ".drag-num-" + i ).draggable({
                        cursor: "move",
                        stack: ".drag-num-" + i,
                        revert: true,
                        snap: true,
                        revertDuration: 0,
                    });
                }
            }

            function rotateBox3 (param) {
                var num = 3;
                var deg = 0;

                // Click draggable box.
                for (var i=0; i<draggableBox.numbers; i++) { 
                    if (i==draggableBox.numbers-1 && param.hasClass("drag-num-2")) { 
                        $(param).on("click", function(e) {
                            
                            deg += 90;
                            num+=1;
                            // if (deg == 360) { deg = 0; } 
                            if (num >= 7) { num = 3; } 
                            $(this).css("transform","rotate("+ (deg) +"deg)");
                            $(this).find("p").text(num);
                            evaluate ();
                        });
                    }
                }

            }

            // this is for objective div..
            if (typeof obj.draggable != "undefine" && !obj.draggable) {
                var objectRotate = 0;

                for (var i = 0; i<Math.pow (questions[currentIndex].grid, 2); i++) {
                    jQuery('<div/>', {
                        "class": 'objective-box objective-div objective-num-'+ questions[currentIndex].answers[rotateObjective][i],
                        "id": 'obj-target',
                    }).append("<p class='num-p'> "+ (questions[currentIndex].answers[rotateObjective][i])+" </p>").appendTo('.'+param);
                }


                $(".rotateBox").on("click", function(){
                    objectRotate += 45;
                    $(".objective").css("transform","rotate("+ (objectRotate) +"deg)");
                });

            }
    }

    function loadGame () {
        canvas("puzzle-box", {draggable: true});
        canvas("objective", {draggable: false});
    }

    function evaluate () {
       var value = $(".puzzle-box").find("p").text();
       var answer = [];

       if (value.length == Math.pow(questions[currentIndex].grid,2)) {

            for (var i =0; i<questions[currentIndex].answers.length; i++) {
                answer.push(questions[currentIndex].answers[i].join(""));
            }

            if (answer.includes(value) == true) {

              var statugme = setInterval(function() {
                    score +=1;
                    updateNavDivs ();
                }, 100);

                setTimeout(function(){
                    clearInterval(timerStatus);
                    clearInterval(statugme);
                    // score +=5;
                    // updateNavDivs ();
                    startGame(currentIndex + 1);
                }, 500);
            }

       }

    //    function check(array, value) {
    //         for (var j = Math.pow(questions[currentIndex].grid, 2); j--;) {
    //             if (array[j] != value[j]) {
    //                 return false;
    //             } 
    //         }

    //         return true;
    //    }

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

            if ((currentIndex + 1) < questions.length) {
                 startGame(currentIndex + 1);
            } else {
                console.log("Reload Another Game");
            }

            return;
        }
    }

    function updateNavDivs () {
        $("."+CLASSES.totalScoreSpan).text(score);
        $("."+CLASSES.score).html(' <i class="material-icons md-light t-y md-18">star</i>');
        $("."+CLASSES.score).children('.material-icons').addClass('animated bounceInDown ');
    }

    // ========= Create Navigation Canvas ===========
    function createRoundsDiv () {
        var navigatorHolder =  document.querySelector("."+CLASSES.navigatorHolder);
        var barcontainer = document.createElement("div");
        var totalQuestionSpan = document.createElement("span");
        var currenQuestion = document.createElement("span");
        var icon1 = document.createElement("i");

            icon1.className ="material-icons mx-2 py-1 md-light md-18";
            icon1.innerHTML = "feedback";

            totalQuestionSpan.className = CLASSES.totalQuestionLengthSpan + " l-h-2 text-light";
            totalQuestionSpan.innerHTML = " of " + questions.length;

            currenQuestion.className = CLASSES.currenQuestionSpan + " font-weight-bold l-h-2 mx-1 text-light";
            currenQuestion.innerHTML = currentIndex + 1;

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

    function resetButton () {
        var navigatorHolder = document.querySelector("."+CLASSES.navigatorHolder);
        var barcontainer = document.createElement("div");
        var button = document.createElement("button");
            button.className = "btn btn-sm btn-light btn-reset";
            button.innerHTML = "Reset";

            barcontainer.className = "bar-container mx-2 d-flex";
            barcontainer.appendChild(button);
            navigatorHolder.appendChild(barcontainer);
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

    function startGame (index) {

        if (index < questions.length) { 
            
            timer = 60;
            currentIndex = index;

            $("."+CLASSES.currenQuestionSpan).text(index + 1);
            $(".objective").css("transform","rotate(45deg)");

            timerStatus = setInterval(function () {
                updateTimer();
             }, 500);
     
             loadGame ();

             $(".btn-reset").on("click", function(){
                call_swal({
                    title:"",
                    description:"Are you sure you want to reset the game?",
                    btnText:"Play",
                }, function(){
                    startGame (0);
                });
             })
        }    
    }

    $(window).on("load", function() {
        
        createRoundsDiv ();
        createCounterDiv ();
        createScoreDiv ();
        resetButton ();
        loadGame ();

        call_swal({
            title:"Your Task",
            description:"You will be shown an objective pattern in the left side of the canvas made with coloured pieces. You'll need to recreate the pattern shown in the right side of the canvas.",
            btnText:"Play",
        }, function(){
            startGame (0);
        });

    });
})()