"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," 0 -110 240 200");

const inputParamFr		= document.getElementById("param1");
const inputParamSt		= document.getElementById("param2");
//const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
const checkboxTaylor 	= document.getElementById('checkboxTaylor');
const checkboxTriple 	= document.getElementById('checkboxTriple');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
checkboxBackgrd.checked = false;
checkboxTaylor.checked	= false;
checkboxTriple.checked	= false;
let mybackground     	= "black";
let myforeground     	= "white";

let path = [];
function setPathAttributes() {
for (let i = 0; i < 5; i++)
	{
	path[i] = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path[i].setAttribute( 'stroke' , '#FFFFFF' );
  	if (i>0)
  		{path[i].setAttribute( 'stroke-width' , 0.5 );}
  	else
  		{path[0].setAttribute( 'stroke-width' , 1.0 );}
  	path[i].setAttribute( 'fill' , 'none' );
	svgEl.appendChild(path[i]);
  	}
  	}
let txt  	= '';
let choose	= 0;

let xaxis = document.createElementNS( "http://www.w3.org/2000/svg", "line" );
	xaxis.setAttribute("style","fill:none; stroke:yellow; stroke-width:0.5");
	xaxis.setAttribute("x1", -5);
	xaxis.setAttribute("y1", 0);
	xaxis.setAttribute("x2", 300);
	xaxis.setAttribute("y2", 0);
	svgEl.appendChild(xaxis);

let yaxis = document.createElementNS( "http://www.w3.org/2000/svg", "line" );
	yaxis.setAttribute("style","fill:none; stroke:yellow; stroke-width:0.5");
	yaxis.setAttribute("x1", 0);
	yaxis.setAttribute("y1", -100);
	yaxis.setAttribute("x2", 0);
	yaxis.setAttribute("y2", 100);
	svgEl.appendChild(yaxis);
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
  	svgEl.appendChild(normal);
let txtn  	= '';
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	cir.setAttribute( 'stroke' , '#FFFF00' ); 
	//svgEl.appendChild(cir);	
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
    rline.setAttribute( 'stroke' , '#FFFF00' );
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

// let xfrequency 	= 3;
// let yfrequency	= 4;

const RR		= 16;
	

function theCurve(t) {
			const cvx	= t;
			const cvy   = -sin(t);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		return [ 1, -cos(t) ];
		//return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}

/* --------------- Approximations of sine --------------------*/
function T1sine(t) 	{return [t, -t];}
function dT1sine(t)	{return [1, -1];}
function T3sine(t) 	{return [t, -t*(1 - t*t/6)];}
function dT3sine(t) {return [1, -1 + t*t/2];}
function T5sine(t) 	{return [t, -t*(1 - t*t/6*(1-t*t/20))];}
function dT5sine(t) {return [1, -1 + t*t/2*(1-t*t/12)];}
function T7sine(t) 	{const t2 = sqr(t); return [t, -t*(1 - t2/6*(1-t2/20*(1-t2/42)))];}
function dT7sine(t) {const t2 = sqr(t); return [1, -1 + t2/2*(1-t2/12*(1-t2/30))];}
function P3sine(x)	{return (3*x - 4*cube(x));}
function dP3sine(x)	{return (3 - 12*sqr(x));}
function gd5sine(t)	{return [t, P3sine(P3sine(T5sine(t/9)[1]))];}
function dgd5sine(t){return [1, dP3sine(P3sine(T5sine(t/9)[1]))*dP3sine(T5sine(t/9)[1])*dT5sine(t/9)[1]/9];}
function gd7sine(t)	{return [t, P3sine(T7sine(t/3)[1])];}
function dgd7sine(t){return [1, dP3sine(T7sine(t/3)[1])*dT7sine(t/3)[1]/3];}


function curCurve(t) {
		let result = 0;
		switch (choose) {
		case 0:
			result = theCurve(t);
		break;
		case 1:
			result = T5sine(t);
		break;
		case 2:
			result = T7sine(t);
		break;
		case 3:
			result = gd5sine(t);
		break;
		case 4:
			result = gd7sine(t);
		break;
		}
	return result;
}

function dcurCurve(t) {
		let result = 0;
		switch (choose) {
		case 0:
			result = dtheCurve(t);
		break;
		case 1:
			result = dT5sine(t);
		break;
		case 2:
			result = dT7sine(t);
		break;
		case 3:
			result = dgd5sine(t);
		break;
		case 4:
			result = dgd7sine(t);
		break;
		}
	return result;
}

function kappa(t) {
	return numCurvature(t, dcurCurve);
}

/* ============ important globals for curve ============= */
function adaptScale() {
			let res = 24;
		return res;
	}

		let scale = adaptScale();// scaling factor for drawing
		const s0  = 0.0;
		const s1  = 3.0*pi;
		
		const n = 128;
		const ds = (s1 - s0)/n;


let curve 	= [];
let cval 	= [];
let dval	= [];

function fillCurve(curCurve,dcurCurve) {
		let result = [];
		scale = adaptScale();
		let t = 0;
		for (let i=0; i<n+1; i++)
		{
		   t = s0 +(s1-s0)*(i/n);
		   result 	= [curCurve(t), dcurCurve(t)];
		curve[i] 	= result;
		}
	return curve;
}

/* ============ only called in init() and when changed in CrvtParam()
   curve = CurveByCurvature2D(s0,s1,n,inStp, kappa, c0,v0);    
===================================================================== */

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
else { 	if (cir.parentElement)
	 			{svgEl.removeChild(cir);}
		rline.setAttribute("d", '');}

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
	path[choose].setAttribute( "d" , txt );
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
	// handle scaling:
	[px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky] = scalTimesVec1(scale, [px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky]);			
	
	txt += 'M' +px + ' '+ py;
    txt += 'C' +hx + ' '+ hy;
    txt += ' ' +kx + ' '+ ky;
    txt += ' ' +qx + ' '+ qy;
	}
	path[choose].setAttribute( "d" , txt );
}

let ch = choose;
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
	 			{svgEl.removeChild(cir);}
			  rline.setAttribute( "d", '');	}	
	 	
	if (checkboxNormal.checked)			{
			normal.setAttribute( "d", txtn);			
			}
	else	{ normal.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
//let loopID2 = 0;


const startStopCircles = (() => {
    window.clearInterval(loopID1);
    if ( checkboxOsc.checked ) {
    		loopID1 = window.setInterval(render, 60);
         }
    else { ;} 
    });
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
		makeNormalsSVG();
        }
    else { ;
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
     		{	for (let i=0; i<5; i++) {
     				path[i].setAttribute( 'stroke' , '#FFFFFF' ); }
     			path[3].setAttribute( 'stroke' , '#000000' );
     			cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 	rline.setAttribute( 'stroke' , '#FFFF00' );
     			xaxis.setAttribute("style", "stroke:yellow; stroke-width:0.5" );
     			yaxis.setAttribute("style", "stroke:yellow; stroke-width:0.5" );}
    else	{	for (let i=0; i<5; i++) {
     				path[i].setAttribute( 'stroke' , '#000000' ); }
     			path[3].setAttribute( 'stroke' , '#FFFFFF' );
     			cir.setAttribute( 'stroke' , '#0000FF' );
    		 	rline.setAttribute( 'stroke' , '#0000FF' );
     			xaxis.setAttribute("style", "stroke:blue; stroke-width:0.5"  );
     			yaxis.setAttribute("style", "stroke:blue; stroke-width:0.5"  );}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
    
const addTaylor5_7 = (() => {
		window.clearInterval(loopID1);
		checkboxOsc.checked 	= false;
		checkboxNormal.checked	= false;
		if (checkboxTaylor.checked)
		{
			choose = 1;
			fillCurve(curCurve,dcurCurve);
 			makeTXTforpath();
 			choose = 2;
			fillCurve(curCurve,dcurCurve);
 			makeTXTforpath();
 			choose = 0;
			fillCurve(curCurve,dcurCurve);
 			makeTXTforpath();
 		}
 		else
 		{	path[1].setAttribute( "d", '' );
 			path[2].setAttribute( "d", '' );
 		}
		
	render();
	});
	
const addTripleTaylor = (() => {
		window.clearInterval(loopID1);
		checkboxOsc.checked 	= false;
		checkboxNormal.checked	= false;
		if (checkboxTriple.checked)
		{
 			choose = 3;
 			
			fillCurve(curCurve,dcurCurve);
 			makeTXTforpath();
 		}
 		else
 		{	path[3].setAttribute( "d", '' );
 			choose = 0;
			fillCurve(curCurve,dcurCurve);
 			makeTXTforpath();
 		}
		
	render();
	});
    
// 
// inputParamFr.value = xfrequency;
// function getxFrequency() {
// 		//window.clearInterval(loopID1);
// 		checkboxOsc.checked = false;
// 		xfrequency 	= min(20, max(1, inputParamFr.value));
// 		inputParamFr.value = xfrequency;
// 		fillCurve();
// 		makeTXTforpath();
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
// 		makeTXTforpath();
// 		makeNormalsSVG();
// 		
// 		render();
// }

const init = (() => {
		choose = 0;
		setPathAttributes();
		fillCurve(curCurve,dcurCurve);
		//console.log("curve",curve);
		makeTXTforpath();
		makeNormalsSVG();
		render();      
});


init();

// inputParamFr.addEventListener("change", getxFrequency);
// inputParamSt.addEventListener("change", getyFrequency);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
checkboxTaylor.addEventListener ('change', addTaylor5_7 , false);
checkboxTriple.addEventListener ('change', addTripleTaylor , false);
};