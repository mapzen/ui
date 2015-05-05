// (c) 2015 Mapzen
//
// MAPZEN BUG (or MAPZEN DOG in the UK)
// http://en.wikipedia.org/wiki/Digital_on-screen_graphic
//
// Identifies full-screen demo pages with Mapzen brand and
// provides helpful social media links.
// --------------------------------------------------------
/* global ga */
var MapzenBug = (function () {
  'use strict'

  var STYLESHEET = 'https://cdn.rawgit.com/mapzen/ui/master/components/bug/bug.css'
  var DEFAULT_LINK = 'https://mapzen.com/'
  var TWITTER_BASE_URL = 'https://twitter.com/home?status='

  // Do not call this at initialize. Google Analytics may
  // not be loaded yet when this is loaded. Only call it
  // when the tracking event itself needs to be logged.
  function _track (category, action, label, value) {
    // Is Google Analytics present?
    if (typeof ga === 'undefined') {
      return false
    }

    // Tracking event
    console.log('Event tracked:', category, action, label)
    ga && ga('send', 'event', category, action, label, value)
  }

  // Loads external stylesheet for the bug.
  // Ensures that it is placed before other defined stylesheets or style
  // blocks in the head, so that custom styles are allowed to override
  function _loadExternalStylesheet () {
    var el = document.createElement('link')
    var firstStylesheet = document.head.querySelectorAll('link, style')[0]

    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('type', 'text/css')
    el.setAttribute('href', STYLESHEET)

    if (firstStylesheet !== 'undefined') {
      document.head.insertBefore(el, firstStylesheet)
    } else {
      document.head.appendChild(el)
    }
  }

  function _popupWindow (url, title, w, h) {
    // Borrowed from rrssb
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    var left = ((width / 2) - (w / 2)) + dualScreenLeft
    var top = ((height / 3) - (h / 3)) + dualScreenTop

    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus()
    }
  }

  function _buildTwitterLink (opts) {
    var msg

    if (opts.twitterShareMsg) {
      msg = encodeURIComponent(opts.twitterShareMsg + ' ' + window.location.href)
    } else if (opts.name) {
      msg = encodeURIComponent(opts.name + ', powered by @mapzen ' + window.location.href)
    } else {
      msg = encodeURIComponent('Check out this project by @mapzen! ' + window.location.href)
    }

    return TWITTER_BASE_URL + msg
  }

  function _createElsAndAppend (opts) {
    var el = document.createElement('div')
    var link = document.createElement('a')
    var logo = document.createElement('div')
    var twitterEl = document.createElement('a')
    var facebookEl = document.createElement('a')
    var twitterLogo = document.createElement('div')
    var facebookLogo = document.createElement('div')

    // Create container
    el.id = 'mz-bug'
    el.className = 'mz-bug-container'
    el.setAttribute('role', 'widget')

    // Create link
    link.href = opts.link || DEFAULT_LINK
    link.target = '_blank'
    link.className = 'mz-bug-anchor'
    if (opts.name) {
      link.title = opts.name + ' · Powered by Mapzen'
    } else {
      link.title = 'Powered by Mapzen'
    }

    logo.className = 'mz-bug-logo'

    // Create Twitter & Facebook link
    twitterEl.href = _buildTwitterLink(opts) // Default link
    twitterEl.target = '_blank'
    twitterEl.className = 'mz-bug-twitter-link'
    twitterEl.title = 'Share this on Twitter'
    twitterEl.addEventListener('click', function (e) {
      e.preventDefault()
      // Build a new link, in case viewport has changed.
      var currentLink = _buildTwitterLink(opts)
      _popupWindow(currentLink, 'Twitter', 580, 470)
      if (opts.analytics) {
        _track()
      }
    })
    twitterLogo.className = 'mz-bug-twitter-logo'
    facebookEl.href = 'http://facebook.com/'
    facebookEl.target = '_blank'
    facebookEl.className = 'mz-bug-facebook-link'
    facebookEl.title = 'Share this on Facebook'
    facebookLogo.className = 'mz-bug-facebook-logo'

    link.appendChild(logo)
    el.appendChild(link)
    twitterEl.appendChild(twitterLogo)
    facebookEl.appendChild(facebookLogo)
    el.appendChild(twitterEl)
    el.appendChild(facebookEl)
    document.body.appendChild(el)

    return el
  }

  var MapzenBug = function (opts) {
    // If iframed, exit & do nothing.
    if (window.self !== window.top) {
      return false
    }

    opts = opts || {}
    opts.analytics = true // Default value
    _loadExternalStylesheet()
    _createElsAndAppend(opts)
  }

  return MapzenBug
}())
