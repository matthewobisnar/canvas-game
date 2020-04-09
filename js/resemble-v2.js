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
    var enableTimer = true;
    var questions = [];

    var draggableBox = {
        numbers: 3,
        margin: 48,
    };

    function canvas (param, obj) {

            $("."+param).empty();

            // Add Parent Box...
            $("."+param).css({
                "margin": (window.innerHeight/2) - (questions[currentIndex].grid*questions[currentIndex].W/2) - (questions[currentIndex].W + draggableBox.margin + 30) + "px auto",
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
                        "class": 'objective-box objective-div objective-num-'+ questions[currentIndex].objective[rotateObjective][i],
                        "id": 'obj-target',
                    }).append("<p class='num-p'> "+ (questions[currentIndex].objective[rotateObjective][i])+" </p>").appendTo('.'+param);
                }

                $(".rotateBox").html(questions[currentIndex].rotation != 0 ? 'Rotate&nbsp;<span id="rotate_name"> '+ questions[currentIndex].rotation +' </span><span>&#176;</span> '+ (questions[currentIndex].direction == "CW" ? "Clockwise" : "Counter Clockwise") +' <i class="material-icons pl-3">rotate_right</i>': '');

                // if (questions[currentIndex].rotation != 0) {
                //     $(".rotateBox").on("click", function(){
                //         objectRotate += questions[currentIndex].rotation;
                //         $(".objective").css("transform","rotate("+ (objectRotate) +"deg)");
                //     });
                // }
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
                    if (currentIndex == 0) {
                        call_swal({
                            title: "Good job! You are now ready to take the exercise. ",
                            btnText:"Next"
                        }, function() {
                           //self.enableTimer = true;
                           startGame(currentIndex + 1);
                        });
                    } else {
                        startGame(currentIndex + 1);
                    }

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
                swal({
                    title: "Total Score: " + score,
                    allowOutsideClick: false,
                }).then(function() {
                    window.location.href ="index.html";
                });
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
            currenQuestion.innerHTML = currentIndex;

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

            enableTimer = (index == 0) ? false : true;

            timer = 60;
            currentIndex = index;

            $("."+CLASSES.currenQuestionSpan).text(index);
           //$(".objective").css("transform","rotate(45deg)");

           if (enableTimer) {
             clearInterval(timerStatus);
             timerStatus = setInterval(function () {
                updateTimer();
             }, 500);
           }
             loadGame ();

             $(".btn-reset").on("click", function(){
            
              swal({
                title:"",
                text:"Are you sure you want to reset the game?",
                closeOnClickOutside: false,
                allowOutsideClick: false,
                buttons: {
                    cancel: "Home",
                    catch: {
                      text: "Reset",
                      value:  true,
                    },
                  },
                dangerMode: true,
              }).then((response) => {

                switch (response) {                        
                    case true:
                        startGame (0);
                      break;
                    default :
                        window.location.href ="index.html";
                  }

                });
             })
        } else {
            swal({
                title: "Total Score: " + score,
                allowOutsideClick: false,
            }).then(function() {
                    window.location.href ="index.html";
            });
        }
    }

    $(window).on("load", function() {

        var data = {};
            data.game_level_category_code = "aaJJ6PCj1krTE9AR";
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
                questions.push(JSON.parse(item.game_level_content));
            });
        }

        createRoundsDiv ();
        createCounterDiv ();
        createScoreDiv ();
        resetButton ();
        loadGame ();

        $(document).on("click", "#nextButton", function(){
            startGame(currentIndex + 1);
        });

        $(document).on("click", "#backButton", function(){
           if ((currentIndex - 1 ) > 0) {
                startGame(currentIndex - 1);
           }
        });

        $(".objective-container, .puzzle-game").height(window.innerHeight - $(".navigators").height());
        var currentState = 0;
        var intro = introJs();
            intro.setOptions({
                showBullets: false,
                exitOnEsc: false,
                overlayOpacity: 1,
                exitOnOverlayClick: false,
                showStepNumbers:false,
                steps: [
                    { 
                        element: ".objective",
                        intro: "A pattern of colorful pieces will appear on the right side of the screen."
                    },{ 
                        element: ".puzzle-box",
                        intro: "You will have to recreate such pattern on the left side."
                    },{
                        element: ".items", 
                        intro: "Choose from the pieces at the bottom of the screen to recreate and match the pattern shown. Unless, you are asked to rotate to a specific degree otherwise."
                    },{ 
                        element: ".drag-num-2",
                        intro: "Drag the pieces to the empty grid on the left side to recreate the pattern on the right."
                    },{
                        element: ".boxes > .drag-num-2",
                        intro: "Pieces that are placed poorly or overlap will be reset. <br/> Be patient! Sometimes, pieces will have to be rotated many times to fit perfectly!"
                    },
                    { 
                        intro: "Now, try dragging one piece to the grid on the left. Then tap to rotate the piece so it matches the target pattern."
                    }
                ]
            });

            intro.onchange(function(targetElement) {  
                currentState = this._currentStep; 
            });

            
            intro.onbeforeexit(function() {
                if (currentState < intro._options.steps.length - 1) { 
                    startGame(1);
                }
            });

        var sound = new Howl({
            src: ['assets/audio/Silly.mp3'],
            loop: true,
          });

        $(document).ready(function() {
            
            setTimeout(function() {
                $("#wrapper").hide();
                $(".reassemble-container").addClass("d-block");

                if ( $(".reassemble-container").hasClass("d-block")) {
                    setTimeout(function() {
                        sound.play();
                        intro.start();

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

                    }, 500);
                }

                startGame (0);
            },2000)
        })

    });
})()