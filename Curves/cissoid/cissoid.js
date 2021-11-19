"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -200 -200 380 330");

//const inputParamFr		= document.getElementById("param1");
const inputParamSt		= document.getElementById("param2");
const checkboxConst  	= document.getElementById('checkboxConst');
//const checkboxTang		= document.getElementById('checkboxTang');
const checkboxCurves	= document.getElementById('checkboxCurves');
const checkboxRand		= document.getElementById('checkboxRand');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxConst.checked	= false;
checkboxCurves.checked	= false;
checkboxRand.checked	= false;
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= true;
checkboxBackgrd.checked = false;
let mybackground     	= "black";
let myforeground     	= "white";


let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 2 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	svgEl.appendChild(path);
// for drawing more than one curve	
let path2 = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path2.setAttribute( 'stroke' , '#FFFFFF' );
  	path2.setAttribute( 'stroke-width' , 0.5 );
  	path2.setAttribute( 'fill' , 'none' );
let txtp2  = '';
	path.setAttribute( 'd', txtp2);
	svgEl.appendChild(path2);
// for redrawing the curve slowly	
let pathd = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	pathd.setAttribute( 'stroke' , '#FF00FF' );
  	pathd.setAttribute( 'stroke-width' , 2.5);
  	pathd.setAttribute( 'fill' , 'none' );
let txtd  = '';
	svgEl.appendChild(pathd);

let res = 6;

let laxis = document.createElementNS( "http://www.w3.org/2000/svg", "line" );
	laxis.setAttribute("style","fill:none; stroke:white; stroke-width:0.5");
	//svgEl.appendChild(laxis);
let maxis = document.createElementNS( "http://www.w3.org/2000/svg", "line" );
	maxis.setAttribute("style","fill:none; stroke:white; stroke-width:0.5");
	//svgEl.appendChild(maxis);
	
let xaxis = document.createElementNS( "http://www.w3.org/2000/svg", "line" );
	xaxis.setAttribute("style","fill:none; stroke:yellow; stroke-width:0.5");
	xaxis.setAttribute("x1", -300);
	xaxis.setAttribute("y1", -10*res);
	xaxis.setAttribute("x2", 300);
	xaxis.setAttribute("y2", -10*res);
	svgEl.appendChild(xaxis);		
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	normal.setAttribute("d",txtn);
	svgEl.appendChild(normal);

let cirst	= document.createElementNS("http://www.w3.org/2000/svg","circle");	
	cirst.setAttribute("style","fill:none; stroke-width:1");
    cirst.setAttribute( 'stroke' , '#FFFFFF' );
    cirst.setAttribute("cx", 0);
	cirst.setAttribute("cy", 0);
	cirst.setAttribute("r", 2);
	svgEl.appendChild(cirst); // origin
let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrl.setAttribute("style","fill:none; stroke-width:1");
	cirrl.setAttribute( 'stroke' , '#FFFF00' );			
	cirrl.setAttribute("cx", 0);
	cirrl.setAttribute("cy", 0);
	cirrl.setAttribute("r", 0);
	//svgEl.appendChild(cirrl);
	
let rstick  = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	rstick.setAttribute("style","fill:none; stroke-width:2");
	rstick.setAttribute( 'stroke' , '#FFFF00' );
let txtst	= '';
	svgEl.appendChild(rstick);
let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	tancon.setAttribute("style","fill:none; stroke-width:1.0");
	tancon.setAttribute( 'stroke' , '#007700' );
    //tancon.setAttribute( 'stroke-dasharray', '1');
let txttn	= '';
	tancon.setAttribute("d",txttn);
	svgEl.appendChild(tancon);
		
// Thick dots
let cirtm	= [];
for (let i=0; i < 10; i++)
{
	cirtm[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirtm[i].setAttribute("style","fill:#FF00FF; stroke:#FF00FF; stroke-width:1");
	if (i==1) cirtm[i].setAttribute("style","fill:#FFFF00; stroke:#FFFF00");
	else if (i == 2) {cirtm[2].setAttribute("style","fill:#007700; stroke:#007700");}
			
	cirtm[i].setAttribute("cx", 0);
	cirtm[i].setAttribute("cy", 0);
	
	cirtm[i].setAttribute("r", 2.5);
	svgEl.appendChild(cirtm[i]);
}
	

const numDots	= 800;	
let cirrnd0		= [];
let cirrnd1		= [];
// see: addRandots() for radius attribute
for (let i=0; i<numDots; i++)
	{
	cirrnd0[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrnd0[i].setAttribute("style","fill:'#666666'; stroke-width:1");
	cirrnd0[i].setAttribute( 'stroke' , '#666666' );
	cirrnd0[i].setAttribute("r", 0.4);
	//svgEl.appendChild(cirrnd0[i]);
	
	cirrnd1[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrnd1[i].setAttribute("style","fill:'#666666'; stroke-width:1");
	cirrnd1[i].setAttribute( 'stroke' , '#666666' );
	cirrnd1[i].setAttribute("r", 0.4);
	//svgEl.appendChild(cirrnd1[i]);
	}

// Osculating circles
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

let jjc = 0;
let jjr = 0;


/* ============== Definition of curve: =========== */

const frequency = 2;
let stick		= 2.0;
let scale;
const bb        = 10;
const fac		= 0.25;
let kk			= fac * stick;

function theCurve(t) {
			//const tt	= 1.0*atan(4*t);
			const cvx	= bb*sin(t)*(1/(1+cos(t)) -kk);
			const cvy   = -bb*(1 - kk*cos(t));
		return [cvx, cvy];
	}
function dtheCurve(t) {
		
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dtheCurve);
}


/* ============ important globals for curve ============= */
function adaptScale() {

		return res;
	}

		
		let s0 = -3;
		let s1 = +3;
		
const n 	= 128;
;
const ds 	= (s1 - s0)/n;
const ns 	= 4;

let curve 	= [];
let curve2	= [];
let rndx 	= [];
let rndy 	= [];
let altern	= 0;

function fillCurve(xStick) {
		let result	= [];
		scale 	= adaptScale();
		let t = 0;
		for (let i=0; i<n+1; i++)
		{
		   t = s0 +(s1-s0)*(i/n);
		   result 	= [theCurve(t), dtheCurve(t)];
		curve[i] 	= result;
		}
  // 	if (!(xStick == stick))  // do all
		{ const savedStick = stick;
		  stick = xStick;
		  kk	= fac * stick;
		  for (let i=0; i<n+1; i++)
			{
		   		t = s0 +(s1-s0)*(i/n);
		   		result 		= [theCurve(t), dtheCurve(t)];
				curve2[i] 	= result;
			}
		  stick 		= savedStick;
		  kk	= fac * stick;
		}
		rndx 	= random_(numDots);
		rndy	= random_(numDots);

	return curve;
}

/* ============    
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
	function getOscCirc(j) 
	{
		const pos = curve[j][0];
		const tan = curve[j][1];
		const krad = 1/kappa(s0+j*ds);
		const unrml = [-tan[1], tan[0]];
		const mdif  = scalTimesVec1(krad/norm1(unrml), unrml);
		px	= pos[0]*scale;  py  = pos[1]*scale;
		qx  = (mdif[0]+pos[0])*scale;   qy  = (mdif[1]+pos[1])*scale;
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
	return [abs(krad), mdif[0]+pos[0], mdif[1]+pos[1]];  // not scaled
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
} //  make circles with radius -- append in render()


function removeRollconst()	{
	if (!(checkboxConst.checked))
	{
			for (let i=0; i < 10; i++)
 				{	cirtm[i].setAttribute("r", 0);	}
			pathd.setAttribute( "d" , '' );

    		rstick.setAttribute("d",'');
    		tancon.setAttribute("d",'');
    		if (laxis.parentElement)
    			{svgEl.removeChild(laxis);}
    		if (maxis.parentElement)
    			{svgEl.removeChild(maxis);}
    }
}

function removeTangconst()	{
    		tancon.setAttribute("d",'');
}

function makeConstructSvg(j)	{
	const tj 	= s0+j*ds;
		kk		= 0;
	const Mx 	= scale*theCurve(tj)[0];
	const My 	= scale*theCurve(tj)[1];
	const nM	= sqrt(sqr(Mx) + sqr(My));
		kk		= fac * 4;
	const Nx 	= scale*theCurve(tj)[0];
	const Ny 	= scale*theCurve(tj)[1];
		kk		= fac * stick;
	const qx 	= scale*theCurve(tj)[0];
	const qy 	= scale*theCurve(tj)[1];
	const mx 	= 0;
	const my 	= 0;
	let stx		= fac*(Nx - Mx);
	let sty		= fac*(Ny - My);
	
		//const tan	= dtheCurve(tj);
	let bx;
	let by;
	if (!(Mx == 0))
	{ 
		const ans	= intersectLines([mx,my],[-Ny,Nx], [Mx,My],[Mx,0]);
	 		bx 		= ans[1][0];
	 		by 		= ans[1][1];
	 } 
	 else{
	 		bx	= 0;
	 		by	= My/2;
	 }
	let tx		= 2*(qy - by);
	let ty		= 2*(bx - qx);
	const xt	= -tx;
	const yt	= -ty;

    txttn = 'M'+mx+' '+my+'L'+bx+' '+by+'L'+Mx+' '+My+'M'+bx+' '+by;
    txttn = txttn +'L'+qx+' '+qy + 'l'+tx+' '+ty+'M'+qx+' '+qy + 'l'+xt+' '+yt;
    tancon.setAttribute("d", txttn );
	
    txtst = 'M'+mx+' '+my+'L'+Nx+' '+Ny+'L'+Mx+' '+My;
    rstick.setAttribute("d", txtst );
    
    let ncr	= 0;
    if (Mx == 0)  { ncr = 3; }
    laxis.setAttribute("x1", -100*(Nx+ncr));
	laxis.setAttribute("y1", -100*Ny);
	laxis.setAttribute("x2", 100*(Nx+ncr));
	laxis.setAttribute("y2", 100*Ny);
	
	maxis.setAttribute("x1", Mx+7*stx);
	maxis.setAttribute("y1", My+7*sty);
	maxis.setAttribute("x2", Mx-7*stx);
	maxis.setAttribute("y2", My-7*sty);
	
    
    cirtm[0].setAttribute("cx", qx);
	cirtm[0].setAttribute("cy", qy);
	cirtm[1].setAttribute("cx", Mx);
	cirtm[1].setAttribute("cy", My);
	cirtm[2].setAttribute("cx", bx);
	cirtm[2].setAttribute("cy", by);
	for (let i=0; i < 3; i++)
 				{	cirtm[i].setAttribute("r", 2.5);	}
	if (checkboxCurves.checked)
	{
		cirtm[3].setAttribute("cx", Mx+1*stx);
		cirtm[3].setAttribute("cy", My+1*sty);
		cirtm[4].setAttribute("cx", Mx+3*stx);
		cirtm[4].setAttribute("cy", My+3*sty);
		cirtm[5].setAttribute("cx", Mx+5*stx);
		cirtm[5].setAttribute("cy", My+5*sty);
		cirtm[6].setAttribute("cx", Mx+7*stx);
		cirtm[6].setAttribute("cy", My+7*sty);
		cirtm[7].setAttribute("cx", Mx-1*stx);
		cirtm[7].setAttribute("cy", My-1*sty);
		cirtm[8].setAttribute("cx", Mx-5*stx);
		cirtm[8].setAttribute("cy", My-5*sty);
		cirtm[9].setAttribute("cx", Mx-7*stx);
		cirtm[9].setAttribute("cy", My-7*sty);
	    for (let i=3; i < 10; i++)
 				{	cirtm[i].setAttribute("r", 2.5);	}
	}
	else {
		for (let i=3; i < 10; i++)
 				{	cirtm[i].setAttribute("r", 0);	}
	}
	
	
     if (checkboxRand.checked)
    {
    	let rnx;
    	let rny;
    	const b0x	= 7*stx;
    	const b0y	= 7*sty;
    	const b1x	= -b0y;
    	const b1y	= +b0x;
    	// moves the square boundary
//     	const sq1x  = mx + b0x + b1x;
//     	const sq1y  = my + b0y + b1y;
//     	const sq2x  = mx + b0x - b1x;
//     	const sq2y  = my + b0y - b1y;
//     	const sq3x  = mx - b0x - b1x;
//     	const sq3y  = my - b0y - b1y;
//     	const sq4x  = mx - b0x + b1x;
//     	const sq4y  = my - b0y + b1y;
//     	txtst		= txtst+'M'+' '+sq1x+' '+sq1y+' '+'L'+' '+sq2x+' '+sq2y;
//     	txtst		= txtst+'L'+' '+sq3x+' '+sq3y+' '+'L'+' '+sq4x+' '+sq4y;
		if (altern == 0)
		{
			for (let i=0; i<numDots; i++)
			{            //if (i < 3) {console.log("mx",);}
				rnx	= Mx + rndx[i]*b0x + rndy[i]*b1x;
				rny	= My + rndx[i]*b0y + rndy[i]*b1y;
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
				rnx	= Mx + rndx[i]*b0x + rndy[i]*b1x;
				rny	= My + rndx[i]*b0y + rndy[i]*b1y;
				cirrnd1[i].setAttribute("cx", rnx);
				cirrnd1[i].setAttribute("cy", rny);
				svgEl.appendChild(cirrnd1[i]);
			}
			altern = 0;
		}	
	
	}          
}

/* ============================================================= */

function makeNormalsSVG() {
		let nrml 	= [];
		let tngl	= [];
		let aux		= [];
		let kap		= 1;
		let ptsx	= 0;
		let ptsy	= 0;
		let qtsx	= 0;
		let qtsy	= 0;
		let nns		= 1;
			txtn  	= '';
		for (let i = 0;  i < n/nns; i++)	{
			aux		  = [- curve[nns*i][1][1], curve[nns*i][1][0]];
			kap		  = kappa(s0+nns*i*ds);
			if (!(abs(kap) < epsD)) { 
				nrml	= scalTimesVec1(scale/kap/norm1(aux), aux);
				tngl	= [nrml[1], -nrml[0]]; 
				ptsx	= curve[nns*i][0][0]*scale;
				ptsy	= curve[nns*i][0][1]*scale;
				qtsx 	= ptsx + nrml[0];
				qtsy 	= ptsy + nrml[1];
			
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


function makeTXTforpath(cCurve,stopAt_jjr)   // theCurve(t)
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
	if (!stopAt_jjr || (ns*(i+1) < jjr+1) )
		{
			ttxt += 'M' +px + ' '+ py;
    		ttxt += 'C' +hx + ' '+ hy;
    		ttxt += ' ' +kx + ' '+ ky;
    		ttxt += ' ' +qx + ' '+ qy;
    	}
	}
	return ttxt;
}

/* ============================================================= */

function hideDots()	{
	if (!( checkboxRand.checked )) 
	{
		for (let i=0; i<numDots; i++)
    		{	if (cirrnd0[i].parentElement)
    			{ svgEl.removeChild(cirrnd0[i]);}
    		 	if (cirrnd1[i].parentElement)
    			{ svgEl.removeChild(cirrnd1[i]);}
    		}
    }
}

// let jjc = 0; see initial declarations
// let jjr = 0;

function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );
		

	if ((checkboxConst.checked)||(checkboxRand.checked))	
	{
	 	txtd = makeTXTforpath(curve,true);
		pathd.setAttribute( "d" , txtd );
		
	 	makeConstructSvg(jjr); 
	 	jjr++; if (jjr == n) {jjr = 0;}
	 }

	if (checkboxOsc.checked)	{
	 	makeOscSvg(jjc);  
	 	jjc++; if (jjc == n) {jjc = 0;}
		}
	else	{ removeOscCirc(); }
	 	
	if (checkboxNormal.checked)			{
			normal.setAttribute("d",txtn);	
			}
	else	{normal.setAttribute("d",''); 
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
    		svgEl.appendChild(laxis);
    		svgEl.appendChild(maxis);
    		loopID3 = window.setInterval(render, 60);
         }
    else {  
        	checkboxConst.checked = false;
         } 
    });

const addConstruction = (() => {
	checkboxOsc.checked = false;
	window.clearInterval(loopID1);
	window.clearInterval(loopID3);
 	if (!checkboxConst.checked)
 		{checkboxRand.checked = false;}
	if ( checkboxConst.checked ) 
		{   svgEl.appendChild(laxis);
			svgEl.appendChild(maxis);
			scale = adaptScale();
			txt		= makeTXTforpath(curve,false);
			if (!(checkboxRand.checked)) 
    			{hideDots();}
    		window.clearInterval(loopID2);
    		loopID2 = window.setInterval(render, 90);
    	}
    else { window.clearInterval(loopID2);
    		scale = adaptScale();    		
    	}

	});
	
const addCurves =(() =>	{
		if ( checkboxCurves.checked )
			{ path2.setAttribute( "d" , txtp2 );
				{if (checkboxConst.checked )	
					for (let i=0; i < 10; i++)
						{	cirtm[i].setAttribute("r", 2.5);	}
				}
			}
		else
			{path2.setAttribute( "d" , '' );
			for (let i=0; i < 10; i++)
				{ cirtm[i].setAttribute("r", 0);	}
			}
		render();
	});


const startStopCircles = (() => {
    checkboxConst.checked	= false;
    checkboxRand.checked	= false;
    path2.setAttribute( "d" , '' );
    checkboxCurves.checked	= false;
    for (let i=0; i < 10; i++)
			{	cirtm[i].setAttribute("r", 0);	}	
    window.clearInterval(loopID2);
    window.clearInterval(loopID3);
    hideDots();		
    if ( checkboxOsc.checked ) {
    		checkboxConst.checked = false;
    		removeRollconst();
			fillCurve(0);
			txt	= makeTXTforpath(curve,false);
			makeNormalsSVG();
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 50);
         }
    else { window.clearInterval(loopID1);} 
    });
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
    	//checkboxConst.checked = false;
    	scale = adaptScale();
		fillCurve(0);
		txt	= makeTXTforpath(curve,false);
		makeNormalsSVG();
        }
    else {  normal.setAttribute("d",''); 
    	} 
    if (!(checkboxRand.checked)) 
    			{hideDots();}	
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
     		 path2.setAttribute( 'stroke' , '#FFFFFF' );
     		 cirst.setAttribute( 'stroke' , '#FFFFFF' );
     		 laxis.setAttribute("style","fill:none; stroke:white; stroke-width:0.5");
     		 maxis.setAttribute("style","fill:none; stroke:white; stroke-width:0.5");
     		 rstick.setAttribute( 'stroke' , '#DDDD00' );
     		 xaxis.setAttribute("style","stroke:yellow");
     		 cirtm[1].setAttribute("style","fill:yellow; stroke:yellow");
     		 //tancon.setAttribute( 'stroke' , '#AFAFAF' );
     		 cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 rline.setAttribute( 'stroke' , '#FFFF00' );
     		}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 path2.setAttribute( 'stroke' , '#000000' );
    		 cirst.setAttribute( 'stroke' , '#000000' );
    		 laxis.setAttribute("style","fill:none; stroke:black; stroke-width:0.5");
    		 maxis.setAttribute("style","fill:none; stroke:black; stroke-width:0.5");
			 rstick.setAttribute( 'stroke' , '#0000FF' );
			 xaxis.setAttribute("style","stroke:blue");
			 cirtm[1].setAttribute("style","fill:blue; stroke:blue");
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
    if (!(checkboxRand.checked)) 
    			{hideDots();}
	render();
    });
    


//function getFrequency() {
	//	checkboxConst.checked = false;
	//n_angle 	= min(1, max(0, 1.0*inputParamFr.value));
	//	inputParamFr.value = n_angle;
	//	cosangl	= cos(n_angle*pi/2);
	//	sinangl	= sin(n_angle*pi/2);
	//	scale 	= adaptScale();
	//	removeRollconst();
	//	path2.setAttribute( "d" , '' );
    //	checkboxCurves.checked	= false;
	//	for (let i=0; i < 10; i++)
 	//		{	cirtm[i].setAttribute("r", 0);	}
	//	checkboxRand.checked	= false;
	//	hideDots();
	//	fillCurve(0);
	//	txt	= makeTXTforpath(curve);
	//	makeNormalsSVG();
	//	
	//	render();
//}

inputParamSt.value = stick;
function getStickFactor() {
		//checkboxConst.checked = false;
		stick		= min(7.0,max(-7, 1.0*inputParamSt.value));
		stick = 0.5*floor(2.0*stick);
		inputParamSt.value = stick;
		kk		= fac * stick;
		scale = adaptScale();
		removeRollconst();
		hideDots();
		fillCurve(0);
		txt	= makeTXTforpath(curve);
		if (checkboxNormal.checked)
			{ makeNormalsSVG(); }
		
		render();
}

const init = (() => {
		fillCurve(stick);
		//console.log("curve",curve);
		txt	= makeTXTforpath(curve,false);
		fillCurve(7.0);
		txtp2	= makeTXTforpath(curve2,false);
		fillCurve(5.0);
		txtp2	= txtp2 + makeTXTforpath(curve2,false);
		fillCurve(3.0);
		txtp2	= txtp2 + makeTXTforpath(curve2,false);
		fillCurve(1.0);
		txtp2	= txtp2 + makeTXTforpath(curve2,false);
		fillCurve(-1.0);
		txtp2	= txtp2 + makeTXTforpath(curve2,false);
		fillCurve(-3.0);
		txtp2	= txtp2 + makeTXTforpath(curve2,false);
		fillCurve(-5.0);
		txtp2	= txtp2 + makeTXTforpath(curve2,false);
		fillCurve(-7.0);
		txtp2	= txtp2 + makeTXTforpath(curve2,false);		
		makeNormalsSVG();
		//addConstruction();
		addCurves();
		//addRandots();
		render();      
});


init();

//inputParamFr.addEventListener("change", getFrequency);
inputParamSt.addEventListener("change", getStickFactor);
checkboxConst.addEventListener ('change', addConstruction , false);
checkboxCurves.addEventListener ('change', addCurves , false);
checkboxRand.addEventListener ('change', addRandots , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};