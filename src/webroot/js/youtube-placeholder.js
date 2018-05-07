/*
 * Replace placeholder images with YouTube player when clicked.
 */
(function() {
    let els = document.querySelectorAll('img.yt-placehold');

    for (let i = 0; i < els.length; i++) {
        els[i].addEventListener('click', function() {
            let video = '<iframe ' +
                'id="ytplayer" class="centre" width="640" height="360" ' +
                'type="text/html" ' +
                'src="'+ els[i].getAttribute('data-video') +'?autoplay=1&origin=http://ergarcade.com" frameborder="0" allowfullscreen></iframe>';
            /* els[i].outerHTML = video;   /* replace image element */
            els[i].parentNode.outerHTML = video;
        });

        /*
         * Add an icon overlay.
         */
        els[i].insertAdjacentHTML('afterend',
            '<i class="fas fa-play-circle fa-4x" style="pointer-events: none; position: absolute; z-index: 1; top: 45%; left: 50%; transform: translate(-50%,-50%);"></i>');
    }
})();
