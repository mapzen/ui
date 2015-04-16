
var SECTION_NAV_CSS_COMPONENT_PREFIX = 'section-nav-'
var SECTION_NAV_DEFERRED_COLLAPSE_TIMEOUT = 900
var SECTION_NAV_PAGE_ELEMENT_BUFFER = 100
var SECTION_NAV_VIEWPORT_TOP_OFFSET = 20
var SECTION_NAV_SCROLL_TIME = 250 // Time in ms to scroll page to section

var SectionNavigation = function (selector) {
  var el = document.querySelector(selector)

  this.el = el
  this.topPosition = this.el.offsetTop
  this.isFloating = false
  this.isCollapsed = false
  this.hitboxIsActive = false
  this.deferredCollapseTimer = null // Placeholder for setTimeout
  this.sections = [] // Placeholder for NodeList
  this.sectionPositions = [] // Placeholder for array of numbers

  this.initSections()
  this.addEventListeners()

  this.determineFloatState()
  this.determineActiveSection()

  // Enable some CSS transitions only after page has completed loading.
  // This fixes browser issues where initial paint would sometimes
  // be animated, which looks out of place.
  // Make sure the timer is greater than the amount of the transition
  // time in the CSS.
  window.setTimeout(function () {
    el.classList.add('enable-animation')
  }, 300)
}

SectionNavigation.prototype.initSections = function () {
  this.sections = document.querySelectorAll('.js-section-navigable')
  var ul = this.el.querySelector('ul')
  var handleClickEvent = function (index) {
    return function () {
      this.clickSection(index)
    }
  }

  // Empty the ul element, if needed
  while (ul.lastChild) {
    ul.removeChild(ul.lastChild)
  }

  // Create list elements from sections
  for (var i = 0, j = this.sections.length; i < j; i++) {
    var section = this.sections[i]
    var name = section.getAttribute('data-section-name') || '???'
    var li = document.createElement('li')
    li.className = SECTION_NAV_CSS_COMPONENT_PREFIX + 'item'
    li.setAttribute('data-section-index', i)
    li.textContent = name

    // The first element gets to start with the active state on
    if (i === 0) {
      li.classList.add('active')
    }

    // Bind click event
    li.addEventListener('click', handleClickEvent(i).bind(this), false)

    ul.appendChild(li)
  }

  // Add hidden element that accounts for footer area
  var hiddenLi = document.createElement('li')
  hiddenLi.className = SECTION_NAV_CSS_COMPONENT_PREFIX + 'item ' + SECTION_NAV_CSS_COMPONENT_PREFIX + 'item-egg'
  hiddenLi.textContent = '???'
  ul.appendChild(hiddenLi)

  // Remember the Y position of each section
  this.sectionPositions = this.getSectionPositions()

  // Recalculate Y positions when layout changes
  window.addEventListener('resize', this.getSectionPositions.bind(this))
}

SectionNavigation.prototype.getSectionPositions = function () {
  var positions = []

  for (var i = 0, j = this.sections.length; i < j; i++) {
    var el = this.sections[i]
    var position = el.getBoundingClientRect().top + document.body.scrollTop + SECTION_NAV_PAGE_ELEMENT_BUFFER

    // Clamp position value to zero if result is negative
    if (position < 0) {
      position = 0
    }

    positions.push(position)

    // Record the bottom edge of the last section
    if (i === j - 1) {
      positions.push(position + el.getBoundingClientRect().height)
    }
  }

  return positions
}

SectionNavigation.prototype.addEventListeners = function () {
  var hitboxClassName = SECTION_NAV_CSS_COMPONENT_PREFIX + 'hitbox'
  var hitboxEl = document.querySelector('.' + hitboxClassName)

  // All the elements that act as hitboxes for the purpose of
  // interacting with the product navigation bar
  // TODO make this work better -- this fires lots of duplicate events
  hitboxEl.addEventListener('mouseover', onMouseEntersHitboxArea.bind(this), false)
  hitboxEl.addEventListener('mouseout', onMouseLeavesHitboxArea.bind(this), false)
  this.el.addEventListener('mouseover', onMouseEntersHitboxArea.bind(this), false)
  this.el.addEventListener('mouseout', onMouseLeavesHitboxArea.bind(this), false)
  document.querySelector('nav').addEventListener('mouseover', onMouseEntersHitboxArea.bind(this), false)
  document.querySelector('nav').addEventListener('mouseout', onMouseLeavesHitboxArea.bind(this), false)

  window.addEventListener('mouseover', onMouseReentersWindow.bind(this))
  window.addEventListener('scroll', onScrollWindow.bind(this))

  this.el.querySelector('.' + SECTION_NAV_CSS_COMPONENT_PREFIX + 'title').addEventListener('click', onClickNavigationTitle, false)

  function onMouseLeavesHitboxArea (event) {
    this.hitboxIsActive = false

    // Do not collapse if navbar is not floating
    if (this.isFloating === false) return

    // Do not collapse if mouse pointer exits the window
    if (event && !event.relatedTarget) return

    this.deferredCollapse()
  }

  function onMouseEntersHitboxArea (event) {
    this.hitboxIsActive = true
    this.expand()
  }

  function onMouseReentersWindow (event) {
    // Do not collapse if navbar is not floating
    if (this.isFloating === false) return

    // Collapse if mouse pointer re-enters the window
    // but outside of the hitbox area
    if (!event.relatedTarget && this.hitboxIsActive === false) {
      this.collapse()
    }
  }

  // TODO: Throttle this event better
  function onScrollWindow (event) {
    var windowYPosition = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

    this.determineFloatState(windowYPosition)
    this.determineActiveSection(windowYPosition)
  }

  function onClickNavigationTitle (event) {
    document.body.classList.add('is-scrolling')
    $(window).scrollTo(0, SECTION_NAV_SCROLL_TIME, {
      onAfter: function () {
        document.body.classList.remove('is-scrolling')
      }
    })
  }
}

SectionNavigation.prototype.expand = function () {
  clearTimeout(this.deferredCollapseTimer)
  this.isCollapsed = false
  this.el.classList.remove('is-collapsed')
}

SectionNavigation.prototype.collapse = function () {
  // Refuse to collapse if the hitbox area is active
  if (this.hitboxIsActive) return

  this.isCollapsed = true
  this.el.classList.add('is-collapsed')
}

SectionNavigation.prototype.deferredCollapse = function () {
  var timer = SECTION_NAV_DEFERRED_COLLAPSE_TIMEOUT || 1200

  // Set a timer to defer collapse into the future
  // This can be canceled by clearing the timer elsewhere
  this.deferredCollapseTimer = setTimeout(function () {
    if (this.deferredCollapseTimer) {
      this.collapse()
    }
  }.bind(this), timer)
}

SectionNavigation.prototype.float = function () {
  this.isFloating = true
  this.el.classList.add('is-floating')
  document.body.classList.add('floating-section-nav')
}

SectionNavigation.prototype.unfloat = function () {
  this.isFloating = false
  this.el.classList.remove('is-floating')
  document.body.classList.remove('floating-section-nav')
}

SectionNavigation.prototype.determineFloatState = function (windowYPosition) {
  windowYPosition = windowYPosition || window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

  // Set product navigation to be floating or not
  // depending on the window's current Y position
  if (windowYPosition >= (this.topPosition - SECTION_NAV_VIEWPORT_TOP_OFFSET)) {
    this.float()
  } else {
    this.unfloat()
    this.expand()
  }
}

SectionNavigation.prototype.determineActiveSection = function (windowYPosition) {
  var positions = this.sectionPositions

  windowYPosition = windowYPosition || window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

  if (windowYPosition < positions[0]) {
    // Assume very first section for now
    this.setSection(0)
    this.expand()
    return
  } else if (windowYPosition >= positions[positions.length - 1]) {
    // Last section
    this.setSection(positions.length - 1)
    return
  }

  for (var i = 0, j = positions.length; i < j; i++) {
    if (windowYPosition >= positions[i] && windowYPosition < positions[i + 1]) {
      this.setSection(i)

      // Depending on the section are on, set default collapse or expand state
      // TODO: Is this a thing that is here?
      if (i === 0) {
        this.expand()
      } else if (!this.isCollapsed) {
        this.collapse()
      }

      return
    }
  }
}

SectionNavigation.prototype.setSection = function (sectionIndex) {
  var listEls = this.el.querySelectorAll('li')
  var el = listEls[sectionIndex]
  var listScrollPosition = sectionIndex * this.el.offsetHeight

  // Remove active class on all list elements
  for (var i = 0, j = listEls.length; i < j; i++) {
    listEls[i].classList.remove('active')
  }

  // Set new section to active state
  el.classList.add('active')

  // Set list container scroll position for nav in collapsed state
  el.parentNode.style.top = '-' + listScrollPosition.toString() + 'px'
}

SectionNavigation.prototype.clickSection = function (sectionIndex) {
  var listEls = this.el.querySelectorAll('li')
  var el = listEls[sectionIndex]
  var position = this.sectionPositions[sectionIndex]
  var navEl = this.el

  // Indicate that page is being mechanically scrolled
  document.body.classList.add('is-scrolling')

  // Indicate which section is being scrolled to
  el.classList.add('activated')

  $(window).scrollTo(position, SECTION_NAV_SCROLL_TIME, {
    onAfter: function () {
      document.body.classList.remove('is-scrolling')
      el.classList.remove('activated')
    }
  })
}
