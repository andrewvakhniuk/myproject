/**
 * Template Name: Apex App
 * Version: 1.0
 * Template Scripts
 * Author: MarkUps
 * Author URI: http://www.markups.io/

 Custom JS

 1. FULL OVERLAY MENU
 2. MENU SMOOTH SCROLLING
 3. VIDEO POPUP
 4. APPS SCREENSHOT SLIDEER ( SLICK SLIDER )
 5. BOOTSTRAP ACCORDION


 **/


//---------------------------
// Start  youtube
//---------------------------
//if computer
if (typeof window.orientation === 'undefined') {

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('header-video', {
        // startSeconds:20,
        // endSeconds:40,
        // height: '195',
        // width: '260',
        videoId: 'iNyn8Xj-q8E',
        loop: 1,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            // 'autoplay': 1,
            'controls': 0,
            disablekb: 1,
            'rel': 0,
            'fs': 0,
            iv_load_policy: 3,
            modestbranding: 1,
            start:7,
            end: 50
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.setVolume(0);
    event.target.playVideo();


}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
    }
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
    event.target.setVolume(0);
}

}
//if mobile
else{
$('.mu-header-featured-area').css({'height':'400px'});
}


//---------------------------
// END  youtube
//---------------------------


(function ($) {


    /* ----------------------------------------------------------- */
    /*  1. FULL OVERLYAY MENU
    /* ----------------------------------------------------------- */

    $('.mu-menu-btn').on('click', function (event) {

        event.preventDefault();

        $('.mu-menu-full-overlay').addClass('mu-menu-full-overlay-show');

    });

    // when click colose btn

    $('.mu-menu-close-btn').on('click', function (event) {

        event.preventDefault();

        $('.mu-menu-full-overlay').removeClass('mu-menu-full-overlay-show');

    });

    // when click menu item overlay disappear

    $('.mu-menu a').on('click', function (event) {

        event.preventDefault();

        $('.mu-menu-full-overlay').removeClass('mu-menu-full-overlay-show');

    });

    /* ----------------------------------------------------------- */
    /*  1. NAV BAR SMOOTH SCROLLING
    /* ----------------------------------------------------------- */

    $(".scroll-to-block").click(function (event) {
        event.preventDefault();
        $id = $(this).data('block');

        $('html,body').animate({
            scrollTop: $('#' + $id).offset().top
        }, 300, 'swing');
    });


    //MENU SCROLLING WITH ACTIVE ITEM SELECTED

    //get the top of order container element
    $(".scroll-to-order").click(function (event) {
        event.preventDefault();

        $('html,body').animate({
            scrollTop: $('#order-container').offset().top
        }, 300, 'swing');
    });


    /* ----------------------------------------------------------- */
    /*  3. VIDEO POPUP
    /* ----------------------------------------------------------- */

    $('.mu-video-play-btn').on('click', function (event) {

        event.preventDefault();

        $('.mu-video-iframe-area').addClass('mu-video-iframe-display');

    });

    // when click the close btn

    // disappear iframe window

    $('.mu-video-close-btn').on('click', function (event) {

        event.preventDefault();

        $('.mu-video-iframe-area').removeClass('mu-video-iframe-display');

    });

    // stop iframe if it is play while close the iframe window

    $('.mu-video-close-btn').click(function () {

        $('.mu-video-iframe').attr('src', $('.mu-video-iframe').attr('src'));

    });

    // when click overlay area

    $('.mu-video-iframe-area').on('click', function (event) {

        event.preventDefault();

        $('.mu-video-iframe-area').removeClass('mu-video-iframe-display');

    });

    $('.mu-video-iframe-area, .mu-video-iframe').on('click', function (e) {
        e.stopPropagation();
    });


    /* ----------------------------------------------------------- */
    /*  4. APPS SCREENSHOT SLIDEER ( SLICK SLIDER )
    /* ----------------------------------------------------------- */

    $('.mu-apps-screenshot-slider').slick({
        slidesToShow: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: true,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    slidesToShow: 1
                }
            }
        ]
    });


    /* ----------------------------------------------------------- */
    /*  5. BOOTSTRAP ACCORDION
    /* ----------------------------------------------------------- */

    /* Start for accordion #1*/
    $('#accordion .panel-collapse').on('shown.bs.collapse', function () {
        $(this).prev().find(".fa").removeClass("fa-plus").addClass("fa-minus");
    });

    //The reverse of the above on hidden event:

    $('#accordion .panel-collapse').on('hidden.bs.collapse', function () {
        $(this).prev().find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });


})(jQuery);



  
	