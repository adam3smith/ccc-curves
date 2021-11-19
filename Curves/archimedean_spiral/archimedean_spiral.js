"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","600");
svgEl.setAttribute("height","600");

let scaleFactor	= 1.0;
function setViewBox(boxL,boxT,boxW,boxH, theScale)	{
boxL = boxL*theScale;
boxT = boxT*theScale;
boxW = boxW*theScale;
boxH = boxH*theScale;
svgEl.setAttribute("viewBox",`${(boxL).toString()} ${(boxT).toString()} ${(boxW).toString()} ${(boxH).toString()}`);
}
setViewBox(-170, -170, 400, 400, scaleFactor);

function resetAllStrokeWidths(theScale) {
		path.setAttribute(  'stroke-width' , `${(1*scaleFactor).toString()}` );
		normal.setAttribute('stroke-width' , `${(0.5*scaleFactor).toString()}` );
		cir.setAttribute("style",`fill:none; stroke-width:${(1*scaleFactor).toString()}`);
		rline.setAttribute( 'stroke-width' , `${(1*scaleFactor).toString()}` );
}

const inputParamFr		= document.getElementById("param1");
const inputParamSt		= document.getElementById("param2");
	 inputParamSt.value = log(scaleFactor);
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
const checkboxInvert 	= document.getElementById('checkboxInvert');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
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
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style",`fill:none; stroke-width:1`);
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
/* ============ important globals for curve ============= */

let exponent 		= 2.0;
inputParamFr.value 	= exponent;	
const RR			= 400;   // for inversion
const n 			= 256;

		let s0  	= 0.5*pow6(exponent/2 - 1/40);
		const s1	= sqrt(27);
		let ds 		= (s1 - s0)/n;


function nrmlz()	{
			let nf = max(150/exp(2*exponent*log(s1)),0.25);
			if (checkboxInvert.checked) {
				nf	= 200/exp(2*exponent*abs(log(s0)))}
		return nf;
}		
let nrmlzV	= 1;
function theCurve(t) {
			const tt	= sqr(t-s0/2);
			const thx	= exp(exponent * log(tt)) * nrmlzV; // t^exponent
			const cvx	= thx * cos(tt);
			const cvy   = thx * sin(tt);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		//return [ 0,1 ];
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}


let curve 	= [];
let mxyr	= [];
let rad 	= [];

function fillCurve() {
			let newRadius = "";
			let midX = "";
			let midY = "";
			let lxyr = [];
		//s0 	= (exponent + 1/8)/16;
		//ds 	= (s1 - s0)/n;
		// The next two handle scaling	
		nrmlzV 	= nrmlz();  
		resetAllStrokeWidths(scaleFactor);
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
}

/* ============ only called in init() and when changed in CrvtParam()
   curve = CurveByCurvature2D(s0,s1,n,inStp, kappa, c0,v0);    
===================================================================== */

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
		let newRadius;
		let midX;
		let midY;
		[midX, midY, newRadius] = scalTimesVec1(1, getOscCirc2(j));	

	if (abs(midX) + abs(midY) + newRadius < 16000)	
	{
		cir.setAttribute("cx", midX);
		cir.setAttribute("cy", midY);
		cir.setAttribute("r",newRadius);
		svgEl.appendChild(cir);
		rline.setAttribute("d", txtl );
	}
	else { if (cir.parentElement)
			{ svgEl.removeChild(cir);	}
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
			kap		  = 1/rad[i];
			if (!(abs(kap) < epsD)) {
				ptsx	  = curve[i][0][0];
				ptsy	  = curve[i][0][1];
				if (!(checkboxInvert.checked))	{
					nrml	  = scalTimesVec1(rad[i]/norm1(aux), aux);
					qtsx 	  = nrml[0];
					qtsy 	  = nrml[1];
				//if (i < 3) {console.log("curve[3] ",curve[3]);}
					txtn += 'M' +ptsx +' '+ptsy +'l'+qtsx +' '+qtsy;	}
				else	{
				    qtsx = mxyr[i][0]; 	qtsy = mxyr[i][1];
				    txtn += 'M' +ptsx +' '+ptsy +'L'+qtsx +' '+qtsy;	
						}
			}
		}
		//console.log("txtn =", txtn);
		normal.setAttribute("d",txtn);
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
// let t 	= 0;
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
let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );

	 if (checkboxOsc.checked)	
	 	{
	 		fillCurve();
	 		makeOscSvg(jjc);
	 		resetAllStrokeWidths(scaleFactor);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{ ;	}	
	 	
	if (checkboxNormal.checked)			{
			makeNormalsSVG();	
			}
	else	{ normal.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;


const startStopCircles = (() => {
    resetAllStrokeWidths(scaleFactor);
    if ( checkboxOsc.checked ) {
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 60);
         }
    else { window.clearInterval(loopID1);
    		} 
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
    

const showInverted = (() => {
    window.clearInterval(loopID1);   	
		fillCurve();
		makeTXTforpath();
    if (!(checkboxOsc.checked))	{
    	if (cir.parentElement)
	        {svgEl.removeChild(cir);}	
		rline.setAttribute( "d", '');
	} 
    	
    	render();
    });    

function getMorphParam() {
		exponent 	= min(2, max(0, inputParamFr.value));
		inputParamFr.value 	= exponent;
		if (!(checkboxOsc.checked))	{
    		if (cir.parentElement)
	        	{svgEl.removeChild(cir);}	
			rline.setAttribute( "d", '');
		} 
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		
		render();
}

function getScaleFactor() {
		//window.clearInterval(loopID1);
		checkboxOsc.checked = false;
		const val 	= min(+4, max(-4, inputParamSt.value));
		inputParamSt.value = val;
		scaleFactor	= exp(inputParamSt.value);
		setViewBox(-170, -150, 400, 400, scaleFactor);
		resetAllStrokeWidths(scaleFactor);
		
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

inputParamFr.addEventListener("change", getMorphParam);
inputParamSt.addEventListener("change", getScaleFactor);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
checkboxInvert.addEventListener ('change', showInverted , false);
};