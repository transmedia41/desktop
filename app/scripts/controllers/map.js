'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

  /**
   * Service to manage geoJSON layering with Leaflet.js' angular directive, which only allows 1 set of geoJSON data.
   *
   * Assuming you have a leaflet directive with its 'geojson' attribute set to `geojson`, usage is as follows:
   *     var layers = new GeoJSONLayers();
   *
   *     layers.addLayer('myLayer', geoJSON, function(feature) { return { fillColor: '#00F' }; });
   *     $scope.geojson = layers.get();
   *
   *     layers.removeLayer('myLayer');
   *     $scope.geojson = layers.get();
   */
  .factory('GeoJSONLayers', function() {
    var handler = function() {
      this.clear()
    }

    handler.prototype.clear = function() {
      this.json = {
        type : "FeatureCollection",
        features : []
      }
      this.layerStyles = {}
    }

    handler.prototype.addLayer = function(layerID, geoJSON, styleCallback) {
      this.layerStyles[layerID] = styleCallback

      // tag features with their assigned layer
      geoJSON.features.forEach(function(feature, i) {
        feature.properties.__LAYERID__ = layerID
      });

      // merge into current objects
      Array.prototype.push.apply(this.json.features, geoJSON.features)
    }

    handler.prototype.removeLayer = function(layerID) {
      var feats = this.json.features,
          i = 0

      delete this.layerStyles[layerID]

      // remove relevant geoJSON objects as well
      for (; i < feats.length; ++i) {
        feature = feats[i]
        if (feature.properties.__LAYERID__ == layerID) {
          feats.splice(i, 1)
          --i
        }
      }
    }

    handler.prototype.__handleStyle = function(feature) {
      if (feature.properties['__LAYERID__'] === undefined) {
          return {}
      }
      return this.layerStyles[feature.properties.__LAYERID__](feature)
    }

    // return geoJSON data for assignment to scope
    handler.prototype.get = function() {
      var self = this

      return {
        data: this.json,
        style: function(feature) {
            return self.__handleStyle.call(self, feature)
        },
        resetStyleOnMouseout: true
      }
    }

    return handler
  })



