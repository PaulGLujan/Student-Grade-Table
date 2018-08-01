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
      $('.get_data_button').on('click', handleGetDataClicked);
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
      
      var outer_tr = $('<tr>');
      var inner_td_name = $('<td>', {
            text: studentObj.name,
      });
      var inner_td_course = $('<td>', {
            text: studentObj.course,
      });
      var inner_td_grade = $('<td>', {
            text: studentObj.grade,
      })
      var inner_td_button = $('<td>');
      var button = $('<button>', {
            text: 'Delete',
            'data-id': studentObj.id,
            class: 'btn btn-danger delete_row',
            on: {
                  click: function(){
                        var current_index = studentObj.id;
                        deleteData( current_index, outer_tr );
                  } 
            }
      })
      
      $(inner_td_button).append(button);
      $(outer_tr).append(inner_td_name, inner_td_course, inner_td_grade, inner_td_button);
      $('.student-list tbody').append(outer_tr);

      // $('button').on('click', function(){
      //       var current_index = studentObj.id;

      //       deleteData( current_index, outer_tr );

      //       // student_array.splice( current_index, 1 );
      //       // outer_tr.remove();
            
      //       // var average = calculateGradeAverage ( student_array );
      //       // renderGradeAverage(average);
      // })
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
 * handleGetDataClicked - handles clicks on the get_data_button
 * @param: 
 * @returns 
 */
function handleGetDataClicked () {
      var jQueryObj = this;
      getData();
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
                  console.log(response);
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
                  console.log(response);
            },
            // success: doWhenDataSentAndReturned,
            dataType: 'json',
        };
        $.ajax( ajaxOptions )
}
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
      console.log(student_array);      
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