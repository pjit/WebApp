/**
 * Created with JetBrains WebStorm.
 * User: psingh
 * Date: 3/12/14
 * Time: 10:45 PM
 * To change this template use File | Settings | File Templates.
 */

storageEngine = function() {
   var initialized = false;
   var initializedObjectStores = {};

   // helper function to get de-serialized object for a type
   function getStorageObject(type) {
      var item = localStorage.getItem(type);
      var parsedItem = JSON.parse(item);

      return parsedItem;
   }
   //
   function validate(type, errorCB) {
      if (!initialized) {
         errorCB('storage_api_not_initialized',
            'The storage engine has not been initialized');
      }
      else if (!initializedObjectStores[type]) {
         errorCB('storage_not_initialized',
            'The object store ' + type + ' has not been initialized');
      }
   }

   return {
      init : function(successCallback, errorCallback) {
         if (window.localStorage) {
            initialized = true;
            successCallback(null);
         }
         else {
            errorCallback('storage_api_not_supported',
               'The web storage API is not supported');
         }
      },
      initObjectStore : function(type, successCallback, errorCallback) {
         if (!initialized) {
            errorCallback('storage_api_not_initialized',
               'The storage engine has not been initialized');
         }
         else if (!localStorage.getItem(type)) {
            localStorage.setItem(type, JSON.stringify({}))
         }
         initializedObjectStores[type] = true;
         successCallback(null);
      },
      save : function(type, obj, successCallback, errorCallback) {
         validate(type, errorCallback);

         if (!obj.id) {
            obj.id = $.now(); // Time in milliseconds - google js uuid also
         }
         var storageItem = getStorageObject(type);

         storageItem[obj.id] = obj;
         localStorage.setItem(type, JSON.stringify(storageItem));
         successCallback(obj);
      },
      findAll : function(type, successCallback, errorCallback) {
         validate(type, errorCallback);

         var result = [];
         var storageItem = getStorageObject(type);

         $.each(storageItem, function(i,v){
            result.push(v);
         });
         successCallback(result);
      },
      delete: function(type, id, successCallback, errorCallback) {
         validate(type, errorCallback);

         var storageItem = getStorageObject(type);

         if (storageItem[id]) {
            delete storageItem[id];
            localStorage.setItem(type, JSON.stringify(storageItem));
            successCallback(id);
         }
         else {
            errorCallback("object_not_found",
               "The object requested could not be found");
         }
      },
      findByProperty: function(type, propertyName, propertyValue,
                               successCallback, errorCallback) {
         validate(type, errorCallback);

         var result = [];
         var storageItem = getStorageObject(type);

         $.each(storageItem, function(i, v) {
            if (v[propertyName] === propertyValue) {
               result.push(v);
            }
         });
         successCallback(result);
      },
      findById: function(type, id, successCallback, errorCallback) {
         validate(type, errorCallback);

         var storageItem = getStorageObject(type);

         successCallback(storageItem[id]);
      }
   }
}();