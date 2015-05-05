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

  var STYLESHEET = 'https://cdn.rawgit.com/mapzen/ui/0.1.0/components/bug/bug.css'
  var DEFAULT_LINK = 'https://mapzen.com/'
  var TRACKING_CATEGORY = 'demo'

  function _track (action, label, value, nonInteraction) {
    if (typeof ga === 'undefined') {
      return false
    }

    console.log('Event tracked:', TRACKING_CATEGORY, action, label, nonInteraction)
    ga('send', 'event', TRACKING_CATEGORY, action, label, value, nonInteraction)
  }

  function _loadAnalytics () {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-47035811-1', 'auto');
    ga('send', 'pageview');
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
    var base = 'https://twitter.com/intent/tweet'
    var url = encodeURIComponent(window.location.href)
    var text
    var params

    if (opts.tweet) {
      text = encodeURIComponent(opts.tweet)
    } else if (opts.name) {
      text = encodeURIComponent(opts.name + ', powered by @mapzen')
    } else {
      text = encodeURIComponent('Check out this project by @mapzen!')
    }

    params = '?text=' + text + '&url=' + url
    return base + params
  }

  function _buildFacebookLink (opts) {
    var base = 'https://www.facebook.com/sharer/sharer.php?u='
    var url = encodeURIComponent(window.location.href)
    return base + url
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
    link.addEventListener('click', function (e) {
      if (opts.analytics === true) {
        _track('click', 'mapzen logo')
      }
    })

    logo.className = 'mz-bug-logo'

    // Create Twitter
    twitterLogo.className = 'mz-bug-twitter-logo'
    twitterEl.href = _buildTwitterLink(opts) // Default link
    twitterEl.target = '_blank'
    twitterEl.className = 'mz-bug-twitter-link'
    twitterEl.title = 'Share this on Twitter'
    twitterEl.addEventListener('click', function (e) {
      e.preventDefault()

      // Always rebuild most current link, just in case
      twitterEl.href = _buildTwitterLink(opts)
      _popupWindow(twitterEl.href, 'Twitter', 580, 470)
      if (opts.analytics === true) {
        _track('click', 'twitter')
      }
    })

    // Create Facebook
    facebookLogo.className = 'mz-bug-facebook-logo'
    facebookEl.href = _buildFacebookLink(opts)
    facebookEl.target = '_blank'
    facebookEl.className = 'mz-bug-facebook-link'
    facebookEl.title = 'Share this on Facebook'
    facebookEl.addEventListener('click', function (e) {
      e.preventDefault()

      // Always rebuild most current link, just in case
      facebookEl.href = _buildFacebookLink(opts)
      _popupWindow(facebookEl.href, 'Facebook', 580, 470)
      if (opts.analytics === true) {
        _track('click', 'facebook')
      }
    })

    // Build DOM
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

    this.opts = opts || {}
    this.opts.analytics = true // Default value

    _loadExternalStylesheet()
    this.el = _createElsAndAppend(this.opts)
    this.twitterEl = this.el.querySelector('.mz-bug-twitter-link')
    this.facebookEl = this.el.querySelector('.mz-bug-facebook-link')

    // Rebuild links if hash changes
    if ('onhashchange' in window) {
      window.onhashchange = function () {
        this.rebuildLinks()
      }.bind(this)
    }

    // Check if Google Analytics is present soon in the future; if not, load it.
    window.setTimeout(function () {
      if (typeof ga === 'undefined') {
        console.log('Analytics not detected; loading Mapzen default...')
        _loadAnalytics()
        if (this.opts.analytics === true) {
          _track('analytics', 'fallback', null, true)
        }
      }

      if (this.opts.analytics === true) {
        _track('bug', 'active', null, true)
      }
    }.bind(this), 0)

  }

  MapzenBug.prototype.rebuildLinks = function () {
    this.twitterEl.href = _buildTwitterLink(this.opts)
    this.facebookEl.href = _buildFacebookLink(this.opts)
  }

  return MapzenBug
}())
