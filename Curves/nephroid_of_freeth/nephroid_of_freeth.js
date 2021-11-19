"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -160 -160 370 320");

const inputParamFr		= document.getElementById("param1");
//const inputParamSt		= document.getElementById("param2");
//const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
const checkboxInvert 	= document.getElementById('checkboxInvert');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= true;
checkboxBackgrd.checked = false;
checkboxInvert.checked 	= false;
let mybackground     	= "black";
let myforeground     	= "white";


let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 1.0 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	svgEl.appendChild(path);
	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	svgEl.appendChild(normal);

let cirInv 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirInv.setAttribute("style","fill:none; stroke:gray; stroke-width:1");
	cirInv.setAttribute( 'stroke-dasharray', '2');
	
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

let morph 	= 2.0;
const n 	= 256;
const RR	= 5000;
let scale; // scale factor for drawing
let s0    	= 0;
let s1  	= 4*pi;
let ds 		= (s1 - s0)/n;	

		cirInv.setAttribute("cx", 0);
		cirInv.setAttribute("cy", 0);
		cirInv.setAttribute("r",  0);
		svgEl.appendChild(cirInv);

function adaptScale() {
			let res = 55;
			// change globals
			if (checkboxInvert.checked)
			{;}
		return res;
	}

function theCurve(t) {
			const tr	= (1 - morph*sin(t/2))*scale;
			const cvx	= 40+tr*cos(t);
			const cvy   = tr*sin(t);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		const tr	= (1 - morph*sin(t/2))*scale;
		const dtr	= -0.5*morph*cos(t/2)*scale;
		return [-tr*sin(t)+dtr*cos(t), tr*cos(t)+dtr*sin(t) ];
		//return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}

/* ============ This function has to be called before changes: ============= */


let curve 	= [];
let mxyr	= [];
let rad 	= [];

function fillCurve() {
		scale 	= adaptScale();
		let result = [];
		let t;
		for (let i=0; i<n+1; i++)
		{
		   t = s0 +(s1-s0)*(i/n);
		   curve[i] 	= [theCurve(t), dtheCurve(t)];
		   rad[i]		= 1/kappa(t);
		   
		   if (checkboxInvert.checked)   // redefinition
		   	{ 
		   		mxyr[i] 	= invertCircle(RR, getOscCirc1(i));	
		   		curve[i]	= IndIn(RR, curve[i]);
		   		rad[i]		= mxyr[i][2];
			}
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


function getOscCirc1(j) {	//	used in fillCurve() to fill mxyr
		
		if (checkboxInvert.checked)
		{ 
			const pos 	= curve[j][0];
			const px  	= pos[0];  
			const py  	= pos[1];
			const tan 	= curve[j][1];
			const unrml = [-tan[1], tan[0]];
			const rdl 	= 1/kappa(s0+j*ds);
			const mdif  = scalTimesVec1(rdl/norm1(unrml), unrml);
			qx  = (mdif[0]+pos[0]);   qy  = (mdif[1]+pos[1]);	
		return [qx, qy, abs(rdl)];
		}
	}
	
function getOscCirc2(j) {   // used for osculating circles of curve and inverted
		const pos = curve[j][0];
		const tan = curve[j][1];
		const rdl = rad[j]; //1/kappa(s0+j*ds);
		const unrml = [-tan[1], tan[0]];
		const mdif  = scalTimesVec1(rdl/norm1(unrml), unrml);
		px	= pos[0];  py  = pos[1];
		if (!(checkboxInvert.checked)) 
			{ qx  = (mdif[0]+pos[0]);   qy  = (mdif[1]+pos[1]);	}
		else { qx = mxyr[j][0];   qy = mxyr[j][1];	}
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
	return [qx, qy, abs(rdl)]; 
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
	return [mdif[0]+pos[0], mdif[1]+pos[1], abs(rad)];
	}

[midX, midY, newRadius] =  getOscCirc2(j);

if (abs(midX) + abs(midY) + newRadius < 16000)	
	{
		cir.setAttribute("cx", midX);
		cir.setAttribute("cy", midY);
		cir.setAttribute("r",newRadius);
		svgEl.appendChild(cir);
		rline.setAttribute("d", txtl );
	}
else { removeOscCirc();}

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
		for (let i = 0;  i < n; i++)	// {
// 			tang	  = curve[i][1];
// 			aux		  = [- tang[1], tang[0]];
// 			kap		  = kappa(s0+i*ds);
// 			if (!(abs(kap) < epsD)) {
// 				nrml	  = scalTimesVec1(1.0/kap/norm1(aux), aux);
// 				ptsx	  = curve[i][0][0];
// 				ptsy	  = curve[i][0][1];
// 				qtsx 	  = nrml[0];
// 				qtsy 	  = nrml[1];
// 			
// 				//if (i < 3) {console.log("curve[3] ",curve[3]);}
// 				txtn 	+= 'M' +ptsx +' '+ptsy +'l'+qtsx +' '+qtsy;
// 			}
// 		}
		{
				tang	  = curve[i][1];
				aux		  = [- tang[1], tang[0]];
				kap		  = 1/rad[i];
				if (!(abs(kap) < epsD)) {
					ptsx	  = curve[i][0][0];
					ptsy	  = curve[i][0][1];
					if (!(checkboxInvert.checked))	{
						nrml	  = scalTimesVec1(rad[i]/norm1(aux), aux);
						qtsx 	  = nrml[0];
						qtsy 	  = nrml[1];
				//if (i < 3) {console.log("curve[3] ",curve[3]);}
						txtn += 'M' +ptsx +' '+ptsy +'l'+qtsx +' '+qtsy;	
					}
					else	{
				    	qtsx = mxyr[i][0]; 	qtsy = mxyr[i][1];
				    	txtn += 'M' +ptsx +' '+ptsy +'L'+qtsx +' '+qtsy;	
					}
				}
			//console.log("txtn =", txtn);
			normal.setAttribute("d",txtn);
			//console.log("n = ",n);
		}
		
}

//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}




/* =================== makes the Bezier Path ================= */
function makeTXTforpath()   // theCurve(t)
{
	txt 	= '';

/* ==================== linear segments only =================== */	
//	let t 	= 0;
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
	path.setAttribute( "d" , txt );
}

let jjc = 0;
let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}	
	 	}
	 else	{ if (cir.parentElement)
	 			{ svgEl.removeChild(cir);	}
			  rline.setAttribute( "d", '');	}	
	 	
	if (checkboxNormal.checked)			{
			  normal.setAttribute( "d", txtn);  //makeNormalsSVG();	
			}
	else	{ normal.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;


const startStopCircles = (() => {
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
    else { 
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
     	 cirInv.setAttribute("style","fill:none; stroke:gray");
     	 cir.setAttribute( 'stroke' , '#FFFF00' ); 
    	 rline.setAttribute( 'stroke' , '#FFFF00' );	
     	}
    else{path.setAttribute( 'stroke' , '#000000' );
    	 cirInv.setAttribute("style","fill:none; stroke:black");
    	 cir.setAttribute( 'stroke' , '#0000FF' );
    	 rline.setAttribute( 'stroke' , '#0000FF' );
    	}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
    	  
	render();
    });

const toggleInversion = (() => {
    if ( checkboxInvert.checked ) {
         svgEl.setAttribute("viewBox"," -160 -140 370 320");
         cirInv.setAttribute("r", 70);
        }
    else {svgEl.setAttribute("viewBox"," -160 -140 370 320");
    	  cirInv.setAttribute("r", 0); 
    	}
    	
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		
		render(); 
	});

inputParamFr.value = morph;
function getMorphParam() {
		//window.clearInterval(loopID1);
		morph 	= min(2.5, max(0, inputParamFr.value));
		inputParamFr.value = morph;
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		
		render();
}
// 
// inputParamSt.value = yfrequency;
// function getyFrequency() {
// 		//window.clearInterval(loopID1);
// 		checkboxOsc.checked = false;
// 		yfrequency= 1.0*inputParamSt.value;
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
});


init();

inputParamFr.addEventListener("change", getMorphParam);
//inputParamSt.addEventListener("change", getyFrequency);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
checkboxInvert.addEventListener ('change', toggleInversion , false);
};