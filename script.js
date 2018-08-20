/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
var student_array = [];
var edit_mode = false;
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
      addClickHandlersToElements();
      getData();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
      //Delete button event listener is in renderStudentOnDom function
      $('.add_button').on('click', handleAddClicked);
      $('.cancel_button').on('click', handleCancelClick);
      // $('.student-list').on('click', '.delete_row', function (){
      //       var jQueryObj = $(this);
      //       deleteData( student_array, jQueryObj );
      // });
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked( event ){
      addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
      var name = $('#studentName').val();
      var course = $('#course').val();
      var grade = parseFloat($('#studentGrade').val());
      clearAddStudentFormInputs();

      sendData ( name, course, grade );
      // var new_student_object = {
      //       name: $('#studentName').val(),
      //       course: $('#course').val(),
      //       grade: parseFloat($('#studentGrade').val()),
      // }
      // student_array.push(new_student_object);

      // updateStudentList( student_array );
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
      $('#studentName').val('');
      $('#course').val('');
      $('#studentGrade').val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom( studentObj ) {
      const id = studentObj.id;
      let name = studentObj.name;
      let course = studentObj.course;
      let grade = studentObj.grade;
      
      var outer_tr = $('<tr>');
      var inner_td_name = $('<td>', {
            text: name,
      });
      var inner_td_course = $('<td>', {
            text: course,
      });
      var inner_td_grade = $('<td>', {
            text: grade,
      })
      var inner_td_button = $('<td>');
      var del_button = $('<button>', {
            text: 'Delete',
            'data-id': id,
            class: 'btn btn-danger delete_row',
            on: {
                  click: function(){
                        deleteData( id, outer_tr );
                  } 
            }
      })
      var edit_button_initial = $('<button>', {
            text: 'Edit',
            class: 'btn btn-info',
            on: {
                  click: editMode
            }
      })
      var save_button = $('<button>', {
            text: 'Save',
            class: 'btn btn-success',
      })
      var nameInput = $('<input />', {
            'class': 'tableInput',
            'type': 'text',
            'value': name,
      });

      var courseInput = $('<input />', {
            'class': 'tableInput',
            'type': 'text',
            'value': course,
      });

      var gradeInput = $('<input />', {
            'class': 'tableInput',
            'type': 'text',
            'value': grade,
      });

      $(inner_td_button).append(del_button, edit_button_initial);
      $(outer_tr).append(inner_td_name, inner_td_course, inner_td_grade, inner_td_button);
      $('.student-list tbody').append(outer_tr);

      function editMode(){
            edit_mode = true;

            console.log('editMode on');
            $(inner_td_name).text('');
            $(inner_td_course).text('');
            $(inner_td_grade).text('');

            $(inner_td_name).append(nameInput);
            $(inner_td_course).append(courseInput);
            $(inner_td_grade).append(gradeInput);
      
            $(edit_button_initial).replaceWith(save_button);

            $(save_button).on('click', sendUpdate);

            $(outer_tr).addClass('bg-warning');

            $(document).on('click', function(e) {
                  if(!$(e.target).is($(edit_button_initial))
                  &&!$(e.target).is($(save_button))
            ) {
                        exitEditMode.call(this)
                  }
                }.bind(this));
      }

      function sendUpdate(){
            var ajaxOptions = {
                  url: 'backend/data.php',
                  method: 'GET',
                  data:{
                        'action': 'update',
                        'student_id': id,
                        'name': $(nameInput).val(),
                        'course': $(courseInput).val(),
                        'grade': $(gradeInput).val(),                  
                  },
                  success: function(response){
                        if(response.success){
                              name = $(nameInput).val();
                              course = $(courseInput).val();
                              grade = parseInt($(gradeInput).val());
                              exitEditMode();
                        }
                  },
                  dataType: 'json',
            };
            $.ajax( ajaxOptions )
      }

      function exitEditMode(){

            $(document).off('click');

            $(edit_button_initial).on('click', editMode);

            $(inner_td_name).text(name);
            $(inner_td_course).text(course);
            $(inner_td_grade).text(grade);

            //$(save_button).replaceWith(edit_button_initial);
            $(save_button).remove();
            $(inner_td_button).append(edit_button_initial);
            $(outer_tr).removeClass('bg-warning');

            for(let i=0; i<student_array.length; i++){
                  if(student_array[i].id === id){
                        student_array[i].name = name;
                        student_array[i].course = course;
                        student_array[i].grade = grade;
                  }
            }
            var average = calculateGradeAverage ( student_array );
            renderGradeAverage(average);

            edit_mode = false;
            console.log('editMode off')
      }
}
/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList ( student_array ) {
      var last_student_index = student_array.length - 1;
      // for ( let i = 0; i < student_array.length; i++ ) {
      //       renderStudentOnDom( student_array[i] );
      // }
      renderStudentOnDom(student_array[last_student_index]);
      var average = calculateGradeAverage ( student_array );
      renderGradeAverage(average);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage ( student_array ){
      var sum = 0;
      var average = 0;

      for ( var i = 0; i < student_array.length; i++ ) {
            sum += student_array[i].grade;
      }
      average = sum / student_array.length;
      average = parseInt(average);

      if ( average === NaN) {
            average = 0;
      }

      return average
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
      $('.avgGrade').text(average);
}
/***************************************************************************************************
 * getData - pulls data from database using AJAX call
 * @param: 
 * @returns 
 */
function getData () {
      var ajaxOptions = {
            url: 'backend/data.php',
            method: 'GET',
            data:{
                  'api_key':'k9mLtN7WCf',
                  'action': 'readAll',
            },
            success: doWhenDataReceived,
            dataType: 'json',
        };
        $.ajax( ajaxOptions )
}
/***************************************************************************************************
 * sendData - send data to server
 * @param: 
 * @returns 
 */
function sendData ( name, course, grade ) {
      var ajaxOptions = {
            url: 'backend/data.php',
            method: 'GET',
            data:{ 
                  'api_key':'k9mLtN7WCf', 
                  'action': 'insert',
                  'name': name, 
                  'course': course, 
                  'grade': grade 
            },
            success: function adsf (response){
                  var new_student_object = {
                        name: name,
                        course: course,
                        grade: grade,
                        id: response.insertID,
                  }
                  student_array.push(new_student_object);
                  updateStudentList( student_array );
            },
            // success: doWhenDataSentAndReturned,
            dataType: 'json',
        };
        $.ajax( ajaxOptions )
        //debugger
      //return 11
}
/***************************************************************************************************
 * deleteData - send data to server
 * @param: 
 * @returns 
 */
function deleteData ( current_index, outer_tr ) {
      var ajaxOptions = {
            url: 'backend/data.php',
            method: 'get',
            data:{ 
                  'api_key':'k9mLtN7WCf', 
                  'action': 'delete',
                  'student_id': current_index 
            },
            success: function (response){
                  for (let i=0; i<student_array.length; i++){
                        if(student_array[i].id === current_index){
                              student_array.splice(i, 1);
                        }
                  }
                  // outer_tr.remove();

                  var average = calculateGradeAverage ( student_array );
                  renderGradeAverage(average);
                  outer_tr.remove();
            },
            error: function(){
            },
            // success: doWhenDataSentAndReturned,
            dataType: 'json',
        };
        $.ajax( ajaxOptions )
}
// /***************************************************************************************************
//  * editData - edit a row of data 
//  * @param: id, name, course, grade
//  * @returns
//  */
// function editData(){
//       console.log('editData is running');
// }

/***************************************************************************************************
 * editMode - changes div to input
 * @param: 
 * @returns
 */
// function editMode(){
//       console.log($(this));
      
//       var input = $('<input />', {
//             'type': 'text',
//             'value': $(this).text(),
//       });

//       $(this).replaceWith(input);

//       $(document).keypress(function(event) {
//             if(event.which == 13) {
//                   enterEdit();
//             }
//           });

//       function enterEdit(){
//             var td_element = $('<td>', {
//                   text: $(input).val(),
//                   on: {
//                         dblclick: editMode
//                   }
//              });
//             input.replaceWith(td_element);
//       }
// }

/***************************************************************************************************
 * doWhenDataReceived - runs after the data is got
 * @param: 
 * @returns 
 */
function doWhenDataReceived ( response ) {
      // student_array = response.data;      
      for ( let i = 0; i < response.data.length; i++ ) {
            var currentStudent = response.data[i];
            student_array.push(currentStudent)
            updateStudentList(student_array);
      }
      // updateStudentList(student_array);
      console.log('student array:', student_array);      
}
/***************************************************************************************************
 * doWhenDataSentAndReturned - runs after data is sent
 * @param: 
 * @returns 
 */
// function doWhenDataSentAndReturned ( response ) {
//       var new_id = response.new_id;

//             var new_student_object = {
//             name: $('#studentName').val(),
//             course: $('#course').val(),
//             grade: parseFloat($('#studentGrade').val()),
//             }
//       console.log('response resonse', response);
// }