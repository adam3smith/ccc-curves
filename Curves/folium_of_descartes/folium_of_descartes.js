"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -110 -95 220 220");

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
for (let i = 0; i<14; i++)
	{
	path[i] = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	//path[i].setAttribute( 'stroke' , '#FFFFFF' );
  	path[i].setAttribute( 'stroke-width' , 0.75 );
  	path[i].setAttribute( 'fill' , 'none' );
	svgEl.appendChild(path[i]);
  	}
  	
    path[0].setAttribute( 'stroke' , '#77CC00' );
    path[1].setAttribute( 'stroke' , '#77CC00' );
    path[2].setAttribute( 'stroke' , '#999900' );
    path[3].setAttribute( 'stroke' , '#999900' );
    path[4].setAttribute( 'stroke' , '#BB6600' );
    path[5].setAttribute( 'stroke' , '#BB6600' );
    path[6].setAttribute( 'stroke' , '#DD3300' );
    path[7].setAttribute( 'stroke' , '#DD3300' );
  	path[8].setAttribute( 'stroke' , '#FF0000' );
  	path[9].setAttribute( 'stroke' , '#CC0033' );
  	path[10].setAttribute( 'stroke' , '#990066' );
  	path[11].setAttribute( 'stroke' , '#660099' );
  	path[12].setAttribute( 'stroke' , '#3322CC' );
  	path[13].setAttribute( 'stroke' , '#0044FF' );
let txt  = '';

let achsen = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	achsen.setAttribute( 'stroke' , '#FFFFFF' );
  	achsen.setAttribute( 'stroke-width' , 0.25 );
  	achsen.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(achsen);
let txta = 'M'+' '+'-150'+' '+'0'+'L'+' '+'150'+' '+'0';
	txta = txta+'M'+' '+'0'+' '+'-150'+'L'+' '+'0'+' '+'150';
	achsen.setAttribute('d', txta);
  	
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
	
function folium(p) {
		return	(cube(p[0]) + cube(p[1]) - 3*p[0]*p[1]);
	}
	
function gradfolium(p)	{
			const gtc	= [];
				gtc[0]	=  3*sqr(p[0]) - 3*p[1];
				gtc[1]	=  3*sqr(p[1]) - 3*p[0];
		return gtc;
	}
	
function tangfolium(p)	{
			const tgtc	= [];
				tgtc[0] = -(3*sqr(p[1]) - 3*p[0]);
				tgtc[1] =  3*sqr(p[0]) - 3*p[1];
		return tgtc;
	}
	
 function ddLevel(p) {
			const ddfo 	= [];
				ddfo[0]	= [6*p[0], -3];
				ddfo[1]	= [-3, 6*p[1]];
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
			let res = 24;
		return res;
	}

const epsQ = 1/1024;
let n	= 192;
let xa 	= 0;
let ya 	= 0;
function makeInitials(choo) {
		n	= 192*1;
		switch (choo) {
		case 0:
			xa = 1.1; ya = 1.1;
			n = 64;
		break;
		case 1:
			xa = 1.2; ya = 1.2;
			n = 96;
		break;
		case 2:
			xa = 1.3; ya = 1.3;
			n = 96;
		break;
		case 3:
			xa = 1.4; ya = 1.4;
			n = 128;
		break;
		case 4:
			//ya = -2.9856775284484667; xa = 2.0331366918850886;
			xa = 3.085198831799806; ya = -4.060512972572763;
			n = 288;
		break;
		case 6:
			xa = 3.14; ya = -4.06;
			n = 112;
		break;
		case 7:
			xa = 3.2; ya = -4.06;
			n = 112;
		break;
		case 8:
			xa = 3.26; ya = -4.06;
			n = 112;
		break;
		case 9:
			xa = 3.32; ya = -4.06;
			n = 112;
		break;
		case 5:
			xa = 3.1; ya = -4.06;
			n = 128;
		break;
		case 10:
			xa = 3.06; ya = -4.06;
			n = 96;
		break;
		case 11:
			xa = 2.96; ya = -4.06;
			n = 64;
		break;
		case 12:
			xa = 2.86; ya = -4.06;
			n = 64;
		break;
		case 13:
			xa = 2.76; ya = -4.06;
			n = 64;
		break;
		} 		
	}
		
		const ns = 4; 
		let ds 	 = 1/128;

let choose	= 0;
let scale	= 1;
let step	= [];
let curve 	= [];
let cval 	= [];
let dval	= [];
let start	= [xa,ya];
let v0		= folium(start);
let nextP	= [];
let v1		= 0;
let n0		= 0;
let t1		= [];
function fillCurve() {
		scale 	= adaptScale();
		makeInitials(choose);
		start	= [xa,ya];
		v0		= folium(start);
		//console.log("start = ", start);
		for (let i=0; i<n+1; i++)
		{ 
			t1		= tangfolium(start);
			n0		= sqrt(norm1(t1));
			if (!(choose == 4))  {ds =  1/n0/48;} 
			// else if (!(choose > 1))  {ds = 1/n0/32;} 
			else
		    	{	if (n0 < epsD*16) {t1 = [epsD*16, epsD*16]; n0 = epsD*16;}
		    		ds	= 1/max(1/1024, n0)/64;
		    	}
		curve[i] 	= [start, t1 ];
		step[i]		= ds;
			nextP 	= LevelODEt2(ds/2, start, tangfolium, ddLevel);
			nextP 	= LevelODEt2(ds/2, nextP, tangfolium, ddLevel);
			nextP 	= LevelODEt2(ds/2, nextP, tangfolium, ddLevel);
			nextP 	= LevelODEt2(ds/2, nextP, tangfolium, ddLevel);
			v1 = folium(nextP);  // This Newton step improves accuracy
			t1 = gradfolium(nextP);
			nextP = linComb1(1,(v0-v1)/dotProd1(t1,t1)  , nextP,t1);
			if (i>504){console.log("start, nextP, v0,v1,ds = ",start, nextP,v0,folium(nextP),ds);}
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
let newRadius = 17000;
let midX = 0;
let midY = 0;
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

if (!(choose == 10))
	{ [newRadius, midX, midY] = scalTimesVec1(scale, getOscCirc(j)); }

if (abs(midX) + abs(midY) + newRadius < 16000)	
	{
		cir.setAttribute("cx", midX);
		cir.setAttribute("cy", midY);
		cir.setAttribute("r",newRadius);
		svgEl.appendChild(cir);
		rline.setAttribute("d", txtl );
	}
else 
	{ rline.setAttribute("d", '');
		cir.setAttribute("r", 0);
	}
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
		let fc		= 1; if (choose == 4){ fc = 2;}
			txtn  	= '';
			normal.setAttribute( "d" , '' );
	if (!(choose == 10)) 
	{
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
	for (let i=0; i<n+1; i++)
  	{	
	 	px = curve[i][0][0];
	 	py = -curve[i][0][1];
	 	[px,py] = scalTimesVec1(scale, [px,py]);
	 	if (i == 0)
	 			{txt += 'M' +px +' '+py;}
	 	else	{txt += 'L' +px +' '+py;}
	 }
	// console.log("txt = ",txt);
	 
 
// 	for (let i=0; i<n/ns; i++)
// 	{
// 	ds = step[ns*i];	
// 	// left
// 	px = curve[ns*i][0][0];
// 	py = curve[ns*i][0][1];
// 	mx = curve[ns*i][1][0]*ds*ns/3;
// 	my = curve[ns*i][1][1]*ds*ns/3;
// 	hx = px + mx;
// 	hy = py + my;
// 	// right
// 	qx = curve[ns*(i+1)][0][0];
// 	qy = curve[ns*(i+1)][0][1];
// 	nx = curve[ns*(i+1)][1][0]*ds*ns/3;
// 	ny = curve[ns*(i+1)][1][1]*ds*ns/3;
// 	kx = qx - nx;
// 	ky = qy - ny;
// 	// handle scaling:
// 	[px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky] = scalTimesVec1(scale, [px,py,mx,my,hx,hy,qx,qy,nx,ny,kx,ky]);			
// 	[py,hy,ky,qy] = scalTimesVec1(-1, [py,hy,ky,qy]);
// 	txt += 'M' +px + ' '+ py;
//     txt += 'C' +hx + ' '+ hy;
//     txt += ' ' +kx + ' '+ ky;
//     txt += ' ' +qx + ' '+ qy;
// 	}
	path[choose].setAttribute( "d" , txt );	
}

let jjc = 0;
//let jjr = 0;
function render() {
	 if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n-1) {jjc = 0;}
	 	}
	 else	{ removeOscCirc();	}	
	 	
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
    jjc = 0;
    if ( checkboxOsc.checked ) {
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 30);
         }
    else { window.clearInterval(loopID1);} 
    });
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
    	window.clearInterval(loopID1);
		makeNormalsSVG();
        }
    else { //normal.setAttribute( "d", ''); 
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
    
  //   for (let i=0; i<14; i++)
//     {
//     	if (mybackground == "black")			
//      		 {path[i].setAttribute( 'stroke' , '#FFFFFF' );	}
//     	else {path[i].setAttribute( 'stroke' , '#000000' );	}
//     }
 //   		path[4].setAttribute( 'stroke' , '#FF0000' );
 
 	if (mybackground == "black")			
     		{achsen.setAttribute( 'stroke' , '#FFFFFF' );	}
    else 	{achsen.setAttribute( 'stroke' , '#000000' );	}
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
		choose 	= min(13, max(0, inputParam1.value));
		inputParam1.value = choose;
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		for (let i = 0; i < 14; i++)
			{path[i].setAttribute( 'stroke-width' , 0.75 );}
		path[choose].setAttribute( 'stroke-width' , 1.5 );
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
		for (let i = 0; i < 14; i++)	{
		choose = i;
		fillCurve();
		makeTXTforpath();
		}
		choose = 4;
		fillCurve();
		makeTXTforpath();
		inputParam1.value = choose;
	 	path[choose].setAttribute( 'stroke-width' , 1.5 );
		
		render();      
});


init();

inputParam1.addEventListener("change", getLevel);
// inputParamSt.addEventListener("change", getyFrequency);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};