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

                $(".canvas").addClass("animated fadeIn").html( "<button class='instructionClass btn btn-sm' data-toggle='modal' data-target='#exampleModalCenter'><i class='material-icons text-secondary'>info</i></button><div class='test-wrap p-5'><p><span class='targets'>" + this.words.join( "</span> <span>" ) + "</span></p></div>" );
                $("span").addClass("targets animated");

                // Add Event click per word.
                $(".canvas p .targets").on( "click", this.evaluateWords.bind(this));

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

                        if (this.enableTimer == false) {
                            call_swal({
                                title: "Good job! You are now ready to take the exercise. ",
                                btnText:"Next"
                            }, function() {
                               self.enableTimer = true;
                               self.gameQue(self.currentQuestionIndex + 1);
                            });
                        } else {
                            call_swal({
                                title: "0 Remaining Mistakes",
                                description: "Proceed to question " + parseInt(self.currentQuestionIndex + 1),
                                btnText:"Next"
                            }, function() {
                               self.gameQue(self.currentQuestionIndex + 1);
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
                          })
                          .then((willDelete) => {
                            if (willDelete) {
                                window.location.reload();
                            } else {
                                window.location.href ="index.html";
                            }
                          });
                    } else {
                         // dead..
                         clearInterval(this.timerStatus);
                         call_swal({
                             title: "Total Score: " + this.totalScores,
                             description: "Continue anyway?",
                             btnText:"Reset"
                         }, function() {
                            self.enableTimer = true;
                            self.gameQue(self.currentQuestionIndex + 1);
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
                    window.location.href = "index.html";
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
                canvas.style.minHeight = (window.innerHeight - (document.querySelector("." + wordCorrection.CLASSES.navigatiorContainer).clientHeight + 15)) + "px";


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
        // Just add Questions Here...
        let states = {
            "stages": [{
                    "paragraph": `Can you spot these avoidable mistsakes? <br/> 
                    There are some punctuations errors here as well; <br/> 
                    Also, the words are somethings not apporpriate.`,
                    "incorrect": ["mistsakes?","well;","somethings","apporpriate."],
                },{
                    "paragraph": `Research in fiction <br/><br/> Fiction might be set in a maek-believe world, but it has to make sense. For our fiction to be authentic, we have to research, 
                    and of course part of that research is ensuring that we have the world right, in terms of what can work and what can&apos;t. 
                    A reader or viewer is happy to cut us a certain amount of slack &minus; they will suspend their disbelief &minus; but only to the point that it seems plausible. 
                    Stretch too far and you might not lose them completely, but perhaps it could mean that now they&apos;re critiquing you&apos;re work and your world, instead of immersing themselves in it. 
                    So the, world-building is the first obvious area where researching other art is necessary, if we want our worlds to hold up to scrutiny and feel real. <br/><br/> 
                    Steampunk as&nbsp; a genre is very much about the world the characters inhabit. as much as&nbsp; the characters and plot are important, the setting is what sets steampunk apart from horror, scifi, romance or historical fiction. 
                    From the very beginning, it&apos;s important to set the scene You want the reader to understand what kind of book they&apos;re reading right from the start.`,
                    "incorrect": ["maek-believe", "you're", "the,", "as", "scene"],
                },{
                    "paragraph": `Bubbles party Services<br/><br/>Welcome to your new neighbourhood party&nbsp; service! We are newly established in the Bayside Area and offer a range of services and products to suit every party&nbsp; need. 
                    From baby showers to engagement parties, birthday celebrations to end-of-year farewells, we take care of all your requiremens so you have nothing to worry about, 
                    and you can just sat back and enjoy your event.<br/><br/> Our team has a combined forty-five years of experience in the event planning and management sector. 
                    It&apos;s fair to say we know all the potential pitfalls of event management and how to avoid them! You can rest assured that your party&nbsp;will go off without a hitch&nbsp;In fact, 
                    we&apos;re so convinced that we can foresee every issue that we guarantee satisfaction - or your money back. <br/><br/>
                    Worried about the cost? Don&apos;t be - we offer four different tiers of services so you can choose a party&nbsp; to suit your budget. 
                    And for the month of Sepptember, you can upgrade from Tier 1 to Tier 2 for no extra cost! So find us on social media (links below) 
                    or you can even give us a call or send us an email. We would love to hear from you so that we can help make your speciale day utterly unforgettable.`,
                    "incorrect": ["Sepptember,", "requiremens", "speciale", "party", "hitch&nbsp;In"],
                },{
                    "paragraph": `Meditation for stress relief <br/><br/> Meditation has been practised for thousands of years as a means of quietening the mind and releiving stress. 
                    It involves sitting or lying in a comfortable position, and focusing on your breathing. 
                    Sometimes those who practise meditation focus on a mantra or an idea; other times they just try to observe their own thoughts to obtain insight into what is troubling them. 
                    Most of us think of meditation as something which features mainly in Easter religions, such as Buddism. But the fact is, other religions use similar techniques for the same purposes. 
                    Take, for example, the rosary used in the Roman Catholic faith. 
                    The rosary is a set of beads strung together like a necklace, and they are held in the hands. 
                    Each bead corresponds to a pray, but the prayers are quite repetitive and recited off by heart. 
                    According to the people who use them, after a while, the prayers can offer a kind of calm, similar to that achieved through meditation. 
                    So we can see that seeking a quiet mind and stress relief is not something which is restricted to &apos;Western&apos; or &apos;Eastern&apos; belief&apos;s, but is something which humans have developed all over the world. <br/><br/> 
                    How do you begin meditation! Rather than trying to twist your legs into nots and risk having your bottom going numb from sitting in one spot for hours, just try it in short bursts to begin with. 
                    There are many apps you can download to help, but you can start by just sitting or lying still for 30 seconds and focusing on your breath and you inhale and exhale. 
                    You might be surprised at how much calmer you feel even after a short time of meditation. And once youve had some practice, you can start extending it for even greater benefits.`,
                    "incorrect": ["releiving", "Easter", "Buddism", "pray,", "belief&apos;s", "nots", "youve","meditation!"],
                },{
                    "paragraph": `The Collapse <br/><br/> Even though they had known for years that it was coming, when the Collapse happened, people were suprised. <br/><br/> 
                    They had had every oportunity to prevent it. The short-term inconveniences and difficulties would have yielded immeasurable long-term benefits, had they only taken the initiative<br/><br/>
                    But nobody did, so there was the Collapse, and then afterwards, the Chaos. No informetion, no infrastructure. 
                    To begin with there was fear and panic, but after the fear and panic, there was an odd kind of resignation, and in that time of resignation, the Company just sort of… hanppend. 
                    It cannot be said that people were happy to have someone finally start rebuilding. Nobody was happy in those days. 
                    There were brief moments of happiness, brief moments where it didnt all seem pointless or difficult’.
                    But when the Company took over, people welcomed the idea of not having to worry about each day. It was easier to leave it all to the Company. <br/><br/>
                    The first changes were met with universal agreement. The Company would have control over all government buildingss. Since the government had fallen apart, who was using them anyway? 
                    The Company would issue vehicles to Company employees only—who needed a car, when you had no fuel to put in it, The Company would distribute food and phase out supermarkets. 
                    The shops had had precious little to offer since the Collapse, so most agreed that this was one less concern, and it left time for cleaning up, for leisure, for reconnecting with family. <br/><br/> 
                    One by one, each responsibility was taken from the many and claimed by the fewe. When the people finally realised that their voices had been silence, and their influence eliminated, 
                    it's hard to know if they cared anymore. The trade-off for their liberation was a easy life. It wasnt an exciting life, and there was no way to sway decision-making, but it was not hard. 
                    They had had enough of 'hard'. Soon enough, the Company had convinced them that democracy was overrated, and that if the people just left it to them, 
                    the Company could do a better job, make a much better society, out of the ruins of the imperfection which had existed before. <br/><br/> 
                    And so a new kind of life began, and almost too willingly, every one began to forget the past.`,
                    "incorrect": ["suprised.", "oportunity", "hanppend." ,"informetion,", "didnt", "difficult’.", "it,", "fewe","silence,","wasnt", "a" ,"initiative"],
                },{
                    "paragraph": `Dear Ali, <br/><br/>
                    Thank you for you grant submission, which we received on 17st March.
                    As you are no doubt aware, the grants process takes some time and involves several stages, and we would like to thank you for your patience while we reached our decision. <br/><br/>
                    Im delighted to be able to inform you that your application has bene successful and we will be able to forward the grant money to your designated account within four (5) business days. 
                    Please note that you will be required to sign and submit an acknowledgment of receipt within one week of receiving the monies. 
                    I’ve included this as an attachment to this email. Simply print and sign, and the scanned page can be re-uploaded to our website. Instricutions are included in the attachemnet. <br/><br/>
                    Your project sounds very interesting and we are so thrilled that we are in the position to help artists like yourself to realise their dreams of fulfilling projects, 
                    and while it is not required, we do encourage applicants to contact us again once the project is completed. 
                    We really enjoy seeing the finished product and sharing in that sense of achievement 
                    If you have any queries or concerns, please do not hesitate to contact me directly, either via this email address or my phone number. 
                    Once again, congratulations and we wish you the very best for your project. <br/><br/>
                    Kind regards, <br/>
                    Dorothea jackson`,
                    "incorrect": ["you", "17st", "Im", "pray,", "bene", "(5)", "acknowledgment","attachemnet.","Instricutions","jackson"],
                }]
            }

        // Declare Instance of the object.
        window["wordCorrection"] = new wordCorrection(states);
        window["wordCorrection"].startGame(false);

        var intro = introJs();
            intro.setOptions({
                showBullets: false,
                exitOnEsc: false,
                overlayOpacity: 0,
                exitOnOverlayClick: false,
                showStepNumbers:true,
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
                        intro: "There is error counter on the right side of the screen. Make sure to refer how many errors are still left."
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
                        oncomplete : function() {
                            alert("end of introduction");
                        }
                    },
                ]
            });
        
            setTimeout(function() {
                intro.start();
            }, 500);

        // Call Swal
        // call_swal(wordCorrection.SWAL.start_game, function() {
        //     call_swal("", function(){
        //        window["wordCorrection"].startGame(false);
        //     });
        // });
    }
})();