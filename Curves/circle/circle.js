"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -150 -110 220 220");

//const inputParamFr		= document.getElementById("param1");
//const inputParamSt		= document.getElementById("param2");
const checkboxThread  	= document.getElementById('checkboxThread');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxThread.checked	= true;
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
checkboxBackgrd.checked = false;
let mybackground     	= "black";
let myforeground     	= "white";


let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 1.5 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	path.setAttribute( 'd', txt);
	svgEl.appendChild(path);
	
let path2 = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path2.setAttribute( 'stroke' , '#FFFFFF' );
  	path2.setAttribute( 'stroke-width' , 0.5 );
  	path2.setAttribute( 'fill' , 'none' );
let txtp2  = '';
	path.setAttribute( 'd', txtp2);
	svgEl.appendChild(path2);
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	svgEl.appendChild(normal);


let cirf 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirf.setAttribute("style","fill:none; stroke-width:1.25");
	cirf.setAttribute( 'stroke' , '#FFFF00' );
	cirf.setAttribute("cx", 0);
	cirf.setAttribute("cy", 0);
	svgEl.appendChild(cirf);  // never erased
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	//svgEl.appendChild(cir);
let rline 	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
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

const RR		= 5;
let xfrequency 	= 3;
let yfrequency	= 4;
let choose 		= 0;
	
function theCurve(t) {
			const cvx	= RR*(cos(t) + t*sin(t));
			const cvy   = RR*(sin(t) - t*cos(t));
		return [cvx, cvy];
	}
function dtheCurve(t) {
		return [ RR*t*cos(t), RR*t*sin(t) ];
		//return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}

/* ============ important globals for curve ============= */
function adaptScale() {
			let res = 6;
		return res;
	}

		let scale = adaptScale();// scaling factor for drawing
		const s0  = 0.0;
		const s1  = 2.0*pi;
		
		const n  = 96;
		const ds = (s1 - s0)/n;
		const ns = 8;

		cirf.setAttribute("r",scale*RR);	

let curve 	= [];
let curve2	= [];

function fillCurve() {
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
	return [abs(rad), mdif[0]+pos[0], mdif[1]+pos[1]];  // not scaled
	}

[newRadius, midX, midY] = scalTimesVec1(scale, getOscCirc(j));

	if (abs(midX) + abs(midY) + newRadius < 16000)	
		{
			cir.setAttribute("cx", midX);
			cir.setAttribute("cy", midY);
			cir.setAttribute("r",newRadius);
			svgEl.appendChild(cir);
			rline.setAttribute("d", txtl );
		}
	else { 	removeOscCirc();}

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
			txtn  	= '';
			normal.setAttribute( "d" , '' );
		for (let i = 0;  i < n; i++)	{
			tang	  = curve[i][1];
			aux		  = [- tang[1], tang[0]];
			kap		  = kappa(s0+i*ds);
			if (!(abs(kap) < epsD)) {
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

function rotateCurve(ang, ctCurv)	{
			const cosa 	= cos(ang);
			const sina 	= sin(ang);
			let rsCurv	= [];
			for (let i=0; i < ctCurv.length; i++)
				{	rsCurv[i] = [];
				}
			for (let i=0; i < ctCurv.length; i++)
			{rsCurv[i][0] = [cosa * ctCurv[i][0][0] - sina * ctCurv[i][0][1],
							 sina * ctCurv[i][0][0] + cosa * ctCurv[i][0][1] ];
			 rsCurv[i][1] = [cosa * ctCurv[i][1][0] - sina * ctCurv[i][1][1],
							 sina * ctCurv[i][1][0] + cosa * ctCurv[i][1][1] ];
			}
		return rsCurv;
	}


/* =================== makes the Bezier Path ================= */
function makeTXTforpath(acurve)   // theCurve(t)
{
	let atxt 	= '';
	let t 		= 0;

/* ==================== linear segments only =================== */	
// 	for (let i=0; i<n+1; i++)
//   	{	
// 	 	t = s0 + (s1-s0)*(i/n);
// 	 	px = theCurve(t)[0];
// 	 	py = theCurve(t)[1];
// 	 	[px,py] = scalTimesVec1(scale, [px,py]);
// 	 	if (i == 0)
// 	 			{atxt += 'M' +px +' '+py;}
// 	 	else	{atxt += 'L' +px +' '+py;}
// 	 }
	 
 
	for (let i=0; i<n/ns; i++)
	{	
	// left
	px = acurve[ns*i][0][0];
	py = acurve[ns*i][0][1];
	mx = acurve[ns*i][1][0]*ds*ns/3;
	my = acurve[ns*i][1][1]*ds*ns/3;
	hx = px + mx;
	hy = py + my;
	// right
	qx = acurve[ns*(i+1)][0][0];
	qy = acurve[ns*(i+1)][0][1];
	nx = acurve[ns*(i+1)][1][0]*ds*ns/3;
	ny = acurve[ns*(i+1)][1][1]*ds*ns/3;
	kx = qx - nx;
	ky = qy - ny;
	// handle scaling:
	[px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky] = scalTimesVec1(scale, [px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky]);			
	
	atxt += 'M' +px + ' '+ py;
    atxt += 'C' +hx + ' '+ hy;
    atxt += ' ' +kx + ' '+ ky;
    atxt += ' ' +qx + ' '+ qy;
	}
	return atxt;
}

/* ============================================ */

let jjc = 0;
let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );
	path2.setAttribute( "d" , txtp2 );
	
	if ((checkboxOsc.checked)||(checkboxThread.checked))	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{ removeOscCirc();	}
			  
if (checkboxThread.checked)	
	 	{
	 		path2.setAttribute( "d" , '' );
	 		cir.setAttribute('stroke', 'none');  
	 	}
	 	else {;}


	if (checkboxNormal.checked)			{
			makeNormalsSVG();			}
	else	{ normal.setAttribute( "d", '');
			}		


div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID0 = 0;
let loopID1 = 0;
let loopID2 = 0;

const oneThreadOnly = (() => {
	window.clearInterval(loopID1);
	window.clearInterval(loopID2);
	path2.setAttribute( "d" , '' );
    if ( checkboxThread.checked ) {
			checkboxNormal.checked 	= false;
			checkboxOsc.checked 	= false;
    		loopID2 = window.setInterval(render, 60);
		}
	else { ; }
	}); 

const startStopCircles = (() => {
    window.clearInterval(loopID2);
    window.clearInterval(loopID1);
    checkboxThread.checked = false;
    if ( checkboxOsc.checked ) {
    		loopID1 = window.setInterval(render, 60);
         }
    else {;} 
    });
    
const addRemoveNormals = (() => {
    	window.clearInterval(loopID2); 
    	window.clearInterval(loopID1);
    	checkboxThread.checked = false;
    if ( checkboxNormal.checked ) {
		makeNormalsSVG();
        }
    else { ;
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
     		 path2.setAttribute( 'stroke' , '#FFFFFF' );
     		 cirf.setAttribute( 'stroke' , '#FFFF00' );}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 path2.setAttribute( 'stroke' , '#000000' );
    		 cirf.setAttribute( 'stroke' , '#0000FF' );}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
    
// 
// inputParamFr.value = xfrequency;
// function getxFrequency() {
// 		//window.clearInterval(loopID1);
// 		checkboxOsc.checked = false;
// 		xfrequency 	= min(20, max(0, inputParamFr.value));
// 		inputParamFr.value = xfrequency;
// 		fillCurve();
// 		txt = makeTXTforpath(curve);
// 		makeNormalsSVG();
// 		
// 		render();
// }
// 
// inputParamSt.value = yfrequency;
// function getyFrequency() {
// 		//window.clearInterval(loopID1);
// 		checkboxOsc.checked = false;
// 		yfrequency= min(20, max(1, inputParamSt.value));
// 		inputParamSt.value = yfrequency;
// 		fillCurve();
// 		txt = makeTXTforpath(curve);
// 		makeNormalsSVG();
// 		
// 		render();
// }

const init = (() => {
		
		fillCurve();
		curve2 	= rotateCurve(2*pi/8, curve);
		txt 	= makeTXTforpath(curve);
		txtp2	= makeTXTforpath(curve2);
		for (let i=0; i<6; i++)	{
			curve2 	= rotateCurve(2*pi/8, curve2);
			txtp2	= txtp2+makeTXTforpath(curve2);
		}
		makeNormalsSVG();
		render();
		checkboxThread.checked = true;
		checkboxOsc.checked = true;
		oneThreadOnly();      
});


init();

//inputParamFr.addEventListener("change", getxFrequency);
//inputParamSt.addEventListener("change", getyFrequency);
checkboxThread.addEventListener ('change', oneThreadOnly, false);
checkboxOsc.addEventListener ('change', startStopCircles, false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};