<?php
//************************************************************************
// Datei: 			logout
// Beschreibung: 	Vernichtet die Session und leitet zur index.php weiter
// Autor: 			Patrick Vogt, am 30.07.2013
// MatrikelNr: 		924789
//************************************************************************
ob_start();
session_start();
session_unset();
session_destroy();
$_SESSION = array();
header("Location: ../index.php?msg=logout");
ob_end_flush();   
?>