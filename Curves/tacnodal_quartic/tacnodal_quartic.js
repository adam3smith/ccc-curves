"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","600");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -120 -100 220 220");

const inputParam1		= document.getElementById("param1");
//const inputParamSt		= document.getElementById("param2");
//const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
checkboxBackgrd.checked = false;
let mybackground     	= "black";
let myforeground     	= "white";

let path = [];
for (let i = 0; i<13; i++)
	{
	path[i] = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path[i].setAttribute( 'stroke' , '#FFFFFF' );
  	path[i].setAttribute( 'stroke-width' , 0.75 );
  	path[i].setAttribute( 'fill' , 'none' );
	svgEl.appendChild(path[i]);
  	}
  	path[3].setAttribute( 'stroke' , '#FF0000' );
  	path[4].setAttribute( 'stroke' , '#FF0000' );
let txt  = '';
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
  	svgEl.appendChild(normal);
let txtn  	= '';
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	//svgEl.appendChild(cir);
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'fill' , 'none' );
  	svgEl.appendChild(rline);	
let txtl	= '';

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

	
function tacnodal(p) {
		return	(p[1] + 1)*sqr(p[1]) - pow4(p[0]);
	}
	
function gradTacnodal(p)	{
			const gtc	= [];
				gtc[0]	= - 4*cube(p[0]);
				gtc[1]	=  p[1] * (3*p[1] + 2);
		return gtc;
	}
	
function tangTacnodal(p)	{
			const tgtc	= [];
				tgtc[0] = - p[1] * (3*p[1] + 2);
				tgtc[1] = - 4*cube(p[0]);
		return tgtc;
	}
	
 function ddLevel(p) {
			const ddfo 	= [];
				ddfo[0]	= [-12*sqr(p[0]), 0];
				ddfo[1]	= [0, 6*p[1] + 2];
		return ddfo;	
 }	
 
 function kappa(tan0,tan1,p0,p1)	{
 			const n0	= norm1(tan0);
 			const nrm	= [+tan0[1]/n0, -tan0[0]/n0];
 			const n1	= norm1(tan1);
 			const kap	= dotProd1(nrm, linComb1(1/n1, -1/n0, tan1, tan0))/
 						  norm1(vecDif1(p1,p0));
		return kap;
 }

/* ============ important globals for curve ============= */
function adaptScale() {
			let res = 85;
		return res;
	}

const epsQ = 1/1024;
let n	= 192;
let xa 	= 0;
let ya 	= -1;
function makeInitials(choo) {
		n	= 192;
		switch (choo) {
		case 0:
			ya = 1.0; xa = sqrt(sqrt(cube(ya)+sqr(ya))) + 0.05;
			n = 192*6.5;
		break;
		case 1:
			ya = 1.0; xa = sqrt(sqrt(cube(ya)+sqr(ya))) + 0.02;
			n = 192*6;
		break;
		case 2:
			ya = 1.0; xa = sqrt(sqrt(cube(ya)+sqr(ya))) + 0.008;
			n = 192*6;
		break;
		case 3:
			ya = 1.0; xa = sqrt(sqrt(cube(ya)+sqr(ya)));
			n = 192*4.5;
		break;
		case 4:
			xa = 0; ya = -1;
			n = 192*4.5;
		break;
		case 5:
			ya = 1.05; xa = sqrt(sqrt(cube(ya)+sqr(ya))) - 0.02;
			n = 192*3.5;
		break;
		case 6:
			ya = 1.1; xa = sqrt(sqrt(cube(ya)+sqr(ya))) - 0.05;
			n = 192*3;
		break;
		case 7:
			ya = 1.2; xa = sqrt(sqrt(cube(ya)+sqr(ya))) - 0.08;
			n = 192*3;
		break;
		case 8:
			ya = 1.3; xa = sqrt(sqrt(cube(ya)+sqr(ya))) - 0.12;
			n = 192*3;
		break;
		case 9:
			xa = 0; ya = -0.95;
			n = 192*3.5;
		break;
		case 10:
			xa = 0; ya = -0.88;
			n = 192*3;
		break;
		case 11:
			xa = 0; ya = -0.8;
			n = 192*2;
		break;
		case 12:
			xa = 0; ya = -0.70;
			n = 192*1.5;
		break;
		} 		
	}
		
		const ns = 8; 
		let ds 	 = 1/128;

let choose	= 0;
let scale	= 1;
let step	= [];
let curve 	= [];
let cval 	= [];
let dval	= [];
let start	= [xa,ya];
let v0		= tacnodal(start);
let nextP	= [];
let v1		= 0;
let n0		= 0;
let t1		= [];
function fillCurve() {
		scale 	= adaptScale();
		makeInitials(choose);
		start	= [xa,ya];
		v0		= tacnodal(start);
		//console.log("start = ", start);
		for (let i=0; i<n+1; i++)
		{ 
			t1		= tangTacnodal(start);
			n0		= norm1(t1);
			if (n0 < epsD*16) {t1 = [-epsD*16, 0]; n0 = epsD*16;}
		    ds		= 1/max(1/1024, n0)/64/3;
		curve[i] 	= [start, t1 ];
		step[i]		= ds;
			nextP 	= LevelODEt2(ds/2, start, tangTacnodal, ddLevel);
			nextP 	= LevelODEt2(ds/2, nextP, tangTacnodal, ddLevel);
			if (n0 > epsQ) {
			v1 = tacnodal(nextP);  // This Newton step improves accuracy
			t1 = gradTacnodal(nextP);
			nextP = linComb1(1,(v0-v1)/dotProd1(t1,t1)  , nextP,t1); 	}
			//if (i==100){console.log("start, nextP = ",start, nextP,v0,tacnodal(nextP));}
			start = nextP;
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
		// const rad = norm1(vecDif1(curve[j+1][0],curve[j][0])) /
// 					norm1(vecDif1(curve[j+1][1],curve[j][1]));
		let rad = 1/kappa(curve[j][1], curve[j+1][1],  curve[j][0], curve[j+1][0]); 
		const unrml = [+tan[1], -tan[0]];
		const mdif  = scalTimesVec1(rad/norm1(unrml), unrml);
		px	= pos[0]*scale;  py  = -pos[1]*scale;
		qx  = (mdif[0]+pos[0])*scale;   qy  = -(mdif[1]+pos[1])*scale;
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
		if (norm1(pos) < epsD) {rad = epsD}
	return [abs(rad), mdif[0]+pos[0], -(mdif[1]+pos[1])];  // not scaled
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
else { removeOscCirc();	}

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
		const fc	= 4;
			txtn  	= '';
			normal.setAttribute( "d" , '' );
		for (let i = 0;  i < n/fc-1; i++)	{
			tang	= curve[fc*i][1];
			aux		= [ tang[1], -tang[0]];
			kap		= kappa(curve[fc*i][1], curve[fc*i+1][1],  curve[fc*i][0], curve[fc*i+1][0]); 
			if (!(abs(kap) < epsD)) {
				nrml	  = scalTimesVec1(scale/kap/norm1(aux), aux);
				ptsx	  = curve[fc*i][0][0]*scale;
				ptsy	  = -curve[fc*i][0][1]*scale;
				qtsx 	  = nrml[0];
				qtsy 	  = -nrml[1];
			
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
	let ds	= step[0];
/* ==================== linear segments only =================== */	
// 	for (let i=0; i<n+1; i++)
//   	{	
// 	 	px = curve[i][0][0];
// 	 	py = curve[i][0][1];
// 	 	[px,py] = scalTimesVec1(scale, [px,py]);
// 	 	if (i == 0)
// 	 			{txt += 'M' +px +' '+py;}
// 	 	else	{txt += 'L' +px +' '+py;}
// 	 }
	// console.log("txt = ",txt);
	 
 
	for (let i=0; i<n/ns; i++)
	{
	ds = step[ns*i];	
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
	[py,hy,ky,qy] = scalTimesVec1(-1, [py,hy,ky,qy]);
	txt += 'M' +px + ' '+ py;
    txt += 'C' +hx + ' '+ hy;
    txt += ' ' +kx + ' '+ ky;
    txt += ' ' +qx + ' '+ qy;
	}
	path[choose].setAttribute( "d" , txt );	
}

let jjc = 0;
//let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	

	if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n-1) {jjc = 0;}
	 	}
	else	{ removeOscCirc();	}	
	 	
	if (checkboxNormal.checked)			{
			normal.setAttribute( "d", txtn);
			}
	else	{ normal.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;


const startStopCircles = (() => {
    jjc = 0;
    if ( checkboxOsc.checked ) {
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 30);
         }
    else { window.clearInterval(loopID1);} 
    });
    
const addRemoveNormals = (() => {
    window.clearInterval(loopID1);
    if ( checkboxNormal.checked ) {
		 makeNormalsSVG();
        }
    else { 	normal.setAttribute( "d", ''); 
    		checkboxOsc.checked = false;} 
    	
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
    
    for (let i=0; i<13; i++)
    {
    	if (mybackground == "black")			
     		 {path[i].setAttribute( 'stroke' , '#FFFFFF' );	}
    	else {path[i].setAttribute( 'stroke' , '#000000' );	}
    }
    		path[3].setAttribute( 'stroke' , '#FF0000' );
  			path[4].setAttribute( 'stroke' , '#FF0000' );
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
    
// 
inputParam1.value = choose;
function getLevel() {
		//window.clearInterval(loopID1);
		checkboxOsc.checked = false;
		choose 	= min(12, max(0, inputParam1.value));
		inputParam1.value = choose;
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		for (let i = 0; i < 13; i++)
			{path[i].setAttribute( 'stroke-width' , 0.75 );}
		path[choose].setAttribute( 'stroke-width' , 1.5 );
		if (choose == 3) {path[4].setAttribute( 'stroke-width' , 1.5 );}
		if (choose == 4) {path[3].setAttribute( 'stroke-width' , 1.5 );}
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
		for (let i = 0; i < 13; i++)	{
		choose = i;
		fillCurve();
		makeTXTforpath();
		}
		choose = 4;
		fillCurve();
		makeTXTforpath();
		inputParam1.value = choose;
		path[choose].setAttribute( 'stroke-width' , 1.5 );
		if (choose == 3) {path[4].setAttribute( 'stroke-width' , 1.5 );}
		if (choose == 4) {path[3].setAttribute( 'stroke-width' , 1.5 );}
		
		render();      
});


init();

inputParam1.addEventListener("change", getLevel);
// inputParamSt.addEventListener("change", getyFrequency);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};