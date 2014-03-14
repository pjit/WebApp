/**
 * Created with JetBrains WebStorm.
 * User: psingh
 * Date: 3/12/14
 * Time: 10:45 PM
 * To change this template use File | Settings | File Templates.
 */

storageEngine = function() {
   var database;
   var objectStore;

   return {
      init : function(successCallback, errorCallback) {
      },
      initObjectStore : function(type, successCallback, errorCallback) {
      },
      save : function(type, obj, successCallback, errorCallback) {
      },
      findAll : function(type, successCallback, errorCallback) {
      },
      delete: function(type, id, successCallback, errorCallback) {
      },
      findByProperty: function(type, propertyName, propertyValue,
                               successCallback, errorCallback) {
      },
      findById: function(type, id, successCallback, errorCallback) {
      }
   }
}();
