// (c) 2015 Mapzen
//
// UTILS · IFRAMED ANCHORS
//
// Bottom line is, don’t use target="_blank" in anchors.
// Read more: https://css-tricks.com/use-target_blank/
//
// If you’re in an iframe, though, you may not want links
// to open within the frame. The following code snippet
// will add target="_top" to all links that do not have an
// explicit target attribute, if the page is inside an
// iframe. You should run it after, say, links are created
// by Leaflet to make sure all attribution links open in
// the parent tab / window.
// --------------------------------------------------------
var MPZN = (function (MPZN) {
  'use strict'

  MPZN = MPZN || {}
  MPZN.Utils = MPZN.Utils || {}

  MPZN.Utils.iframedAnchors = function () {
    if (window.self !== window.top) {
      var anchors = document.querySelectorAll('a')
      for (var i = 0, j = anchors.length; i < j; i++) {
        var el = anchors[i]
        if (!el.target) {
          el.target = '_top'
        }
      }
    }
  }

  return MPZN
})(MPZN)
