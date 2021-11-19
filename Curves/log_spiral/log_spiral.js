"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","600");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -10 -10 20 20");

const inputParamFr		= document.getElementById("param1");
// const inputParamSt		= document.getElementById("param2");
//const checkboxConst  	= document.getElementById('checkboxConst');
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
  	path.setAttribute( 'stroke-width' , 0.05 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	path.setAttribute( 'd' , '' );
  	svgEl.appendChild(path);
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.025 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	normal.setAttribute( 'd' , '' );
	svgEl.appendChild(normal);


// let cirst	= document.createElementNS("http://www.w3.org/2000/svg","circle");
// let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
// let rstick  = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
// let txtst	= '';
// let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
// let txttn	= '';
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:0.05");
	cir.setAttribute( 'stroke' , '#FFFF00' );
let rline 	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 0.05 );
  	rline.setAttribute( 'fill' , 'none' ); 
    rline.setAttribute( 'stroke' , '#FFFF00' );
let txtl	= '';
	rline.setAttribute( 'd' , '' );
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

let growth	= 0.15;


function theCurve(t) {
			const rr	= exp(growth*t)*scale;
			const cvx	= rr*cos(t);
			const cvy   = rr*sin(t);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		//return [ -RR*xfrequency*sin(xfrequency*t), RR*yfrequency*cos(yfrequency*t) ];
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}

/* ============ important globals for curve ============= */
function adaptScale() {
		const res 	= 8/exp(growth*s1);
		return res;
	}

		const s0  	= -5.0*pi;
		const s1  	= 2.0*pi;
		
		const n 	= 256;
		const ns 	= 4;   // larger steps for Bezier
		const ds 	= (s1 - s0)/n;
		let scale 	= adaptScale();// scaling factor for drawing


let cirS	= [];
for (let k=0; k < n/ns; k++)
	{ cirS[k] =  document.createElementNS("http://www.w3.org/2000/svg","circle");
	  setCirS_Attribute(k);
	  svgEl.appendChild(cirS[k]);
	}
	
function  setCirS_Attribute(k){
		cirS[k].setAttribute("style","fill:none; stroke:red; stroke-width:0.05");
		cirS[k].setAttribute("cx", 0);
		cirS[k].setAttribute("cy", 0);
		cirS[k].setAttribute("r", 0);
	}

/* ============= Compute the data =======================*/
let curve 	= [];
let cval 	= [];
let dval	= [];

function fillCurve() {
		inputParamFr.value = growth;
		scale 		= adaptScale();
		let result 	= [];
		let t 		= 0;
		
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

let midX = "";
let midY = "";
let newRadius = "";
function makeOscSvg(j) {
newRadius = "";
midX = "";
midY = "";
function getOscCirc(j) {
		const pos = curve[j][0];
		const tan = curve[j][1];
		const rad = 1/kappa(s0+j*ds);
		const unrml = [-tan[1], tan[0]];
		const mdif  = scalTimesVec1(rad/norm1(unrml), unrml);
		px	= pos[0];  py  = pos[1];
		qx  = (mdif[0]+pos[0]);   qy  = (mdif[1]+pos[1]);
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
	return [mdif[0]+pos[0], mdif[1]+pos[1], abs(rad) ];  // not scaled
	}

// [newRadius, midX, midY] = scalTimesVec1(scale, getOscCirc(j));
[midX, midY, newRadius] = getOscCirc(j);

if (abs(midX) + abs(midY) + newRadius < 16000)	
	{
		cir.setAttribute("cx", midX);
		cir.setAttribute("cy", midY);
		cir.setAttribute("r",newRadius);
		rline.setAttribute("d", txtl );
		svgEl.appendChild(cir);
	}
else { 	if ( cir.parent.Element )
			{svgEl.removeChild(cir);}
		rline.setAttribute("d", '');}

} //  make circles with radius -- append in render()

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
		for (let i = 0;  i < n+1; i++)	{
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
//[px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky] = scalTimesVec1(scale, [px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky]);			
	
	txt += 'M' +px + ' '+ py;
    txt += 'C' +hx + ' '+ hy;
    txt += ' ' +kx + ' '+ ky;
    txt += ' ' +qx + ' '+ qy;
	}
}

let jjc = 0;
let kks = 0;
function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );	

	if (checkboxStay.checked)	{
	 	if (jjc/ns == round(jjc/ns))	
	 	{
	 		makeOscSvg(jjc);
	 		cirS[kks].setAttribute("cx", midX);
			cirS[kks].setAttribute("cy", midY);
			cirS[kks].setAttribute("r",newRadius);
	 		kks++; if (kks > (n/ns - 1)) 
	 			{ kks = 0;}	
	 	}
	 	jjc++; if (jjc == n) 
	 			{	jjc = 0;
	 				checkboxStay.checked = false; }
	 }

	 if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{	if ( cir.parentElement)
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
let loopID2 = 0;

const letCirclesStay = (() => {
	checkboxOsc.checked	= false;
	window.clearInterval(loopID1);
	kks = 0;
	jjc = 0;
	for (let k = 0; k < n/ns; k++)
			{setCirS_Attribute(k)}
	if ( checkboxStay.checked ) {
    		window.clearInterval(loopID2);
    		loopID2 = window.setInterval(render, 60);
    	}
    else { window.clearInterval(loopID2);
    	}
	});


const startStopCircles = (() => {
    window.clearInterval(loopID1);
    if ( checkboxOsc.checked ) {
    		window.clearInterval(loopID2);
    		loopID1 = window.setInterval(render, 60);
         }
    else { ;} 
    });
    
const addRemoveNormals = (() => {
    window.clearInterval(loopID1);
    if ( checkboxNormal.checked ) {
		makeNormalsSVG();
        }
    else { //normal.setAttribute( "d", ''); 
    	;} 
    	
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
    

inputParamFr.value = growth;
function getGrowth() {
		//window.clearInterval(loopID1);
		checkboxOsc.checked  = false;
		checkboxStay.checked = false;
		for (let k = 0; k < n/ns; k++)
			{setCirS_Attribute(k)}
		growth 	= min(0.5, max(0.05, inputParamFr.value));
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
// 		//checkboxConst.checked = false;
// 		//cirst.setAttribute("r",-1);
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

inputParamFr.addEventListener("change", getGrowth);
// inputParamSt.addEventListener("change", getyFrequency);
checkboxStay.addEventListener ('change', letCirclesStay , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};