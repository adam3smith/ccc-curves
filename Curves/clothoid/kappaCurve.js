"use strict"
/* choose == 1 Version for Clothoide and Looping curve */
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","600");
svgEl.setAttribute("height","500");
svgEl.setAttribute("viewBox"," -20 -140 340 320");

const inputKappaParam	= document.getElementById("kappaParam");
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
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
	svgEl.appendChild(path);	
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	normal.setAttribute( "d" , txtn ); 
	svgEl.appendChild(normal);
let emptyNormal = true;

let cir = document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	cir.setAttribute( 'stroke' , '#FFFF00' );
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'stroke' , '#FFFF00' );
  	rline.setAttribute( 'fill' , 'none' );
let txtl	= '';
	svgEl.appendChild(rline)
let choose  =  1;
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

/* ============== for changing the curvature function: =========== */
let bPar       = 72/120; // number see function CrvtParam()
const aPar = 1;					 // not morphed
const cPar = 2;



 function kappa(t) {
 		if (choose == 0) 	{
 				return bPar*(cPar + cos(aPar*t)); }
 		else {	return exp(bPar*log(abs(t))); }
 }

function vel(t) {
			const aux = exp((bPar+1)*log(abs(t)))/(bPar+1);
     return [cos(aux), -sin(aux)];
	}

/* ============ important globals for curve ============= */

		let scale = 64;  // scaling factor for drawing
		scale  = 80*sqr(5/3*bPar);
		let s0 = 0.001;
		let s1 = 32.001; let n = 512; let inStp = 2;
		let c0 =[1.2/bPar,E-exp(bPar)]; let v0 = [1,0];
if (choose == 1)
	{	scale = 45*(1+bPar);
		s0 = -5-pi;  s1 = 8.1; n = 256; inStp = 2;
		c0 =[1.5/(1+bPar),1.5/(0.5+bPar)]; v0 = [1,0];					}
const ds = (s1 - s0)/n;
let curve = [];
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
		const rad = sgn(s0+j*ds)/kappa(s0+j*ds);
		const unrml = [tan[1], -tan[0]];
		const mdif  = scalTimesVec1(rad/norm1(unrml), unrml);
		px	= pos[0]*scale;  py  = pos[1]*scale;
		qx  = (mdif[0]+pos[0])*scale;   qy  = (mdif[1]+pos[1])*scale;
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
	return [abs(rad), mdif[0]+pos[0], mdif[1]+pos[1]];  // not scaled
	}

[newRadius, midX, midY] = scalTimesVec1(scale, getOscCirc(j));
	
cir.setAttribute("cx", midX);
cir.setAttribute("cy", midY);
cir.setAttribute("r",newRadius);
svgEl.appendChild(cir);
rline.setAttribute("d", txtl );

} //  make circles with radius -- append in render()
/* ============================================================= */

function makeNormalsSVG() {
		let nrml 	= [];
		let aux		= [];
		const rad	= [];
		let ptsx	= 0;
		let ptsy	= 0;
		let qtsx	= 0;
		let qtsy	= 0;
			txtn  	= '';
		for (let i = 0;  i < n; i++)	{
			aux		  = [curve[i][1][1], - curve[i][1][0]];
			rad[i]	  = sgn(s0+i*ds)/kappa(s0+i*ds);
			nrml[i]   = scalTimesVec1(scale*rad[i]/norm1(aux), aux);
			ptsx	  = curve[i][0][0]*scale;
			ptsy	  = curve[i][0][1]*scale;
			qtsx 	  = ptsx + nrml[i][0];
			qtsy 	  = ptsy + nrml[i][1];
			
			//if (i < 3) {console.log("curve[3] ",curve[3]);}
			txtn 	+= 'M' +ptsx +' '+ptsy +'L' +qtsx +' '+qtsy;
		}
		//console.log("txtn =", txtn);
		normal.setAttribute( "d" , txtn );
}

//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}




/* =================== makes the Bezier Path =================*/
function makeTXTforpath()
{
	 
	txt  = '';
	const ns = 8/inStp;  
	for (let i=0; i<n/ns-1; i++)
	{	
	// left
	px = curve[ns*i][0][0];
	py = curve[ns*i][0][1];
	mx = curve[ns*i][1][0]*ds*4/3;
	my = curve[ns*i][1][1]*ds*4/3;
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
function render() {
	// console.log("txt = ",txt);
	path.setAttribute( "d" , txt );

	 if (checkboxOsc.checked)	{
	 	makeOscSvg(jjc);  
	 	jjc++; if (jjc == n) {jjc = 0}
	 }
	 else	
	 	{  	if (svgEl.appendChild(cir))
					{ svgEl.removeChild(cir); }		
			rline.setAttribute( "d", '');	
		}

 	if ( checkboxNormal.checked ) {
   	 		normal.setAttribute( "d" , txtn ); }
   	else {	normal.setAttribute( "d" , '' ); }

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID = 0;


const startStopCircles = (() => {
    if ( checkboxOsc.checked ) {
    		window.clearInterval(loopID);
    		loopID = window.setInterval(render, 60);
         }
    else { window.clearInterval(loopID);} 
    });
    
const addRemoveNormals = (() => {
   if ( checkboxNormal.checked ) {
		makeNormalsSVG();
        emptyNormal = false; 
        }
    else { if (!emptyNormal) 
    		{	normal.setAttribute( "d" , '' );
    			emptyNormal = true;		
    		} 
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

inputKappaParam.value = bPar;
function CrvtParam() {
		window.clearInterval(loopID);
		checkboxOsc.checked = false;
		bPar = min(1.1, max(0.05, inputKappaParam.value));
		inputKappaParam.value = bPar;
		if (choose == 0)	{
				curve = CurveByCurvature2D(s0,s1,n,inStp, kappa, c0,v0);	}
		else{	curve = antiDerivative(s0, s1, n, inStp, c0,vel);			}
		makeTXTforpath();
		makeNormalsSVG();
		
		render();
}

const init = (() => {
		//function antiDerivative(s0, s, n, inStp, A0, integrand)	
		if (choose == 0)	{
				curve = CurveByCurvature2D(s0,s1,n,inStp, kappa, c0,v0);	}
		else{	curve = antiDerivative(s0, s1, n, inStp, c0,vel);			}
		//console.log("curve",curve);
		makeTXTforpath();
		makeNormalsSVG();
		render();      
});


init();

inputKappaParam.addEventListener("change", CrvtParam);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};