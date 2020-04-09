(function() {
   var sound = new Howl({
      src: ['assets/audio/Silly.mp3'],
      autoplay: true,
      loop: true,
    });

    // Clear listener after first call.
   sound.on('load', function(){
      sound.play();
   });

    $(document).ready(function(){
         //  sound.play();
   
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

    })
})()