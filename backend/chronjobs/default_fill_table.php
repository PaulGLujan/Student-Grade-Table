<?php
require '../mysql_connect.php';
require 'mysql_default_db_connect.php';

$query = "DELETE FROM `student_data` WHERE 1";
$result = mysqli_query($conn, $query);


$query = "SELECT * FROM `student_data` WHERE 1";
$result = mysqli_query($conn_default_db, $query);

if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if ($result) {
        $rows=[];
        while( $row = mysqli_fetch_assoc($result)){
            $id = $row['id'];
            $name = $row['name'];
            $grade = $row['grade'];
            $course = $row['course'];
            $update_query = "INSERT INTO `student_data`(`id`, `name`, `grade`, `course`) VALUES ($id,'{$name}',$grade,'{$course}')";
            print($update_query);
            mysqli_query($conn, $update_query);
        };
	} else {
		$output['errors'][] = 'no data';
	};
};
print_r($rows);

