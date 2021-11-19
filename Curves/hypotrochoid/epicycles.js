"use strict"
// same as for epicycles, only negative default frequency
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","600");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -190 -120 370 320");

const inputParamFr		= document.getElementById("param1");
const inputParamSt		= document.getElementById("param2");
const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= true;
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
	normal.setAttribute("d",txtn);
	svgEl.appendChild(normal);

let cirst	= document.createElementNS("http://www.w3.org/2000/svg","circle");	
	cirst.setAttribute("style","fill:none; stroke-width:1");
    cirst.setAttribute( 'stroke' , '#FFFF00' );
    cirst.setAttribute("cx", 0);
	cirst.setAttribute("cy", 0);
	//svgEl.appendChild(cirst);
let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrl.setAttribute("style","fill:none; stroke-width:1");
	cirrl.setAttribute( 'stroke' , '#FFFF00' );			
	cirrl.setAttribute("cx", 0);
	cirrl.setAttribute("cy", 0);
	//svgEl.appendChild(cirrl);
let rstick  = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	rstick.setAttribute("style","fill:none; stroke-width:2");
	rstick.setAttribute( 'stroke' , '#FFFF00' );
let txtst	= '';
	svgEl.appendChild(rstick);
let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	tancon.setAttribute("style","fill:none; stroke-width:1.5");
	tancon.setAttribute( 'stroke' , '#007700' );
    //tancon.setAttribute( 'stroke-dasharray', '1');
let txttn	= '';
	tancon.setAttribute("d",txttn);
	svgEl.appendChild(tancon);
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	cir.setAttribute( 'stroke' , '#FFFF00' );
	//svgEl.appendChild(cir);	
	
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'fill' , 'none' ); 
    rline.setAttribute( 'stroke' , '#FFFF00' );
let txtl	= '';
	rline.setAttribute("d",txtl);
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

let frequency 	= -4;
let stick		= 1;

const RR		= 12;
let rad			= RR/frequency;
let strt		= RR - rad;
let sticklength	= abs(rad)*stick;	

function theCurve(t) {
			const cvx	= RR*cos(t) + sticklength*cos(frequency*t);
			const cvy   = RR*sin(t) + sticklength*sin(frequency*t);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		return [-RR*sin(t) - sticklength*frequency*sin(frequency*t), RR*cos(t) + sticklength*frequency*cos(frequency*t)];
		//return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}

/* ============ important globals for curve ============= */
function adaptScale() {
			let res = 6;
			if ((frequency < 3)&&(frequency > -4))
				{res = 4.5;}
			if ((frequency == 1)||(frequency == -1))
				{res = 0.6*res;}
				res = res*6/(5 + 1*stick);
		return res;
	}

		let scale = adaptScale();// scaling factor for drawing
		let s0 = 0.0;
		let s1 = 2*pi;
		
const n 	= 256;
const ds 	= (s1 - s0)/n;
const ns 	= 2;

let curve 	= [];

function fillCurve() {
		let result	= [];
		let t 		= 0;
		for (let i=0; i<n+1; i++)
		{
		   t = s0 +(s1-s0)*(i/n);
		   result 	= [theCurve(t), dtheCurve(t)];
		curve[i] 	= result;
		}
	return curve;
}

/* ============    
===================================================================== */

function makeOscSvg(j) {
let newRadius = "";
let midX = "";
let midY = "";
	function getOscCirc(j) 
	{
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
		rline.setAttribute("d", txtl );
		svgEl.appendChild(cir);
	}
} //  make circles with radius -- append in render()

function makeRollSvg(j)	{
	const tj 	= s0+j*ds;	
	const mx 	= scale*RR*cos(tj);
	const my 	= scale*RR*sin(tj);
	const rho	= abs(scale*rad);
	cirrl.setAttribute("r",rho);
	cirrl.setAttribute("cx", mx);
	cirrl.setAttribute("cy", my);
	const qx = scale*theCurve(tj)[0];
	const qy = scale*theCurve(tj)[1];    
    txtst = 'M'+mx+' '+my+ ' L'+qx+' '+qy;
    rstick.setAttribute("d", txtst );	
	const bx 	= scale*strt*cos(tj);
	const by 	= scale*strt*sin(tj);
	const tx	= 2*(qy - by);
	const xt	= -tx;
	const ty	= 2*(bx - qx);
	const yt	= -ty;
    txttn = 'M'+bx+' '+by+ ' L'+qx+' '+qy + 'l'+tx+' '+ty+'M'+qx+' '+qy + 'l'+xt+' '+yt;
    tancon.setAttribute("d", txttn );
    svgEl.appendChild(cirst);
    svgEl.appendChild(cirrl);
}

function removeRollconst()	{
			if  (cirst.parentElement) 
    		    {	svgEl.removeChild(cirst);	}
    		if  (cirrl.parentElement) 
    		    {	svgEl.removeChild(cirrl);	}
    		rstick.setAttribute("d",'');
    		tancon.setAttribute("d",'');
}
/* ============================================================= */

function makeNormalsSVG() {
		let nrml 	= [];
		let aux		= [];
		let kap		= 1;
		let ptsx	= 0;
		let ptsy	= 0;
		let qtsx	= 0;
		let qtsy	= 0;
			txtn  	= '';
		for (let i = 0;  i < n; i++)	{
			aux		  = [- curve[i][1][1], curve[i][1][0]];
			kap		  = kappa(s0+i*ds);
			if (!(abs(kap) < epsD)) { 
				nrml	  = scalTimesVec1(scale/kap/norm1(aux), aux);
				ptsx	  = curve[i][0][0]*scale;
				ptsy	  = curve[i][0][1]*scale;
				qtsx 	  = ptsx + nrml[0];
				qtsy 	  = ptsy + nrml[1];
			
			//if (i < 3) {console.log("curve[3] ",curve[3]);}
			txtn 	+= 'M' +ptsx +' '+ptsy +'L' +qtsx +' '+qtsy;
			}
		}
		//console.log("txtn =", txtn);
		normal.setAttribute( "d" , txtn );
		checkboxNormal.checked = true;
}

//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}




/* =================== makes the Bezier Path ================= */
function makeTXTforpath(cCurve)   // theCurve(t)
{
	let ttxt 	= '';
	let t 		= 0;

/* ==================== linear segments only =================== */	
// 	for (let i=0; i<n+1; i++)
//   	{	
// 	 	t = s0 + (s1-s0)*(i/n);
// 	 	px = theCurve(t)[0];
// 	 	py = theCurve(t)[1];
// 	 	[px,py] = scalTimesVec1(scale, [px,py]);
// 	 	if (i == 0)
// 	 			{ttxt += 'M' +px +' '+py;}
// 	 	else	{ttxt += 'L' +px +' '+py;}
// 	 }
 
	for (let i=0; i<n/ns; i++)
	{	
	// left
	px = cCurve[ns*i][0][0];
	py = cCurve[ns*i][0][1];
	mx = cCurve[ns*i][1][0]*ds*ns/3;
	my = cCurve[ns*i][1][1]*ds*ns/3;
	hx = px + mx;
	hy = py + my;
	// right
	qx = cCurve[ns*(i+1)][0][0];
	qy = cCurve[ns*(i+1)][0][1];
	nx = cCurve[ns*(i+1)][1][0]*ds*ns/3;
	ny = cCurve[ns*(i+1)][1][1]*ds*ns/3;
	kx = qx - nx;
	ky = qy - ny;
	// handle scaling:
	[px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky] = scalTimesVec1(scale, [px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky]);			
	
	ttxt += 'M' +px + ' '+ py;
    ttxt += 'C' +hx + ' '+ hy;
    ttxt += ' ' +kx + ' '+ ky;
    ttxt += ' ' +qx + ' '+ qy;
	}
	return ttxt;
}

/* ============================================================= */

let jjc = 0;
let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );	

	if (checkboxConst.checked)	{
	 	makeRollSvg(jjr);  
	 	jjr++; if (jjr == n) {jjr = 0;}
	 }
	 else {removeRollconst();}

	if (checkboxOsc.checked)	{
	 	makeOscSvg(jjc);  
	 	jjc++; if (jjc == n) {jjc = 0;}
		}
	else	{ if  (cir.parentElement) 
    		    {	svgEl.removeChild(cir);	}	
			  rline.setAttribute( "d", '');	
			}
	 	
	if (checkboxNormal.checked)			{
			svgEl.appendChild(normal);	
			}
	else	{; 
			}


div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;

const addConstruction = (() => {
	if ( checkboxConst.checked ) {
			checkboxOsc.checked = false;
			cirst.setAttribute("r",scale*strt);
    		window.clearInterval(loopID2);
    		loopID2 = window.setInterval(render, 60);
    	}
    else { window.clearInterval(loopID2);
    	}
	});


const startStopCircles = (() => {
    if ( checkboxOsc.checked ) {
    		checkboxConst.checked = false;
    		removeRollconst();
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 60);
         }
    else { window.clearInterval(loopID1);} 
    });
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
    	//checkboxConst.checked = false;
		makeNormalsSVG();
        }
    else {  normal.setAttribute("d",''); 
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
     		 cirst.setAttribute( 'stroke' , '#FFFF00' );
     		 cirrl.setAttribute( 'stroke' , '#FFFF00' );
     		 rstick.setAttribute( 'stroke' , '#FFFF00' );
     		 //tancon.setAttribute( 'stroke' , '#AFAFAF' );
     		 cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 rline.setAttribute( 'stroke' , '#FFFF00' );
     		}
    else	{path.setAttribute( 'stroke' , '#000000' );
			 cirst.setAttribute( 'stroke' , '#0000FF' );
			 cirrl.setAttribute( 'stroke' , '#0000FF' );
			 rstick.setAttribute( 'stroke' , '#0000FF' );
			 //tancon.setAttribute( 'stroke' , '#0000FF' );
			 cir.setAttribute( 'stroke' , '#0000FF' );
    		 rline.setAttribute( 'stroke' , '#0000FF' );
    		}
    
	if (!(checkboxConst.checked)) {removeRollconst();}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
	render();
    });
    

inputParamFr.value = frequency;
function getFrequency() {
		window.clearInterval(loopID1);
		//checkboxOsc.checked = false;
		//checkboxConst.checked = false;
		frequency 	= min(12, max(-12, 1.0*inputParamFr.value));
		inputParamFr.value = frequency;
		if (frequency == 0) {rad = RR}
		else	{rad	= RR/frequency;}
		strt			= RR - rad;
		sticklength		= abs(rad)*stick;
		scale = adaptScale();
		removeRollconst();
		fillCurve();
		txt	= makeTXTforpath(curve);
		makeNormalsSVG();
		
		render();
}

inputParamSt.value = stick;
function getStickFactor() {
		window.clearInterval(loopID1);
		//checkboxOsc.checked = false;
		//checkboxConst.checked = false;
		stick		= min(5,max(0, 1.0*inputParamSt.value));
		inputParamSt.value = stick;
		sticklength = abs(rad)*stick;
		scale = adaptScale();
		removeRollconst();
		fillCurve();
		txt	= makeTXTforpath(curve);
		makeNormalsSVG();
		
		render();
}

const init = (() => {
		checkboxConst.checked = false;
		cirst.setAttribute("r",-1);
		fillCurve();
		//console.log("curve",curve);
		txt	= makeTXTforpath(curve);
		makeNormalsSVG();
		render();      
});


init();

inputParamFr.addEventListener("change", getFrequency);
inputParamSt.addEventListener("change", getStickFactor);
checkboxConst.addEventListener ('change', addConstruction , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};