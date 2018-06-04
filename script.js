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
      $('.add_button').on('click', handleAddClicked);
      $('.cancel_button').on('click', handleCancelClick);
      // $('.student-list').on('click', '.delete_row', function (){
      //       var jQueryObj = $(this);
      //       removeStudent( student_array, jQueryObj );
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
      //debugger
      console.log('add');
      console.log(event);
      addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
      console.log('cancel')
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
      var new_student_object = {
            name: $('#studentName').val(),
            course: $('#course').val(),
            grade: parseFloat($('#studentGrade').val()),
      }
      student_array.push(new_student_object);
      // console.log(new_student_object);

      clearAddStudentFormInputs();
      updateStudentList( student_array );
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
            class: 'btn btn-danger delete_row',
      })
      
      $(inner_td_button).append(button);
      $(outer_tr).append(inner_td_name, inner_td_course, inner_td_grade, inner_td_button);
      $('.student-list tbody').append(outer_tr);

      $(button).on('click', function(){
            var current_index = outer_tr.index();
            student_array.splice( current_index, 1 );
            outer_tr.remove();
            
            var average = calculateGradeAverage ( student_array );
            renderGradeAverage(average);
      })
}
/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList ( student_array ) {
      var last_student_index = student_array.length - 1;

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
 * removeStudent - removes student from student_array and dom
 * @param: {array} students  the array of student objects
 * @returns {undefined} none
 */
function removeStudent ( student_array, jQueryObj ) {
      var tr_DOM_element = jQueryObj.closest('tr');
      var current_index = tr_DOM_element.index();
      student_array.splice( current_index, 1 );
      tr_DOM_element.remove();

      var average = calculateGradeAverage ( student_array );
      renderGradeAverage(average);
}
/***************************************************************************************************
 * handleGetDataClicked - handles clicks on the get_data_button
 * @param: 
 * @returns 
 */
function handleGetDataClicked () {
      var jQueryObj = this;
      console.log('handleGetDataClicked')
      getData();
}
/***************************************************************************************************
 * getData - pulls data from database using AJAX call
 * @param: 
 * @returns 
 */
function getData () {
      console.log('getData()');
      var ajaxOptions = {
            url: 'http://s-apis.learningfuze.com/sgt/get',
            method: 'post',
            data:{'api_key':'k9mLtN7WCf'},
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
function sendData () {
      console.log('sendData()');
      var ajaxOptions = {
            url: 'http://s-apis.learningfuze.com/sgt/get',
            method: 'post',
            data:{ 'api_key':'k9mLtN7WCf', name:'Me', course:'Being Me', grade: 100 },
            success: doWhenDataSent,
            dataType: 'json',
        };
        $.ajax( ajaxOptions )
}
/***************************************************************************************************
 * getData - runs after the data is got
 * @param: 
 * @returns 
 */
function doWhenDataReceived ( response ) {
      console.log('doWhenDataReceived()');
      console.log(response);
}
/***************************************************************************************************
 * getData - runs after the data is got
 * @param: 
 * @returns 
 */
function doWhenDataReceived ( response ) {
      console.log('doWhenDataSent()');
      console.log(response);
}