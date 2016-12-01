'use strict';

module.exports = {
  getItemIdFromLocation: function(location) {
    return location.split("/").slice(-1)[0];
  }
};