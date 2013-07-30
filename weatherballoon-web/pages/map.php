<?php
//*****************************************************************
// Script: map.php
// Scriptbeschreibung: Stellt die Karte mit den visuellen Informationen dar
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

// Inkludiere den GPX-Generator, um .gpx-Dateien zu generieren
require_once("libs/gpxGenerator/GpxGenerator.class.php");

// Bevor die Karte angezeigt werden kann, muss die "positions.gpx" mit den darzustellenden Wegpunkten generiert werden.
$gpxGenerator = new GpxGenerator();

// Hole Datensätze von der Datenbank
$gpxGenerator->readRecordsFromDatabase();

// Konvertiere Datensätze ins GPX-Format
$gpxGenerator->convertRecordsToGpx();

// Schreibe die Ergebnisse in die positions.gpx
$gpxGenerator->writeToFile();

// Zeige die Karte an
include("map/mapview.html");

?>