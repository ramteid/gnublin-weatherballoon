// gra_canvas
// Version vom 2. 4. 2013
// Jürgen Berkemeier
// www.j-berkemeier.de
if(typeof(JB)=="undefined") JB = {};
JB.gra = function(gradiv) {
 this.canvas = true;
 if(typeof gradiv == "string") gradiv = document.getElementById(gradiv);
 var getCurrentStyle = function(element,cssPropertyName) {
  if (window.getComputedStyle)
   return window.getComputedStyle(element,'').getPropertyValue(cssPropertyName.replace(/([A-Z])/g,"-$1").toLowerCase());
  else if (element.currentStyle) return element.currentStyle[cssPropertyName];
  else return "";
 }
 this.w = parseInt(getCurrentStyle(gradiv,"width"));  //gradiv.offsetWidth;
 this.h = parseInt(getCurrentStyle(gradiv,"height")); //gradiv.offsetHeight;
 var cv = document.createElement("canvas");
 cv.width = this.w;
 cv.height = this.h;
 cv.style.position = "absolute";
 gradiv.appendChild(cv);
 this.context = cv.getContext("2d"); 
 this.w = this.context.canvas.width;
 this.h = this.context.canvas.height;
 this.linewidth = 1;
 this.context.lineWidth = 1;
 var xoff=0,yoff=0;
 this.setwidth=function(w) {
  this.linewidth = w;
  this.context.lineWidth = w;
  xoff = (w-1)/2;
  yoff = (w-1)/2;
 }
 this.setbuf=function(siz) {
 }
 this.flush=function() {
 }
 this.punkt=function(x,y,c) {
  this.context.fillStyle = c;
  this.context.fillRect(x-xoff,this.h-y+yoff,this.linewidth,this.linewidth);
 } // punkt
 this.ver_linie=function(x,y1,y2,c) {
  this.linie(x,this.h-y1,x,this.h-y2,c);
 } // ver_linie
 this.hor_linie=function(x1,x2,y,c) {
  this.linie(x1,this.h-y,x2,this.h-y,c);
 } // hor_linie
 this.linie=function(xs,ys,xe,ye,c) {
  xs=Math.round(xs); xe=Math.round(xe);
  ys=Math.round(ys); ye=Math.round(ye);
  this.context.strokeStyle = c;
  this.context.beginPath();
	this.context.moveTo(xs,this.h-ys);
	this.context.lineTo(xe,this.h-ye);
  this.context.stroke();
 } // linie
 this.polyline=function(arr,c) { 
  this.context.strokeStyle = c;
  this.context.beginPath();
  this.context.moveTo(Math.round(arr[0].x),this.h-Math.round(arr[0].y));
  for(var i=1,l=arr.length;i<l;i++) {
 	 this.context.lineTo(Math.round(arr[i].x),this.h-Math.round(arr[i].y));
  }
  this.context.stroke();
 } // polyline
 this.polyfill=function(arr,c,a) { 
  this.context.fillStyle = c;
	this.context.globalAlpha = a;
  this.context.beginPath();
  this.context.moveTo(Math.round(arr[0].x),this.h-Math.round(arr[0].y));
  for(var i=1,l=arr.length;i<l;i++) {
 	 this.context.lineTo(Math.round(arr[i].x),this.h-Math.round(arr[i].y));
  }
  this.context.fill();
	this.context.globalAlpha = 1;
 } // polyfill
 this.text=function(x,y,size,color,text,align) {
  var align_h = "m";
  var align_v = "m";
  if(align && align.length) {
   align_h = align.substr(0,1);
   if(align.length>1) align_v = align.substr(1,1);
  }
  this.context.save();
  this.context.translate(x,this.h-y);
  if(text.search("<br />")!=-1) {
    this.context.rotate(1.5*Math.PI);
    text = " "+text.replace(/<br \/>/g," ").replace(/\&nbsp;/g," ").replace(/  /g," ")+" ";
  }
  switch(align_h) {
   case "l": this.context.textAlign = "start"; break;
   case "m": this.context.textAlign = "center"; break;
   case "r": this.context.textAlign = "end"; break;
   default:  this.context.textAlign = "start"; break;
  }
  switch(align_v) {
   case "o": this.context.textBaseline = "top" ; break;
   case "m": this.context.textBaseline = "middle" ; break;
   case "u": this.context.textBaseline = "bottom" ; break;
   default:  this.context.textBaseline = "bottom" ; break;
  }
  this.context.font = size+" sans-serif";
  this.context.fillStyle = color;
  this.context.fillText(text,0,0);
  this.context.restore();
 } // text
 this.del=function() {
  this.context.clearRect(0, 0, this.w, this.h);
 } // del
} // gra

