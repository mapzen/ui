'use strict'

// Constants (configurable)
var SCROLL_COUNTER_LIFESPAN = 1000

var FIXED_NAV_ENABLE_AT_Y_POSITION = 300
var FIXED_NAV_REVEAL_ON_COUNTER = 4
var FIXED_NAV_HIDE_ON_COUNTER = 2
//var FIXED_NAV_HIDE_AT_Y_POSITION = 50
var FIXED_NAV_ALWAYS_SHOW_BELOW_Y_POSITION = 50

var PRODUCT_NAV_COLLAPSE_DELAY_TIMEOUT = 900
var PRODUCT_NAV_TOP_OFFSET = 20

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

var ProductNavigation = function (el) {
  this.el = document.querySelector(el)
  this.topPosition = this.el.offsetTop
  this.isFloating = false
  this.isCollapsed = false
  this.hitboxIsActive = false
  this.delayedCollapseTimer = null // Placeholder

  this.addEventListeners()

  // Enable CSS transition time only after page has completed loading
  // so that setting the navbar into initial state is not animated.
  document.addEventListener('DOMContentLoaded', function (event) {
    this.el.querySelector('.product-nav-container').classList.add('enable-animation')
  }.bind(this))
}

ProductNavigation.prototype.addEventListeners = function () {
  // The hitbox is an invisible area bigger than the navigation bar itself
  // When the mouse enters this area, expand the navigation bar
  var hitboxClassName = 'product-nav-hitbox'
  var hitboxEl = document.querySelector('.' + hitboxClassName)

  // All the elements that act as hitboxes for the purpose of
  // expanding product navigation
  hitboxEl.addEventListener('mouseover', onMouseEntersHitboxArea.bind(this))
  hitboxEl.addEventListener('mouseout', onMouseLeavesHitboxArea.bind(this))
  this.el.addEventListener('mouseover', onMouseEntersHitboxArea.bind(this))
  this.el.addEventListener('mouseout', onMouseLeavesHitboxArea.bind(this))
  document.querySelector('nav').addEventListener('mouseover', onMouseEntersHitboxArea.bind(this))
  document.querySelector('nav').addEventListener('mouseout', onMouseLeavesHitboxArea.bind(this))

  window.addEventListener('mouseover', onMouseReentersWindow.bind(this))
  window.addEventListener('scroll', onScrollWindow.bind(this))

  function onMouseLeavesHitboxArea (event) {
    this.hitboxIsActive = false

    // event.relatedTarget is null if mouse exits the window
    // In that case, do not collapse the navigation
    if (event && !event.relatedTarget) return false

    this.delayedCollapse()
  }

  function onMouseEntersHitboxArea (event) {
    this.hitboxIsActive = true
    this.expand()
  }

  function onMouseReentersWindow (event) {
    // Collapse nav if mouse re-enters window not on the hitbox area
    // Do not collapse if navigation is not in the floating state
    if (this.isFloating === false) return

    if (!event.relatedTarget && this.hitboxIsActive === false) {
      this.collapse()
    }
  }

  function onScrollWindow (event) {
    this.determineFloatState()
  }
}

ProductNavigation.prototype.collapse = function () {
  // Never allow a collapse if the hitbox area is active
  if (this.hitboxIsActive) return

  this.isCollapsed === true
  this.el.classList.add('is-collapsed')
}

ProductNavigation.prototype.expand = function () {
  clearTimeout(this.delayedCollapseTimer)
  this.isCollapsed === false
  this.el.classList.remove('is-collapsed')
}

ProductNavigation.prototype.delayedCollapse = function () {
  var timer = PRODUCT_NAV_COLLAPSE_DELAY_TIMEOUT || 1200

  // Set a timer to collapse navigation in the future
  // This can be canceled by clearing the timeout elsewhere
  this.delayedCollapseTimer = setTimeout(function () {
    if (this.delayedCollapseTimer) {
      this.collapse()
    }
  }.bind(this), timer)
}

ProductNavigation.prototype.float = function () {
  this.isFloating = true
  this.el.classList.add('is-floating')
  document.body.classList.add('floating-product-nav')
}

ProductNavigation.prototype.unfloat = function () {
  this.isFloating = false
  this.el.classList.remove('is-floating')
  document.body.classList.remove('floating-product-nav')
}

ProductNavigation.prototype.determineFloatState = function () {
  // Set product navigation to be floated or not
  // depending on current window position
  var windowYPosition = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

  if (windowYPosition >= (this.topPosition - PRODUCT_NAV_TOP_OFFSET)) {
    this.float()
  } else {
    this.unfloat()
    this.expand()
  }
}

ProductNavigation.prototype.changeSection = function (newSectionId, triggerCollapse) {
  var listEls = this.el.querySelectorAll('li')
  var el = document.getElementById(newSectionId)
  var elIndex = Array.prototype.indexOf.call(listEls, el)
  var listScrollPosition = elIndex * 50

  // Remove active class on all list elements
  for (var i = 0, j = listEls.length; i < j; i++) {
    listEls[i].classList.remove('active')
  }

  // Set new section to active state
  el.classList.add('active')

  // Set list container scroll position for nav in collapsed state
  el.parentNode.style.top = '-' + listScrollPosition.toString() + 'px'

  // Collapse or expand nav when this section is active?
  if (triggerCollapse === true && !this.isCollapsed) {
    this.collapse()
  } else if (triggerCollapse === false) {
    this.expand()
  }
  // else ignore
}

var $window = $(window)
var $body = $('body')

var sectHighlightsPos = $('#section-highlights').offset().top
var sectExamplesPos = $('#section-examples').offset().top
var sectApiPos = $('#section-api').offset().top
var sectContributePos = $('#section-contribute').offset().top
var sectGithubPos = $('#section-github').offset().top
var sectFooterPos = $('footer').offset().top

var productNav = new ProductNavigation('#product-nav')

// Start out revealing fixed main nav
// It already does this, but record the state in DOM
revealFixedMainNav()

// Set demo height
setDemoContainerHeight()
window.addEventListener('resize', setDemoContainerHeight)

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

  if (windowYPosition >= sectFooterPos) {
    productNav.changeSection('nav-bottom')
  } else if (windowYPosition >= sectGithubPos -100) {
    productNav.changeSection('nav-github')
  } else if (windowYPosition >= sectContributePos -100) {
    productNav.changeSection('nav-contribute')
  } else if (windowYPosition >= sectApiPos -100) {
    productNav.changeSection('nav-api')
  } else if (windowYPosition >= sectExamplesPos -100) {
    productNav.changeSection('nav-examples')
  } else if (windowYPosition >= sectHighlightsPos -100) {
    productNav.changeSection('nav-highlights', true)
  } else {
    productNav.changeSection('nav-demo', false)
  }
})

$(document).on('ready', function (e) {

  // Clicks
  $('#nav-demo').on('click', function (e) {
    scrollToSection(this, 0)
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
