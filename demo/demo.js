'use strict';

$(document).on('ready', function (e) {
  var $pNav = $('#product-nav')
  var $window = $(window)
  var pNavTopPosition = $('#product-nav').offset().top

  var sectDemoPos = $('#section-demo').position().top
  var sectHighlightsPos = $('#section-highlights').offset().top
  var sectExamplesPos = $('#section-examples').offset().top
  var sectApiPos = $('#section-api').offset().top
  var sectContributePos = $('#section-contribute').offset().top
  var sectGithubPos = $('#section-github').offset().top

  $window.on('scroll', function (e) {
    var windowScrollPos = $window.scrollTop()
    //console.log($window.scrollTop())
    if (windowScrollPos >= (pNavTopPosition - 1)) {
      $('body').addClass("fix-product-nav");
    } else {
      $('body').removeClass("fix-product-nav");
    }

    if (windowScrollPos >= sectGithubPos - 60) {
      $('.top-nav-item').removeClass('active')
      $('#nav-github').addClass('active')
    }
    else if (windowScrollPos >= sectContributePos - 60) {
      $('.top-nav-item').removeClass('active')
      $('#nav-contribute').addClass('active')
    }
    else if (windowScrollPos >= sectApiPos - 60) {
      $('.top-nav-item').removeClass('active')
      $('#nav-api').addClass('active')
    }
    else if (windowScrollPos >= sectExamplesPos - 60) {
      $('.top-nav-item').removeClass('active')
      $('#nav-examples').addClass('active')
    }
    else if (windowScrollPos >= sectHighlightsPos - 60) {
      $('.top-nav-item').removeClass('active')
      $('#nav-highlights').addClass('active')
    } else {
      $('.top-nav-item').removeClass('active')
      $('#nav-demo').addClass('active')
    }

  })

  // Clicks
  $('#nav-demo').on('click', function (e) {
    $(window).scrollTo(sectDemoPos, 250);
  })
  $('#nav-highlights').on('click', function (e) {
    $(window).scrollTo(sectHighlightsPos - 60, 250);
  })
  $('#nav-examples').on('click', function (e) {
    $(window).scrollTo(sectExamplesPos - 60, 250);
  })
  $('#nav-api').on('click', function (e) {
    $(window).scrollTo(sectApiPos - 60, 250);
  })
  $('#nav-contribute').on('click', function (e) {
    $(window).scrollTo(sectContributePos - 60, 250);
  })
  $('#nav-github').on('click', function (e) {
    $(window).scrollTo(sectGithubPos - 60, 250);
  })

})
