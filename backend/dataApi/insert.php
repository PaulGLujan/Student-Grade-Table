<?php

//check if you have all the data you need from the client-side call.  
if ( empty($_GET['name']) || empty($_GET['course']) || empty($_GET['grade']) ){
//if not, add an appropriate error to errors
	$output['errors'][] = 'Need to have name, course, and grade in data.';
}
//write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing
$query = "INSERT INTO `student_data`(`name`, `grade`, `course_name`) VALUES ('{$_GET['name']}','{$_GET['grade']}','{$_GET['course']}')";
$result = null;
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn, $query);
$row = mysqli_insert_id($result);
print($row);

//check if $result is empty.  
if ( empty($result) ){
	//if it is, add 'database error' to errors
	$output['errors'][] = 'Database error.';
}
//else:
else { 
	//check if the number of affected rows is 1
	if ( $result === 1) {
		//if it did, change output success to true
		$output['success'] = true;
		//get the insert ID of the row that was added
		$ID = $result['id'];
		//add 'insertID' to $outut and set the value to the row's insert ID
		$output['insertID'] = $ID;
	}
	//if not, add to the errors: 'insert error'
	else {
		$output['errors'][] = 'insert error';
	}
}
?>