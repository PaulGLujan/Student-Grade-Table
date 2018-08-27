<?php
require '../mysql_connect.php';

$query = "SELECT * FROM `student_data` WHERE 1";
$result = mysqli_query($conn, $query);

if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if ($result) {
        $rows=[];
        while( $row = mysqli_fetch_assoc($result)){
            $rows[] = $row;
        };
	} else {
		$output['errors'][] = 'no data';
	};
};
print_r($rows);

