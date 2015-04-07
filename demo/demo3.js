'use strict';

$(document).on('ready', function (e) {
  var $pNav = $('#product-nav')
  var $window = $(window)
  var $body = $('body')
  var pNavTopPosition = $('#product-nav').offset().top

  var sectDemoPos = $('#section-demo').position().top
  var sectHighlightsPos = $('#section-highlights').offset().top
  var sectExamplesPos = $('#section-examples').offset().top
  var sectApiPos = $('#section-api').offset().top
  var sectContributePos = $('#section-contribute').offset().top
  var sectGithubPos = $('#section-github').offset().top
  var windowScrollPrevPos
  var windowScrollPos
  var downCounter = 0
  var upCounter = 0
  var pageVersion = 1

  if ($body.hasClass('version3')) {
    pageVersion = 3
  }

  // nope
  $('iframe').on('scroll', function (e) {
    console.log(e)
    e.preventDefault()
    e.stopImmedatePropagation()
  })

  $window.on('scroll', function (e) {
    windowScrollPrevPos = windowScrollPos
    windowScrollPos = $window.scrollTop()

    if (windowScrollPrevPos > windowScrollPos && windowScrollPos > 300) {
      // scrolling up
      downCounter = 0
      upCounter++
    } else  {
      // scrolling down
      upCounter = 0
      downCounter++
    }


    // TODO: clear the counters after a certain time has elapsed, if no other scroll action
    // has taken place

    if (upCounter >= 3) {
      if (!$body.hasClass('is-scrolling')) {
        // this eneds to be done better, timing is off
        // disable in this demo
        //$body.addClass('fix-main-nav')
        //$('nav').addClass('navbar-fixed-top')
      }
    } else if (downCounter >= 1) {
      $body.removeClass('fix-main-nav')
      $('nav').removeClass('navbar-fixed-top')
    }

    //console.log($window.scrollTop())
    if (windowScrollPos >= 200) { //(pNavTopPosition - 1 + 100)) {
      $body.addClass("fix-floating-nav");
      $('.floating-container').removeClass('not-floating-yet')
      $('.product-nav').addClass('show-product-logo')
    } else {
      $body.removeClass("fix-floating-nav");
      $('.floating-container').addClass('not-floating-yet')
      $('.product-nav').removeClass('show-product-logo')
    $('.reveal-floating').removeClass('reveal')
    }

    if (windowScrollPos >= sectGithubPos -150) {
      $('.top-nav-item').removeClass('active')
      $('#nav-github').addClass('active')
      $('.navscroller').css('top', -300)
    }
    else if (windowScrollPos >= sectContributePos -150) {
      $('.top-nav-item').removeClass('active')
      $('#nav-contribute').addClass('active')
      $('.navscroller').css('top', -240)
    }
    else if (windowScrollPos >= sectApiPos -150) {
      $('.top-nav-item').removeClass('active')
      $('#nav-api').addClass('active')
      $('.navscroller').css('top', -180)
    }
    else if (windowScrollPos >= sectExamplesPos -150) {
      $('.top-nav-item').removeClass('active')
      $('#nav-examples').addClass('active')
      $('.navscroller').css('top', -120)
    }
    else if (windowScrollPos >= sectHighlightsPos -150) {
      $('.top-nav-item').removeClass('active')
      $('#nav-highlights').addClass('active')
      $('.navscroller').css('top', -60)
    } else {
      // demo
      $('.top-nav-item').removeClass('active')
      $('#nav-demo').addClass('active')
      $('.navscroller').css('top', 0)
    }

  })

  function momentarilyDisableMainNavReveal () {
    $body.addClass('do-not-reveal-main-nav')
    $body.addClass('is-scrolling')
    window.setTimeout(function () {
      $body.removeClass('do-not-reveal-main-nav')
    }, 500)
  }

  var scrollToSettings = {
    onAfter: function (target) {
      $body.removeClass('is-scrolling')
      // Clear counter here to prevent main nav from fixing
      upCounter = 0
      $('.top-nav-item').removeClass('activated')
    }
  }

  // Clicks
  $('#nav-demo').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectDemoPos, 250, scrollToSettings);
    $('.navscroller').css('top', 0)
  })
  $('#nav-highlights').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectHighlightsPos - 60, 250, scrollToSettings);
    $('.navscroller').css('top', -60)
  })
  $('#nav-examples').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectExamplesPos - 60, 250, scrollToSettings);
    $('.navscroller').css('top', -120)
  })
  $('#nav-api').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectApiPos - 60, 250, scrollToSettings);
    $('.navscroller').css('top', -180)
  })
  $('#nav-contribute').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectContributePos - 60, 250, scrollToSettings);
    $('.navscroller').css('top', -240)
  })
  $('#nav-github').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectGithubPos - 60, 250, scrollToSettings);
    $('.navscroller').css('top', -300)
  })

  $('.floating-container').on('mouseover', function (e) {
    $('.reveal-floating').addClass('reveal')
  })
  $('.reveal-floating').on('mouseout', function (e) {
    $('.reveal-floating').removeClass('reveal')
  })

})
