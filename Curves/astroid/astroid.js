"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","700");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -190 -165 380 330");

const inputParamFr		= document.getElementById("param1");
const inputParamSt		= document.getElementById("param2");
const checkboxConst  	= document.getElementById('checkboxConst');
const checkboxTang		= document.getElementById('checkboxTang');
const checkboxLad		= document.getElementById('checkboxLad');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxConst.checked	= true;
checkboxTang.checked	= false;
checkboxLad.checked		= false;
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;
checkboxBackgrd.checked = false;
let mybackground     	= "black";
let myforeground     	= "white";


let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 1.5 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	svgEl.appendChild(path);
	
let pathd = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	pathd.setAttribute( 'stroke' , '#FF00FF' );
  	pathd.setAttribute( 'stroke-width' , 2 );
  	pathd.setAttribute( 'fill' , 'none' );
let txtd  = '';
	svgEl.appendChild(pathd);	
	
let achsen = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	achsen.setAttribute( 'stroke' , '#FFFFFF' );
  	achsen.setAttribute( 'stroke-width' , 0.4 );
  	achsen.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(achsen);
let txta = 'M'+' '+'-200'+' '+'0'+'L'+' '+'200'+' '+'0';
	txta = txta+'M'+' '+'0'+' '+'-200'+'L'+' '+'0'+' '+'200';
	achsen.setAttribute('d', txta);
let achsen45 = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	achsen45.setAttribute( 'stroke' , '#FF0000' );
  	achsen45.setAttribute( 'stroke-width' , 1.5 );
  	achsen45.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(achsen45);
let txta45 = 'M'+' '+'-200'+' '+'-200'+'L'+' '+'200'+' '+'200';
	txta45 = txta45+'M'+' '+'200'+' '+'-200'+'L'+' '+'-200'+' '+'200';
	achsen45.setAttribute('d', '');
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	normal.setAttribute("d",txtn);
	svgEl.appendChild(normal);
let normalmv = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normalmv.setAttribute( 'stroke' , '#007700' );
  	normalmv.setAttribute( 'stroke-width' , 1.5 );
  	normalmv.setAttribute( 'fill' , 'none' );
let txtnmv  	= '';
	normalmv.setAttribute("d",txtnmv);
	svgEl.appendChild(normalmv);

let cirst	= document.createElementNS("http://www.w3.org/2000/svg","circle");	
	cirst.setAttribute("style","fill:none; stroke-width:1");
    cirst.setAttribute( 'stroke' , '#FFFF00' );
    cirst.setAttribute("cx", 0);
	cirst.setAttribute("cy", 0);
	svgEl.appendChild(cirst);
let cirrl	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrl.setAttribute("style","fill:none; stroke-width:1");
	cirrl.setAttribute( 'stroke' , '#FFFF00' );			
	cirrl.setAttribute("cx", 0);
	cirrl.setAttribute("cy", 0);
	cirrl.setAttribute("r", 0);
	svgEl.appendChild(cirrl);
let cirrl2	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrl2.setAttribute("style","fill:none; stroke-width:1");
	cirrl2.setAttribute( 'stroke' , '#999999' );			
	cirrl2.setAttribute("cx", 0);
	cirrl2.setAttribute("cy", 0);
	cirrl2.setAttribute("r", 0);
	//svgEl.appendChild(cirrl2);  // not used in Astroid

// Thick dots:
let cirtm	= [];
for (let i=1; i < 5; i++)
{
	cirtm[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirtm[i].setAttribute("style","fill:#007700; stroke:#007700; stroke-width:1");
	cirtm[i].setAttribute("cx", 0);
	cirtm[i].setAttribute("cy", 0);
	cirtm[i].setAttribute("r", 0);
	svgEl.appendChild(cirtm[i]);
}
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

let jjc = 0;
let jjr = 0;
let jjl = 0;


/* ============== Definition of curve: =========== */

const frequency = -3;
let n_angle		= 0;
let cosangl		= cos(n_angle*pi/2);
let sinangl		= sin(n_angle*pi/2);
let stick		= 1;
let scale;
const RR		= 9;
let rad			= RR/frequency;
let strt		= RR - rad;
let sticklength	= abs(rad)*stick;
let rho			= -1;
const aa		= RR+sticklength;  // = norm1(theCurve(0));	

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
			let res;
			if (checkboxConst.checked || checkboxTang.checked) 	
				{ res = 9; 
				if (stick > 1.4) {res = res*4/(3+stick);}
				}
			else 						
				{ res = 6; 
				}
			rho		= abs(res*rad);
		return res;
	}


let s0 = 0.0; //0.0001*pi;
let s1 = 2*pi;
		
		
const n 	= 256;
const ds 	= (s1 - s0)/n;
const ns 	= 2;

let curve 	= [];

function fillCurve() {
		let result;
		scale 	= adaptScale();
		cosangl	= cos(n_angle*pi/2);
		sinangl	= sin(n_angle*pi/2);
		let t = 0;
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
} //  make circles with radius -- append in render()


function removeRollconst()	{
			for (let i=1; i < 5; i++)
			{	cirtm[i].setAttribute("r", 0.1);	}
			pathd.setAttribute( "d" , '' );

    		cirst.setAttribute("r","0");
    		cirrl.setAttribute("r","0");
    		rstick.setAttribute("d",'');
    		tancon.setAttribute("d",'');
    		normalmv.setAttribute("d",'');
    		achsen45.setAttribute('d', '');
    		achsen.setAttribute( 'stroke-width' , 0.4 );
}

function removeTangconst()	{
			for (let i=1; i < 5; i++)
			{	cirtm[i].setAttribute("r", 0.1);	}
			//pathd.setAttribute( "d" , '' );

    		//cirst.setAttribute("r","-1");
    		//cirrl.setAttribute("r","-1");
    		//rstick.setAttribute("d",'');
    		tancon.setAttribute("d",'');
    		txtnmv = '';
    		normalmv.setAttribute("d",txtnmv);
    		achsen45.setAttribute('d', '');
}

function makeRollSvg(j)	{
	const tj 	= s0+j*ds;	
	const mx 	= scale*RR*cos(tj);
	const my 	= scale*RR*sin(tj);
	const Mx 	= mx/2; 
	const My 	= my/2;
	 	rho		= abs(scale*rad);
	const qx = scale*theCurve(tj)[0];
	const qy = scale*theCurve(tj)[1];
	cirrl.setAttribute("r", rho);
	cirrl.setAttribute("cx", mx);
	cirrl.setAttribute("cy", my);    
    txtst = 'M'+mx+' '+my+ ' L'+qx+' '+qy;
    rstick.setAttribute("d", txtst );
    if (stick == 1)
    {

//     	cirtm[0].setAttribute("cx", Mx);
// 		cirtm[0].setAttribute("cy", My);
		for (let i=1; i < 3; i++)
		{	cirtm[i].setAttribute("r", 2.5);	}
	}
	else
	{
		for (let i=1; i < 3; i++)
		{	cirtm[i].setAttribute("r", 0);	}
	}
	const tan	= dtheCurve(tj);
	const nx	= -8*tan[1];
	const ny	= 8*tan[0];
	
	const bx 	= scale*strt*cos(tj);
	const by 	= scale*strt*sin(tj);
	let tx		= 8*tan[0];
	let ty		= 8*tan[1];
	let xt		= -tx;
	let yt		= -ty;
	if (stick == 1)
	{
		const tnm	= sqrt(tx*tx + ty*ty);
		if (tnm > 0) 
			 { 	tx = scale*aa*sgn(qx)*abs(tx)/tnm;
			 	xt = 0; 
			 	yt = scale*aa*sgn(qy)*abs(ty)/tnm; 
			 	ty = 0;}
		else { tx = qx;  ty = qy; xt = 0; yt = 0;}
		
		txttn = 'M'+bx+' '+by+'L'+qx+' '+qy+'L'+tx+' '+ty+ 'L'+xt+' '+yt;		
    	 cirtm[1].setAttribute("cx", tx);
		 cirtm[1].setAttribute("cy", ty);
    	 cirtm[2].setAttribute("cx", xt);
		 cirtm[2].setAttribute("cy", yt);
		}
	else
    	{txttn = 'M'+bx+' '+by+'L'+qx+' '+qy + 'l'+tx+' '+ty+'M'+qx+' '+qy + 'l'+xt+' '+yt;}
    tancon.setAttribute("d", txttn );
    
    if (!(checkboxTang.checked))
    { removeTangconst(); }
}

function makeLadderSvg(j)	{
	if ((stick == 1)&& checkboxLad.checked)
	{
		const tj 	= s0+j*ds;	
		const qx = scale*theCurve(tj)[0];
		const qy = scale*theCurve(tj)[1];
		const tan	= dtheCurve(tj);
		
		//const bx 	= scale*strt*cos(tj);
		//const by 	= scale*strt*sin(tj);
		let tx		= 8*tan[0];
		let ty		= 8*tan[1];
		let xt		= -tx;
		let yt		= -ty;
		const tnm	= sqrt(tx*tx + ty*ty);
		if (tnm > 0) 
			 { 	tx = scale*aa*sgn(qx)*abs(tx)/tnm;
			 	xt = 0; 
			 	yt = scale*aa*sgn(qy)*abs(ty)/tnm; 
			 	ty = 0;}
		else { tx = qx;  ty = qy; xt = 0; yt = 0;}
		
		txttn = 'M'+qx+' '+qy+'L'+tx+' '+ty+ 'L'+xt+' '+yt; //+bx+' '+by+'L'
		tancon.setAttribute("d", txttn );		
    	 cirtm[1].setAttribute("cx", tx);
		 cirtm[1].setAttribute("cy", ty);
    	 cirtm[2].setAttribute("cx", xt);
		 cirtm[2].setAttribute("cy", yt);
		// Large Ladder
		const nx	= -8*tan[1];
		const ny	= 8*tan[0];
		//console.log("nx,ny =",nx,ny);
		const sgxy	= sgn(qx*qy);		
		let lam;
		let Nx;
		let Ny;
		if (!(abs(nx+sgxy*ny) < epsD)) {
			lam		= -(qx + sgxy*qy)/(nx+sgxy*ny);
			Nx		= nx*lam;
			Ny		= ny*lam;
			}
		else	{
				Nx	=  qy;
				Ny	= -qx;
				}
		txtnmv	= 'M'+qx+' '+qy+'l'+Nx+' '+Ny;		
    	cirtm[3].setAttribute("cx", qx+Nx);
		cirtm[3].setAttribute("cy", qy+Ny);
		if (!(abs(nx-sgxy*ny) < epsD)) {
			lam		= -(qx - sgxy*qy)/(nx-sgxy*ny);
			Nx		= nx*lam;
			Ny		= ny*lam;		
			//console.log("Nx,Ny =",Nx,Ny);
			}
		else	{
				Nx	= -qy;
				Ny	=  qx;
				} 
		txtnmv	= txtnmv + 'M'+qx+' '+qy+'l'+Nx+' '+Ny;
		normalmv.setAttribute("d",txtnmv);
    	cirtm[4].setAttribute("cx", qx+Nx);
		cirtm[4].setAttribute("cy", qy+Ny);
		for (let i=1; i < 5; i++)
		{	cirtm[i].setAttribute("r", 2.5);	}
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
		let nns		= 2;
			txtn  	= '';
		for (let i = 0;  i < n/nns; i++)	{
			aux		  = [- curve[nns*i][1][1], curve[nns*i][1][0]];
			kap		  = kappa(s0+nns*i*ds);
			if (!(abs(kap) < epsD)) { 
				nrml	= scalTimesVec1(cosangl*scale/kap/norm1(aux), aux);
				tngl	= [nrml[1], -nrml[0]]; 
				ptsx	= curve[nns*i][0][0]*scale;
				ptsy	= curve[nns*i][0][1]*scale;
				qtsx 	= ptsx + nrml[0]*cosangl + nrml[1]*sinangl;
				qtsy 	= ptsy + nrml[1]*cosangl - nrml[0]*sinangl;
			
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
	if (!stopAt_jjr || (ns*(i+1) < jjr+1) || (ns*(i+1) < jjl+1) )
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

// let jjc = 0; see initial declarations
// let jjr = 0;

function render() {
	// console.log("txt = ",txt);
	
	path.setAttribute( "d" , txt );
		

	if (checkboxConst.checked)	{
		jjl  = 0;
	 	txtd = makeTXTforpath(curve,true);
		pathd.setAttribute( "d" , txtd );
	 	makeRollSvg(jjr); 
	 	jjr++; if (jjr == n) {jjr = 0;}
	 }

	if (checkboxLad.checked)	{
	 	jjr  = 0;
	 	txtd = makeTXTforpath(curve,true);
		pathd.setAttribute( "d" , txtd );
	 	makeLadderSvg(jjl); 
	 	jjl++; if (jjl == n) {jjl = 0;}
	 }
	 
	 

	if (checkboxOsc.checked)	{
	 	makeOscSvg(jjc);  
	 	jjc++; if (jjc == n) {jjc = 0;}
		}
	else	{	removeOscCirc();	}
	 	
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

const addConstruction = (() => {
	window.clearInterval(loopID1);
	window.clearInterval(loopID3);
	if(checkboxLad.checked)  {
		checkboxTang.checked = false;
		checkboxLad.checked  = false;
	  }
	if ( checkboxConst.checked || checkboxTang.checked ) 
		{
			checkboxNormal.checked = false;
			checkboxOsc.checked = false;
			scale = adaptScale();
			cirst.setAttribute("r",scale*strt);
			fillCurve();
			txt	= makeTXTforpath(curve,false);
    		window.clearInterval(loopID2);
    		loopID2 = window.setInterval(render, 90);
    	}
    else { window.clearInterval(loopID2);
    		scale = adaptScale();
    	}

	});

const addLadders = (() => {
		checkboxOsc.checked 	= false;
		checkboxConst.checked 	= false;
		checkboxTang.checked	= false;
		if ( checkboxLad.checked ) {			  
			  removeRollconst();
			  stick	= 1;
			  inputParamSt.value = stick;
			  getStickFactor();
			  
			  achsen.setAttribute( 'stroke-width' , 1 );
			  achsen45.setAttribute('d', txta45);
			  scale = adaptScale();
			  fillCurve();
			  txt	= makeTXTforpath(curve);
			  makeNormalsSVG();
    		  window.clearInterval(loopID3);
    		  loopID3 = window.setInterval(render, 150);
			}
		else {
				window.clearInterval(loopID3);
			}
	
	});
	
const startStopCircles = (() => {	
    checkboxLad.checked = false;
    window.clearInterval(loopID2);
    window.clearInterval(loopID3);		
    if ( checkboxOsc.checked ) {
    		checkboxConst.checked = false;
    		removeRollconst();
			fillCurve();
			txt	= makeTXTforpath(curve,false);
			makeNormalsSVG();
    		window.clearInterval(loopID1);
    		loopID1 = window.setInterval(render, 90);
         }
    else { window.clearInterval(loopID1);} 
    });
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
    	checkboxConst.checked = false;
    	scale = adaptScale();
		removeRollconst();
		fillCurve();
		txt	= makeTXTforpath(curve);
		makeNormalsSVG();
        }
    else {  normal.setAttribute("d",''); 
    	} 
    if ( checkboxLad.checked ) { addLadders(); }	
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
     		 achsen.setAttribute( 'stroke' , '#FFFFFF' );
     		 cirst.setAttribute( 'stroke' , '#DDDD00' );
     		 cirrl.setAttribute( 'stroke' , '#DDDD00' );
     		 rstick.setAttribute( 'stroke' , '#DDDD00' );
     		 //tancon.setAttribute( 'stroke' , '#AFAFAF' );
     		 cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 rline.setAttribute( 'stroke' , '#FFFF00' );
     		}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 achsen.setAttribute( 'stroke' , '#000000' );
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
    if ( checkboxLad.checked ) { addLadders(); }
	render();
    });
    

inputParamFr.value = n_angle;
function getFrequency() {
		checkboxConst.checked = false;
		n_angle 	= min(1, max(0, 1.0*inputParamFr.value));
		inputParamFr.value = n_angle;
		cosangl	= cos(n_angle*pi/2);
		sinangl	= sin(n_angle*pi/2);
		scale 	= adaptScale();
		removeRollconst();
		fillCurve();
		txt	= makeTXTforpath(curve);
		makeNormalsSVG();
		
		render();
}

inputParamSt.value = stick;
function getStickFactor() {
		checkboxConst.checked = false;
		stick		= min(5,max(0, 1.0*inputParamSt.value));
		inputParamSt.value = stick;
		if (!(stick == 1))
			{checkboxLad.checked = false;}
		sticklength = abs(rad)*stick;
		scale = adaptScale();
		removeRollconst();
		fillCurve();
		txt	= makeTXTforpath(curve);
		makeNormalsSVG();
		
		render();
}

const init = (() => {
		fillCurve();
		//console.log("curve",curve);
		txt	= makeTXTforpath(curve,false);
		//makeNormalsSVG();
		addConstruction();
		render();      
});


init();

inputParamFr.addEventListener("change", getFrequency);
inputParamSt.addEventListener("change", getStickFactor);
checkboxConst.addEventListener ('change', addConstruction , false);
checkboxTang.addEventListener ('change', addConstruction , false);
checkboxLad.addEventListener ('change', addLadders , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};