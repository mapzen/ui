// (c) 2015 Mapzen
//
// MAPZEN BUG (or MAPZEN DOG in the UK)
// http://en.wikipedia.org/wiki/Digital_on-screen_graphic
//
// Identifies full-screen demo pages with Mapzen brand and
// provides helpful social media links.
// --------------------------------------------------------
var MapzenBug = (function () {
  'use strict'

  var STYLESHEET = 'http://localhost:8080/components/bug/bug.css'
  var DEFAULT_LINK = 'https://mapzen.com/'

  // Do not call this at initialize. Google Analytics may
  // not be loaded yet when this is loaded. Only call it
  // when the tracking event itself needs to be logged.
  function _track() {
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

  function _createElsAndAppend (opts) {
    var el = document.createElement('div')
    var link = document.createElement('a')
    var logo = document.createElement('div')
    var twitterEl = document.createElement('a')
    var facebookEl = document.createElement('a')
    var twitterLogo = document.createElement('div')
    var facebookLogo = document.createElement('div')
    var twitterShareMsg
    var facebookShareMsg

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
    if (opts.twitterShareMsg) {
      twitterShareMsg = encodeURIComponent(opts.twitterShareMsg + ' ' + location.href)
    } else if (opts.name) {
      twitterShareMsg = encodeURIComponent(opts.name + ', powered by @mapzen ' + location.href)
    } else {
      twitterShareMsg = encodeURIComponent('Check out this project by @mapzen! ' + location.href)
    }

    twitterEl.href = 'http://twitter.com/home?status=' + twitterShareMsg + ''
    twitterEl.target = '_blank'
    twitterEl.className = 'mz-bug-twitter-link'
    twitterEl.addEventListener('click', function (e) {
      e.preventDefault()
      _popupWindow(twitterEl.href, 'Twitter', 580, 470)
    })
    twitterLogo.className = 'mz-bug-twitter-logo'
    facebookEl.href = 'http://facebook.com/'
    facebookEl.target = '_blank'
    facebookEl.className = 'mz-bug-facebook-link'
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
    _loadExternalStylesheet()
    _createElsAndAppend(opts)

    //_track()
  }

  return MapzenBug
}())
