(function() {
   var sound = new Howl({
      src: ['assets/audio/Silly.mp3'],
      loop: true,
    });

    $(document).ready(function(){
       
      function onloadSound () {
         if (!("mute" in sessionStorage)) {
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
      }

      sound.on("load", function() {
         sound.play();
         onloadSound();
      })

        $("#vol_control").on("click",triggerSound);

        function triggerSound () {
            var isTrue = sessionStorage.getItem("mute") == "true" ? true: false;
            
            if (("mute" in sessionStorage)) {
               if (!isTrue) {
                  $("i", this).text("volume_mute");
                  sessionStorage.setItem('mute', true);
               } else {
                  $("i", this).text("volume_up");
                  sessionStorage.setItem('mute', false);
               }
               
                  var isTrue = sessionStorage.getItem("mute") == "true" ? true: false;
                  sound.mute(isTrue);
               
            } else{
               $("i", this).text("volume_mute");
               sessionStorage.setItem('mute', false);
               sound.mute(false);
            }
      }
    })
})()