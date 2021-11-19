"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -30 -110 220 220");

const inputParamFr		= document.getElementById("param1");
//const inputParamSt		= document.getElementById("param2");
const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxIntersec 	= document.getElementById('checkboxIntersec');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxOsc.checked 	= false;
checkboxConst.checked 	= false;
checkboxNormal.checked 	= false;
checkboxIntersec.checked = true;
checkboxBackgrd.checked = false;
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

let cirfc1 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirfc1.setAttribute("style","fill:yellow; stroke:yellow;");
	cirfc1.setAttribute("cy", 0);
	cirfc1.setAttribute("r",  1);
	svgEl.appendChild(cirfc1);
	
let axes = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	axes.setAttribute( 'stroke' , '#FFFFFF' );
  	axes.setAttribute( 'stroke-width' , 0.5 );
  	axes.setAttribute( 'fill' , 'none' );
let txtax  = 'M'+' '+'0'+' '+'-150'+' '+'L'+' '+'0'+' '+'150'+' ';
	txtax  = txtax+'M'+' '+'0'+' '+'0'+' '+'L'+' '+'-100'+' '+'0';
	axes.setAttribute( "d" , txtax );
	svgEl.appendChild(axes);
	
let direct = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	direct.setAttribute( 'stroke' , '#FFFF00' );
  	direct.setAttribute( 'stroke-width' , 1.0 );
  	direct.setAttribute( 'fill' , 'none' );
let txtdir  = '';
	svgEl.appendChild(direct);
	
let paCon = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	paCon.setAttribute( 'stroke' , '#FFFF00' );
  	paCon.setAttribute( 'stroke-width' , 0.5 );
  	paCon.setAttribute( 'fill' , 'none' );
let txtCon  = '';
	svgEl.appendChild(paCon);
	
// let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
// let rstick  = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
// let txtst	= '';
// let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
// let txttn	= '';
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:0.75");
	svgEl.appendChild(cir);	
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 0.75 );
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

let param 	= 7;

const RR		= 16;
	

function theCurve(t) {
			const cvx	= 1/param*sqr(t);
			const cvy   = t;
		return [cvx, cvy];
	}
function dtheCurve(t) {
		return [ 2/param*t, 1 ];
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
		const s0  = -16;
		const s1  = +16;
		
		const n = 128;
		const ds = (s1 - s0)/n;


let curve 	= [];
let cval 	= [];
let dval	= [];
let fp		= scale*param/4;
let fp_		= -fp;

function fillCurve() {
		let result = [];
		let t 	= 0;
		fp		= scale*param/4;
		cirfc1.setAttribute("cx", fp);
		fp_	   = -fp;
		txtdir = 'M'+' '+fp_+' '+'-150'+' '+'L'+' '+fp_+' '+'150';
		direct.setAttribute( "d" , txtdir );
		
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


function getOscCirc(j) {
		const pos = curve[j][0];
		const tan = curve[j][1];
		const rad = 1/kappa(s0+j*ds);
		const unrml = [-tan[1], tan[0]];
		const mdif  = scalTimesVec1(rad/norm1(unrml), unrml);
		px	= pos[0]*scale;  py  = pos[1]*scale;
		qx  = (mdif[0]+pos[0])*scale;   qy  = (mdif[1]+pos[1])*scale;
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
		
		let tx		= 2*px;
		let ty		= py;
		txtCon 	= 'M'+fp+' '+0+'L'+fp_+' '+py+'L'+px+' '+py+'L'+fp+' '+0;
		px		= -px;	
		txtCon	= txtCon+'L'+px+' '+0+'L'+fp_+' '+py+' '+'M'+px+' '+0;
		px		= -px;
		txtCon	= txtCon+'L'+px+' '+py+' '+'l'+' '+tx+' '+ty;
	return [abs(rad), mdif[0]+pos[0], mdif[1]+pos[1]];  // not scaled
	}

function makeOscSvg(j) {
let newRadius = "";
let midX = "";
let midY = "";

[newRadius, midX, midY] = scalTimesVec1(scale, getOscCirc(j));

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

function makeConstructionSvg(j) {
	let newRadius = "";
	let midX = "";
	let midY = "";
	[midX, midY, newRadius] =  getOscCirc(j);
}

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
			if (checkboxIntersec.checked)
					{ kap	= -0.01;			}
			else	{ kap	= kappa(s0+i*ds);	}
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
}

let jjc = 0;
let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );
		

	 if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{ removeOscCirc();	}	
			  
	if (checkboxConst.checked)	
	 	{	 
	 		makeConstructionSvg(jjr);  
	 		jjr++; if (jjr == n) {jjr = 0;}
			{paCon.setAttribute( "d", txtCon);}
	 	}
	 else	{ paCon.setAttribute( "d", '');	}		  
			  
	 	
	if ((checkboxNormal.checked)||(checkboxIntersec.checked))			{
				if (checkboxNormal.checked) 
						{normal.setAttribute( 'stroke' , '#FF0000' );}
				else	{normal.setAttribute( 'stroke' , '#00AA00' );}
			  	makeNormalsSVG();	
			}
	else	{ 	normal.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;


const startStopCircles = (() => {
    window.clearInterval(loopID2);
    checkboxConst.checked = false;
    if ( checkboxOsc.checked ) {
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 60);
         }
    else { window.clearInterval(loopID1);} 
    });
    
const addConstruction = (() => {
    	window.clearInterval(loopID1);
    	checkboxOsc.checked = false;
    	if ( checkboxConst.checked ) {
    		window.clearInterval(loopID2);
    		loopID2 = window.setInterval(render, 60);
         	}
         else { window.clearInterval(loopID2);	}    	
	});
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
    	window.clearInterval(loopID1);
    	checkboxIntersec.checked = false;
		makeNormalsSVG();
        }
    else { //normal.setAttribute( "d", ''); 
    	window.clearInterval(loopID1);
    	} 
    	
    	render();
    });
    
const intersectNormals = (() => {
    if ( checkboxIntersec.checked ) {
    	window.clearInterval(loopID1);
    	checkboxNormal.checked = false;
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
     		 axes.setAttribute( 'stroke' , '#FFFFFF' );
     		 direct.setAttribute( 'stroke' , '#FFFF00' );
     		 paCon.setAttribute( 'stroke' , '#FFFF00' );
     		 cirfc1.setAttribute("style","fill:yellow; stroke:yellow;");
     		}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 axes.setAttribute( 'stroke' , '#000000' );
    		 direct.setAttribute( 'stroke' , '#0000FF' );
    		 paCon.setAttribute( 'stroke' , '#0000FF' );
    		 cirfc1.setAttribute("style","fill:blue; stroke:blue;");
    		}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
    

inputParamFr.value = param;
function getparam() {
		//window.clearInterval(loopID1);
		checkboxOsc.checked = false;
		param 	= min(20, max(2, inputParamFr.value));
		inputParamFr.value = param;
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
});


init();

inputParamFr.addEventListener("change", getparam);
//inputParamSt.addEventListener("change", getyFrequency);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxConst.addEventListener ('change', addConstruction , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxIntersec.addEventListener ('change', intersectNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};