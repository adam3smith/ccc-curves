"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -120 -110 220 220");

const inputParamFr		= document.getElementById("param1");
//const inputParamSt		= document.getElementById("param2");
const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxAffin  	= document.getElementById('checkboxAffin');
const checkboxRoll		= document.getElementById('checkboxRoll');
const checkboxWhisper 	= document.getElementById('checkboxWhisper');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxConst.checked	= true;
checkboxAffin.checked	= false;
checkboxRoll.checked	= false;
checkboxWhisper.checked	= true;
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
checkboxBackgrd.checked = false;
let mybackground     	= "black";
let myforeground     	= "white";

// Curve:
let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 1.0 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	path.setAttribute( 'd', txt);
	svgEl.appendChild(path);
	
let achsen = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	achsen.setAttribute( 'stroke' , '#FFFFFF' );
  	achsen.setAttribute( 'stroke-width' , 0.25 );
  	achsen.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(achsen);
let txta = 'M'+' '+'-150'+' '+'0'+'L'+' '+'150'+' '+'0';
	txta = txta+'M'+' '+'0'+' '+'-150'+'L'+' '+'0'+' '+'150';
	achsen.setAttribute('d', txta);
let txtb = [];

// Normals:  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	svgEl.appendChild(normal);


// constructionM, constructionA
let cirlt	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirlt.setAttribute("style","fill:none; stroke-width:0.5");
	cirlt.setAttribute( 'stroke' , '#FFFF00' );
	cirlt.setAttribute("cx", 0);
	cirlt.setAttribute("cy", 0);
	cirlt.setAttribute("r", 1);
	//svgEl.appendChild(cirlt);
let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	tancon.setAttribute( 'stroke' , '#FFFF00' );
  	tancon.setAttribute( 'stroke-width' , 0.5 );
  	tancon.setAttribute( 'fill' , 'none' );
let txttn	= '';
	tancon.setAttribute( 'd', txttn);
	svgEl.appendChild(tancon);
let focl 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	focl.setAttribute("style","fill:#FFFF00; stroke-width:0.25");
	focl.setAttribute( 'stroke' , '#FFFF00' );
	//svgEl.appendChild(focl);
	focl.setAttribute("cx", 0);
	focl.setAttribute("cy", 0);
	focl.setAttribute("r", 1);
let focr 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	focr.setAttribute("style","fill:#FFFF00; stroke-width:0.25");
	focr.setAttribute( 'stroke' , '#FFFF00' );
	//svgEl.appendChild(focr);
	focr.setAttribute("cx", 0);
	focr.setAttribute("cy", 0);
	focr.setAttribute("r", 1);

let rays	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	rays.setAttribute( 'stroke' , '#FF7700' );
  	rays.setAttribute( 'stroke-width' , 0.5 );
  	rays.setAttribute( 'fill' , 'none' );
let txtra	= '';
	rays.setAttribute( 'd', txtra);
	svgEl.appendChild(rays);
	 
let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrl.setAttribute("style","fill:none; stroke-width:0.5");
	cirrl.setAttribute( 'stroke' , '#FFFF00' );
	//svgEl.appendChild(cirrl);
let rstick  = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rstick.setAttribute( 'stroke-width' , 0.5 );
  	rstick.setAttribute( 'stroke' , '#FFFF00' );
  	rstick.setAttribute( 'fill' , 'none' );
let txtst	= '';
	rstick.setAttribute( 'd', txtst);
	svgEl.appendChild(rstick);

// Osculating Circles:	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	//svgEl.appendChild(cir);
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'fill' , 'none' );
let txtl	= '';
	svgEl.appendChild(rline);

/* ============ used in making path ========== */
let px = 0;
let py = 0;
let mx = 0;
let my = 0;
let hx = 0;
let hy = 0;

let qx = 0;
let qy = 0;
let nx = 0;
let ny = 0;
let kx = 0;
let ky = 0;

/* ============== Definition of curve: =========== */

let axratio 	= 1.6;
let RRlast		= 50;
let RR			= RRlast;
let RR_			= - RR
let bb			= RR/axratio;
let bb_			= -bb;
let ee			= RR*sqrt(1 - sqr(1/axratio));
let ee_			= -ee;
let SR			= (RR-bb);

function theCurve(t) {
			const cvx	= RR*cos(t);
			const cvy   = RR/axratio*sin(t);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		return [ -RR*sin(t), RR/axratio*cos(t) ];
		//return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}

/* ============ important globals for curve ============= */
function initialize() {
		RR			= RRlast;
		if (checkboxConst.checked) { RR = 50;}
		if (checkboxAffin.checked) { RR = 90;}
		if (checkboxRoll.checked) { RR = 110;}
		RRlast		= RR;
		RR_			= - RR;
		ee			= RR*sqrt(1 - sqr(1/axratio));
		ee_			= -ee;
		bb			= RR/axratio;
		bb_			= -bb;
		SR			= (RR-bb);
		focr.setAttribute("cx", ee);
		focl.setAttribute("cx", ee_);
		
		if (checkboxConst.checked)
		{	
			focr.setAttribute("cx", ee);
			focl.setAttribute("cx", ee_);
			cirlt.setAttribute("cx", -ee);
			cirlt.setAttribute("r", 2*RR);
			svgEl.appendChild(cirlt);
			achsen.setAttribute('d', txta);
		}
		else if (checkboxAffin.checked)
		{
			focr.setAttribute("cx", ee);
			focl.setAttribute("cx", ee_);
			cirlt.setAttribute("cx", 0);
			cirlt.setAttribute("r", RR);
			svgEl.appendChild(cirlt);
			txtb = txta + 'M'+' '+RR+' '+RR+' '+'L'+' '+RR+' '+RR_+' '+'L'+' '+RR_+' '+RR_+' ';
			txtb = txtb + 'L'+' '+RR_+' '+RR+' '+'L'+' '+RR+' '+RR+' ';
			txtb = txtb + 'M'+' '+RR+' '+bb+' '+'L'+' '+RR_+' '+bb+' ';
			txtb = txtb + 'M'+' '+RR+' '+bb_+' '+'L'+' '+RR_+' '+bb_+' ';
			achsen.setAttribute('d', txtb);
		}
		else if (checkboxRoll.checked)
		{	
			focr.setAttribute("cx", ee);
			focl.setAttribute("cx", ee_);
			achsen.setAttribute('d', txta);
			cirlt.setAttribute("cx", 0);
			cirlt.setAttribute("r", SR);
			svgEl.appendChild(cirlt);
		}
		svgEl.appendChild(focl);
		svgEl.appendChild(focr);
}

		const s0  = 0.0;
		const s1  = 2.0*pi;
		
		const n = 256;
		const ds = (s1 - s0)/n;


let curve 	= [];

function fillCurve() {
		initialize();
		let result = [];
		let t = 0;
		for (let i=0; i<n+1; i++)
		{
		   t = s0 +(s1-s0)*(i/n);
		   result 	= [theCurve(t), dtheCurve(t)];
		curve[i] 	= result;
		}
		makeTXTforpath();
	return curve;
}

function constructionM(j)	{
		ee			= RR*sqrt(1 - sqr(1/axratio));
		const ee_	= -ee;	
		const tt	= s0 + (s1-s0)*(j/n);
		const cx	= theCurve(tt)[0];
		const cy	= theCurve(tt)[1];
		const sc	= 2*RR/sqrt(sqr(cx+ee) + sqr(cy));
		const fx	= sc*(cx+ee)-ee;
		const fy	= sc*cy;
		let tnx		= 8*dtheCurve(tt)[0];
		let tny		= 8*dtheCurve(tt)[1];
		txttn		= 'M'+' '+ee_+' '+'0'+' '+'L'+' '+fx+' '+fy;
		txttn		= txttn + 'L'+' '+ee+' '+'0'+' '+'L'+' '+cx+' '+cy;
		txttn		= txttn + 'l'+' '+tnx+' '+tny;
		tnx = - 2*tnx;	tny = - 2*tny;
		txttn		= txttn + 'l'+' '+tnx+' '+tny;
		tancon.setAttribute( "d", txttn);
}

function constructionA(j)	{
		ee			= RR*sqrt(1 - sqr(1/axratio));
		const ee_	= -ee;
		const bb_	= -bb;		
		const tt	= s0 + (s1-s0)*(j/n);
		const cx	= theCurve(tt)[0];
		const cy	= theCurve(tt)[1];
		const cya	= theCurve(tt)[1]*axratio;
		let RX = 0;  let bx = 0;
		if (cy > 0) { RX = RR_;  bx = bb_;}
		else		{ RX = RR;  bx = bb;}
		txttn		= 'M'+' '+cx+' '+'0'+' '+'L'+' '+cx+' '+cya+' '+'L'+' '+'0'+' '+RX;
		txttn		= txttn + 'M'+' '+'0'+' '+bx+' '+'L'+' '+cx+' '+cy;
		if (abs(cx) > 0.01)
			{const CX	= sqr(RR)/cx;
			 const cy2	= 2*cy;
			 const CX2	= 2*cx - CX;
			 txttn		= txttn + 'M'+' '+CX+' '+'0'+' '+'L'+' '+CX2+' '+cy2;
			 txttn		= txttn + 'M'+' '+CX+' '+'0'+' '+'L'+' '+cx+' '+cya;
			}
		tancon.setAttribute( "d", txttn);
}

function constructionR(j)	{
		const tt	= s0 - (s1-s0)*(j/n);
		const sr	= SR/2;
		const ll	= (RR + bb)/2;
		const mx	= sr*cos(tt);
		const MX	= 2*mx;
		const my	= sr*sin(tt);
		const MY	= 2*my;
		const cx	= mx+ll*cos(tt);
		const cy	= my+ll*sin(-tt);
		let tx 		= -(MY-cy);
		let ty		=  (MX-cx);	
		cirrl.setAttribute("cx", mx);
		cirrl.setAttribute("cy", my);
		cirrl.setAttribute("r", sr);
		svgEl.appendChild(cirrl);
		txtst = 'M'+' '+mx+' '+my+' '+'L'+' '+cx+' '+cy+' '+'L'+' '+MX+' '+MY;
		txtst = txtst +'M'+' '+cx+' '+cy+' '+ 'l'+' '+tx+' '+ty;
		tx	= - tx;  ty	= -ty;
		txtst = txtst +'M'+' '+cx+' '+cy+' '+ 'l'+' '+tx+' '+ty;
		rstick.setAttribute( 'd', txtst);

}

function constructRays()	{
		ee			= RR*sqrt(1 - sqr(1/axratio));
		ee_			= -ee;
		let tt;
		let eex;
		let cx;		let cy;
		txtra		= 'M'+' '+ee+' '+'0';
		for (let i=0; i < 8; i++)
			{   tt	= s0 + ds*(5*n/8 + 8*(i+1));
				cx	= theCurve(tt)[0];
				cy	= theCurve(tt)[1];
				txtra = txtra + 'L'+' '+cx+' '+cy+' '+'L'+' '+ee_+' '+'0';
				cx	= theCurve(tt+ds*4)[0];
				cy	= theCurve(tt+ds*4)[1];
				txtra = txtra + 'L'+' '+cx+' '+cy+' '+'L'+' '+ee+' '+'0';
			}
		
		rays.setAttribute( "d", txtra);
}


/* ============ only called in init() and when changed in CrvtParam()
   curve = CurveByCurvature2D(s0,s1,n,inStp, kappa, c0,v0);    
===================================================================== */


function removeOscCirc()	{
		if ( cir.parentElement)
			{svgEl.removeChild(cir);}
		rline.setAttribute("d", '');
}


function makeOscSvg(j) {
let newRadius = "";
let midX = "";
let midY = "";
function getOscCirc(j) {
		const pos = curve[j][0];
		const tan = curve[j][1];
		const rad = 1/kappa(s0+j*ds);
		const unrml = [-tan[1], tan[0]];
		const mdif  = scalTimesVec1(rad/norm1(unrml), unrml);
		px	= pos[0];  py  = pos[1];
		qx  = (mdif[0]+pos[0]);   qy  = (mdif[1]+pos[1]);
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
	return [abs(rad), mdif[0]+pos[0], mdif[1]+pos[1]];  // not scaled
	}

[newRadius, midX, midY] = getOscCirc(j);

if (abs(midX) + abs(midY) + newRadius < 16000)	
	{
		cir.setAttribute("cx", midX);
		cir.setAttribute("cy", midY);
		cir.setAttribute("r",newRadius);
		svgEl.appendChild(cir);
		rline.setAttribute("d", txtl );
	}
else { removeOscCirc();}

	if (mybackground == "black")			
    		{cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 rline.setAttribute( 'stroke' , '#FFFF00' );}
    else	{cir.setAttribute( 'stroke' , '#0000FF' );
    		 rline.setAttribute( 'stroke' , '#0000FF' );}
} //  make circles with radius -- append in render()


/* ============================================================= */

function makeNormalsSVG() {
		let nrml 	= [];
		let tang	= [];
		let aux		= [];
		let kap		= 0;
		let ptsx	= 0;
		let ptsy	= 0;
		let qtsx	= 0;
		let qtsy	= 0;
		const nn	= 2;
	
			txtn  	= '';
			normal.setAttribute( "d" , '' );
		for (let i = 0;  i < n/nn; i++)	{
			tang	  = curve[nn*i][1];
			aux		  = [- tang[1], tang[0]];
			kap		  = kappa(s0+nn*i*ds);
			if (!(abs(kap) < epsD)) {
				nrml	  = scalTimesVec1(1/kap/norm1(aux), aux);
				ptsx	  = curve[nn*i][0][0];
				ptsy	  = curve[nn*i][0][1];
				qtsx 	  = nrml[0];
				qtsy 	  = nrml[1];
			
				//if (i < 3) {console.log("curve[3] ",curve[3]);}
				txtn 	+= 'M' +ptsx +' '+ptsy +'l'+qtsx +' '+qtsy;
			}
		}
		//console.log("txtn =", txtn);
		normal.setAttribute("d",txtn);
		//console.log("n = ",n);
}



/* =================== makes the Bezier Path ================= */
//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}

function makeTXTforpath()   // theCurve(t)
{
	txt 	= '';
	let t 	= 0;

/* ==================== linear segments only =================== */	
// 	for (let i=0; i<n+1; i++)
//   	{	
// 	 	t = s0 + (s1-s0)*(i/n);
// 	 	px = theCurve(t)[0];
// 	 	py = theCurve(t)[1];
// 	 	if (i == 0)
// 	 			{txt += 'M' +px +' '+py;}
// 	 	else	{txt += 'L' +px +' '+py;}
// 	 }
	 
	txt  = '';
	const ns = 8;  
	for (let i=0; i<n/ns; i++)
	{	
	// left
	px = curve[ns*i][0][0];
	py = curve[ns*i][0][1];
	mx = curve[ns*i][1][0]*ds*ns/3;
	my = curve[ns*i][1][1]*ds*ns/3;
	hx = px + mx;
	hy = py + my;
	// right
	qx = curve[ns*(i+1)][0][0];
	qy = curve[ns*(i+1)][0][1];
	nx = curve[ns*(i+1)][1][0]*ds*ns/3;
	ny = curve[ns*(i+1)][1][1]*ds*ns/3;
	kx = qx - nx;
	ky = qy - ny;
	
	txt += 'M' +px + ' '+ py;
    txt += 'C' +hx + ' '+ hy;
    txt += ' ' +kx + ' '+ ky;
    txt += ' ' +qx + ' '+ qy;
	}
}

let jjc = 0;
let jj1 = 0;
let jj2 = 0;
let jj3 = 0;


function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );	

	 if (checkboxConst.checked)	
	 	{
	 		constructionM(jj1); 
	 		jj1++; if (jj1 == n) {jj1 = 0;}
	 	}
	 else	{tancon.setAttribute( "d", '');
	 		if (!(checkboxAffin.checked)&& !(checkboxRoll.checked))
	 		 	{if (cirlt.parentElement)
	 		 		{svgEl.removeChild(cirlt);}
	 		 	}
	 		}
	 		
	 if (checkboxAffin.checked)
	 	{ constructionA(jj2);
	 	  jj2++; if (jj2 == n) {jj2 = 0;}
	 	}
	 else	{
	 			if (!(checkboxConst.checked)&& !(checkboxRoll.checked))
	 		 	{ if (cirlt.parentElement)
	 		 		{svgEl.removeChild(cirlt);}
	 		 	}
	 		}
	 		
	 if (checkboxRoll.checked)
	 	{ constructionR(jj3);
	 	  jj3++; if (jj3 == n) {jj3 = 0;}
	 	}
	 else	{	if (cirrl.parentElement)
	 		 		{svgEl.removeChild(cirrl);}
	 			rstick.setAttribute('d', '');
	 			if (!(checkboxConst.checked)&& !(checkboxAffin.checked))
	 		 		{if (cirlt.parentElement)
	 		 			{svgEl.removeChild(cirlt);}
	 		 		}
	 		}

	 if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{ removeOscCirc();	}	
	 	
	if (checkboxNormal.checked)			{
			makeNormalsSVG();			}
	else	{ normal.setAttribute( "d", '');
			}
			
	if (checkboxWhisper.checked)			{
			constructRays();			}
	else	{ rays.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;
let loopID3 = 0;
let loopID4 = 0;

const addConstruction = (() => {
    checkboxOsc.checked = false;
    window.clearInterval(loopID1);
    checkboxAffin.checked = false;
    window.clearInterval(loopID3);
    checkboxRoll.checked = false;
    window.clearInterval(loopID4);
    fillCurve();
    
    if ( checkboxConst.checked ) {
    		window.clearInterval(loopID2);
    		loopID2 = window.setInterval(render, 90);
         }
    else { window.clearInterval(loopID2);} 
    });
    
const addAffineMap = (() => {
    checkboxOsc.checked = false;
    window.clearInterval(loopID1);
    checkboxConst.checked = false;
    window.clearInterval(loopID2);
    checkboxRoll.checked = false;
    window.clearInterval(loopID4);
    fillCurve();
    
    if ( checkboxAffin.checked ) {
    		window.clearInterval(loopID3);
    		loopID3 = window.setInterval(render, 90);
         }
    else { window.clearInterval(loopID3);} 
    });
    
const addRolling = (() => {
    checkboxOsc.checked = false;
    window.clearInterval(loopID1);
    checkboxConst.checked = false;
    window.clearInterval(loopID2);
    checkboxAffin.checked = false;
    window.clearInterval(loopID3);
    fillCurve();
    
    if ( checkboxRoll.checked ) {
    		window.clearInterval(loopID4);
    		loopID4 = window.setInterval(render, 90);
         }
    else { window.clearInterval(loopID4);
    		} 
    });

const startStopCircles = (() => {
    checkboxConst.checked = false;
    window.clearInterval(loopID2);
    checkboxAffin.checked = false;
    window.clearInterval(loopID3);
    checkboxRoll.checked = false;
    window.clearInterval(loopID4);
    
    if ( checkboxOsc.checked ) {
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 60);
         }
    else { window.clearInterval(loopID1);} 
    });
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
    	window.clearInterval(loopID1);
		makeNormalsSVG();
        }
    else { //normal.setAttribute( "d", ''); 
    	window.clearInterval(loopID1);
    	} 
    	
    	render();
    	checkboxOsc.checked = false;
    });
    
const addReflectedRays = (() => {
    if ( checkboxWhisper.checked ) {
    	window.clearInterval(loopID1);
    	constructRays();
        }
    else { rays.setAttribute( "d", ''); 
    	window.clearInterval(loopID1);
    	} 
    	
    	render();
    	checkboxOsc.checked = false;
    });
    
const toggleBackground = (() => {
    if ( checkboxBackgrd.checked ) {
         mybackground = "white"; myforeground ="black";}
    else {mybackground = "black"; myforeground ="white"; }; 
    title.style.backgroundColor = mybackground;
    title.style.color = myforeground;
    svgArea.style.backgroundColor = mybackground;
    svgArea.style.color = myforeground;
    mySVG.style.backgroundColor = mybackground;
    mySVG.style.color = myforeground;
    if (mybackground == "black")			
     		{path.setAttribute( 'stroke' , '#FFFFFF' );
     		 achsen.setAttribute( 'stroke' , '#FFFFFF' );
     		 tancon.setAttribute( 'stroke' , '#FFFF00' );
     		 focl.setAttribute( 'stroke' , '#FFFF00' );
     		 focl.setAttribute("style","fill:#FFFF00; stroke-width:0.25");
     		 focr.setAttribute( 'stroke' , '#FFFF00' );
     		 focr.setAttribute("style","fill:#FFFF00; stroke-width:0.25");
     		 cirlt.setAttribute( 'stroke' , '#FFFF00' );
     		 cirrl.setAttribute( 'stroke' , '#FFFF00' );
     		 rstick.setAttribute( 'stroke' , '#FFFF00' );
     		 rays.setAttribute( 'stroke' , '#FF7700' );}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 achsen.setAttribute( 'stroke' , '#000000' );
    		 tancon.setAttribute( 'stroke' , '#0000FF' );
     		 focl.setAttribute( 'stroke' , '#0000FF' );
     		 focl.setAttribute("style","fill:#0000FF; stroke-width:0.25");
     		 focr.setAttribute( 'stroke' , '#0000FF' );
     		 focr.setAttribute("style","fill:#0000FF; stroke-width:0.25");
     		 cirlt.setAttribute( 'stroke' , '#0000FF' );
     		 cirrl.setAttribute( 'stroke' , '#0000FF' );
     		 rstick.setAttribute( 'stroke' , '#0000FF' );
     		 rays.setAttribute( 'stroke' , '#7700FF' );}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
    

inputParamFr.value = axratio;
function getAxRatio() {
		//window.clearInterval(loopID1);
		checkboxOsc.checked = false;
		axratio 	= min(20, max(1, inputParamFr.value));
		inputParamFr.value = axratio;
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		
		render();
}

// inputParamSt.value = yfrequency;
// function getyFrequency() {
// 		//window.clearInterval(loopID1);
// 		checkboxOsc.checked = false;
// 		yfrequency= min(20, max(1, inputParamSt.value));
// 		inputParamSt.value = yfrequency;
// 		fillCurve();
// 		makeTXTforpath();
// 		makeNormalsSVG();
// 		
// 		render();
// }

const init = (() => {
		fillCurve();
		//console.log("curve",curve);
		makeTXTforpath();
		makeNormalsSVG();
		render(); 
		addConstruction();     
});


init();

inputParamFr.addEventListener("change", getAxRatio);
//inputParamSt.addEventListener("change", getyFrequency);
checkboxConst.addEventListener ('change', addConstruction , false);
checkboxAffin.addEventListener ('change', addAffineMap , false);
checkboxRoll.addEventListener ('change', addRolling , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxWhisper.addEventListener ('change', addReflectedRays , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};