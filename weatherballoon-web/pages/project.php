<div class="container">
	<div class="hero-unit balloons">
		<h1>Gnublin Wetterballon</h1>
		<p>Ein Wetterballon basierend auf der Gnublin-Plattform</p>
	</div>
	<div class="row">
		<div class="span4">
			<h2>Stratosph&auml;re</h2>
			<p>Im Wesentlichen durchquert der Wetterballon zwei gro&szlig;e Schichten der Atmosph&auml;re. Da w&auml;re zum einen die Troposph&auml;re und die Stratosph&auml;re
			Die Troposph&auml;re wird durch den Erdboden erw&auml;rmt, deswegen ist der vertikale atmosph&auml;rische Temperaturgradient innrhalb der Troposph&auml;re negativ.
			In der Stratosph&auml;re herrschen Temperaturen bis -60&deg; Celsius.</p>
		</div>
		<div class="span4">
			<h2>Ballon</h2>
			<p>Der Ballon ist aus Latex, da Latex besonders gute Ausdehnungseigenschaften aufweist und somit eine h&ouml;here Steigh&ouml;he verspricht. Bei einer Nutzlast von ca. 2,2 kg 
			werden ca. 2,1 Kubikmeter Helium in den Ballon gef&uuml;llt. Nach dem Start beginnt der Ballon durch die Auftriebskraft des Heliums mit dem Steigflug. Durch den abnehmenden 
			Atmosph&auml;rendurcks dehnt sich der Ballon immer weiter aus, bis er schlie&szlig;lich platzt.</p>
		</div>
		<div class="span4">
			<h2>Fallschirm</h2>
			<p>Nach dem Platzen des Ballons befindet sich die Nutzlast im freien Fall. Um den Fall zu bremsen und die Wucht des Aufpralls zu vermindern, wird ein Fallschirm zwischen 
			Ballon und Transport-Box befestigt. Im Steigflug ist dieser lose gespannt, sodass er sich nicht entfalten kann. Nach dem Platzen des Ballons spannt sich der Fallschirm dann 
			auf und l&auml;sst die Nutzlast sachte zur Erde zur&uuml;ck "fallen".</p>
		</div>
	</div>
	<div class="row">
		<div class="span4">
			<h2>Gnublin-Board</h2>
			<p>Im Rahmen der Vorlesung Embedded Linux wurde das Linux-Board Gnublin der Firma Embedded Systems pr&auml;sentiert. Das Gnublin-Board ist eine ARM-basierte Ausbildungsplattform 
			f&uuml;r Embedded Linux, die aufgrund des geringen Stromverbrauchs und den vielen Erweiterungen inklusive einer Programmierumgebung gerne als Ersatz f&uuml;r typische Mikrokontroller-Anwendungen 
			genutzt wird.</p>
		</div>
		<div class="span4">
			<h2>GPS-Modul</h2>
			<p>F&uuml;r die Ermittlung der Position wird ein GPS-Empf&auml;nger ben&ouml;tigt. Dieser sollte m&ouml;glichst g&uuml;nstig, leicht und Stromsparend sein. Daher viel die Wahl auf den Empf&auml;nger 
			Gms-D1 von GlobalTop mit MediaTek MT3329 Chip. Die Koordinaten werden dann per UMTS-Stick als SMS versendet. Durch den UMTS-Stick ist auch eine Kommunikation mit dem Gnublin-Board per SMS m&ouml;glich.
			Der Betrieb des UMTS-Moduls ben&ouml;tigt besonders viel Energie, weshalb von dem Stick keine Datenverbindung aufgebaut werden kann.</p>
		</div>
		<div class="span4">
			<h2>PT1000</h2>
			<p>Um die Temperatur au&szlig;erhalb der Neoporbox zu bestimmen kommt ein Spannungsteiler mit einem PT1000-Temperaturwiderstand zum Einsatz. Der Spannungsabfall beim PT1000 ist von der Temperatur 
			abh&auml;ngig. Je niedriger die Temperatur wird, desto geringer ist der Widerstand. Der Widerstand des PT1000 kann dann durch einen zweiten Widerstand und durch die Stromst&auml;rke berechnet werden.
			Die am Spannungsteiler abgegriffene Spannung wird dann vom Gnublin-Board &uuml;ber einen Analog-Digital-Wandler in einen digitalen Wert umgerechnet.</p>
		</div>
	</div>
	<div class="row">
		<div class="span4">
			<h2>Webcam</h2>
			<p>Um w&auml;hrend des Fluges Bilder aufzuzeichnen, wird eine handels&uuml;bliche Webcam verwendet. Die Entscheidung viel auf die Logitech C170, weil von ihr akzeptable Bilder produziert werden k&ouml;nnen und 
			diese Webcam am Gnublin-Board bereits erfolgreich getestet wurde. Im System ist das Programm <code>uvccapture</code> enthalten, mit dem Webcams angesprochen werden k&ouml;nnen. Es soll in einem Interval, 
			etwa alle zwei Minuten, ein Bild aufgenommen werden. Diese Bilder werden im JPEG-Format auf der lokalen SD-Karte gespeichert.</p>
		</div>
		<div class="span4">
			<h2>Akku</h2>
			<p>Die Stromversorgung stellt eine besonders kritische Komponente dar, von welcher s&auml;mtliche Systeme abh&auml;ngen. Zudem reduziert die extreme K&auml;lte in der Stratosph&auml;re von ca. -50&deg; Celsius enorm die Akkulaufzeit. 
			Es muss mit einem maximalen Stromverbrauch von 400 mA gerechnet werden. Der Akku muss des Weiteren die ben&ouml;tigte Leistung &uuml;ber die gesamte Flugdauer hinweg bereitstellen. Geht man von einem Verbrauch von 400 mA 
			und einer Flugdauer von 6 Stunden aus, ergibt das 2400 mAh.</p>
		</div>
		<div class="span4">
			<h2>Watchdog</h2>
			<p>Der Watchdog-Timer ist eine Systemfunktion des LPC3131-Prozessors. Diese kann softwareseitig gestartet werden und wartet dann in einem 10 Sekunden-Intervall auf ein Signal. Bleibt dieses aus, wird ein hard-reset des Gnublin-Boards 
			vorgenommen. Auf diese Weise soll ein permanetes Einfrieren beziehungsweise Abst&uuml;rzen des Betriebssystems verhindert werden. Es gibt auch eine hardwareseitige Absicherung, die aus einem Mikrocontroller und einem Relais basiert. Der 
			Mikrocontroller erwartet vom Gnublin-Board alle 10 Sekunden ein Lebenszeichen.</p>
		</div>
	</div>
	<div class="row">
		<div class="span12">
			<h2>Mehr...</h2>
			<p>... Informationen finden Sie in unserem <a href="https://github.com/ramteid/gnublin-weatherballoon/blob/master/Protokoll%20zum%20Projekt.pdf?raw=true">Protokoll zum Projekt</a>. Den Programmcode und die Dokumentation k&ouml;nnen Sie auf <a href="https://github.com/ramteid/gnublin-weatherballoon" target="_blank">github.com</a> finden.</p>
		</div>
	</div>
</div>