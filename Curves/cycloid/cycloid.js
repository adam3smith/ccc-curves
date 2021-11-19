"use strict"
window.onload=function(){ 

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -100 -100 220 220");

const inputParamFr		= document.getElementById("param1");
//const inputParamSt		= document.getElementById("param2");
const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxRand		= document.getElementById('checkboxRand');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxConst.checked	= false;
checkboxRand.checked	= false;
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
checkboxBackgrd.checked = false;
let mybackground     	= "black";
let myforeground     	= "white";


let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 1.0 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	path.setAttribute( 'd', txt);
	svgEl.appendChild(path);
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	svgEl.appendChild(normal);

// Rolling Construction
let street = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	street.setAttribute( 'stroke' , '#FFFF00' );
  	street.setAttribute( 'stroke-width' , 0.5 );
  	street.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(street); 
let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrl.setAttribute("style","fill:none; stroke-width:0.5");
	cirrl.setAttribute( 'stroke' , '#FFFF00' );
	cirrl.setAttribute("cy", 0);
	svgEl.appendChild(cirrl);
let rstick  = document.createElementNS( "http://www.w3.org/2000/svg", "path" );	street.setAttribute( 'stroke' , '#FFFF00' );
  	rstick.setAttribute( 'stroke-width' , 0.5 );
  	rstick.setAttribute( 'fill' , 'none' );
  	rstick.setAttribute( 'stroke' , '#FFFF00' );
let txtst	= '';
	rstick.setAttribute( 'd', txt);
	svgEl.appendChild(rstick);
let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	tancon.setAttribute( 'stroke-width' , 0.5 );
  	tancon.setAttribute( 'fill' , 'none' );
  	tancon.setAttribute( 'stroke' , '#FFFF00' );
let txttn	= '';
	tancon.setAttribute( 'd', txttn);
	svgEl.appendChild(tancon);

const numDots	= 800;	
let cirrnd0	= [];
let cirrnd1	= [];
// see: addRandots() for radius attribute
for (let i=0; i<numDots; i++)
	{
	cirrnd0[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrnd0[i].setAttribute("style","fill:'#666666'; stroke-width:0.25");
	cirrnd0[i].setAttribute( 'stroke' , '#666666' );
	cirrnd0[i].setAttribute("r", 0.3);
	svgEl.appendChild(cirrnd0[i]);
	
	cirrnd1[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrnd1[i].setAttribute("style","fill:'#666666'; stroke-width:0.25");
	cirrnd1[i].setAttribute( 'stroke' , '#666666' );
	cirrnd1[i].setAttribute("r", 0.3);
	svgEl.appendChild(cirrnd1[i]);
	}
let dotsAreOn	= false;
// let cirst	= document.createElementNS("http://www.w3.org/2000/svg","circle");

// Osculating Circles	
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

let sLength 	= 1;

const RR		= 16;
const RR_		= -RR;
let txtstr  = 'M'+' '+'-150'+' '+RR+' '+'L'+' '+'200'+' '+RR;
	street.setAttribute( 'd', txtstr);
	cirrl.setAttribute("r",RR);

function theCurve(t) {
			const cvx	= RR*(t + sLength*cos(t));
			const cvy   = RR*sLength*sin(t);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		return [ RR*(1-sLength*sin(t)), RR*sLength*cos(t) ];
		//return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}

/* ============ important globals for curve ============= */

		const s0  = -3*pi;
		const s1  = 3.5*pi;
		
		const n = 256;
		const ds = (s1 - s0)/n;


let curve 	= [];
let rndx 	= [];
let rndy 	= [];
let altern	= 0;

function fillCurve() {
		let result = [];
		let t = 0;
		for (let i=0; i<n+1; i++)
		{
		   t = s0 +(s1-s0)*(i/n);
		   result 	= [theCurve(t), dtheCurve(t)];
		curve[i] 	= result;
		}
		rndx 	= random_(numDots);
		rndy	= random_(numDots);
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
		rline.setAttribute("d", txtl );
		svgEl.appendChild(cir);
	}
else { rline.setAttribute("d", '');}

} //  make circles with radius -- append in render()

function makeRollSvg(j)	{
	const tj 	= s0+j*ds;	
	const mx 	= RR*tj;
	const my	= RR;
	cirrl.setAttribute("r",RR);
	cirrl.setAttribute("cx", mx);
	svgEl.appendChild(cirrl);
	const qx = theCurve(tj)[0];
	const qy = theCurve(tj)[1];    
    txtst = 'M'+' '+mx+' '+'0'+' '+'L'+' '+qx+' '+qy;
    if (checkboxRand.checked)
    {
    	let rnx;
    	let rny;
    	const b0x	= 5*(qx-mx)/sLength;
    	const b0y	= 5*qy/sLength;
    	const b1x	= -b0y;
    	const b1y	= +b0x;
    	// moves the square boundary
//     	const sq1x  = mx + b0x + b1x;
//     	const sq1y  = b0y + b1y;
//     	const sq2x  = mx + b0x - b1x;
//     	const sq2y  = b0y - b1y;
//     	const sq3x  = mx - b0x - b1x;
//     	const sq3y  = -b0y - b1y;
//     	const sq4x  = mx - b0x + b1x;
//     	const sq4y  = -b0y + b1y;
//     	txtst		= txtst+'M'+' '+sq1x+' '+sq1y+' '+'L'+' '+sq2x+' '+sq2y;
//     	txtst		= txtst+'L'+' '+sq3x+' '+sq3y+' '+'L'+' '+sq4x+' '+sq4y;

	
		if (altern == 0)
		{
			for (let i=0; i<numDots; i++)
			{
				rnx	= mx + rndx[i]*b0x + rndy[i]*b1x;
				rny	=      rndx[i]*b0y + rndy[i]*b1y;
				cirrnd0[i].setAttribute("cx", rnx);
				cirrnd0[i].setAttribute("cy", rny);
				svgEl.appendChild(cirrnd0[i]);
			}
			altern = 1;
		}
		else
		{
			for (let i=0; i<numDots; i++)
			{
				rnx	= mx + rndx[i]*b0x + rndy[i]*b1x;
				rny	=      rndx[i]*b0y + rndy[i]*b1y;
				cirrnd1[i].setAttribute("cx", rnx);
				cirrnd1[i].setAttribute("cy", rny);
				svgEl.appendChild(cirrnd1[i]);
			}
			altern = 0;
		}
    }
    rstick.setAttribute("d", txtst );	
	const tan	= dtheCurve(tj);
	const tx	= 2*tan[0];
	const xt	= -tx;
	const ty	= 2*tan[1];
	const yt	= -ty;
	txttn = 'M'+mx+' '+my+ ' L'+qx+' '+qy + 'l'+tx+' '+ty+'M'+qx+' '+qy + 'l'+xt+' '+yt;
	tancon.setAttribute("d", txttn );
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
			kap		  = kappa(s0+i*ds);
			if (!(abs(kap) < epsD)) {
				nrml	  = scalTimesVec1(1/kap/norm1(aux), aux);
				ptsx	  = curve[i][0][0];
				ptsy	  = curve[i][0][1];
				qtsx 	  = nrml[0];
				qtsy 	  = nrml[1];
			
				//if (i < 3) {console.log("curve[3] ",curve[3]);}
				txtn 	+= 'M' +ptsx +' '+ptsy +'l'+qtsx +' '+qtsy;
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

function hideDots()	{
	if (dotsAreOn)
	{
		for (let i=0; i<numDots; i++)
    	{if (cirrnd1[i].parentElement)
    	    {svgEl.removeChild(cirrnd1[i]);}
    	 if (cirrnd0[i].parentElement)		//(svgEl.appendChild(cirrnd0[i]))
    	    {svgEl.removeChild(cirrnd0[i]);}
    	}
    dotsAreOn	= false;
    }
}

let jjc = 0;
let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );	

	 if ((checkboxConst.checked)||(checkboxRand.checked))	
	 	{
	 		makeRollSvg(jjr);  
	 		jjr++; if (jjr == n) {jjr = 0;}
	 	}
	 else	{ if (cirrl.parentElement)
	 			{svgEl.removeChild(cirrl);}
			  rstick.setAttribute("d", '');	
			  tancon.setAttribute("d", '');
			}

	 if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{ if (cir.parentElement)
	 			{svgEl.removeChild(cir);}
			  rline.setAttribute( "d", '');	
			}	
	 	
	if (checkboxNormal.checked)			
			{ normal.setAttribute("d",txtn);	// makeNormalsSVG();		
			}
	else	{ normal.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;
let loopID3 = 0;

const addRandots = (() => {
			
    		checkboxOsc.checked = false;
    		window.clearInterval(loopID1);
    		window.clearInterval(loopID2);
    		window.clearInterval(loopID3);
    if ( checkboxRand.checked ) {
    		checkboxConst.checked = true;
    		dotsAreOn	= true;
    		loopID3 = window.setInterval(render, 60);
         }
    else {  
        	checkboxConst.checked = false;} 
    });

const addConstruction = (() => {
    		checkboxOsc.checked = false;
    		window.clearInterval(loopID1);
    		window.clearInterval(loopID2);
    if ( checkboxConst.checked ) {
    		if (!(checkboxRand.checked)) 
    			{hideDots();}
    		window.clearInterval(loopID3);
    		loopID2 = window.setInterval(render, 60);
         }
    else { 
    		checkboxRand.checked = false;
    		hideDots();} 
    });

const startStopCircles = (() => {
    		checkboxConst.checked = false;
    		checkboxRand.checked  = false;
    		window.clearInterval(loopID1);
    		window.clearInterval(loopID2);
    		window.clearInterval(loopID3);
    		hideDots();
    if ( checkboxOsc.checked ) {
    		loopID1 = window.setInterval(render, 60);
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
    	if (!(checkboxRand.checked)) 
    			{hideDots();} 
    	
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
     		 street.setAttribute( 'stroke' , '#FFFF00' );
     		 cirrl.setAttribute( 'stroke' , '#FFFF00' );
     		 rstick.setAttribute( 'stroke' , '#FFFF00' );
     		 cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 rline.setAttribute( 'stroke' , '#FFFF00' );
     		 tancon.setAttribute( 'stroke' , '#FFFF00' );}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 street.setAttribute( 'stroke' , '#0000FF' );
    		 cirrl.setAttribute( 'stroke' , '#0000FF' );
    		 rstick.setAttribute( 'stroke' , '#0000FF' );
    		 cir.setAttribute( 'stroke' , '#0000FF' );
    		 rline.setAttribute( 'stroke' , '#0000FF' );
    		 tancon.setAttribute( 'stroke' , '#0000FF' );}
    if (!(checkboxRand.checked)) 
    			{hideDots();}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
    
inputParamFr.value = sLength;
function getStickLength() {
		//window.clearInterval(loopID1);
		checkboxOsc.checked = false;
		sLength 	= min(5, max(0.2, inputParamFr.value));
		inputParamFr.value = sLength;
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

inputParamFr.addEventListener("change", getStickLength);
//inputParamSt.addEventListener("change", getyFrequency);
checkboxConst.addEventListener ('change', addConstruction , false);
checkboxRand.addEventListener ('change', addRandots , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};