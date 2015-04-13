'use strict'

// Constants (configurable)
var SCROLL_COUNTER_LIFESPAN = 1000

var FIXED_NAV_ENABLE_AT_Y_POSITION = 300
var FIXED_NAV_REVEAL_ON_COUNTER = 4
var FIXED_NAV_HIDE_ON_COUNTER = 2
//var FIXED_NAV_HIDE_AT_Y_POSITION = 50
var FIXED_NAV_ALWAYS_SHOW_BELOW_Y_POSITION = 50

var PRODUCT_NAV_SELECTOR
var PRODUCT_NAV_COLLAPSE_DELAY_TIMEOUT = 900

var windowPreviousYPosition
var windowYPosition
var scrollDownCounter = 0
var scrollUpCounter = 0
var scrollCounterLifespanTimer
var navigationDelayTimer

function resetScrollCounters () {
  scrollDownCounter = 0
  scrollUpCounter = 0
}

function revealFixedMainNav () {
  document.body.classList.remove('hide-fixed-main-nav')
  document.body.classList.add('fixed-main-nav')
  //document.querySelector('nav').classList.add('navbar-fixed-top')
}

function hideFixedMainNav () {
  document.body.classList.remove('fixed-main-nav')
  document.body.classList.add('hide-fixed-main-nav')
  //document.querySelector('nav').classList.remove('navbar-fixed-top')
}

function setDemoContainerHeight () {
  var viewportHeight = document.documentElement.clientHeight
  var demoContainerEl = document.getElementById('demo-container')
  var minHeight = 600
  var maxHeightPercentage = 0.8
  demoContainerEl.style.height = Math.max(minHeight, Math.floor(maxHeightPercentage * viewportHeight)) + 'px'
}

function momentarilyDisableMainNavReveal () {
  hideFixedMainNav()
  document.body.classList.add('do-not-reveal-main-nav')
  document.body.classList.add('is-scrolling')
  window.setTimeout(function () {
    document.body.classList.remove('do-not-reveal-main-nav')
  }, 500)
}

var scrollToSettings = {
  onAfter: function (target) {
    document.body.classList.remove('is-scrolling')
    // Clear counter here to prevent main nav from fixing
    //scrollUpCounter = 0
    $('.product-nav-item').removeClass('activated')

    if (windowYPosition < FIXED_NAV_ALWAYS_SHOW_BELOW_Y_POSITION) {
      revealFixedMainNav()
    }
  }
}

function scrollToSection (element, position) {
  momentarilyDisableMainNavReveal()
  element.classList.add('activated')
  $(window).scrollTo(position, 250, scrollToSettings)
}


var ProductNavigation = function () {
  this.el = null // Placeholder for product navigation element
  this.delayedCollapseTimer = null // Placeholder
  this.hitboxIsActive = false
}

ProductNavigation.prototype.init = function (el) {
  var selector = el || PRODUCT_NAV_SELECTOR || '.product-nav'
  this.el = document.querySelector(selector)

  this.initEvents()

  // Enable CSS transition time only after page has completed loading
  // so that setting the navbar into initial state is not animated.
  setTimeout(function () {
    this.el.querySelector('.product-nav-container').classList.add('enable-animation')
  }.bind(this), 0)
}

ProductNavigation.prototype.initEvents = function () {
  // Add event listeners to things.
  // The hitbox is an invisible area bigger than the navigation bar itself
  // When the mouse enters this area, expand the navigation bar
  var hitboxEl = document.querySelector('.product-nav-hitbox')

  hitboxEl.addEventListener('mouseover', this.expand.bind(this))
  hitboxEl.addEventListener('mouseout', this.delayedCollapse.bind(this))
  this.el.addEventListener('mouseover', this.expand.bind(this))
  this.el.addEventListener('mouseout', this.delayedCollapse.bind(this))

  // Collapse nav if mouse re-enters window not on the hitbox area
  window.addEventListener('mouseover', function (e) {
    if (!e.relatedTarget && !e.target.classList.contains('product-nav-hitbox')) {
      this.collapse()
    }
  }.bind(this))
}

ProductNavigation.prototype.collapse = function () {
  this.el.classList.add('is-collapsed')
}

ProductNavigation.prototype.expand = function () {
  // If there is a delayed collapse timer, clear it
  clearTimeout(this.delayedCollapseTimer)
  $('.product-nav').removeClass('is-collapsed')
}

ProductNavigation.prototype.delayedCollapse = function (event) {
  // event.relatedTarget is null if mouse exits the window
  // In that case, do not collapse the navigation
  if (event && !event.relatedTarget) return false

  // Timer priority: local, global, default
  var timer = PRODUCT_NAV_COLLAPSE_DELAY_TIMEOUT || 1200

  // Set a timer to collapse navigation in the future
  // If the timer has not cleared by then, collapse navigation
  this.delayedCollapseTimer = setTimeout(function () {
    if (this.delayedCollapseTimer) {
      this.collapse()
    }
  }.bind(this), timer)
}

ProductNavigation.prototype.float = function () {
  this.el.classList.add('is-floating')
  document.body.classList.add('floating-product-nav')
}

ProductNavigation.prototype.unfloat = function () {
  this.el.classList.remove('is-floating')
  document.body.classList.remove('floating-product-nav')
}

$(document).on('ready', function (e) {
  var $window = $(window)
  var $body = $('body')
  var $pNav = $('#product-nav')
  var pNavTopPosition = $pNav.offset().top
  var pNavHeight = $pNav.height()

  var sectDemoPos = $('#demo-container').position().top
  var sectHighlightsPos = $('#section-highlights').offset().top
  var sectExamplesPos = $('#section-examples').offset().top
  var sectApiPos = $('#section-api').offset().top
  var sectContributePos = $('#section-contribute').offset().top
  var sectGithubPos = $('#section-github').offset().top
  var sectFooterPos = $('footer').offset().top

  var productNav = new ProductNavigation()

  // Start out revealing fixed main nav
  // It already does this, but record the state in DOM
  revealFixedMainNav()

  // Set demo height
  setDemoContainerHeight()
  window.addEventListener('resize', setDemoContainerHeight)

  productNav.init()

  $window.on('scroll', function (e) {
    // Determine window Y positioning
    // documentElement.scrollTop returns 0 in Chrome for some reason
    // document.body.scrollTop is deprecated, but is backwards-compatible
    windowPreviousYPosition = windowYPosition
    windowYPosition = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

    // Return early if some other script is doing the scrolling, as
    // indicated by the presence of the `is-scrolling` class that is
    // momentarily applied to the body element
    if (document.body.classList.contains('is-scrolling')) {
      resetScrollCounters()
      return
    }

    // Determine window scroll direction
    // The terms "up" and "down" are from the viewer's perspective.
    // That is, "scrolling down" means that the page moves _up_ in space
    // and "scrolling up" means that the page moves _down_ in space.
    if (windowPreviousYPosition > windowYPosition) {
      // Scrolling up
      window.clearTimeout(scrollCounterLifespanTimer)
      scrollDownCounter = 0
      scrollUpCounter++
    } else {
      // Scrolling down
      window.clearTimeout(scrollCounterLifespanTimer)
      scrollUpCounter = 0
      scrollDownCounter++
    }

    // Set a timer to expire scroll counter after a set time
    scrollCounterLifespanTimer = window.setTimeout(function () {
      resetScrollCounters()
    }, SCROLL_COUNTER_LIFESPAN)

    // As user scrolls up, reveal main navigation
    // or hide it, as user scrolls back down

    if (windowYPosition < FIXED_NAV_ALWAYS_SHOW_BELOW_Y_POSITION) {
      revealFixedMainNav()
    }

    if (scrollUpCounter >= FIXED_NAV_REVEAL_ON_COUNTER && windowYPosition > FIXED_NAV_ENABLE_AT_Y_POSITION) {
      revealFixedMainNav()
    } else if (scrollDownCounter >= FIXED_NAV_HIDE_ON_COUNTER) {
      hideFixedMainNav()
    }

    // 20 is the distance away from top of screen
    if (windowYPosition >= (pNavTopPosition - 20)) {
      productNav.float()
    } else {
      productNav.unfloat()
      productNav.expand()
    }

    if (windowYPosition >= sectFooterPos) {
      $('.product-nav-item').removeClass('active')
      $('#nav-bottom').addClass('active')
      $('.product-nav-scroll-container').css('top', -300)
    }
    else if (windowYPosition >= sectGithubPos -100) {
      $('.product-nav-item').removeClass('active')
      $('#nav-github').addClass('active')
      $('.product-nav-scroll-container').css('top', -250)
    }
    else if (windowYPosition >= sectContributePos -100) {
      $('.product-nav-item').removeClass('active')
      $('#nav-contribute').addClass('active')
      $('.product-nav-scroll-container').css('top', -200)
    }
    else if (windowYPosition >= sectApiPos -100) {
      $('.product-nav-item').removeClass('active')
      $('#nav-api').addClass('active')
      $('.product-nav-scroll-container').css('top', -150)
    }
    else if (windowYPosition >= sectExamplesPos -100) {
      $('.product-nav-item').removeClass('active')
      $('#nav-examples').addClass('active')
      $('.product-nav-scroll-container').css('top', -100)
    }
    else if (windowYPosition >= sectHighlightsPos -100) {
      $('.product-nav-item').removeClass('active')
      $('#nav-highlights').addClass('active')
      $('.product-nav-scroll-container').css('top', -50)

      productNav.collapse()
    } else {
      // demo
      $('.product-nav-item').removeClass('active')
      $('#nav-demo').addClass('active')
      $('.product-nav-scroll-container').css('top', 0)

      productNav.expand()
    }

  })

  // Clicks
  $('#nav-demo').on('click', function (e) {
    scrollToSection(this, sectDemoPos -100)
    $('.product-nav-item').removeClass('active')
    $('.product-nav-scroll-container').css('top', 0)
  })
  $('#nav-highlights').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $('.product-nav-item').removeClass('active')
    $(this).addClass('activated')
    $(window).scrollTo(sectHighlightsPos - 100, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -50)
  })
  $('#nav-examples').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $('.product-nav-item').removeClass('active')
    $(this).addClass('activated')
    $(window).scrollTo(sectExamplesPos - 100, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -100)
  })
  $('#nav-api').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $('.product-nav-item').removeClass('active')
    $(this).addClass('activated')
    $(window).scrollTo(sectApiPos - 100, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -150)
  })
  $('#nav-contribute').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $('.product-nav-item').removeClass('active')
    $(this).addClass('activated')
    $(window).scrollTo(sectContributePos - 100, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -200)
  })
  $('#nav-github').on('click', function (e) {
    momentarilyDisableMainNavReveal()
    $('.product-nav-item').removeClass('active')
    $(this).addClass('activated')
    $(window).scrollTo(sectGithubPos - 100, 250, scrollToSettings);
    $('.product-nav-scroll-container').css('top', -250)
  })

  $('.product-name').on('click', function (e) {
    $body.addClass('is-scrolling')
    $window.scrollTo(0, 250, scrollToSettings)
  })

})
