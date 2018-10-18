/*
 * Replace placeholder images with YouTube player when clicked.
 *
 * https://stackoverflow.com/questions/13725683/how-to-add-a-splash-screen-placeholder-image-for-a-youtube-video
 */
(function() {
    let els = document.querySelectorAll('img.yt-placehold');

    for (let i = 0; i < els.length; i++) {
        els[i].addEventListener('click', function() {
            let video = '<div class="centre"><iframe ' +
                'id="ytplayer" width="640" height="360" ' +
                'type="text/html" ' +
                'src="'+ els[i].getAttribute('data-video') +'?autoplay=1&origin=http://ergarcade.com" frameborder="0" allowfullscreen>' +
                '</div></iframe>';
            els[i].parentNode.outerHTML = video;
        });

        /*
         * Add an icon overlay.
         */
        els[i].insertAdjacentHTML('afterend',
            '<i class="fas fa-play-circle fa-4x" style="pointer-events: none; position: absolute; z-index: 1; top: 45%; left: 50%; transform: translate(-50%,-50%);"></i>');
    }
})();
