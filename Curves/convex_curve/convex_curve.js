"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","600");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -130 -110 250 250");

const inputParamFr		= document.getElementById("param1");
const inputParamSt		= document.getElementById("param2");
const checkboxRotate  	= document.getElementById('checkboxRotate');
const checkboxMorph  	= document.getElementById('checkboxMorph');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= true;
checkboxRotate.checked	= false;
checkboxBackgrd.checked = false;
checkboxMorph.checked 	= false;
let mybackground     	= "black";
let myforeground     	= "white";


let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 2.0 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	svgEl.appendChild(path);

let poly = document.createElementNS("http://www.w3.org/2000/svg","polygon");
const ed	= 98;
const polystring = [ed, ed, ed, -ed, -ed, -ed, -ed, ed];
	poly.setAttribute("points", `${(polystring).toString()}`);
    //poly.setAttribute("style", `fill:none;stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);
    poly.setAttribute("style", `fill:none;stroke:gray;stroke-width:3`);
    svgEl.appendChild(poly);
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	svgEl.appendChild(normal);
	
// 
// let cirst	= document.createElementNS("http://www.w3.org/2000/svg","circle");
// let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
// let rstick  = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
// let txtst	= '';
// let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
// let txttn	= '';
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	cir.setAttribute( 'stroke' , '#FFFF00' );
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'fill' , 'none' );
    rline.setAttribute( 'stroke' , '#FFFF00' );
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

let fourier3 	= 2.0;
let fourier5	= 0;

const RR		= 16;
// let rad			= RR/fourier3;
// let strt		= RR - rad;
// let sticklength	= abs(rad)*fourier5;

// function makeStreetCircle(rho) {	
// 	cirst.setAttribute("style","fill:none; stroke-width:1");
// 	if (mybackground == "black")			
//      		{cirst.setAttribute( 'stroke' , '#AFAFAF' );}
//     else	{cirst.setAttribute( 'stroke' , '#0000FF' );}
// 	cirst.setAttribute("cx", 0);
// 	cirst.setAttribute("cy", 0);
// 	cirst.setAttribute("r",rho);
// 	svgEl.appendChild(cirst);
		
// 	cirrl.setAttribute("style","fill:none; stroke-width:1");
// 	if (mybackground == "black")			
//      		{cirrl.setAttribute( 'stroke' , '#AFAFAF' );}
//     else	{cirrl.setAttribute( 'stroke' , '#0000FF' );}
// 	cirrl.setAttribute("cx", 0);
// 	cirrl.setAttribute("cy", 0);
// 	cirrl.setAttribute("r",rho);
// 	svgEl.appendChild(cirrl);
	
// 	rstick.setAttribute("style","fill:none; stroke-width:1");
// 	if (mybackground == "black")			
//      		{rstick.setAttribute( 'stroke' , '#AFAFAF' );}
//     else	{rstick.setAttribute( 'stroke' , '#0000FF' );}
	
// 	tancon.setAttribute("style","fill:none; stroke-width:1");
// 	if (mybackground == "black")			
//      		{tancon.setAttribute( 'stroke' , '#AFAFAF' );}
//     else	{tancon.setAttribute( 'stroke' , '#0000FF' );}
//     tancon.setAttribute( 'stroke-dasharray', '1');
// 	}
	
function supportFct(t) {
		return 16 + fourier3*cos(3*t) + fourier5*cos(5*t);
}

function dsupportFct(t) {
		return  -3*fourier3*sin(3*t) - 5*fourier5*sin(5*t);
}

function d2supportFct(t) {
		return  -9*fourier3*cos(3*t) - 25*fourier5*cos(5*t);
}
let a = 0.5*pi; 	// rotation parameter
let	dfx;
let dfy;
function computeShift(aa) {
				a	= aa;
			dfx 	= (supportFct(a) - supportFct(a+pi))/2;
			dfy 	= (supportFct(a+pi/2) - supportFct(a+3*pi/2))/2;
	}
function theCurve(t) {
			const spt	= supportFct(t+a);
			const dspt	= dsupportFct(t+a);
			const snt	= sin(t);
			const cst	= cos(t);
			const cvx	= (spt)*cst - dspt*snt - dfx;
			const cvy   = (spt)*snt + dspt*cst - dfy;
		return [cvx, cvy];
	}
function dtheCurve(t) {
			const sp	= supportFct(t+a) + d2supportFct(t+a);
		return [-sp*sin(t), +sp*cos(t)];
		//nicht OK für a > 0: return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return 1/(supportFct(t+a) + d2supportFct(t+a));
	//return numCurvature(t, dtheCurve);
}

/* ============ important globals for curve ============= */
function adaptScale() {
			let res = 6;
		return res;
	}

		let scale = adaptScale();// scaling factor for drawing
		const s0  = 0.0;
		const s1  = 2.0*pi;
		
		const n = 128;
		const ds = (s1 - s0)/n;


let curve 	= [];
let cval 	= [];
let dval	= [];

function fillCurve() {
		computeShift(a);
		let result = [];
		let t = 0;
		for (let i=0; i<n+1; i++)
		{
		   t = s0 +(s1-s0)*(i/n);
		   result 	= [theCurve(t), dtheCurve(t)];
		curve[i] 	= result;
		}
	return curve;
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
		px	= pos[0]*scale;  py  = pos[1]*scale;
		qx  = (mdif[0]+pos[0])*scale;   qy  = (mdif[1]+pos[1])*scale;
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
	return [mdif[0]+pos[0], mdif[1]+pos[1], abs(rad)];  // not scaled
	}

[midX, midY, newRadius] = scalTimesVec1(scale, getOscCirc(j));

if (abs(midX) + abs(midY) + newRadius < 16000)	
	{
		cir.setAttribute("cx", midX);
		cir.setAttribute("cy", midY);
		cir.setAttribute("r",newRadius);
		svgEl.appendChild(cir);
		rline.setAttribute("d", txtl );
	}
else { removeOscCirc(); }

}


// function makeRollSvg(j)	{
// 	const tj 	= s0+j*ds;	
// 	const mx 	= scale*RR*cos(tj);
// 	const my 	= scale*RR*sin(tj);
// 	const rho	= abs(scale*rad);
// 	cirrl.setAttribute("r",rho);
// 	cirrl.setAttribute("cx", mx);
// 	cirrl.setAttribute("cy", my);
// 	const qx = scale*theCurve(tj)[0];
// 	const qy = scale*theCurve(tj)[1];    
//     txtst = 'M'+mx+' '+my+ ' L'+qx+' '+qy;
//     rstick.setAttribute("d", txtst );	
// 	const bx 	= scale*strt*cos(tj);
// 	const by 	= scale*strt*sin(tj);
// 	const tx	= qy - by;
// 	const xt	= -tx;
// 	const ty	= bx - qx;
// 	const yt	= -ty;
//     txttn = 'M'+bx+' '+by+ ' L'+qx+' '+qy + 'l'+tx+' '+ty+'M'+qx+' '+qy + 'l'+xt+' '+yt;
//     tancon.setAttribute("d", txttn );
//     svgEl.appendChild(cirrl);
// 	svgEl.appendChild(rstick);
// 	svgEl.appendChild(tancon);
// }

// function removeRollconst()	{
//     		cirst.setAttribute("r","-1");
//     		cirrl.setAttribute("r","-1");
//     		rstick.setAttribute("d",'');
//     		tancon.setAttribute("d",'');
// }
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
			txtn  	= '';
			normal.setAttribute( "d" , '' );
		for (let i = 0;  i < n; i++)	{
			tang	  = curve[i][1];
			aux		  = [- tang[1], tang[0]];
			kap		  = kappa(s0+i*ds);
			if (!(abs(kap) < epsD)&&!(abs(kap) > 1/epsD)) {
				nrml	  = scalTimesVec1(scale/kap/norm1(aux), aux);
				ptsx	  = curve[i][0][0]*scale;
				ptsy	  = curve[i][0][1]*scale;
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

//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}




/* =================== makes the Bezier Path ================= */
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
// 	 	[px,py] = scalTimesVec1(scale, [px,py]);
// 	 	if (i == 0)
// 	 			{txt += 'M' +px +' '+py;}
// 	 	else	{txt += 'L' +px +' '+py;}
// 	 }
	 
	txt  = '';
	const ns = 4;  
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
	// handle scaling:
	[px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky] = scalTimesVec1(scale, [px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky]);			
	
	txt += 'M' +px + ' '+ py;
    txt += 'C' +hx + ' '+ hy;
    txt += ' ' +kx + ' '+ ky;
    txt += ' ' +qx + ' '+ qy;
	}
	path.setAttribute("d",txt);
}

let jjc = 0;
let jjr = 0;
let jjm = 0;
let tm 	= 0;
let tad	= 1;
function render() {

	if (checkboxRotate.checked)	{
	 	computeShift(2*pi*jjr/n);
	 	fillCurve();
		makeTXTforpath();
		makeNormalsSVG();  
	 	jjr++; if (jjr == n) {jjr = 0;}
	 }
	 
	 if ( checkboxMorph.checked ) {
		tm = jjm/20;
		fourier3 = (1-tm)*2;
		fourier5 = tm*0.65;
	 	fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
	 	jjm = jjm+tad; if ((jjm == 20)||(jjm==0)) {tad = -tad;}
	 }

	 if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{ removeOscCirc();	}	
	 	
	if (checkboxNormal.checked)			{
			normal.setAttribute( "d", txtn);
			}
	else	{ normal.setAttribute( "d", '');
			}
			
	path.setAttribute( "d" , txt );

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;
let loopID3 = 0;

const addRotation = (() => {
    window.clearInterval(loopID2);
	if ( checkboxRotate.checked ) {
    		window.clearInterval(loopID1);
    		checkboxOsc.checked = false;
    		removeOscCirc();
    		window.clearInterval(loopID3);
    		checkboxMorph.checked = false;
    		loopID2 = window.setInterval(render, 60);
    	}
    else { ; }
	});
	
const morphSymetries = (() => {
	window.clearInterval(loopID3);
	if ( checkboxMorph.checked ) {
		window.clearInterval(loopID1);
		checkboxOsc.checked = false;
		removeOscCirc();
		window.clearInterval(loopID2);
		checkboxRotate.checked = false;
    	loopID3 = window.setInterval(render, 360);
		}
	else	{;}
	 
	 inputParamFr.value = fourier3;
	 inputParamSt.value = fourier5;	
	 //render();
	});

const startStopCircles = (() => {
    window.clearInterval(loopID1);
    window.clearInterval(loopID2);
    window.clearInterval(loopID3);
    if ( checkboxOsc.checked ) {
    		checkboxRotate.checked 	= false;
    		checkboxMorph.checked	= false;
    		loopID1 = window.setInterval(render, 120);
         }
    else { ;} 
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
     		 cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 rline.setAttribute( 'stroke' , '#FFFF00' );}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 cir.setAttribute( 'stroke' , '#0000FF' );
    		 rline.setAttribute( 'stroke' , '#0000FF' );}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
  

inputParamFr.value = fourier3;
function getFourier3() {
		checkboxOsc.checked = false;
		removeOscCirc();
		fourier3 	= min(2, max(0, inputParamFr.value));
		inputParamFr.value = fourier3;
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		
		render();
}

inputParamSt.value = fourier5;
function getFourier5() {
		checkboxOsc.checked = false;
		removeOscCirc();
		fourier5	= min(1, max(0, inputParamSt.value));
		inputParamSt.value = fourier5;
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		
		render();
}

const init = (() => {
		fillCurve();
		//console.log("curve",curve);
		makeTXTforpath();
		makeNormalsSVG();
		render();      
});


init();

inputParamFr.addEventListener("change", getFourier3);
inputParamSt.addEventListener("change", getFourier5);
checkboxRotate.addEventListener ('change', addRotation , false);
checkboxMorph.addEventListener ('change', morphSymetries , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};