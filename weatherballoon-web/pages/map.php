<?php
require_once("classes/GpxGenerator.class.php");

// Bevor die Karte angezeigt werden kann, muss die "positions.gpx" mit den darzustellenden Wegpunkten generiert werden.
$gpxGenerator = new GpxGenerator();
$gpxGenerator->readRecordsFromDatabase();
$gpxGenerator->convertRecordsToGpx();
$gpxGenerator->writeToFile();


// Hole 

// Zeige Karte an
include("map/mapview.html");

?>