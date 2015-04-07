'use strict';

$(document).on('ready', function (e) {
  var $window = $(window)
  var $body = $('body')
  var $pNav = $('#product-nav')
  var pNavTopPosition = $pNav.offset().top
  var pNavHeight = $pNav.height()

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

    // 20 is the distance away from top of screen
    if (windowScrollPos >= (pNavTopPosition - 20)) {
      $body.addClass('floating-product-nav')
      $('.product-nav-container').addClass('is-floating')
      $('.product-name').addClass('is-visible')
    } else {
      $body.removeClass('floating-product-nav')
      $('.product-nav-container').removeClass('is-floating')
      $('.product-name').removeClass('is-visible')
    }

    if (windowScrollPos >= sectGithubPos -150) {
      $('.product-nav-item').removeClass('active')
      $('#nav-github').addClass('active')
      $('.product-nav-scroll-container').css('top', -250)
    }
    else if (windowScrollPos >= sectContributePos -150) {
      $('.product-nav-item').removeClass('active')
      $('#nav-contribute').addClass('active')
      $('.product-nav-scroll-container').css('top', -200)
    }
    else if (windowScrollPos >= sectApiPos -150) {
      $('.product-nav-item').removeClass('active')
      $('#nav-api').addClass('active')
      $('.product-nav-scroll-container').css('top', -150)
    }
    else if (windowScrollPos >= sectExamplesPos -150) {
      $('.product-nav-item').removeClass('active')
      $('#nav-examples').addClass('active')
      $('.product-nav-scroll-container').css('top', -100)
    }
    else if (windowScrollPos >= sectHighlightsPos -150) {
      $('.product-nav-item').removeClass('active')
      $('#nav-highlights').addClass('active')
      $('.product-nav-scroll-container').css('top', -50)
    } else {
      // demo
      $('.product-nav-item').removeClass('active')
      $('#nav-demo').addClass('active')
      $('.product-nav-scroll-container').css('top', 0)
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
      $('.product-nav-item').removeClass('activated')
    }
  }

  function scrollToSection (element, position) {
    momentarilyDisableMainNavReveal()
    $(element).addClass('activated')
    $(window).scrollTo(position, 250, scrollToSettings)
  }

  // Clicks
  $('#nav-demo').on('click', function (e) {
    scrollToSection(this, sectDemoPos -100)
    $('.product-nav-scroll-container').css('top', 0)
  })
  $('#nav-highlights').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectHighlightsPos - 150, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -50)
  })
  $('#nav-examples').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectExamplesPos - 150, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -100)
  })
  $('#nav-api').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectApiPos - 150, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -150)
  })
  $('#nav-contribute').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectContributePos - 150, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -200)
  })
  $('#nav-github').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $(this).addClass('activated')
    $(window).scrollTo(sectGithubPos - 150, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -250)
  })

  $('.product-name').on('click', function (e) {
    $body.addClass('is-scrolling')
    $window.scrollTo(0, 250, scrollToSettings)
  })

  // In case someone overshoots the nav area
  $('.product-nav-hitbox').on('mouseover', function (e) {
    $('.product-nav-container').addClass('is-extended')
  })
  $('.product-nav-hitbox').on('mouseout', function (e) {
    $('.product-nav-container').removeClass('is-extended')
  })
  // TODO: Also detect when the mouse exits top of viewport
  $('.product-nav-container').on('mouseover', function (e) {
    $('.product-nav-container').addClass('is-extended')
  })
  $('.product-nav-container').on('mouseout', function (e) {
    $('.product-nav-container').removeClass('is-extended')
  })

})
