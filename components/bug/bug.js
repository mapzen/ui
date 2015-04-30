// (c) 2015 Mapzen
//
// MAPZEN BUG (or MAPZEN DOG in the UK)
// http://en.wikipedia.org/wiki/Digital_on-screen_graphic
//
// Identifies full-screen demo pages with Mapzen brand and
// provides helpful social media links.
// --------------------------------------------------------
/*
<script>
  // Bug only activates if the page it's called on
  // is opened as a standalone page. So only include
  // this on pages that have no other context (e.g.
  // full-screen demo pages meant to be iframed)
  var mzBug = new MapzenBug({
    title: 'Tangram',
    link: 'https://mapzen.com/projects/tangram/',
    twitterId: 'xxxxx'
  })
</script>
*/
var MapzenBug = (function () {
  'use strict'

  var MapzenBug = function (opts) {
    // If iframed, do nothing.
    if (window.self !== window.top) {
      return false
    }

    this.opts = opts || {}
    this.el = this.createElAndAppend()
  }

  MapzenBug.prototype.init = function () {

  }

  MapzenBug.prototype.createElAndAppend = function () {
    var el = document.createElement('div')
    var link = document.createElement('a')
    var img = document.createElement('img')

    el.id = 'mazpen-bug' // Just be glad I didn't call it pamnez
    el.style.boxSizing = 'border-box'
    el.style.position = 'fixed'
    el.style.top = '0'
    el.style.left = '80px'
    el.style.width = '80px'
    el.style.backgroundColor = 'rgba(255,255,255,0.95)'
    el.style.height = '80px'
    el.style.boxShadow = '0 0 10px 1px rgba(0,0,0,0.10)'
    el.style.borderBottomRightRadius = '4px'
    el.style.borderBottomLeftRadius = '4px'
    el.style.zIndex = 10010 // Mapzen zip code

    link.href = this.opts.link || 'https://mapzen.com/'
    link.style.boxSizing = 'border-box'
    link.target = '_blank'
    link.style.display = 'block'
    link.style.position = 'absolute'
    link.style.top = 0
    link.style.left = 0
    link.style.width = '100%'
    link.style.height = '100%'
    link.style.padding = '8px'

    img.src = 'https://mapzen.com/assets/logos/mapzen-logo-square-color-lit.png'
    img.style.width = '64px'

    link.appendChild(img)
    el.appendChild(link)
    document.body.appendChild(el)

    return el
  }

  return MapzenBug
}())
