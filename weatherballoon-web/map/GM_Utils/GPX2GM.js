// GPX2GM.js
// Darstellung von GPS-Daten aus einer GPX-Datei in Google Maps
// Version 5.7
// 22. 4. 2013 Jürgen Berkemeier
// www.j-berkemeier.de

window.JB = window.JB || {};
JB.GPX2GM = {ver:"5.7",dat:"22. 4. 2013",fname:"map/GM_Utils/GPX2GM.js"};

/*JB.Scaling = {   // nur paarweise verwenden
	hmin:0,hmax:1000,  // Höhenplot
	smin:-30,smax:30,  // Steigungsplot
	vmin:0,vmax:100    // Geschwindigkeitsplot
}; */ 

if(typeof(GPXVIEW_Debuginfo)=="undefined") 
	JB.debuginfo = (location.search.toLowerCase().search("debuginfo")!=-1) 
							&& (location.search.toLowerCase().search("debuginfo=false")==-1) ;    
else
	JB.debuginfo = GPXVIEW_Debuginfo;
if(JB.debuginfo) JB.gpxview_Start = (new Date()).getTime();

JB.GPX2GM.Path = (function() {
	var scr = document.getElementsByTagName("script");
	for(var i=0;i<scr.length;i++) if(scr[i].src && scr[i].src.length) {
		var path = scr[i].src;
		var pos = path.search(JB.GPX2GM.fname);
		if(pos!=-1) {
			JB.GPX2GM.autoload = !(path.search("autoload=false")>pos);
			return path.substring(0,pos);
		}
	} 
	return "";  
})();

JB.Scripte = { GPX2GM_Defs:0, googlemaps:0, gra:0, plot:0 };

JB.setgc = function() {  
	JB.gc = {};
	JB.gc.largemapcontrol = (typeof(Largemapcontrol)!="undefined") ? Largemapcontrol : false;
	JB.gc.overviewmapcontrol = (typeof(Overviewmapcontrol)!="undefined") ? Overviewmapcontrol : false;
	JB.gc.scrollwheelzoom = (typeof(Scrollwheelzoom)!="undefined") ? Scrollwheelzoom : true;
	JB.gc.legende = (typeof(Legende)!="undefined") ? Legende : true;
	JB.gc.legende_fnm = (typeof(Legende_fnm)!="undefined") ? Legende_fnm  : true;
	JB.gc.legende_rr = (typeof(Legende_rr)!="undefined") ? Legende_rr  : true;
	JB.gc.legende_trk = (typeof(Legende_trk)!="undefined") ? Legende_trk : true;
	JB.gc.legende_rte = (typeof(Legende_rte)!="undefined") ? Legende_rte : true;
	JB.gc.legende_wpt = (typeof(Legende_wpt)!="undefined") ? Legende_wpt : true;
	JB.gc.tracks_verbinden = (typeof(Tracks_verbinden)!="undefined") ? Tracks_verbinden : false;    
	JB.gc.tracks_dateiuebergreifend_verbinden = (typeof(Tracks_dateiuebergreifend_verbinden)!="undefined") ? Tracks_dateiuebergreifend_verbinden : false;
	if(JB.gc.tracks_dateiuebergreifend_verbinden) JB.gc.tracks_verbinden = true;
	JB.gc.readspeed = (typeof(Readspeed)!="undefined") ? Readspeed : true;
	JB.gc.speedfaktor = (typeof(Speedfaktor)!="undefined") ? Speedfaktor : 1; // 3.6 bei m/s, 1,609344 bei mph
	JB.gc.trackover = (typeof(Trackover)!="undefined") ? Trackover : true;
	JB.gc.shwpname = (typeof(Shwpname)!="undefined") ? Shwpname : true;
	JB.gc.shwpcmt = (typeof(Shwpcmt)!="undefined") ? Shwpcmt : true;
	JB.gc.shwpdesc = (typeof(Shwpdesc)!="undefined") ? Shwpdesc : false;
	JB.gc.shwptime = (typeof(Shwptime)!="undefined") ? Shwptime : false;
	JB.gc.shtrcmt = (typeof(Shtrcmt)!="undefined") ? Shtrcmt : false;
	JB.gc.shtrdesc = (typeof(Shtrdesc)!="undefined") ? Shtrdesc : false;
	JB.gc.shtrx = (typeof(Shtrx)!="undefined") ? Shtrx : true;
	JB.gc.shtrt = (typeof(Shtrt)!="undefined") ? Shtrt : true;
	JB.gc.shtrtabs = (typeof(Shtrtabs)!="undefined") ? Shtrtabs : false;
	JB.gc.shtrv = (typeof(Shtrv)!="undefined") ? Shtrv : true;
	JB.gc.shtrh = (typeof(Shtrh)!="undefined") ? Shtrh : true;
	JB.gc.shtrs = (typeof(Shtrs)!="undefined") ? Shtrs : true;
	JB.gc.shtrvmitt = (typeof(Shtrvmitt)!="undefined") ? Shtrvmitt : false;
	JB.gc.shrtcmt = (typeof(Shrtcmt)!="undefined") ? Shrtcmt : false;
	JB.gc.shrtdesc = (typeof(Shrtdesc)!="undefined") ? Shrtdesc : false;
	JB.gc.shtrstart = (typeof(Shtrstart)!="undefined") ? Shtrstart : false;
	JB.gc.shtrziel = (typeof(Shtrziel)!="undefined") ? Shtrziel : false;
	JB.gc.shrtstart = (typeof(Shrtstart)!="undefined") ? Shrtstart : false;
	JB.gc.shrtziel = (typeof(Shrtziel)!="undefined") ? Shrtziel : false;
	JB.gc.groesseminibild	= (typeof(Groesseminibild)!="undefined") ? Groesseminibild : 60; // in Pixel, max. 149
	JB.gc.displaycolor = (typeof(Displaycolor)!="undefined") ? Displaycolor : false;
	JB.gc.laengen3d = (typeof(Laengen3d)!="undefined") ? Laengen3d : false;
	JB.gc.hkorr = (typeof(Hkorr)!="undefined") ? Hkorr : true;
	JB.gc.usegpxbounds = (typeof(Usegpxbounds)!="undefined") ? Usegpxbounds : false;
	JB.gc.hglattlaen = (typeof(Hglattlaen)!="undefined") ? Hglattlaen : 500; // in Meter
	JB.gc.vglattlaen = (typeof(Vglattlaen)!="undefined") ? Vglattlaen : 100; // in Meter
	JB.gc.vglatt = (typeof(Vglatt)!="undefined") ? Vglatt : false;
	JB.gc.tdiff = (typeof(Tdiff)!="undefined") ? Tdiff : 0; // in Stunden
	JB.gc.maxzoomemove = (typeof(Maxzoomemove)!="undefined") ? Maxzoomemove : 30; // 1 ... , 30: aus
	JB.gc.plotframecol = (typeof(Plotframecol)!="undefined") ? Plotframecol : "black";
	JB.gc.plotgridcol = (typeof(Plotgridcol)!="undefined") ? Plotgridcol : "gray";
	JB.gc.plotlabelcol = (typeof(Plotlabelcol)!="undefined") ? Plotlabelcol : "black";
	JB.gc.profilfillopac = (typeof(Profilfillopac)!="undefined") ? Profilfillopac : 0; //   0 ... 1, 0:aus
	JB.gc.tcols = ["#ff0000","#00ff00","#0000ff","#aaaa00","#ff00ff","#00ffff","#000000"]; // Trackfarben in #rrggbb für rot grün blau
	JB.gc.rcols = ["#800000","#008000","#000080","#808000","#800080","#008080","#808080"]; // Routenfarben
	JB.gc.ocol = "#000000";   // Track- und Routenfarbe bei Mouseover
	JB.gc.owidth = 3.0;  // Linienstärke Track und Route bei Mouseover
	JB.gc.twidth = 2.0;  // Linienstärke Track
	JB.gc.rwidth = 2.0;  // Linienstärke Route
	JB.gc.topac = 0.8;   // Transparenz Trackfarbe
	JB.gc.ropac = 0.8;   // Transparenz Routenfarbe
	JB.gc.popup_Pars = "width=900,height=790,screenX=970,screenY=0,status=yes,scrollbars=yes";
	var t = "";
	for(var o in JB.gc) t += "<br>&nbsp;&nbsp;" + o + ": " + JB.gc[o];
	JB.Debug_Info("Start","Steuervariablen: "+t+"<br>",false);
}

JB.makeMap = function (ID) {

	JB.Debug_Info(ID,"",false);

	var hscale=[],sscale=[],vscale=[];
	if(typeof(JB.Scaling)!="undefined") {
		if(typeof(JB.Scaling.hmin)!="undefined" && typeof(JB.Scaling.hmax)!="undefined") 
			hscale = [{x:.0001,h:JB.Scaling.hmin} ,{x:.0002,h:JB.Scaling.hmax}] ;
		if(typeof(JB.Scaling.smin)!="undefined" && typeof(JB.Scaling.smax)!="undefined") 
			sscale = [{x:.0001,s:JB.Scaling.smin} ,{x:.0002,s:JB.Scaling.smax}] ;
		if(typeof(JB.Scaling.vmin)!="undefined" && typeof(JB.Scaling.vmax)!="undefined") 
			vscale = [{x:.0001,v:JB.Scaling.vmin} ,{x:.0002,v:JB.Scaling.vmax}] ;
	}

	var dieses = this;
	var gpxdaten;
	var id = ID;
	var markers=[],trackpolylines=[],routepolylines=[];
	var file,maptype;
	var Map;
	var newfile;

	var div = document.getElementById(id);
	div.className += " JBmapdiv";
	var w = div.offsetWidth;
	var h = div.offsetHeight-1;
	var MapHead = document.createElement("div");
	MapHead.id = "map_head"+id;
	MapHead.className = "JBmaphead";
	MapHead.appendChild(document.createTextNode(": "));
	var mapdiv = document.createElement("div");
	mapdiv.id = "map_"+id;
	mapdiv.style.width = w+"px";
	while(div.hasChildNodes()) div.removeChild(div.firstChild);
	if(!JB.gc.legende) MapHead.style.display="none";
	div.appendChild(MapHead);
	div.appendChild(mapdiv);
	if (JB.gc.legende) mapdiv.style.height = h-mapdiv.offsetTop+MapHead.offsetTop+"px";
	else               mapdiv.style.height = h+"px";

	JB.gc.profilflag = false;
	var profil = {hp:{x:"x",y:"h"},hpt:{x:"t",y:"h"},wp:{x:"t",y:"x"},sp:{x:"x",y:"s"},spt:{x:"t",y:"s"},vp:{x:"x",y:"v"},vpt:{x:"t",y:"v"}};
	profil.hpt.ytext = profil.hp.ytext = "H<br />ö<br />h<br />e<br />&nbsp;<br />in<br />&nbsp;<br />m";
	profil.spt.ytext = profil.sp.ytext = "Stg.<br />&nbsp;<br />in<br />&nbsp;<br />%";
	profil.vpt.ytext = profil.vp.ytext = "V<br />&nbsp;<br />in<br />&nbsp;<br />km/h";
	profil.wp.ytext ="x<br />&nbsp;<br />in<br />&nbsp;<br />km";
	profil.hp.xtext = profil.vp.xtext = profil.sp.xtext = "Strecke in km";
	profil.hpt.xtext = profil.vpt.xtext = profil.spt.xtext = profil.wp.xtext = "Zeit in sec"; 
	profil.hpt.scale = profil.hp.scale = hscale;
	profil.spt.scale = profil.sp.scale = sscale;
	profil.vpt.scale = profil.vp.scale = vscale;

	for(var p in profil) {
		profil[p].id = ID+"_"+p;
		profil[p].ele = document.getElementById(profil[p].id);
		if(profil[p].ele) {
			profil[p].ele.className += " JBprofildiv";
			JB.gc.profilflag = true;
			JB.Debug_Info(id,"Profil, ID: "+profil[p].id+" gefunden",false);
		}
	}

	if(JB.gc.profilflag) { 
		var kannCanvas=false,cv,ct;
		cv = document.createElement("canvas");
		if(cv) {
			if (cv.getContext) ct = cv.getContext("2d");
			if(ct) kannCanvas = true;
			if(kannCanvas) {
				if(!ct.fillRect) kannCanvas = false;
				if(!ct.fillText) kannCanvas = false;
			}
		}
		if(JB.Scripte.gra==0) {
			JB.Scripte.gra = 1;
			JB.LoadScript(JB.GPX2GM.Path+(kannCanvas?'map/GM_Utils/gra_canvas.js':'map/GM_Utils/gra_div.js'), function(){ JB.Scripte.gra = 2; });
			JB.Scripte.plot = 1;
			JB.LoadScript(JB.GPX2GM.Path+"map/GM_Utils/plot.js", function(){ JB.Scripte.plot = 2; }); 
			JB.Debug_Info(ID,"Grafikscripte geladen",false);
		}
	}

	this.ShowGPX = function(fn,mpt) {
		var filenames = [];
		file = []; 
		for(var i=0;i<fn.length;i++) {
			if(typeof fn[i] === "string") file[i] = { name:fn[i] , fileobject:null };
			else if(typeof fn[i] === "object") file[i] = { name:fn[i].name , fileobject:fn[i] };
			filenames[i] = file[i].name;
		}
		maptype = mpt;
		JB.Debug_Info(id,"ShowGPX, Filename(s): "+filenames.join(","),false);

		var infodiv = document.createElement("div");
		infodiv.className = "JBinfodiv";
		infodiv.style.position = "relative";
		infodiv.style.width = w/2-40+"px";
		infodiv.style.height = h/2-40+"px";
		infodiv.style.left = w/4+"px";
		infodiv.style.top = -3*h/4+"px";
		infodiv.style.zIndex = "1000";
		infodiv.innerHTML = "Bitte warten.<br />Daten werden geladen.";
		div.appendChild(infodiv);
		JB.Debug_Info(id,"Info da",false);

		JB.Debug_Info(id,"Lade "+filenames.join(","),false);
		JB.lpgpx(file,id,function(daten) {
			newfile = true;
			gpxdaten = daten;
			setMapHead();
			show();
			div.removeChild(infodiv);
			JB.Debug_Info(id,"Info weg",false);
		});
	} // ShowGPX

	this.Rescale = function() {
		JB.Debug_Info(id,"Rescale: lat: "+gpxdaten.latmin+"..."+gpxdaten.latmax+", lon: "+gpxdaten.lonmin+"..."+gpxdaten.lonmax,false);
		Map.rescale(gpxdaten);
	} // Rescale

	this.GetMap = function() {
		return Map;
	} // GetMap

	this.Clear = function() {
	  var p,pr,i;
		Map = null;
		for(p in profil) {
			pr = profil[p];                                                                  
			if(pr.diag) pr.diag.clear();                       
		}
		profil = null;		
		gpxdaten = null;
		for(i=0;i<markers.length;i++) JB.RemoveElement(markers[i]);
		markers = [];
		for(i=0;i<trackpolylines.length;i++) JB.RemoveElement(trackpolylines[i]);
		trackpolylines = [];
		for(i=0;i<routepolylines.length;i++) JB.RemoveElement(routepolylines[i]);
		routepolylines = [];
	} // Clear

	var chkwpt,chktrk,chkrt;
	function setMapHead() {
		JB.Debug_Info(id,"setMapHead",false);
		MapHead.innerHTML = " ";
		if(gpxdaten.wegpunkte.anzahl) {
			if(gpxdaten.wegpunkte.anzahl==1) var texte = ["Wegpunkt"+String.fromCharCode(160)];
			else if(gpxdaten.wegpunkte.anzahl>1) var texte = ["Wegpunkte"+String.fromCharCode(160)];
			chkwpt = new JB.CheckBoxGroup(MapHead.id,texte,ID+"_wpt",[],JB.gc.legende_wpt,show);
		}
		if(gpxdaten.tracks.anzahl) {
			var texte = [];
			if(gpxdaten.tracks.anzahl==1) {
				if(JB.gc.legende_rr) {
					texte[0] = "Track ("+Number(gpxdaten.tracks.track[0].laenge.toPrecision(10).toString(10))+"km";
					if(typeof(gpxdaten.tracks.track[0].rauf)!="undefined") 
						texte[0] += ", +"+gpxdaten.tracks.track[0].rauf+"m, -"+gpxdaten.tracks.track[0].runter+"m) "+String.fromCharCode(160);
					else 
						texte[0] += ") "+String.fromCharCode(160);
				}
				else
					texte[0] = "Track ("+Number(gpxdaten.tracks.track[0].laenge.toPrecision(10).toString(10))+"km) "+String.fromCharCode(160);
			}
			else if(gpxdaten.tracks.anzahl>1) { 
				if(JB.gc.legende_rr) {
					var rrflag=true;  
					for(var i=0;i<gpxdaten.tracks.anzahl;i++) {
						texte[i+1] = gpxdaten.tracks.track[i].name+" ("+Number(gpxdaten.tracks.track[i].laenge.toPrecision(10).toString(10))+"km";
						if(typeof(gpxdaten.tracks.track[i].rauf)!="undefined") {
							texte[i+1] += " ,"+ gpxdaten.tracks.track[i].rauf +"m, -"+gpxdaten.tracks.track[i].runter+"m)";
						}
						else {
							texte[i+1] += ")";
							rrflag = false;
						}
					}
					texte[0] = "Tracks ("+Number(gpxdaten.tracks.laenge.toPrecision(10).toString(10))+"km"
					if(rrflag) texte[0] += " ,+"+gpxdaten.tracks.rauf+"m, -"+gpxdaten.tracks.runter+"m) "+String.fromCharCode(160);
					else       texte[0] += ") "+String.fromCharCode(160);
				}
				else {
					texte[0] = "Tracks ("+Number(gpxdaten.tracks.laenge.toPrecision(10).toString(10))+"km) "+String.fromCharCode(160);
					for(var i=0;i<gpxdaten.tracks.anzahl;i++) texte[i+1] = gpxdaten.tracks.track[i].name+" ("+Number(gpxdaten.tracks.track[i].laenge.toPrecision(10).toString(10))+"km)";
				}
			}
			var farben = []; for(var i=0;i<gpxdaten.tracks.anzahl;i++) farben[i] = gpxdaten.tracks.track[i].farbe;
			chktrk = new JB.CheckBoxGroup(MapHead.id,texte,ID+"_trk",farben,JB.gc.legende_trk,show);
		}
		if(gpxdaten.routen.anzahl) {
			var texte = [];
			if(gpxdaten.routen.anzahl==1)
				texte[0] = "Route ("+Number(gpxdaten.routen.route[0].laenge.toPrecision(10).toString(10))+"km) "+String.fromCharCode(160);
			else if(gpxdaten.routen.anzahl>1) {
				texte[0] = "Routen ("+Number(gpxdaten.routen.laenge.toPrecision(10).toString(10))+"km) "+String.fromCharCode(160);
				for(var i=0;i<gpxdaten.routen.anzahl;i++) texte[i+1] = gpxdaten.routen.route[i].name+" ("+Number(gpxdaten.routen.route[i].laenge.toPrecision(10).toString(10))+"km)";
			}
			chkrt = new JB.CheckBoxGroup(MapHead.id,texte,ID+"_rt",JB.gc.rcols,JB.gc.legende_rte,show);
		}
	} // setMapHead

	function show() {
		JB.Debug_Info(id,"show ",false);
		if(JB.gc.profilflag) {
			JB.Wait(ID,["gra","plot"], function(){
				for(var p in profil) {
					if(profil[p].ele && !profil[p].diag) {
						profil[p].diag = new JB.plot(profil[p].id,profil[p].x,profil[p].y);
						if (profil[p].ele.className && profil[p].ele.className.search(/(^|\s)no_x(\s|$)/i)!=-1) profil[p].xtext = "";
						JB.Debug_Info(id,"Profil: "+profil[p].id+" Diagramm angelegt",false);
						profil[p].diag.framecol = JB.gc.plotframecol;
						profil[p].diag.gridcol = JB.gc.plotgridcol;
						profil[p].diag.labelcol = JB.gc.plotlabelcol;
						profil[p].diag.fillopac = JB.gc.profilfillopac;
					}
				}
				showProfiles();
			}); 
		}
		JB.Wait(id,["googlemaps"],function() {
			if(!Map) {
				Map = new JB.Map(mapdiv,id);
				JB.Debug_Info(ID,"Karte erstellt",false);
			}
			if(newfile) { Map.change(maptype); dieses.Rescale(); newfile = false; }
			showWpts();
			showTracks();
			showRoutes();
		})
	} // show

	function showWpts() {
		JB.Debug_Info(id,"showWpts",false);
		for(var i=0;i<markers.length;i++) JB.RemoveElement(markers[i]);
		markers = [];
		if (!(chkwpt && chkwpt.status[0])) return;
		for(var i=0;i<gpxdaten.wegpunkte.anzahl;i++) {
			var waypoint = gpxdaten.wegpunkte.wegpunkt[i];
			var sym = waypoint.sym.toLowerCase() ;
			var icon = JB.icons[sym]?JB.icons[sym]:null;
			JB.Debug_Info(id,"Symbol: "+sym,false);
			var text = (JB.gc.shwpname?"<b>"+waypoint.name+"</b><br />":"")
							 + (JB.gc.shwpcmt?waypoint.cmt:"") 
							 + (JB.gc.shwpcmt&&JB.gc.shwpdesc?"<br />":"") 
							 + (JB.gc.shwpdesc?waypoint.desc:"");
			if(JB.gc.shwptime && waypoint.time>0) text += "<br /><span style='white-space:nowrap;'>("
																									+ JB.sec2string(waypoint.time,JB.gc.tdiff) +")</span>"; 
			if(JB.checkImageName(waypoint.name))
				markers.push(Map.Marker_Bild(waypoint,JB.icons.Bild,waypoint.name,text));
			else if (waypoint.link && waypoint.link.length)
				markers.push(Map.Marker_Link(waypoint,icon,waypoint.name,waypoint.link,JB.gc.popup_Pars));
			else if (waypoint.name.length || waypoint.cmt.length || waypoint.desc.length)
				markers.push(Map.Marker_Text(waypoint,icon,waypoint.name,text));
			else
				markers.push(Map.Marker(waypoint,icon));
		}
	} // showWpts  

	function showRoutes() {
		JB.Debug_Info(id,"showRoutes",false);
		for(var i=0;i<routepolylines.length;i++) JB.RemoveElement(routepolylines[i]);
		routepolylines = [];
		if (!(chkrt && chkrt.status[0])) return;
		for(var i=0;i<gpxdaten.routen.anzahl;i++) if(chkrt.status[gpxdaten.routen.anzahl==1?0:i+1]) {
			var routei = gpxdaten.routen.route[i];
			var info = "<strong>"+routei.name+"</strong>";
			if(JB.gc.shtrx)
				info += "<br />Länge:&nbsp;"+Number(routei.laenge.toPrecision(10).toString(10))+"&nbsp;km";
			if(JB.gc.shrtcmt) info += "<br />"+routei.cmt;
			if(JB.gc.shrtdesc) info += "<br />"+routei.desc;
			var controls = {
				col: routei.farbe,
				ocol: JB.gc.ocol,
				opac: JB.gc.ropac,
				width: JB.gc.rwidth
			}
			var rts = Map.Polyline(routei,controls,info)
			for(var r=0;r<rts.length;r++) routepolylines.push(rts[r]);
			if(JB.gc.shrtstart) routepolylines.push(Map.Marker(routei.daten[0],JB.icons.start));
			if(JB.gc.shrtziel) routepolylines.push(Map.Marker(routei.daten[routei.daten.length-1],JB.icons.finish));
		}
	} // showRoutes

	function showTracks() {
		JB.Debug_Info(id,"showTracks",false);
		for(var i=0;i<trackpolylines.length;i++) JB.RemoveElement(trackpolylines[i]);
		trackpolylines = [];
		if (!(chktrk && chktrk.status[0])) return;
		for(var i=0;i<gpxdaten.tracks.anzahl;i++) if(chktrk.status[gpxdaten.tracks.anzahl==1?0:i+1]) {
			var tracki = gpxdaten.tracks.track[i];
			var info = "<strong>"+tracki.name+"</strong>";
			if(JB.gc.shtrx) 
				info += "<br />Länge:&nbsp;"+Number(tracki.laenge.toPrecision(10).toString(10))+"&nbsp;km";
			if(JB.gc.shtrs && typeof(tracki.rauf)!="undefined" ) 
				info += "<br /><span style='white-space:nowrap;'>Höhenmeter: +"+tracki.rauf+" m / -"+tracki.runter+" m</span>";
			if(JB.gc.shtrt && tracki.t0>0) 
				info += "<br />Startzeit:  <span style='white-space:nowrap;'>" + JB.sec2string(tracki.t0,JB.gc.tdiff) + "</span>"; 
			if(JB.gc.shtrvmitt && tracki.vmitt>0)
				info += "<br /><span style='white-space:nowrap;'>V<sub>m</sub> = " + tracki.vmitt + " km/h</span>"
			if(JB.gc.shtrcmt) info += "<br />"+tracki.cmt;
			if(JB.gc.shtrdesc) info += "<br />"+tracki.desc;
			var controls = {
				col: tracki.farbe,
				ocol: JB.gc.ocol,
				opac: JB.gc.topac,
				width: JB.gc.twidth
			}
			var trs = Map.Polyline(tracki,controls,info)
			for(var t=0;t<trs.length;t++) trackpolylines.push(trs[t]);
			if(JB.gc.shtrstart) trackpolylines.push(Map.Marker(tracki.daten[0],JB.icons.start));
			if(JB.gc.shtrziel) trackpolylines.push(Map.Marker(tracki.daten[tracki.daten.length-1],JB.icons.finish));
		}
	} // showTracks

	function showProfiles() {
		profil.hp.pflag = profil.sp.pflag = gpxdaten.tracks.hflag;
		profil.hpt.pflag = profil.spt.pflag = gpxdaten.tracks.hflag && gpxdaten.tracks.tflag;
		profil.vpt.pflag = profil.vp.pflag = gpxdaten.tracks.tflag;
		profil.wp.pflag = gpxdaten.tracks.tflag;
		for(var p in profil) {
			var pr = profil[p];                                                
			if(pr.ele && pr.pflag) pr.diag.clear();                       
		}
		if(!(chktrk && chktrk.status[0])) return;
		JB.Debug_Info(id,"showProfiles",false); 
		for(var i=0;i<gpxdaten.tracks.anzahl;i++) {
			var tracki = gpxdaten.tracks.track[i];
			var daten = tracki.daten;
			profil.hp.pflag = profil.sp.pflag = tracki.hflag;
			profil.hpt.pflag = profil.spt.pflag = tracki.hflag && tracki.tflag;
			profil.vpt.pflag = profil.vp.pflag = tracki.tflag;
			profil.wp.pflag = tracki.tflag;
			if(daten.length>1 && chktrk.status[gpxdaten.tracks.anzahl==1?0:i+1]) {
				for(var p in profil) { 
					pr = profil[p];
					if(pr.ele) {
						if(pr.scale && pr.scale.length==2) { 
							pr.scale[0][pr.x] = daten[0][pr.x];
							pr.scale[1][pr.x] = daten[daten.length-1][pr.x];
							pr.diag.scale(pr.scale);
						}
						// else
							 pr.diag.scale(daten);                  
					}
				}
			}
		} 
		profil.hp.pflag = profil.sp.pflag = gpxdaten.tracks.hflag;
		profil.hpt.pflag = profil.spt.pflag = gpxdaten.tracks.hflag && gpxdaten.tracks.tflag;
		profil.vpt.pflag = profil.vp.pflag = gpxdaten.tracks.tflag;
		profil.wp.pflag = gpxdaten.tracks.tflag;
		for(var p in profil) { 
			var pr = profil[p];
			if(pr.ele) pr.diag.frame(50,35,pr.xtext,pr.ytext);     
		}
		for(var i=0;i<gpxdaten.tracks.anzahl;i++) if(chktrk.status[gpxdaten.tracks.anzahl==1?0:i+1]) { 
			var tracki = gpxdaten.tracks.track[i];
			if(tracki.daten.length>1) { 
				profil.hp.pflag = profil.sp.pflag = tracki.hflag;
				profil.hpt.pflag = profil.spt.pflag = tracki.hflag && tracki.tflag;
				profil.vpt.pflag = profil.vp.pflag = tracki.tflag;
				profil.wp.pflag = tracki.tflag;
				for(var p in profil) {
					var pr = profil[p];
					if(pr.ele && pr.pflag) pr.diag.plot(tracki.daten,tracki.farbe);   
				}
			}
		}
		var ct=0,cf=0;
		if(chktrk.status.length==1) {
			if(chktrk.status[0]) cf = ct = 1;
		}
		else {
			var fa={};
			for(var i=1;i<chktrk.status.length;i++) { 
				if(chktrk.status[i]) {
					ct++;
					var fnri = gpxdaten.tracks.track[i-1].fnr;
					if(!fa[fnri]) { fa[fnri] = 1; cf++; }
				}
			}
		}        
		if((cf==1 || JB.gc.tracks_dateiuebergreifend_verbinden) && (JB.gc.tracks_verbinden || ct==1)) {
			var d_t = [];
			profil.hp.pflag = profil.sp.pflag = ct==1?gpxdaten.tracks.hflag:gpxdaten.tracks.hflagall;
			profil.hpt.pflag = profil.spt.pflag = 
			 ct==1?gpxdaten.tracks.hflagall&&gpxdaten.tracks.tflag:gpxdaten.tracks.hflagall&&gpxdaten.tracks.tflagall;
			profil.vpt.pflag = profil.vp.pflag = ct==1?gpxdaten.tracks.tflag:gpxdaten.tracks.tflagall;
			profil.wp.pflag = ct==1?gpxdaten.tracks.tflag:gpxdaten.tracks.tflagall;
			if(gpxdaten.tracks.anzahl==1) 
				d_t = d_t.concat(gpxdaten.tracks.track[0].daten);
			else
				for(var i=0;i<gpxdaten.tracks.anzahl;i++) if(chktrk.status[i+1]) d_t = d_t.concat(gpxdaten.tracks.track[i].daten);
			if(d_t.length) {
				for(var p in profil) {
					var pr = profil[p];
					if(pr.ele && pr.pflag) pr.diag.markeron(d_t,markerstart,markerstop,markermove,"Linie") ;
				}
			}
		}
	} // showProfiles

	function markerstart() {
		JB.Debug_Info(id,"markerstart",false);
		JB.MoveMarker.init(Map,JB.icons.MoveMarker);
		profil.hp.pflag = profil.sp.pflag = gpxdaten.tracks.hflag;
		profil.hpt.pflag = profil.spt.pflag = gpxdaten.tracks.hflag && gpxdaten.tracks.tflag;
		profil.vpt.pflag = profil.vp.pflag = gpxdaten.tracks.tflag;
		profil.wp.pflag = gpxdaten.tracks.tflag;
		for(var p in profil) {
			var pr = profil[p];
			if(pr.ele && pr.pflag) pr.diag.showmarker("Linie");
		}
	} // markerstart
	function markerstop() {
		JB.Debug_Info(id,"markerstop",false);
		JB.MoveMarker.remove();
		profil.hp.pflag = profil.sp.pflag = gpxdaten.tracks.hflag;
		profil.hpt.pflag = profil.spt.pflag = gpxdaten.tracks.hflag && gpxdaten.tracks.tflag;
		profil.vpt.pflag = profil.vp.pflag = gpxdaten.tracks.tflag;
		profil.wp.pflag = gpxdaten.tracks.tflag;
		for(var p in profil) {
			var pr = profil[p];
			if(pr.ele && pr.pflag) pr.diag.hidemarker();
		}
	} // markerstop
	function markermove(p,a) {
		var info = "";
		if(JB.gc.shtrx)                              info += "Strecke:&nbsp;"+a.x.toFixed(1)+"km";
		if(JB.gc.shtrh && typeof a.h != "undefined") info += "<br />Höhe:&nbsp;"+Math.round(a.h)+"m";
		if(JB.gc.shtrh && typeof a.t != "undefined") info += "<br />Temperatur:&nbsp;"+Math.round(a.temperature)+"°C";
		if(JB.gc.shtrv && typeof a.v != "undefined") info += "<br />Geschw.:&nbsp;"+Math.round(a.v)+"km/h";
		if(JB.gc.shtrs && typeof a.s != "undefined") info += "<br />Stg.:&nbsp;"+Math.round(a.s)+"%";
		if(JB.gc.shtrtabs) { if(JB.gc.shtrt && typeof a.t != "undefined") info += "<br />Zeit:&nbsp;"+JB.sec2string(a.tabs,JB.gc.tdiff); }
		else               { if(JB.gc.shtrt && typeof a.t != "undefined") info += "<br />Zeit:&nbsp;"+JB.Zeitstring(a.t); }
		profil.hp.pflag = profil.sp.pflag = gpxdaten.tracks.hflag;
		profil.hpt.pflag = profil.spt.pflag = gpxdaten.tracks.hflag && gpxdaten.tracks.tflag ;
		profil.vpt.pflag = profil.vp.pflag = gpxdaten.tracks.tflag;
		profil.wp.pflag = gpxdaten.tracks.tflag;
		for(var p in profil) {
			var pr = profil[p];
			if(pr.ele && pr.pflag) pr.diag.setmarker(a,"Linie");
		}
		JB.MoveMarker.pos(a,info,JB.gc.maxzoomemove);
	} // markermove

} // JB.makeMap

JB.checkImageName = function(url) {
	var ext = url.substr(url.lastIndexOf(".")+1).toLowerCase();
	return (ext=="jpg" || ext=="jpeg" || ext=="png" || ext=="gif") ;
} //  checkImageName                 

JB.CheckBoxGroup = function(id,Texte,Label,Farbe,def_stat,clickFunc) {
	var dieses = this;
	var nbx = Texte.length;
	this.status = []; for(var i=0;i<nbx;i++) this.status[i] = def_stat ;
	var ele;
	var box=document.createElement("div");
	box.className = "JBcheckbox";
	box.style.position = "absolute";
	box.style.display = "inline";
	box.style.color = "black";
	box.style.height = "1.4em";
	box.style.overflow = "hidden";
	box.style.backgroundColor = "";
	box.style.zIndex = 1000;
	box.style.margin = "0";
	box.style.padding = "0"; 
	box.onmouseover = function() {
		this.style.height = "";
		this.style.overflow = "";
		this.style.backgroundColor = "white";
		this.style.paddingRight = "0.3em";
		this.style.paddingBottom = "0.2em";
	};
	box.onmouseout  = function() {
		this.style.height = "1.4em";
		this.style.overflow = "hidden";
		this.style.backgroundColor = "";
		this.style.paddingRight = "";
		this.style.paddingBottom = "";
	};
	for(var i=0;i<nbx;i++) {
		ele = document.createElement("input");
		ele.type = "checkbox";
		ele.style = "vertical-align:middle";
		ele.id = Label + i;
		ele.nr = i;
		if(i==0) ele.onclick = function() {
			var l = nbx;
			var n = Label;
			var status = this.checked;
			dieses.status[0] = status;
			for(var j=1;j<l;j++) {
				document.getElementById(n+j).checked = status;
				dieses.status[j] = status;
			}
			clickFunc(dieses,this);
		};
		else     ele.onclick = function() {
			var l = nbx;
			var n = Label;
			var status = false;
			for(var j=1;j<l;j++) status |= document.getElementById(n+j).checked;
			document.getElementById(n+"0").checked = status;
			dieses.status[0] = status;
			dieses.status[this.nr] = this.checked;
			clickFunc(dieses,this);
		};
		box.appendChild(ele);
		ele.checked = def_stat;
		ele=document.createElement("span");
		// if(Farbe.length) {
			// if(i==0 && nbx==1) ele.style.color=Farbe[0];
			// else if(i) ele.style.color=Farbe[(i-1)%Farbe.length];
		// }
		ele.appendChild(document.createTextNode(Texte[i]));
		box.appendChild(ele);
		if(i<Texte.length-1) box.appendChild(document.createElement("br"));
	}
	ele=document.getElementById(id);
	ele.appendChild(box);
	var spn=document.createElement("span"); // Platzhalter
	spn.appendChild(document.createTextNode("xX"+Texte[0]+"x"));
	spn.style.visibility="hidden";
	ele.appendChild(spn);
} // JB.CheckBoxGroup

JB.sec2string = function(sec,off) {
	var d = new Date(sec*1000 + off*3600000);
	return d.getDate()+".&nbsp;"+(d.getMonth()+1)+".&nbsp;"+d.getFullYear()+",&nbsp;"+d.getHours()+":"+(d.getMinutes()<10?"0":"")+d.getMinutes(); 
} // sec2string

JB.Zeitstring = function(sekunden) {
	var h=0,m=0,s=sekunden;
	m = Math.floor(s/60);
	s = s%60; if(s<10) s = "0"+s;
	h = Math.floor(m/60)
	m = m%60; if(m<10) m = "0"+m;
	return h+":"+m+":"+s+"h"; 
} // JB.Zeitstring

JB.log = {
	out:null,
	dd:null,
	butt:null,
	but2:null,
	logstring:"",
	newdata:false,
	klein: function() {
		JB.log.dd.style.height = "1.5em";
		JB.log.butt.firstChild.data = "Vergrößern";
		JB.log.butt.onclick = JB.log.gross;
	},
	gross: function() {
		JB.log.dd.style.height = "12em";
		JB.log.butt.firstChild.data = "Verkleinern";
		JB.log.butt.onclick = JB.log.klein;
	},
	weg: function() {
		JB.log.dd.style.display = "none";
	},
	clear: function() {
		JB.log.logstring ="";
		JB.log.newdata = true;
	},
	write: function(str) {
		if(!JB.log.out&&document.body) {
			JB.log.dd = document.createElement("div");
			JB.log.dd.style.border = "1px solid black";
			JB.log.dd.style.position = "fixed";
			JB.log.dd.style.height = "12em";
			JB.log.dd.style.right = "1%";
			JB.log.dd.style.left = "1%";
			JB.log.dd.style.bottom = "0px";
			JB.log.dd.style.overflow = "hidden";
			JB.log.dd.style.zIndex = "2000";
			//JB.log.dd.style.backgroundColor = "rgba(210,210,210,.8)";   geht nicht im IE 8
			JB.log.dd.style.backgroundColor = "rgb(200,200,200)";
			JB.log.dd.style.textAlign = "right";  
			JB.log.butt = document.createElement("button");
			//JB.log.butt.type = "button";  geht nicht im IE 8
			JB.log.butt.appendChild(document.createTextNode("Verkleinern"));
			JB.log.butt.style.cursor = "pointer";
			JB.log.butt.onclick = JB.log.klein;
			JB.log.dd.appendChild(JB.log.butt);
			JB.log.but2 = document.createElement("button");
			//JB.log.but2.type = "button";  geht nicht im IE 8
			JB.log.but2.appendChild(document.createTextNode("Schließen"));
			JB.log.but2.style.cursor = "pointer";
			JB.log.but2.onclick = JB.log.weg;
			JB.log.dd.appendChild(JB.log.but2);
			JB.log.butt3 = document.createElement("button");
			//JB.log.butt3.type = "button";  geht nicht im IE 8
			JB.log.butt3.appendChild(document.createTextNode("Löschen"));
			JB.log.butt3.style.cursor = "pointer";
			JB.log.butt3.onclick = JB.log.clear;
			JB.log.dd.appendChild(JB.log.butt3);
			JB.log.out = document.createElement("div");
			JB.log.out.style.overflow = "scroll";
			JB.log.out.style.height = "10.5em";
			JB.log.out.style.borderTop = "1px solid black";
			JB.log.out.style.textAlign = "left";  
			JB.log.out.style.backgroundColor = "rgb(230,230,230)";
			JB.log.dd.appendChild(JB.log.out);
			document.body.appendChild(JB.log.dd);
			window.setInterval(function(){
				if(JB.log.newdata) {
					JB.log.newdata = false;
					JB.log.out.innerHTML = JB.log.logstring;
				}
			},1000);
		}
		JB.log.logstring += str + "<br>";
		JB.log.newdata = true;
		//if(JB.log.out) JB.log.out.innerHTML = JB.log.logstring;
	}
} // JB.log

JB.Debug_Info = function(id,Infotext,alertflag) {
	if(JB.debuginfo) {
		var dt = ((new Date()).getTime()-JB.gpxview_Start).toString(10);
		while(dt.length<6) dt = "0"+dt;
		JB.log.write(dt+" Map "+id+": "+Infotext);
	}
	if(alertflag) alert(Infotext);
} // GM_Info

JB.Wait = function(id,scripte,callback,ct) {
	var Text = "";
	var flag = true; 
	ct = ct || 1;
	for(var i=0;i<scripte.length;i++) {
		var t = JB.Scripte[scripte[i]];
		flag &= t == 2;
		Text += scripte[i] + ": "+ t + ", ";
	}
	JB.Debug_Info(id+" Wait",Text+" flag="+(flag?"true ":"false ")+ct,false)
	if(flag) window.setTimeout(callback,1);
	else if(ct<15) window.setTimeout(function() { JB.Wait(id,scripte,callback,ct+1) },100+(1<<ct));
	else JB.Debug_Info(id+" Wait",Text+" nicht geladen.",false);
} // Wait

// gmutils.js
// Version 1.8
// 9. 4. 2013
// www.j-berkemeier.de
JB.Map = function(mapcanvas,id) {
	var dieses = this;
	dieses.id = id;
	// OSM-Karten
	var osmmap = new google.maps.ImageMapType({
		getTileUrl: function(ll, z) {
			var X = ll.x % (1 << z); if(X<0) X += (1 << z);
			return "http://tile.openstreetmap.org/" + z + "/" + X + "/" + ll.y + ".png";
		},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		maxZoom: 18,
		name: "OSM",
		alt: "Open Streetmap"
	});
	var osmcycle = new google.maps.ImageMapType({
		getTileUrl: function(ll, z) {
			var X = ll.x % (1 << z); if(X<0) X += (1 << z);
			return "http://c.tile.opencyclemap.org/cycle/" + z + "/" + X + "/" + ll.y + ".png";
		},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		maxZoom: 18,
		name: "OSM Cycle",
		alt: "Open Streetmap Cycle"
	});
	this.maptypes = {
		Karte:google.maps.MapTypeId.ROADMAP,
		Satellit:google.maps.MapTypeId.SATELLITE,
		Hybrid:google.maps.MapTypeId.HYBRID,
		Oberflaeche:google.maps.MapTypeId.TERRAIN,
		OSM: "osm",
		OSM_Cycle: "cycle"
	};
	// Optionen für die Map
	var large = parseInt(mapcanvas.style.height)>190 && parseInt(mapcanvas.style.width)>200;
	var myOptions = {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: large,
		zoomControl: large,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle[JB.gc.largemapcontrol?"LARGE":"SMALL"]
		},
		mapTypeControl: large,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN, 'osm','cycle']
		},
		scaleControl: large,
		streetViewControl: false,
		overviewMapControl: JB.gc.overviewmapcontrol,
		overviewMapControlOptions: { opened: true  },
		scrollwheel: JB.gc.scrollwheelzoom
	};
	// Map anlegen und ausrichten
	this.map = new google.maps.Map(mapcanvas,myOptions);
	// OSM-Karten hinzufügen
	this.map.mapTypes.set('osm', osmmap);
	this.map.mapTypes.set('cycle', osmcycle);
	// Copyright für OSM
	var osmcopyright = document.createElement('div');
	osmcopyright.id = 'copyright-control';
	osmcopyright.style.fontSize = '10px';
	osmcopyright.style.fontFamily = 'Arial, sans-serif';
	osmcopyright.style.margin = '0 2px 4px 0';
	osmcopyright.style.whitespace = 'nowrap';
	osmcopyright.index = 1; 
	osmcopyright.style.color = "black";
	//osmcopyright.style.backgroundColor = "rgba(255,255,255,0.5)"; geht nicht im IE 8
	this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(osmcopyright);
	google.maps.event.addListener(this.map, "maptypeid_changed", function() {
		if (dieses.map.getMapTypeId() == 'osm') {
			osmcopyright.innerHTML = 'Map data &copy; <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a> -';
		} 
		else if (dieses.map.getMapTypeId() == 'cycle') {
			osmcopyright.innerHTML = 'Map data &copy; <a href="http://www.opencyclemap.org/" target="_blank">OpenCycleMap</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a> -';
		} 
		else {
			osmcopyright.innerHTML = '';
		}
	});
} // JB.Map

JB.Map.prototype.change = function(maptype) {
	var mt = this.maptypes[maptype]?this.maptypes[maptype]:google.maps.MapTypeId.SATELLITE;
	this.map.setMapTypeId(mt);
} // change

JB.Map.prototype.rescale = function(gpxdaten) {
	var sw = new google.maps.LatLng(gpxdaten.latmin,gpxdaten.lonmin);
	var ne = new google.maps.LatLng(gpxdaten.latmax,gpxdaten.lonmax);
	var bounds = new google.maps.LatLngBounds(sw,ne);
	this.map.fitBounds(bounds);
} // rescale

JB.Map.prototype.Polyline = function(daten,controls,infotext) {
	var dieses = this;
	var coords = daten.daten;
	var npt = coords.length, latlng = [], infofenster, line=[];
	for(var i=0;i<npt;i++) latlng.push(new google.maps.LatLng(coords[i].lat,coords[i].lon));
	var options = {
		path: latlng,
		strokeColor: controls.col,
		strokeOpacity: controls.opac,
		strokeWeight: controls.width
	}
	line[0] = new google.maps.Polyline(options);
	line[0].setMap(this.map);
	options.strokeOpacity = 0.01;
	options.strokeWeight = controls.width*5;
	line[1] = new google.maps.Polyline(options);
	line[1].setMap(this.map);
	options.strokeOpacity = controls.opac;
	options.strokeWeight = controls.width;
	var mapcenter,clk_ev;
	var infowindow = new google.maps.InfoWindow({ content: infotext });
	google.maps.event.addListener(infowindow,"closeclick", function() { dieses.map.panTo(mapcenter); google.maps.event.removeListener(clk_ev) });
	google.maps.event.addListener(line[1], 'click', function(o) {
		if(daten.link) {
			if(daten.link.search("~")==0) window.location.href = daten.link.substr(1);
			else window.open(daten.link,"",JB.gc.popup_Pars);
		}
		else {
			mapcenter = dieses.map.getCenter();
			clk_ev = google.maps.event.addListener(dieses.map,'click',function() { infowindow.close(); dieses.map.panTo(mapcenter); google.maps.event.removeListener(clk_ev) });
			infowindow.setPosition(o.latLng);
			infowindow.open(dieses.map);
		}
	});
	if(JB.gc.trackover) {
		infofenster = JB.Infofenster(this.map);
		google.maps.event.addListener(line[1], 'mouseover', function(o) {
			options.strokeColor = controls.ocol;
			options.strokeWeight = controls.owidth;
			line[0].setOptions(options);
			infofenster.content(infotext);
			infofenster.show();
			//infofenster.pos({lat: o.latLng.lat(), lon: o.latLng.lng()});
		});
		google.maps.event.addListener(line[1], 'mouseout', function(o) {
			options.strokeColor = controls.col;
			options.strokeWeight = controls.width;
			line[0].setOptions(options);
			infofenster.hide();
		});
	}
	return line;
} // Polyline
  
JB.Map.prototype.Marker = function(coord,icon) { 
	var options = { position: new google.maps.LatLng(coord.lat,coord.lon), map: this.map };
	if (icon) {
		if (icon.icon) options.icon = icon.icon; 
		if (icon.shadow) options.shadow = icon.shadow;
	}
	var marker = new google.maps.Marker(options);
	return marker;
} // Marker

JB.Map.prototype.Marker_Link = function(coord,icon,titel,url,popup_Pars) { 
	var options = { position: new google.maps.LatLng(coord.lat,coord.lon), map: this.map, title: titel };
	if (icon) {
		if (icon.icon) options.icon = icon.icon; 
		if (icon.shadow) options.shadow = icon.shadow;
	}
	var marker = new google.maps.Marker(options);
	google.maps.event.addListener(marker, 'click', function() {
		if(url.search("~")==0) window.location.href = url.substr(1);
		else window.open(url,"",popup_Pars);
	});
	return marker;
} // Marker_Link

JB.Map.prototype.Marker_Text = function(coord,icon,titel,text) {
	var dieses = this;
	var mapcenter,clk_ev;
	var options = { position: new google.maps.LatLng(coord.lat,coord.lon), map: this.map, title: titel };
	if (icon) {
		if (icon.icon) options.icon = icon.icon; 
		if (icon.shadow) options.shadow = icon.shadow;
	}
	var marker = new google.maps.Marker(options);
	var infowindow = new google.maps.InfoWindow({ content: text });
	google.maps.event.addListener(infowindow,"closeclick", function() { dieses.map.panTo(mapcenter); google.maps.event.removeListener(clk_ev) });
	google.maps.event.addListener(marker, 'click', function() {
		mapcenter = dieses.map.getCenter();
		clk_ev = google.maps.event.addListener(dieses.map,'click',function() { infowindow.close(); dieses.map.panTo(mapcenter); google.maps.event.removeListener(clk_ev) });
		var retval = true;
		if(typeof(JB.wpclick)=="function") retval = JB.wpclick("Text",{coord:coord,titel:titel,text:text,id:dieses.id});
		if(retval) infowindow.open(dieses.map,marker);
	});
	return marker;
} // Marker_Text

JB.Map.prototype.Marker_Bild = function(coord,icon,bild,text) {
	var dieses = this;
	var mapcenter,clk_ev;
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(coord.lat,coord.lon), 
		map: this.map,
		icon: icon.icon,
		shadow: icon.shadow
	});
	var infowindow = new google.maps.InfoWindow({ });
	google.maps.event.addListener(infowindow,"closeclick", function() { dieses.map.panTo(mapcenter); google.maps.event.removeListener(clk_ev) });
	google.maps.event.addListener(marker, 'click', function() {
		var retval = true;
		if(typeof(JB.wpclick)=="function") retval = JB.wpclick("Bild",{coord:coord,src:bild,text:text,id:dieses.id});
		if(retval) {
			var img = new Image();
			clk_ev = google.maps.event.addListener(dieses.map,'click',function() { infowindow.close(); dieses.map.panTo(mapcenter); google.maps.event.removeListener(clk_ev) });
			img.onload = function() { 
				var w = img.width, h = img.height;
				var mapdiv = dieses.map.getDiv();
				var mw = mapdiv.offsetWidth-150, mh = mapdiv.offsetHeight-250;
				if(w>mw) { h = Math.round(h*mw/w); w = mw; }; 
				if(h>mh) { w = Math.round(w*mh/h); h = mh; }
				var content = "<img src='"+bild+"' width="+w+" height="+h+"><br>"+text;
				mapcenter = dieses.map.getCenter();
				infowindow.setContent(content);
				infowindow.open(dieses.map,marker);
			}
			img.src = bild;
		}
	});
	google.maps.event.addListener(marker, 'mouseover', function() {
		var img = new Image();
		img.onload = function() { 
			var w = img.width, h = img.height, mw, mh;
			if(w>h) { mw = JB.gc.groesseminibild; mh = Math.round(h*mw/w); }
			else    { mh = JB.gc.groesseminibild; mw = Math.round(w*mh/h); }
			var minibild = new google.maps.Marker({
				position: new google.maps.LatLng(coord.lat,coord.lon), 
				map: dieses.map,
				zIndex: 200,
				icon: {
					url: bild,
					anchor: {x:23,y:0},
					scaledSize: {width:mw,height:mh}        }
			});
			google.maps.event.addListener(marker, 'mouseout', function() { minibild.setMap(null); });
		}
		img.src = bild;
	});
	return marker;
} // Marker_Bild 
 
JB.RemoveElement = function(element) {
	element.setMap(null);
} // JB.RemoveElement    
 
JB.MoveMarker = (function() {
	var MoveMarker_O = function() {
		var marker, infofenster, Map;
		this.init = function(mp,icon) {
			if(mp) {
				Map = mp;
				marker = Map.Marker({lat:0,lon:0},icon); 
				infofenster = JB.Infofenster(Map.map);
				infofenster.show();
			}
		}
		this.pos = function(coord,infotext,maxzoomemove) { 
			if(Map) {
				marker.setPosition(new google.maps.LatLng(coord.lat,coord.lon));
				infofenster.content(infotext);
				if(Map.map.getZoom() >= maxzoomemove) Map.map.setCenter(new google.maps.LatLng(coord.lat,coord.lon));
				else infofenster.pos(coord);  
			}      
		}
		this.remove = function() { 
			if(Map) {
				marker.setMap(null); 
				infofenster.remove();
			}
		}
	} // MoveMarker_O
	return new MoveMarker_O();
})();

JB.Infofenster = function(map) {
	var Infofenster_O = function() {
		var div = document.createElement("div");
		div.className = "JBinfofenster";
		this.div_ = div;
		this.cnr = map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.div_);
		this.map = map;
		this.setMap(map);
		this.set('visible', false);
	}
	Infofenster_O.prototype = new google.maps.OverlayView();
	Infofenster_O.prototype.draw = function() {}
	Infofenster_O.prototype.content = function(content) { 
		if(typeof(content)=="string") this.div_.innerHTML = content;
		else                          this.div_.appendChild(content);
	}
	Infofenster_O.prototype.hide = function() { this.set('visible', false); this.visible = false; }
	Infofenster_O.prototype.show = function() { this.set('visible', true); this.visible = true; }
	Infofenster_O.prototype.remove = function() { 
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].removeAt(this.cnr-1);
		this.visible = false;
	}
	Infofenster_O.prototype.visible_changed = function() { 
		this.div_.style.display = this.get('visible') ? '' : 'none';
	}
	Infofenster_O.prototype.pos = function(coord) { 
		var projection = this.getProjection();
		if (projection) {
			var point = projection.fromLatLngToContainerPixel(new google.maps.LatLng(coord.lat,coord.lon));
			this.div_.style.left = Math.round(point.x) + 5 + "px";
			this.div_.style.top  = Math.round(point.y) - 15 - this.div_.offsetHeight + "px"; 
		} 
	} 
	return new Infofenster_O();
}// JB.Infofenster
// Ende gmutils.js

// lpgpx.js
// Version 2.3
// 19. 4. 2013
// www.j-berkemeier.eu
JB.lpgpx = function(fns,id,callback) { 

	function downloadUrl(file, callback) {
		if(!file.fileobject) {
			var request,url=file.name;
			if (window.ActiveXObject) {
				request = new ActiveXObject('MSXML2.XMLHTTP');
			} 
			else if (window.XMLHttpRequest) {
				request = new XMLHttpRequest();
			} 
			else {
				JB.Debug_Info(id,"HTTP-Request konnte nicht erstellt werden, Datei: "+url,true)
				callback("",-1);
			}    
			request.onreadystatechange = function() {
				if (request.readyState == 4) {
					try {
						status = request.status;
					} 
					catch (e) {
						JB.Debug_Info(id,"HTTP-Request-Status konnte nicht abgefragt werden: "+e+", Datei: "+url,true);
					}
					if (status == 200 || status == 0) {
						callback(request.responseText, request.status);
						request.onreadystatechange = function() {};
					}
					else {
						JB.Debug_Info(id,"Datei konnte nicht geladen werden, Status: "+status+", Datei: "+url,true);
						callback("",request.status);
					}
				}
			}
			request.open('GET', url, true);
			try {
				request.send(null);
			} 
			catch (e) {
				JB.Debug_Info(id,"HTTP-Request konnte nicht abgesetzt werden: "+e+", Datei: "+url,true);
			}
		} // ajax
		else {
			if(typeof(FileReader)=="function") {
				var reader = new FileReader();
				reader.readAsText(file.fileobject); //,"UTF-8");
				reader.onload = function(evt) {
					callback(evt.target.result,200);
				}
				reader.onerror = function(evt) {
					JB.Debug_Info(id,"Datei konnte nicht geladen werden, Status: "+evt.target.error.name+", Datei: "+file.name,true);
					callback("",42);
				}
			}
			else 
				JB.Debug_Info(id,"FileReader wird nicht unterstützt.",true);
		} //File API
	} // downloadUrl

	function xmlParse(str) {
		JB.Debug_Info(id,"xmlParse -",false);
		str = str.replace(/>\s+</g,"><");
		if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.loadXML(str);
			JB.Debug_Info(id,"- ActiveX",false);
			return doc;
		}
		if (typeof DOMParser != 'undefined') {
			JB.Debug_Info(id,"- DOMParser",false);
			return (new DOMParser()).parseFromString(str, 'text/xml');
		}
		JB.Debug_Info(id,"xml konnte nicht geparsed werde!",false);
		return document.createElement("div");
	} // xmlParse

	var entf = (function() {
		var fak = Math.PI/180,ls,le,hs,he,be,sinbs,sinbe,cosbs,cosbe,dh,arg,e;
		var si = Math.sin, co = Math.cos, ac = Math.acos, ro = Math.round, sq = Math.sqrt;
		function entf_o() {
			this.init = function(b,l,h) {
				le = l*fak;
				be = b*fak;
				he = h;
				sinbe = si(be);
				cosbe = co(be);
			}
			this.rechne = function(b,l,h) {
				ls = le ;
				le = l*fak;
				hs = he ;
				he = h;
				be = b*fak;
				dh = (h - hs)/1000;
				sinbs = sinbe;
				cosbs = cosbe;
				sinbe = si(be);
				cosbe = co(be);
				arg = sinbs*sinbe + cosbs*cosbe*co(ls-le);
				arg = ro(arg*100000000000000)/100000000000000;
				e = ac ( arg ) * 6378.137;
				if(dh!=0) e = sq(e*e+dh*dh);
				return e;
			}
		}
		return new entf_o();
	})() // entf

	function rauf_runter(t) {
		var l=t.length;
		if(l<2) return { rauf:0, runter:0 } ;   
		var hs=t[0].h,he=t[l-1].h;
		var hmin=hs,hmax=hs;
		var h = hs;
		var ext = h;
		var rr = t[1].h>ext?1:-1;
		var rauf = 0;
		var runter = 0;
		var dmin = 10;
		var d;
		for(var i=1;i<l-1;i++) {
			var hm = h;
			h = t[i].h;
			if(h<hmin) hmin = h; if(h>hmax) hmax = h;
			var dh = h - hm;
			if(dh>0 && rr<0) { //  Min durchlaufen
				rr = 0;
				d = - (h - ext);
				if(d > dmin) { //  genügend Gefälle
					runter += d;
					ext = h;
				}
			}
			else if(dh<0 && rr>0) { //  Max durchlaufen
				rr = 0;
				d = h - ext;
				if(d > dmin) { //  genügend Steigung
					rauf += d;
					ext = h;
				}
			}
			else if(rr==0) {
				if(dh>0) rr = 1;
				else if(dh<0) rr = -1;
			}
		} 
		d = he - ext;
		if(d>0) rauf += d;
		else    runter -= d;
		var ramin = (hs<he)?hmax-hmin:hmax-hmin+he-hs;
		var rumin = (he<hs)?hmax-hmin:hmax-hmin+hs-he;
		if(rauf<ramin) rauf = ramin;
		if(runter<rumin) runter = rumin;
		runter += (he-hs) - (rauf-runter) ;
		rauf = Math.round(rauf);
		runter = Math.round(runter);
		return { rauf:rauf, runter:runter } ;    
	} // rauf_runter

	function getTag(ele,tagname,defval,child) {
		var tag = ele.getElementsByTagName(tagname), val=defval, tag0;
		if( tag && tag.length ) {
			tag0 = tag[0];
			if( tag0.firstChild && (child?(tag0.parentNode==ele):true) )
				val = tag0.firstChild.data;
		}
		return val;
	} // getTag

  function getTagNS(ele,namespace,tagname,defval,child) {
    var tag = getElementsByTagNameNS(ele,namespace,tagname), val=defval, tag0;
    if( tag && tag.length) {
      tag0 = tag[0];
      if( tag0.firstChild && (child?(tag0.parentNode==ele):true) )
        val = tag0.firstChild.data;
    }
    return val;
  } // getTagNS

  function getElementsByTagNameNS(ele,namespace,name) {
    var alltags = ele.getElementsByTagName("*");
    var tagname = namespace.toLowerCase()+":"+name.toLowerCase()
    var tags = [];
    for(var i=0;i<alltags.length;i++) if(alltags[i].nodeName.toLowerCase()==tagname) tags.push(alltags[i]);
    return tags;
  } // getElementsByTagNameNS

	function utc2sec(utcdate) {
		var jahr = utcdate.substr(0,4);
		var monat = utcdate.substr(5,2)*1-1;
		var tag = utcdate.substr(8,2);
		var stunde = utcdate.substr(11,2);
		var minute = utcdate.substr(14,2);
		var sekunde = utcdate.substr(17,2);
		return Date.UTC(jahr,monat,tag,stunde,minute,sekunde)/1000;
	} // utc2sec

	function smooth(a,x,y,ys,range) {
		var fak,faksum,sum,xi,xmin,xmax,xj,i,j,ai,aj,ti;
		var l = a.length;
		var t = []; 
		for(i=0;i<l;i++) { 
			ti = {}; 
			ai = a[i];
			ti[ys] = ai[y]; 
			for(var o in ai) ti[o] = ai[o]; 
			t[i] = ti;
		}
		var x0 = a[0][x];
		var xl = a[l-1][x];
		range /= 2000;
		if(range>(xl-x0)/4 || range==0) return t;
		for(i=0;i<l;i++) {
			ai = a[i];
			xi = ai[x];
			xmin = xi - range;
			xmax = xi + range;
			sum = ai[y] * range;
			faksum = range;
			j = i - 1;
			if(j>=0) {
				aj = a[j];
				xj = aj[x];
				while(xj>xmin) {
					fak = range - xi + xj;
					sum += aj[y]*fak;
					faksum += fak;
					j--;
					if(j<0) break;
					aj = a[j];
					xj = aj[x];
				}
			}
			j = i + 1;
			if(j<l) {
				aj = a[j];
				xj = aj[x];
				while(xj<xmax) {
					fak = range + xi - xj;
					sum += aj[y]*fak;
					faksum += fak;
					j++;
					if(j>=l) break;
					aj = a[j];
					xj = aj[x];
				}
			}
			t[i][ys] = sum/faksum;
		}
		return t;
	} // smooth

	function diff(a,x,y,d,fak) {
		var l=a.length,l1=l-1;
		if(l<3) { for(var i=0;i<l;i++) a[i][d] = 0; return a; }
		var dx,dy;
		dx = a[1][x]-a[0][x];
		dy = a[1][y]-a[0][y];
		if(dx==0) a[0][d] = 0;
		else      a[0][d] = fak*dy/dx;
		for(var i=1;i<l1;i++) {
			dx = a[i+1][x]-a[i-1][x];
			dy = a[i+1][y]-a[i-1][y];
			if(dx==0) a[i][d] = a[i-1][d];
			else      a[i][d] = fak*dy/dx;
		}
		dx = a[l1-1][x]-a[l1][x];
		dy = a[l1-1][y]-a[l1][y] ;
		if(dx==0) a[l1][d] = a[l1-1][d];
		else      a[l1][d] = fak*dy/dx;
		return a;
	} // diff

	var fnr = 0;
	var gpxdaten = {tracks:{},routen:{},wegpunkte:{}};
	var tnr, rnr, fnr, latmin, latmax, lonmin ,lonmax;

	function parseGPX(xml,gpxdaten,id,fnr) {
		JB.Debug_Info(id,"parseGPX",false);
		var t0=0,usegpxbounds=false;
		if(JB.gc.usegpxbounds) {
			var gpxmetadata = xml.documentElement.getElementsByTagName("metadata"); 
			if(gpxmetadata.length) var gpxbounds = gpxmetadata[0].getElementsByTagName("bounds");
			if(gpxbounds && gpxbounds.length) usegpxbounds = true; 
		}
		if(fnr == 0) {
			gpxdaten.tracks.laenge = 0;
			gpxdaten.tracks.rauf = 0;
			gpxdaten.tracks.runter = 0;
			gpxdaten.tracks.hflag = gpxdaten.tracks.tflag = gpxdaten.tracks.vflag = false;
			gpxdaten.tracks.hflagall = gpxdaten.tracks.tflagall = gpxdaten.tracks.vflagall = true;
			gpxdaten.tracks.track = [];
			gpxdaten.routen.laenge = 0;
			gpxdaten.routen.route = [];
			gpxdaten.wegpunkte.wegpunkt = [];
			tnr = rnr = -1;
			if(usegpxbounds) {
				latmin = parseFloat(gpxbounds[0].getAttribute("minlat"));
				latmax = parseFloat(gpxbounds[0].getAttribute("maxlat"));
				lonmin = parseFloat(gpxbounds[0].getAttribute("minlon"));
				lonmax = parseFloat(gpxbounds[0].getAttribute("maxlon"));
			}
			else {
				latmin=1000;latmax=-1000;lonmin=1000;lonmax=-1000;
			}
		}
		if(usegpxbounds && fnr!=0) {
			var t = parseFloat(gpxbounds[0].getAttribute("minlat"));
			if(t<latmin) latmin = t;
			t = parseFloat(gpxbounds[0].getAttribute("maxlat"));
			if(t>latmax) latmax = t;
			t = parseFloat(gpxbounds[0].getAttribute("minlon"));
			if(t<lonmin) lonmin = t;
			t = parseFloat(gpxbounds[0].getAttribute("maxlon"));
			if(t>lonmax) lonmax = t;
		}
		// Tracks
		var trk = xml.documentElement.getElementsByTagName("trk"); 
		JB.Debug_Info(id,trk.length +"Tracks gefunden",false);   
		for(var k=0;k<trk.length;k++) { 
			var trkk = trk[k];
			var trkpts = trkk.getElementsByTagName("trkpt"); // Trackpunkte
			var trkptslen = trkpts.length;
			if(trkptslen>1) {
				tnr++; 
				var tracki = { laenge:0, rauf:0, runter:0, t0:0, vmitt:0, fnr:fnr};
				tracki.name = getTag(trkk,"name","Track "+k,true);
				tracki.cmt = getTag(trkk,"cmt","",true);
				tracki.desc = getTag(trkk,"desc","",true);
				tracki.link = getTag(trkk,"link","",true);
				tracki.farbe = JB.gc.tcols[tnr%JB.gc.tcols.length];
				if(JB.gc.displaycolor) {
					var ext = trkk.getElementsByTagName("extensions");
					if(ext.length) tracki.farbe = getTagNS(ext[0],"gpxx","DisplayColor",JB.gc.tcols[tnr%JB.gc.tcols.length],false)
				}
				var daten = [];
				var x0=0;
				if(JB.gc.tracks_dateiuebergreifend_verbinden && fnr>0) x0 = gpxdaten.tracks.laenge ;
				else if (JB.gc.tracks_verbinden && k>0) for(var i=0,tr=gpxdaten.tracks.track;i<tr.length;i++) if(tr[i].fnr==fnr) x0 += tr[i].laenge;
				var tracklen = 0;
				var hflag=true,tflag=true,vflag=JB.gc.readspeed,h,temperature,t,v,tabs,tmp;
				JB.Debug_Info(id,trkptslen+" Trackpunkte in Track "+k+" gefunden",false);
				for(var i=0;i<trkptslen;i++) { // Trackdaten erfassen
					var trkptsi = trkpts[i];
					var lat = parseFloat(trkptsi.getAttribute("lat"));
					var lon = parseFloat(trkptsi.getAttribute("lon"));
					if(!usegpxbounds) {
						if(lat<latmin) latmin=lat; if(lat>latmax) latmax=lat;
						if(lon<lonmin) lonmin=lon; if(lon>lonmax) lonmax=lon;
					}
					
					temperature = getTag(trkptsi,"temperature","nf",false);
					if(temperature=="nf") tpflag = false;
					else temperature = parseFloat(temperature.replace(",","."));
					
					h = getTag(trkptsi,"ele","nf",false);
					if(h=="nf") hflag = false;
					else h = parseFloat(h.replace(",","."));
					tmp = getTag(trkptsi,"time","nf",false);
					if(tmp!="nf") { 
						tabs = utc2sec(tmp);
						if( i==0 ) {
							tracki.t0 = tabs;
							if( !JB.gc.tracks_verbinden || (fnr==0&&k==0) || (!JB.gc.tracks_dateiuebergreifend_verbinden&&k==0) || t0==0 ) {
								t = 0; 
								t0 = tracki.t0;
							}              
						}
						else 
							t = tabs - t0;
					}
					else {
						tflag = false;
						tabs = t = 0;
					}
					if(vflag) {
						tmp=getTag(trkptsi,"speed","nf",false);
						if((tmp=getTag(trkptsi,"speed","nf",false)) != "nf")
							v = parseFloat(tmp) * JB.gc.speedfaktor;
						else if((tmp=getTagNS(trkptsi,"gpxx","speed","nf",false)) != "nf")
							v = parseFloat(tmp) * JB.gc.speedfaktor;
						else {
							v = 0;
							vflag = false;
						}
					}
					daten.push({lat:lat,lon:lon,t:t,h:h,temperature:temperature,v:v,tabs:tabs});
				}
				if(!hflag && JB.gc.hkorr) {
					var anzfehl=0,nf=false,fehlst_n,fehlst=[];// Höhen korrigieren
					for(var i=0;i<trkptslen;i++) {
						if(daten[i].h == "nf") {              // Fehlstelle?
							anzfehl ++;                         // Zählen
							if(!nf) {                           // erste Fehlstelle im Block
								fehlst_n = {s:i,e:trkptslen-1};
								nf = true;
							}
						}
						else {
							if(nf) {                              // Erster Wert nach Fehlstelle?
								fehlst_n.e = i;                     // Ende Fehlstellenblock
								fehlst.push(fehlst_n);
								nf = false;
							}
						}
					}
					if(nf) {                                // Letzer Punkt im Fehlstellenblock
						fehlst_n.e = i;                       // Ende Fehlstellenblock
						fehlst.push(fehlst_n);
					}
					JB.Debug_Info(id,anzfehl+" Fehlende Höhenwerte in "+fehlst.length+" Blöcken",false);  
					for(var i=0;i<fehlst.length;i++) 
						JB.Debug_Info(id,"Fehlerblock Nr. "+i+":"+fehlst[i].s+" - "+fehlst[i].e,false);   
					if(anzfehl/trkptslen < 0.3) { // weniger als 30% Fehlstellen
						hflag = true;
						for(var i=0;i<fehlst.length;i++) {
							var s = fehlst[i].s, e = fehlst[i].e;
							if(s==0)
								for(var j=s;j<e;j++) daten[j].h = daten[e].h;
							else if(e==trkptslen)
								for(var j=s;j<e;j++) daten[j].h = daten[s-1].h;
							else 
								for(var j=s;j<e;j++) daten[j].h = daten[s-1].h + (daten[e].h-daten[s-1].h)*(j-s)/(e-s);
						}
					}
				}
				var dateni = daten[0],tracklentmp=tracklen,dx;
				daten[0].x = tracklen+x0;
				daten[0].dx = 0;
				entf.init(dateni.lat,dateni.lon,0.0) ;
				for(var i=1;i<trkptslen;i++) {
					dateni = daten[i];
					dx = entf.rechne(dateni.lat,dateni.lon,0.0);
					tracklen += dx;
					daten[i].x = tracklen+x0;
					daten[i].dx = dx;
				}
				if(hflag && JB.gc.laengen3d) {
					daten = smooth(daten,"x","h","hs",JB.gc.hglattlaen);
					tracklen = tracklentmp;
					dateni = daten[0];
					entf.init(dateni.lat,dateni.lon,dateni.hs) ;
					for(var i=1;i<trkptslen;i++) {
				  	dateni = daten[i];
					  dx = entf.rechne(dateni.lat,dateni.lon,dateni.hs);
					  tracklen += dx;
					  daten[i].x = tracklen+x0;
					  daten[i].dx = dx;
					}
				}
				if(JB.gc.profilflag) {
					if(hflag) {
						if(!JB.gc.laengen3d) daten = smooth(daten,"x","h","hs",JB.gc.hglattlaen); //trkptslen/50); 
						daten = diff(daten,"x","hs","s",0.1);
						daten = smooth(daten,"x","s","s",JB.gc.hglattlaen); //trkptslen/50);
					}
					if(tflag && !vflag) {       
						if(JB.gc.vglatt) {
							daten = smooth(daten,"t","x","xs",JB.gc.vglattlaen); //trkptslen/200); 
							daten = diff(daten,"t","xs","v",3600);
							daten = smooth(daten,"x","v","v",JB.gc.vglattlaen); //trkptslen/200);
						}
						else {
							daten = diff(daten,"t","x","v",3600);
						}
					}
				}
				JB.Debug_Info(id,""+(hflag?"":"Keine ")+"Höhendaten gefunden",false);
				JB.Debug_Info(id,""+(tflag?"":"Keine ")+"Zeitdaten gefunden",false);
				JB.Debug_Info(id,""+(vflag?"":"Keine ")+"Geschwindigkeitsdaten gefunden",false);
				if(hflag) {
					var rr = rauf_runter(daten);
					JB.Debug_Info(id,"Rauf: "+rr.rauf+"   Runter: "+rr.runter,false);
					tracki.rauf = rr.rauf;
					tracki.runter = rr.runter;
					gpxdaten.tracks.rauf += rr.rauf;      
					gpxdaten.tracks.runter += rr.runter;     
				}
				if(tflag) tracki.vmitt = tracklen/(daten[daten.length-1].t-daten[0].t)*3600;
				tracki.vmitt = Math.round(tracki.vmitt*10)/10;
				tracki.daten = daten;
				tracki.laenge = Math.round(tracklen*10)/10;
				tracki.hflag = hflag;
				tracki.tflag = tflag;
				tracki.vflag = vflag;
				gpxdaten.tracks.hflag |= hflag;
				gpxdaten.tracks.tflag |= tflag;
				gpxdaten.tracks.vflag |= vflag;
				gpxdaten.tracks.hflagall &= hflag;
				gpxdaten.tracks.tflagall &= tflag;
				gpxdaten.tracks.vflagall &= vflag;
				gpxdaten.tracks.track.push(tracki);
				gpxdaten.tracks.laenge += Math.round(tracklen*10)/10;
			}
		}
		gpxdaten.tracks.anzahl = gpxdaten.tracks.track.length;
		gpxdaten.tracks.t0 = gpxdaten.tracks.anzahl ? gpxdaten.tracks.track[0].t0 : 0;
		// Routen
		var rte = xml.documentElement.getElementsByTagName("rte"); 
		JB.Debug_Info(id,rte.length +" Routen gefunden",false);
		for(var j=0;j<rte.length;j++) {
			rnr++;
			var rtej = rte[j];
			var rtepts = rtej.getElementsByTagName("rtept");
			JB.Debug_Info(id,rtepts.length +" Zwischenziele gefunden",false);
			var routei = { laenge:0, farbe:JB.gc.rcols[rnr%JB.gc.rcols.length] };
			var routlen = 0;
			routei.name = getTag(rtej,"name","Route "+j,true);
			routei.cmt = getTag(rtej,"cmt","",true);
			routei.desc = getTag(rtej,"desc","",true);
			routei.link = getTag(rtej,"link","",true);
			var daten = [];
			for(var i=0;i<rtepts.length;i++) { // Zwischenziele
				var rteptsi = rtepts[i];
				var lat = parseFloat(rteptsi.getAttribute("lat"));
				var lon = parseFloat(rteptsi.getAttribute("lon"));
				if(i==0) entf.init(lat,lon,0.0) ;
				else     routlen += entf.rechne(lat,lon,0.0);      
				if(!usegpxbounds) {
					if(lat<latmin) latmin=lat; if(lat>latmax) latmax=lat;
					if(lon<lonmin) lonmin=lon; if(lon>lonmax) lonmax=lon;
				}
				daten.push({lat:lat,lon:lon});
				var rpts = getElementsByTagNameNS(rteptsi,"gpxx","rpt"); // Routenpunkte
				if(rpts.length>0) JB.Debug_Info(id,rpts.length +" Routenpunkte (Garmin) gefunden",false);
				for(var k=0;k<rpts.length;k++) {
					var rptsk = rpts[k];
					var lat = parseFloat(rptsk.getAttribute("lat"));
					var lon = parseFloat(rptsk.getAttribute("lon"));
					routlen += entf.rechne(lat,lon,0.0);
					if(!usegpxbounds) {
						if(lat<latmin) latmin=lat; if(lat>latmax) latmax=lat;
						if(lon<lonmin) lonmin=lon; if(lon>lonmax) lonmax=lon;
					}
					daten.push({lat:lat,lon:lon});
				}
			}
			routei.daten = daten;
			routei.laenge = Math.round(routlen*10)/10;
			gpxdaten.routen.route.push(routei);
			gpxdaten.routen.laenge += Math.round(routlen*10)/10;
		}
		gpxdaten.routen.anzahl = gpxdaten.routen.route.length;
		// Waypoints
		var wpts = xml.documentElement.getElementsByTagName("wpt"); 
		JB.Debug_Info(id,wpts.length +" Wegpunkte gefunden",false);
		for(var i=0;i<wpts.length;i++) { // Wegpunktdaten
			var wpt = wpts[i];
			var lat = parseFloat(wpt.getAttribute("lat"));
			var lon = parseFloat(wpt.getAttribute("lon"));
			var temperature = parseFloat(wpt.getAttribute("temperature"));
			if(!usegpxbounds) {
				if(lat<latmin) latmin=lat; if(lat>latmax) latmax=lat;
				if(lon<lonmin) lonmin=lon; if(lon>lonmax) lonmax=lon;
			}
			var waypoint = {};
			waypoint.lat = lat;
			waypoint.lon = lon;
			waypoint.temperature = temperature;
			waypoint.name = getTag(wpt,"name","",false);
			waypoint.cmt = getTag(wpt,"cmt","",false);
			waypoint.desc = getTag(wpt,"desc","",false);
			waypoint.link = getTag(wpt,"link","",false);
			waypoint.sym = getTag(wpt,"sym","default",false);
			waypoint.time = utc2sec(getTag(wpt,"time","1980-01-01T12:00:00Z",false));
			gpxdaten.wegpunkte.wegpunkt.push(waypoint);
		}
		gpxdaten.wegpunkte.anzahl = gpxdaten.wegpunkte.wegpunkt.length;

		gpxdaten.latmin = latmin;
		gpxdaten.latmax = latmax;
		gpxdaten.lonmin = lonmin;
		gpxdaten.lonmax = lonmax;
		return gpxdaten
	} // parseGPX

	function lpgpxResponse(data,status) {
		if(status != 200 && status != 0) {
			JB.Debug_Info(id,fn[fnr].name+" konnte nicht gelesen werden",true);
		}
		else {
			gpxdaten = parseGPX(xmlParse(data),gpxdaten,id,fnr);
		}
		if(fns[++fnr]) {
			JB.Debug_Info(id,fns[fnr].name,false);
			downloadUrl(fns[fnr],lpgpxResponse);
		}
		else {
			callback(gpxdaten);
		}
	} // lpgpxResponse
	JB.Debug_Info(id,fns[fnr].name,false);
	window.setTimeout(function() { downloadUrl(fns[fnr],lpgpxResponse); },1);
} // JB.lpgpx
// Ende lpgpx.js

JB.LoadScript = function(url,callback) {
	var scr = document.createElement('script');
	scr.type = "text/javascript";
	scr.async = "async";
	if(typeof(callback)=="function") {
		scr.onloadDone = false;
		scr.onload = function() { 
			if ( !scr.onloadDone ) {
				scr.onloadDone = true;
				JB.Debug_Info(url,"loaded",false);
				callback(); 
			}
		};
		scr.onreadystatechange = function() { 
			if ( ( "loaded" === scr.readyState || "complete" === scr.readyState ) && !scr.onloadDone ) {
				scr.onloadDone = true; 
				JB.Debug_Info(url,"ready",false);
				callback();
			}
		}
	}
	scr.onerror = function() {
		JB.Debug_Info(url,"Konnte nicht geladen werden.",false);
	}
	scr.src = url;
	document.getElementsByTagName('head')[0].appendChild(scr);
} // LoadScript

JB.LoadCSS = function(url) {
	var l = document.createElement("link");
	l.type = "text/css";
	l.rel = "stylesheet";
	l.href = url;
	document.getElementsByTagName("head")[0].appendChild(l);
	JB.Debug_Info(url,"load",false);
} // LoadCSS

JB.gmcb = function() {
	JB.Scripte.googlemaps = 2;
	JB.Debug_Info("Start","http://maps.google.com/maps/api/js?sensor=false&callback=JB.gmcb geladen",false);
} // gmcb

JB.GPX2GM.start = function() {
	JB.Debug_Info("","GPXViewer "+JB.GPX2GM.ver+" vom "+JB.GPX2GM.dat,false);
	JB.LoadScript("http://maps.google.com/maps/api/js?sensor=false&callback=JB.gmcb", function() {});
	JB.LoadCSS(JB.GPX2GM.Path+"GPX2GM.css");
	JB.LoadScript(JB.GPX2GM.Path+"map/GM_Utils/GPX2GM_Defs.js", function() {
		JB.setgc();
		JB.Scripte.GPX2GM_Defs = 2;
		JB.icons = new JB.Icons(JB.GPX2GM.Path);
		JB.Debug_Info("Start","Icons vorbereitet",false);
		var Map_Nr=0;
		var divs = document.getElementsByTagName("div");
		var typ = undefined;
		var maps=[];
		for(var i=0;i<divs.length;i++) {
			var div = divs[i];
			if(div.className) {
				var Klasse = div.className;
				var CN = Klasse.search(/(^|\s)gpxview/i);
				if(CN>-1) {
					if(div.id) var Id = div.id;
					else {
						var Id = "map"+(Map_Nr++);
						div.id = Id;
					}
					var GPX = Klasse.substring(CN).split()[0];
					GPX = GPX.split(":") ;
					if(GPX.length==3) {
						typ = GPX[2];
					}
					if(GPX[1].length) {
						maps["Karte_"+Id] = div.makeMap = new JB.makeMap(Id);
						maps["Karte_"+Id].ShowGPX(GPX[1].split(","),typ);
					}
				}
			}
		}
		var buttons = document.getElementsByTagName("button");
		for(var i=0;i<buttons.length;i++) {
			var button = buttons[i];
			if(button.className) {
				var Klasse = button.className;
				var CN = Klasse.search(/(^|\s)gpxview/i);
				if(CN>-1) {
					var cmd = Klasse.substring(CN).split()[0];
					cmd = cmd.split(":") ;
					if(cmd.length>2) {
						var Id = cmd[1];
						switch(cmd[2]) {
							case "skaliere":
								( function() {
									var mapid = "Karte_"+Id;
									button.onclick = function(){maps[mapid].Rescale()};
								} )();
								break;
							case "lade":
								if(cmd.length>3) {
									if(cmd.length>4) typ = cmd[4];
									else typ = undefined;
									( function() {
										var fn = cmd[3].split(",");
										var mapid = "Karte_"+Id;
										var tp = typ;
										button.onclick = function(){maps[mapid].ShowGPX(fn,tp)};
									} )();
								}
								break;
							default:
								break;
						}
					}
				}
			}
		}
		var selects = document.getElementsByTagName("select"); 
		for(var i=0;i<selects.length;i++) {
			var select = selects[i];
			var Klasse = select.className;
			var CN = Klasse.search(/(^|\s)gpxview/i);
			if(CN>-1) {
				select.onchange = function() {
					var cmd = this.options[this.options.selectedIndex].value.split(":");
					if(cmd.length<2) return;
					if(cmd.length<3) cmd[2] = undefined;
					maps["Karte_"+cmd[0]].ShowGPX(cmd[1].split(","),cmd[2]);
				}
			}
		}
	}); // JB.LoadScript("GPX2GM_Defs.js")
} // JB.GPX2GM.start

if(JB.GPX2GM.autoload) {
	if(window.addEventListener) {
		window.addEventListener("DOMContentLoaded",JB.GPX2GM.start,false);
		JB.Debug_Info("addEventListener","DOMContentLoaded",false); 
	}
	else if(window.attachEvent) {
		window.attachEvent("onload",JB.GPX2GM.start);
		JB.Debug_Info("attachEvent","onload",false); 
	}
}
