(function() {
    $(document).ready(function(){
        var id;
        var sound = new Howl({
            src: ['assets/audio/Crystal - Vibe Tracks Royalty Free Music - No Copyright Music YouTube Music.mp3'],
            loop: true,
          });

          sound.play();

          $("#vol_control").on("click", function () {
             if ($("i", this).text() == "volume_up") {
                $("i", this).text("volume_mute");
                sound.mute(true, id);
             } else {
                $("i", this).text("volume_up");
                sound.mute(false, id);
             }
          })
    })
})()