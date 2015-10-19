var YouTubeLoopButton = (function(d) {
  var STORAGE_KEY    = 'yt-loop-history';
  var history        = new YouTubeLoopButtonStorage(STORAGE_KEY);
  var videoID;

  var getVideoID = function() {
    var params = document.location.search.substr(1).split('&');
    params = params.filter(function(v) { return v.indexOf('v=') > -1 });

    if (params.length)
      return params[0].split('=')[1];
  };

  // Run everytime user navigates on the page
  var initialize = function() {
    if (location.pathname !== '/watch') return;

    var player          = d.getElementById('player');
    var loopButton      = d.getElementsByClassName('ytp-loop-button');
    var videoElement    = player.getElementsByClassName('html5-main-video')[0];
    var playerControls  = player.getElementsByClassName('ytp-chrome-controls')[0];
    var volumeButton    = playerControls.getElementsByClassName('ytp-volume-hover-area')[0];

    // Get the video ID
    if (!(videoID = getVideoID()))
      return;

    // Create the button if couldn't find one
    if (!loopButton.length) {
      loopButton = d.createElement('button');
      loopButton.className = 'ytp-loop-button ytp-button';
      loopButton.setAttribute('title', 'Loop this video');
      loopButton.setAttribute('tabindex', 33);
      loopButton.innerHTML = '<svg width=100% height=100% viewBox="0 0 36 36" version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><defs><path id=ytp-1000 d="M 8 11 L 24 11 L 24 9 L 28 12.5 L 24 16 L 24 14 L 11 14 L 11 18 L 8 18 Z"></path><path id=ytp-1001 d="M 25 18 L 28 18 L 28 25 L 12 25 L 12 27 L 8 23.5 L 12 20 L 12 22 L 25 22 Z"></path></defs><use xlink:href=#ytp-1000 class=ytp-svg-fill></use><use xlink:href=#ytp-1001 class=ytp-svg-fill></use></svg>';

      loopButton.addEventListener('click', function(e) {
        videoElement.loop = videoElement.loop ? false : true;

        if (videoElement.loop)
          history.add(videoID);
        else
          history.remove(videoID);

        // Update the button's state
        this.classList.toggle('ytp-button-toggled', videoElement.loop);
        return false;
      });

      // Insert the newly created loop button right before the volume button
      playerControls.insertBefore(loopButton, volumeButton);
    } else {
      loopButton = loopButton[0];
    }

    // Update current video's state
    videoElement.loop = history.has(videoID);
    loopButton.classList.toggle('ytp-button-toggled', videoElement.loop);
  };

  return {
    init: initialize
  };
} (document));
