// (c) 2015 Mapzen
//
// City dropdown
// --------------------------------------------------------
/* global jQuery, select2 */
(function ($) {
  'use strict'

  // Exit if demo is iframed.
  if (window.self !== window.top) return false

  var STYLESHEET = '//s3.amazonaws.com/assets-staging.mapzen.com/ui/components/locator/findcity.min.css'
  var CITY_DATA_URL = '//s3.amazonaws.com/assets-staging.mapzen.com/ui/components/locator/cities.json'
  CITY_DATA_URL ='https://gist.githubusercontent.com/randymeech/1fb759d34521b43d373d/raw/3d2d7944ae32d819a17d60a44c6702b4406e6c91/cities'
  var CITY_DATA

  var CITY_SELECT_PLACEHOLDER_TEXT = 'Search'
  var GEOLOCATOR_TITLE_TEXT = 'Get current location'

  function _loadExternalStylesheet () {
    var el = document.createElement('link')
    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('type', 'text/css')
    el.setAttribute('href', STYLESHEET)
    document.head.appendChild(el)
  }

  function _createElsAndAppend () {
    var el = document.createElement('div')

    el.id = 'mz-locator'
    el.className = 'mz-locator'
    el.setAttribute('role', 'widget')

    // Create city locator
    var cityContainerEl = document.createElement('div')
    var citySelectEl = document.createElement('select')
    var citySelectOptionEl = document.createElement('option')
    var citySelectOptionText = document.createTextNode(CITY_SELECT_PLACEHOLDER_TEXT)

    citySelectOptionEl.setAttribute('disabled', '')
    citySelectOptionEl.setAttribute('selected', '')
    citySelectOptionEl.appendChild(citySelectOptionText)

    citySelectEl.className = 'js--mz-citylocator-select2'
    citySelectEl.appendChild(citySelectOptionEl)

    cityContainerEl.id = 'mz-citylocator'
    cityContainerEl.className = 'mz-citylocator'
    cityContainerEl.appendChild(citySelectEl)

    // Create geo locator
    var geoContainerEl = document.createElement('div')
    var geoButtonEl = document.createElement('div')
    var geoIconEl = document.createElement('span')

    geoIconEl.className = 'mz-geolocator-icon'

    geoButtonEl.className = 'mz-geolocator-button'
    geoButtonEl.setAttribute('title', GEOLOCATOR_TITLE_TEXT)
    geoButtonEl.appendChild(geoIconEl)

    geoContainerEl.id = 'mz-geolocator'
    geoContainerEl.className = 'mz-geolocator'
    geoContainerEl.appendChild(geoButtonEl)

    // Build DOM
    el.appendChild(cityContainerEl)
    el.appendChild(geoContainerEl)
    document.body.appendChild(el)

    return el
  }

  _loadExternalStylesheet()
  _createElsAndAppend()

  $.get(CITY_DATA_URL, function (data) {
    CITY_DATA = JSON.parse(data)

    // Process data
    CITY_DATA = CITY_DATA.map(function (item) {
      return {
        name: item.n,
        lat: item.l.split('/')[0],
        lng: item.l.split('/')[1],
        zoom: item.z
      }
    })

    // Assume the JSON is sorted already.

    $(document).ready(function () {
      var $select = $('.js--mz-citylocator-select2');
      CITY_DATA.forEach(function (item) {
        $select.append('<option value="' + item.name + '" data-lat="' + item.lat + '" data-lng="' + item.lng + '" data-zoom="' + item.zoom + '">' + item.name + '</option>')
      })

      $select.select2({
        placeholder: 'Search'
      })

      // Input into the search field should not bubble up and
      // interact with other GUIs inserted onto page.
      // Example: dat-gui listens for 'h' key to hide the UI
      $select.on('select2:open', function (e) {
        $('.select2-search__field').on('keydown', function (e) {
          e.stopPropagation()
        })
      })

      $select.on('select2:select', function (e) {
        /* global map */
        var el = e.params.data.element
        var lat = el.dataset.lat
        var lng = el.dataset.lng
        var zoom = (el.dataset.zoom === 'undefined') ? null : el.dataset.zoom;
        if (zoom) {
          map.setView([lat, lng], zoom);
        } else {
          map.setView([lat, lng]);
        }
      })
    });
  })
})(jQuery);
