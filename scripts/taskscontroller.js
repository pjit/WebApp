/**
 * Created with JetBrains WebStorm.
 * User: psingh
 * Date: 3/12/14
 * Time: 3:27 PM
 * To change this template use File | Settings | File Templates.
 */

taskController = function() {
    var taskPage;
    var initialized = false;

    // private function
    function errorLogger(errorCode, errorMessage) {
       console.log(errorCode + ":" + errorMessage);
    }

    return {
      init : function(page) {
         // Initialize storage engine
         storageEngine.init(function() {
            storageEngine.initObjectStore('task', function() {

            }, errorLogger);
         }, errorLogger);
         if (!initialized) {
            taskPage = page;

            $(taskPage).find('[required="required"]').prev('label')
               .append("<span>*</span>").children('span').addClass('required');
            $(taskPage).find('tbody tr:even').addClass('even');
            // add a task row
            $("#btnAddTask").click(function(evt){
               evt.preventDefault();
               $("#taskCreation").removeClass("not");
            });
            // row highlight
            $(taskPage).find('tbody tr').click(function(evt) {
               $(evt.target).closest('td').siblings().andSelf().toggleClass('rowHighlight');
            });
            // edit row
            $(taskPage).find('#tblTasks tbody').on('click', '.editRow', function(evt) {
               evt.preventDefault();
               $(taskPage).find("#taskCreation").removeClass("not");

               storageEngine.findById('task',
                  $(evt.target).data().taskId, function(task) {
                     $(taskPage).find('form').fromObject(task);
                  }, errorLogger)
            });
            // delete row
            $(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', function(evt) {
               evt.preventDefault();
               storageEngine.delete('task',
                  $(evt.target).data().taskId, function() {
                     $(evt.target).parents('tr').remove();
                  }, errorLogger)
            });
            // save task
            $(taskPage).find('#saveTask').click(function(evt) {
               evt.preventDefault();

               if ($(taskPage).find('form').valid()) {
                  var task = $('form').toObject();

                  storageEngine.save('task', task, function(savedTask) {
                     $(taskPage).find('#tblTasks tbody').empty();
                     taskController.loadTasks();
                     $(':input').val('');
                     $(taskPage).find("#taskCreation").addClass('not');
                     //$('#tblTasks tbody').append(_.template($('#taskRow').text(), savedTask));
                  }, errorLogger);
               }
            });
            initialized = true;
         }
      },
      // load all saved tasks into the table
      loadTasks : function() {
         storageEngine.findAll('task', function(tasks) {
            $.each(tasks, function(index, task) {
               $('#tblTasks tbody').append(_.template($('#taskRow').text(), task));
            });
         }, errorLogger);
      }
    };
}();