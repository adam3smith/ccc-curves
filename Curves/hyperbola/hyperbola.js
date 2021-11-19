"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -160 -140 370 320");

const inputParamFr		= document.getElementById("param1");
//const inputParamSt		= document.getElementById("param2");
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
const checkboxInvert 	= document.getElementById('checkboxInvert');
const checkboxConstr	= document.getElementById('checkboxConstr');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
checkboxBackgrd.checked = false;
checkboxInvert.checked 	= false;
checkboxConstr.checked	= true;
let mybackground     	= "black";
let myforeground     	= "white";


let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 1.0 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
let txt_ = '';
	svgEl.appendChild(path);
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
let txtn_ 	= '';
	svgEl.appendChild(normal);

let paCon = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	paCon.setAttribute( 'stroke' , '#00FFFF' );
  	paCon.setAttribute( 'stroke-width' , 1 );
  	paCon.setAttribute( 'fill' , 'none' );
let txtCon  = '';
	svgEl.appendChild(paCon);

let cirInv 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirInv.setAttribute("style","fill:none; stroke:gray; stroke-width:1");
	cirInv.setAttribute( 'stroke-dasharray', '2');

// Mark focal points:	
let cirfc1 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirfc1.setAttribute("style","fill:yellow; stroke:yellow;");
	cirfc1.setAttribute("cy", 0);
	cirfc1.setAttribute("r",  1);
let cirfc2 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirfc2.setAttribute("style","fill:yellow; stroke:yellow;");
	cirfc2.setAttribute("cy", 0);
	cirfc2.setAttribute("r",  1);
// Mark points on construction
let cirfc3 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirfc3.setAttribute("style","fill:yellow; stroke:yellow;");
	cirfc3.setAttribute("r",  1);
let cirfc4 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirfc4.setAttribute("style","fill:yellow; stroke:yellow;");
	cirfc4.setAttribute("r",  1);	
// directrix circle
let cirf2aa 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirf2aa.setAttribute("style","fill:none; stroke:cyan; stroke-width:1");
	cirf2aa.setAttribute("cy", 0);
	svgEl.appendChild(cirfc1);
	svgEl.appendChild(cirfc2);
	svgEl.appendChild(cirfc3);
	svgEl.appendChild(cirfc4);
	svgEl.appendChild(cirf2aa);
	
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
const aa	= 60;
const ar	= 2*aa;
let morph 	= 1.0;
function ee() { return aa*sqrt(1+sqr(morph)) };
const n 	= 128;
const Rinv	= 90;
const RR	= sqr(Rinv);
let scale; // scale factor for drawing
let s0    	= -2.5;
let s1  	= +2.5;
let ds 		= (s1 - s0)/n;	

		cirInv.setAttribute("cx", 0);
		cirInv.setAttribute("cy", 0);
		cirInv.setAttribute("r",  Rinv); // see render()
		svgEl.appendChild(cirInv);

let e1 = ee();
let e2 = -ee();

function adaptScale() {
			let res = 100;
			{s0    	= -1.5;
			 s1  	= +1.5;
			 ds 	= (s1 - s0)/n;}
			if (checkboxInvert.checked)
			{s0    	= -2.5;
			 s1  	= +2.5;
			 ds 	= (s1 - s0)/n;}
		return res;
	}

function theCurve(t) {
			const tt	= sinh(t);
			const cvx	= aa*cosh(tt);
			const cvy   = aa*morph*sinh(tt);
		return [cvx, cvy];
	}
function dtheCurve(t) {
		//return [aa*sinh(t), aa*morph*cosh(t) ];
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}

/* ============ This function has to be called before changes: ============= */


let curve 	= [];
let mxyr	= [];
let rad 	= [];

function fillCurve() {
		inputParamFr.value = morph;
		scale 	= adaptScale();
		e1 = ee();  e2 = -ee();
		cirfc1.setAttribute("cx", e1);
		cirfc2.setAttribute("cx", e2);
		cirf2aa.setAttribute("cx", e2);
	if (checkboxConstr.checked)
			{cirf2aa.setAttribute("r",  ar);}
	else	{cirf2aa.setAttribute("r",  0);}
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
		
		const dis	= sqrt(sqr(py) + sqr(px-e2))/2;
		const sx	= e2 + aa/dis*(px-e2);
		const sy	= aa/dis*py;
		let tx		= 5*tan[0];
		let ty		= 5*tan[1];
		txtCon 	= 'M'+sx+' '+sy+'L'+e1+' '+0+'L'+px+' '+py+'l'+tx+' '+ty+'M'+px+' '+py;
		tx		= -tx;
		ty		= -ty;	
		txtCon	= txtCon+'l'+tx+' '+ty+'M'+px+' '+py+'L'+e2+' '+0;
		if (checkboxConstr.checked)	{
			cirfc3.setAttribute("cx", px);
			cirfc3.setAttribute("cy", py);
			cirfc4.setAttribute("cx", sx);
			cirfc4.setAttribute("cy", sy);
			if (mybackground == "black")	{
				cirfc3.setAttribute("style", "stroke:yellow");
				cirfc4.setAttribute("style", "stroke:yellow");	}
			else	{
				cirfc3.setAttribute("style", "stroke:blue");
				cirfc4.setAttribute("style", "stroke:blue");	}
			}
	return [qx, qy, abs(rdl)]; 
	}



function makeOscSvg(j) {
let newRadius = "";
let midX = "";
let midY = "";
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

function makeConstructionSvg(j) {
	let newRadius = "";
	let midX = "";
	let midY = "";
	[midX, midY, newRadius] =  getOscCirc2(j);
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
			txtn_ 	= '';
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
						ptsx = -ptsx; qtsx = -qtsx;
						txtn_ += 'M' +ptsx +' '+ptsy +'l'+qtsx +' '+qtsy;	
					}
					else	{
				    	qtsx = mxyr[i][0]; 	qtsy = mxyr[i][1];
				    	txtn += 'M' +ptsx +' '+ptsy +'L'+qtsx +' '+qtsy;
						ptsx = -ptsx; qtsx = -qtsx;
						txtn_ += 'M' +ptsx +' '+ptsy +'L'+qtsx +' '+qtsy;	
					}
				}
			//console.log("txtn =", txtn);
			normal.setAttribute("d",txtn+txtn_);
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
	txt_	= '';

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
    
    px = -px; hx = -hx; kx = -kx; qx = -qx;
    txt_ += 'M' +px + ' '+ py;
    txt_ += 'C' +hx + ' '+ hy;
    txt_ += ' ' +kx + ' '+ ky;
    txt_ += ' ' +qx + ' '+ qy;
	}
}

let jjc = 32;
let jjr = 0;
function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt+txt_ );
	
	if (checkboxInvert.checked)
		 {	cirInv.setAttribute("r", Rinv);
			cirfc1.setAttribute("style","fill:none; stroke:none");
			cirfc2.setAttribute("style","fill:none; stroke:none");	
		 }
	else {	cirInv.setAttribute("r", 0);	}

	 if (checkboxOsc.checked)	
	 	{
	 		makeOscSvg(jjc);  
	 		jjc++; if (jjc == n) {jjc = 0;}
	 	}
	 else	{ removeOscCirc();	}
			  
	 if (checkboxConstr.checked)	
	 	{	 
			cirf2aa.setAttribute("r", ar);
	 		makeConstructionSvg(jjr);  
	 		jjr++; if (jjr == n) {jjr = 0;}
	 		if (!checkboxInvert.checked)
				{paCon.setAttribute( "d", txtCon);}
	 	}
	 else	{ paCon.setAttribute( "d", '');	
			  cirf2aa.setAttribute("r", 0);
			  cirfc3.setAttribute("style","fill:none; stroke:none");
     	 	  cirfc4.setAttribute("style","fill:none; stroke:none");
			;}	
	 	
	if (checkboxNormal.checked)			{
			makeNormalsSVG();	
			;}
	else	{ normal.setAttribute( "d", '');
			}

div.appendChild(svgEl);
}




/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;


const startStopCircles = (() => {
	window.clearInterval(loopID2);
    checkboxConstr.checked = false;
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
    
const addConstruction = (() => {
		if (!(checkboxInvert.checked))	{
    	window.clearInterval(loopID1);
    	checkboxOsc.checked = false;
    	if ( checkboxConstr.checked ) {
    		window.clearInterval(loopID2);
    		loopID2 = window.setInterval(render, 60);
         	}
         else { window.clearInterval(loopID2);	}
    	}
    	else { 	// if (checkboxInvert.checked)
    			window.clearInterval(loopID2);
    			checkboxConstr.checked = false;
     	 	}	
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
     	{	path.setAttribute( 'stroke' , '#FFFFFF' );
     		paCon.setAttribute( 'stroke' , '#00FFFF' );
     		cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		rline.setAttribute( 'stroke' , '#FFFF00' );
     		cirInv.setAttribute("style","fill:none; stroke:gray");
     		if (!(checkboxInvert.checked))	{
     		cirfc1.setAttribute("style","fill:yellow; stroke:yellow");
     		cirfc2.setAttribute("style","fill:yellow; stroke:yellow");	}
     		cirf2aa.setAttribute("style","fill:none; stroke:cyan");	
     		if (checkboxConstr.checked)	{
     			cirfc3.setAttribute("style","fill:yellow; stroke:yellow");
     			cirfc4.setAttribute("style","fill:yellow; stroke:yellow");	}
     	}
    else{	path.setAttribute( 'stroke' , '#000000' );
    		paCon.setAttribute( 'stroke' , '#FF00FF' );
    		cir.setAttribute( 'stroke' , '#0000FF' );
    		rline.setAttribute( 'stroke' , '#0000FF' );
    		cirInv.setAttribute("style","fill:none; stroke:black");
     		if (!(checkboxInvert.checked))	{
     		cirfc1.setAttribute("style","fill:blue; stroke:blue");
     		cirfc2.setAttribute("style","fill:blue; stroke:blue");	}
     		cirf2aa.setAttribute("style","fill:none; stroke:magenta");
     		if (checkboxConstr.checked)	{
     			cirfc3.setAttribute("style","fill:blue; stroke:blue");
     			cirfc4.setAttribute("style","fill:blue; stroke:blue");		}
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
	checkboxConstr.checked = false;
    if ( checkboxInvert.checked ) {
         svgEl.setAttribute("viewBox"," -160 -140 370 320");
        }
    else {svgEl.setAttribute("viewBox"," -160 -140 370 320");
    	if (mybackground == "black")
    			{
    				cirfc1.setAttribute("style","fill:yellow; stroke:yellow");
     				cirfc2.setAttribute("style","fill:yellow; stroke:yellow");
    			}
    	else 	{
    				cirfc1.setAttribute("style","fill:blue; stroke:blue");
     				cirfc2.setAttribute("style","fill:blue; stroke:blue");
    			}
    	}
		fillCurve();
		makeTXTforpath();
		makeNormalsSVG();
		
		render(); 
	});

inputParamFr.value = morph;
function getMorphParam() {
		//window.clearInterval(loopID1);
		checkboxOsc.checked = false;
		morph 	= min(2, max(0.2, 1.0*inputParamFr.value));
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
		addConstruction();
		render();      
});


init();

inputParamFr.addEventListener("change", getMorphParam);
//inputParamSt.addEventListener("change", getyFrequency);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxConstr.addEventListener ('change', addConstruction , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
checkboxInvert.addEventListener ('change', toggleInversion , false);
};