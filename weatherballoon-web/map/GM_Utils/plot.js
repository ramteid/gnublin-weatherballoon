// plot
// Version vom 8. 4. 2013
// Jürgen Berkemeier
// www.j-berkemeier.de
window.JB = window.JB || {};
JB.plot = function(feld,xstr,ystr) {
  this.ticwidth=1;
  this.linewidth=1;
  this.borderwidth=2;
	this.framecol = "black";
	this.gridcol = "gray";
	this.labelcol = "black";
	this.markercol = "black";
	this.fillopac = 0;
  var JB_log10 = function(x) { return Math.log(x)/Math.LN10; }
  var JB_toString = function(n) { return Math.abs(n)<1e-15?"0":Number(n.toPrecision(15)).toString(10); }
  var JB_makediv = function(parentnode,id,x,y,w,h) {
    var ele = document.createElement("div");
    ele.style.position = "absolute";
    if(typeof id == "string" && id.length) ele.id = id;
    if(typeof x == "number") ele.style.left = x + "px";
    if(typeof y == "number") ele.style.top = y + "px";
    if(typeof w == "number") ele.style.width = w + "px";
    if(typeof h == "number") ele.style.height = h + "px";
    parentnode.appendChild(ele);
    return ele;
  }
  if(typeof feld == "string") feld = document.getElementById(feld);
  var xobj = xstr?xstr:"x";
  var yobj = ystr?ystr:"y";
  var xmin=0,xmax=0,ymin=0,ymax=0;
  var xfak=0,yfak=0;
  var dx,dy,fx,fy;
  var gr = null;
  var xlabel = null;
  var ylabel = null;
  var w = parseInt(feld.offsetWidth-1);
  var h = parseInt(feld.offsetHeight-1);
  var marker;
  var ifeld = JB_makediv(feld,"","","",w,h);

  this.scale = function(a) {
    if(xmin==xmax) {
      xmax = xmin = a[0][xobj];
      ymax = ymin = a[0][yobj];
    }
    for(var i=0;i<a.length;i++) {
      var t = a[i];
      if(t[xobj]<xmin) xmin = t[xobj];
      if(t[xobj]>xmax) xmax = t[xobj];
      if(t[yobj]<ymin) ymin = t[yobj];
      if(t[yobj]>ymax) ymax = t[yobj];
    }
  } // plot.scale
  this.clear = function() {
    ifeld.innerHTML = "";
    xmax = xmin = ymax = ymin = xfak = yfak = 0;
  } // plot.clear
  this.frame = function(x0,y0,xl,yl) {
    if(xmax==xmin) { xmin -= 0.5; xmax += 0.5; }
    dx = (xmax - xmin)/100; xmin -= dx; xmax += dx;
    dx = xmax - xmin;
    fx = Math.pow(10,Math.floor(JB_log10(dx))-1);
    xmin = Math.floor(xmin/fx)*fx;
    xmax = Math.ceil(xmax/fx)*fx;
    if(ymax==ymin) { ymin -= 0.5; ymax += 0.5; }
    dy = (ymax - ymin)/100; ymin -= dy; ymax += dy;
    dy = ymax - ymin;
    fy = Math.pow(10,Math.floor(JB_log10(dy))-1);
    ymin = Math.floor(ymin/fy)*fy;
    ymax = Math.ceil(ymax/fy)*fy;
    ifeld.innerHTML = "";
    this.pele = JB_makediv(ifeld,"",x0,0,w-x0,h-y0);
    if(xl.length) xlabel=new JB.gra(JB_makediv(ifeld,"",x0,h-y0,w-x0,y0));
    ylabel=new JB.gra(JB_makediv(ifeld,"",0,0,x0,h-y0));
    gr=new JB.gra(this.pele);
    gr.setbuf(1000);
    xfak = gr.w/(xmax-xmin);
    yfak = gr.h/(ymax-ymin);
    if(xl.length) xlabel.text(xlabel.w/2,0,".9em",this.labelcol,xl,"mu"); 
    if(yl.length) ylabel.text(10,ylabel.h/2,".9em",this.labelcol,yl,"mm");
    var tx = 100*dx/gr.w;
    var ty = gr.h<250 ?  50*dy/gr.h : 100*dy/gr.h;
    var tx10 = Math.pow(10,Math.floor(JB_log10(tx)));
    tx = Math.round(tx/tx10);
    var ty10 = Math.pow(10,Math.floor(JB_log10(ty)));
    ty = Math.round(ty/ty10);
    tx = Number(String(tx).replace(/3/,"2").replace(/[4567]/,"5").replace(/[89]/,"10"));
    ty = Number(String(ty).replace(/3/,"2").replace(/[4567]/,"5").replace(/[89]/,"10"));
    tx *= tx10;
    ty *= ty10;
    var mxmin = Math.ceil(xmin/tx)*tx;
    var mymin = Math.ceil(ymin/ty)*ty;
    gr.setwidth(this.ticwidth);
    for(var x=mxmin;x<=xmax;x+=tx) {
      var xx = (x-xmin)*xfak;
      gr.linie(xx,0,xx,gr.h,this.gridcol);
      if(xl.length && xx<(gr.w-5) && xx>5) xlabel.text(xx,xlabel.h,".8em",this.labelcol,JB_toString(x),"mo");
    }
    for(var y=mymin;y<=ymax;y+=ty) {
      var yy = (y-ymin)*yfak;
      gr.linie(0,yy,gr.w,yy,this.gridcol);
      if(yl.length && yy<(gr.h-5) && yy>5) ylabel.text(ylabel.w,yy,".8em",this.labelcol,JB_toString(y),"rm");
    }
    gr.setwidth(this.linewidth);
    var rahmen=new JB.gra(this.pele);
    rahmen.setwidth(this.borderwidth);
    rahmen.linie(       0,       0,rahmen.w,       0,this.framecol);
    rahmen.linie(rahmen.w,       0,rahmen.w,rahmen.h,this.framecol);
    rahmen.linie(rahmen.w,rahmen.h,       0,rahmen.h,this.framecol);
    rahmen.linie(       0,rahmen.h,       0,       0,this.framecol);
    this.mele = JB_makediv(ifeld,"",x0,0,w-x0,h-y0);
    if(gr.canvas) this.mele.style.backgroundColor = "rgba(255,255,255,0)"; // für den IE9 RC, ohne kein "onmouseover" etc.
  } // plot.frame
  this.plot = function(a,col) {
    var arr=[];
    for(var i=0,l=a.length;i<l;i++)
      arr.push({x:(a[i][xobj]-xmin)*xfak, y:(a[i][yobj]-ymin)*yfak});
    if(this.fillopac>0) {
			var y0;
			if(ymax*ymin<=0) y0 = -ymin*yfak ; 
			else if(ymin>0) y0 = 1;
			else y0 = h-1;
		  arr.push({x:(a[l-1][xobj]-xmin)*xfak,y:y0});
			arr.push({x:(a[0][xobj]-xmin)*xfak,y:y0});
			arr.push({x:(a[0][xobj]-xmin)*xfak,y:(a[0][yobj]-ymin)*yfak});
			gr.polyfill(arr,col,this.fillopac);
			arr.length -= 3;
		}
		gr.polyline(arr,col);
    gr.flush();
  } // plot.plot)
  this.showmarker = function(markertype) {
    if(markertype=="Punkt") {
      marker = JB_makediv(this.pele,"","","","","");
      marker.style.fontSize = "32px";
      var txt=document.createTextNode(String.fromCharCode(8226)) ; // Kreis als Zeichen: &bull; oder &#8226; evtl auch 8729
      marker.appendChild(txt);
    }
    else {
      marker = JB_makediv(this.pele,"","",0,1,gr.h);
      marker.style.backgroundColor = this.markercol;
    }
    marker.style.display = "none";
  } // plot.showmarker
  this.hidemarker = function() {
    marker.style.display = "none";
  } // plot.hidemarker
  this.setmarker = function(a,markertype) {
    marker.style.display = "";
    if(markertype=="Punkt") {
      marker.style.left = Math.round((a[xobj]-xmin)*xfak) - marker.offsetWidth/2 + "px";
      marker.style.top = Math.round(gr.h - (a[yobj]-ymin)*yfak) - marker.offsetHeight/2 + "px";
    }
    else {
      marker.style.left = Math.round((a[xobj]-xmin)*xfak) + "px";
    }
  } // plot.setmarker
  this.markeron = function(a,callback_over,callback_out,callback_move,markertype) {
    var dieses = this;
    var posx=0,offx=0;
    var feldt = this.mele;
    if(feldt.offsetParent) 
      do {
        offx += feldt.offsetLeft;
      } while(feldt = feldt.offsetParent);
    this.mele.onmouseover = function(e) {
      if(!e) e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
      dieses.mele.onmousemove = function(e) {
        if(!e) e = window.event;
        e.cancelBubble = true;
        if(e.stopPropagation) e.stopPropagation();
        if(e.pageX) posx = e.pageX;
	      else if(e.clientX) posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posx -= offx;
        var x = posx/xfak+xmin;
        var al = a.length;
        var p,pi;
        if(x<=a[0][xobj]) pi=0;
        else if(x>=a[al-1][xobj]) pi=al-1;
        else {
          p = al/2;
          pi = Math.floor(p);
          var dp = Math.ceil(p/2);
          do {
            var apx = a[pi][xobj];
            if(x<apx) { p -= dp; if(p<0) p=0; }
            else if(x>apx) { p += dp; if(p>al-1) p=al-1; }
            else break;
            pi = Math.floor(p);
            dp = dp/2;
          } while(dp>=0.5) ;
        }
        dieses.setmarker(a[pi],markertype);
        if(callback_move && typeof(callback_move)=="function") callback_move(pi,a[pi]);
        return false;
      }
      if(callback_over && typeof(callback_over)=="function") callback_over();
      return false;
    } 
    this.mele.onmouseout = function(e) {
      if(!e) e = window.event;
      dieses.hidemarker();
      dieses.mele.onmousemove = null;
      if(callback_out && typeof(callback_out)=="function") callback_out();
      return false;
    }
  } // plot.markeron
  this.markeroff = function() {
    this.pele.onmousemove = null;
    this.pele.onmouseout = null;
  } // plot.markeroff
} // plot
