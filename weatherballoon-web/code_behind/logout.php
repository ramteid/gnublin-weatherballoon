<?php 
ob_start();
session_start();
session_unset();
session_destroy();
$_SESSION = array();

ob_end_flush();   
header("Location: ../index.php?msg=logout");
?>