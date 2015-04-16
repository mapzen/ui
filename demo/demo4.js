'use strict'

// HIDE / SHOW MAIN NAVIGATION
// --------------------------------------------------------

// Constants (configurable)
var SCROLL_COUNTER_LIFESPAN = 1000

var FIXED_NAV_ENABLE_AT_Y_POSITION = 300
var FIXED_NAV_REVEAL_ON_COUNTER = 4
var FIXED_NAV_HIDE_ON_COUNTER = 2
var FIXED_NAV_ALWAYS_SHOW_BELOW_Y_POSITION = 50

var windowPreviousYPosition
var windowYPosition
var scrollDownCounter = 0
var scrollUpCounter = 0
var scrollCounterLifespanTimer

// Functions
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

// Initialize

// Explicitly declare that the main nav should be
// fixed in place when the page is loaded
revealFixedMainNav()

// Main navigation show/hide based on user scroll action
window.addEventListener('scroll', function (e) {
  // Determine window Y positioning
  // documentElement.scrollTop returns 0 in Chrome for some reason
  // document.body.scrollTop is deprecated, but is backwards-compatible
  windowPreviousYPosition = windowYPosition
  windowYPosition = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

  // Always show main nav when windowY is at a set position
  if (windowYPosition < FIXED_NAV_ALWAYS_SHOW_BELOW_Y_POSITION) {
    revealFixedMainNav()
  }

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
  if (scrollUpCounter >= FIXED_NAV_REVEAL_ON_COUNTER && windowYPosition > FIXED_NAV_ENABLE_AT_Y_POSITION) {
    revealFixedMainNav()
  } else if (scrollDownCounter >= FIXED_NAV_HIDE_ON_COUNTER) {
    hideFixedMainNav()
  }
})

// PRODUCT PAGE - DEMO SECTION
// --------------------------------------------------------

function setDemoContainerHeight () {
  var viewportHeight = document.documentElement.clientHeight
  var demoContainerEl = document.getElementById('demo')
  var minHeight = 600
  var maxHeightPercentage = 0.8
  demoContainerEl.style.height = Math.max(minHeight, Math.floor(maxHeightPercentage * viewportHeight)) + 'px'
}

// Set demo height
setDemoContainerHeight()
window.addEventListener('resize', setDemoContainerHeight)

// PRODUCT NAVIGATION
// --------------------------------------------------------

// makes global for debug reasons
var productNav

// Initalize after page reports ready
// TODO THIS BETTER
$(document).ready(function () {
  productNav = new SectionNavigation('#product-nav')

  // TODO HACK
  // After demo has finished loading, reset productNav info
  window.setTimeout(function () {
    productNav.invalidateCurrentState()
  }, 0)
})
