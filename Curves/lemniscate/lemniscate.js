"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -190 -140 370 320");

const inputParamff		= document.getElementById("stick");
const inputParamcc		= document.getElementById("rod");
const checkboxConstr  	= document.getElementById('checkboxConstr');
const checkboxRand		= document.getElementById('checkboxRand');
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxConstr.checked 	= false;
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
	svgEl.appendChild(path);
// for redrawing the curve slowly	
let pathd = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	pathd.setAttribute( 'stroke' , '#FF00FF' );
  	pathd.setAttribute( 'stroke-width' , 1.5 );
  	pathd.setAttribute( 'fill' , 'none' );
let txtd  = '';
	pathd.setAttribute( "d" , txtd );
	svgEl.appendChild(pathd);
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	svgEl.appendChild(normal);
// osculating circle
let cir = document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
    cir.setAttribute( 'stroke' , '#FFFF00' );
    //svgEl.appendChild(cir);
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'fill' , 'none' ); 
    rline.setAttribute( 'stroke' , '#FFFF00' );
    svgEl.appendChild(rline)
let txtl	= '';
// tangent:
let tancon	= document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	tancon.setAttribute("style","fill:none; stroke-width:1");
	tancon.setAttribute( 'stroke' , '#007700' );
    //tancon.setAttribute( 'stroke-dasharray', '1');
let txttn	= '';
	tancon.setAttribute("d",txttn);
	svgEl.appendChild(tancon);
let centr = document.createElementNS("http://www.w3.org/2000/svg","circle");
	centr.setAttribute("style","fill:none; stroke-width:1");
    centr.setAttribute( 'stroke' , '#007700' );
    centr.setAttribute('r', 2.5);
    //svgEl.appendChild(centr);
// construction:
let constr = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	constr.setAttribute( 'stroke-width' , 1.5 );
  	constr.setAttribute( 'fill' , 'none' ); 
    constr.setAttribute( 'stroke' , '#FF00FF' );
    svgEl.appendChild(constr)
let txtcon	= '';
let pen =[];
for (let i=0; i < 5; i++)
	{
	pen[i] = document.createElementNS("http://www.w3.org/2000/svg","circle");
	pen[i].setAttribute("style","fill:#FF00FF; stroke-width:1");
    pen[i].setAttribute( 'stroke' , '#FF00FF' );
    //svgEl.appendChild(pen[i]);
    pen[i].setAttribute('r', 2.5);
    }

const numDots	= 800;	
const cirrnd0	= [];
const cirrnd1	= [];
// see: addRandots() for radius attribute
for (let i=0; i<numDots; i++)
	{
	cirrnd0[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrnd0[i].setAttribute("style","fill:'#666666'; stroke-width:1");
	cirrnd0[i].setAttribute( 'stroke' , '#666666' );
	cirrnd0[i].setAttribute("r", 0.3);
	//svgEl.appendChild(cirrnd0[i]);
	
	cirrnd1[i]	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cirrnd1[i].setAttribute("style","fill:'#666666'; stroke-width:1");
	cirrnd1[i].setAttribute( 'stroke' , '#666666' );
	cirrnd1[i].setAttribute("r", 0.3);
	//svgEl.appendChild(cirrnd1[i]);
	}
let dotsAreOn	= false;

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

let	  cc	= 1.0;  	 // changes the rotating rod-length
const dd	= sqrt(0.5); // is the middle rod length
let   ff	= 0.5; 		 // changes the pen position
let   pt    = [];
let   qt	= [];

// function lemnis(t) {  // one parametrization of the standard lemniscate
// 			const snt 	= sin(t);
// 			const cst 	= cos(t);
// 			const r		= 1/(1+sqr(snt));
// 			const cvx	= r*cst*(1 + (1-lparam)*cst/2);
// 			const cvy   = r*snt*(cst + 1 - lparam);
// 		return [cvx, cvy];
// 	}

function lemnis(t)	{
		const tt	= pi/(1+0.3/cc)*(0.3/cc*(t/pi-1)+cube(t/pi-1))+pi;
		// otherwise too few points near t=pi
		pt	= [dd + cc*cos(tt), cc*sin(tt)];
		qt	= [-dd + cc*cos(t), 0]; 
		      // correct position when solu[0] may be false by rounding error
		const aux	= dd*pt[0] + 0.5*(sqr(cc) - 3*sqr(dd) + sqr(pt[0]) + sqr(pt[1]));
		let   auy	= 0;
		const solu	= quadEq(sqr(pt[0]+dd)+sqr(pt[1]), -2*aux*pt[1], sqr(cc*(pt[0]+dd))-sqr(aux));
		if ( solu[0] )	{
			if (pt[1]*(solu[1]+solu[2]) >= 0)	{
                auy = solu[1];
           	}
           	else	{
                auy = solu[2];
        	}
        	qt[0]	= (aux - pt[1]*auy) / (pt[0] + dd) - dd;  /* pt[0] = -dd ==>> pt[1]*auy = aux */
           	qt[1]	= auy;
		} 
		else 
		{  ;// console.log("t=",t); // informs of rounding error problem
		}
		return linComb1(ff, 1-ff, pt,qt);
	}
	
//	console.log(lemnis(0.0), lemnis(2*pi), lemnis(pi)	); // checks difficult points
	
function dlemnis(t) {
		return scalTimesVec1(1/(2*epsD), vecDif1(lemnis(t+epsD), lemnis(t-epsD)) );
	}


function kappa(t) {
	return numCurvature(t, dlemnis);
}

/* ============ important globals for curve ============= */

		let scale = 128;  // scaling factor for drawing
		let s0 = 0;
		let s1 = 2*pi;
		let c0 = [0,0];
const n = 256;
const ds = (s1 - s0)/n;
const ns = 8;


let curve 	= [];
let jointL	= [];
let jointR	= [];
let rndx 	= [];
let rndy 	= [];
let altern	= 0;

function fillCurve() {
		scale = 100*(1.3+0.8)/(0.8+cc);
		let t = 0;
		let result;
		for (let i=0; i<n+1; i++)
			{
		   		t = s0 +(s1-s0)*(i/n);
		   		result 		= [lemnis(t), dlemnis(t)];
				curve[i] 	= result;
				jointR[i]	= pt;
				jointL[i]	= qt;
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
		px	= pos[0]*scale;  py  = pos[1]*scale;
		qx  = (mdif[0]+pos[0])*scale;   qy  = (mdif[1]+pos[1])*scale;
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
	return [abs(rad), mdif[0]+pos[0], mdif[1]+pos[1]];  // not scaled
	}

[newRadius, midX, midY] = scalTimesVec1(scale, getOscCirc(j));
	
cir.setAttribute("cx", midX);
cir.setAttribute("cy", midY);
cir.setAttribute("r",newRadius);
rline.setAttribute("d", txtl );
svgEl.appendChild(cir);

} //  make circles with radius -- append in render()
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
}


function makeDrawingSvg(j)	{
	if (checkboxConstr.checked)
	{
		const cx	= curve[j][0][0]*scale;
		const cy	= curve[j][0][1]*scale;
		let tanx	= curve[j][1][0]*scale;
		let tany	= curve[j][1][1]*scale;
		const jt1x	=  scale*jointR[j][0];
		const jt1y	=  scale*jointR[j][1];
		const jt2x	=  scale*jointL[j][0];
		const jt2y	=  scale*jointL[j][1];
		const fcr	=  scale*dd;
		const fcl	= -scale*dd;
		txtcon  = 'M'+fcr+' '+'0'+'L'+jt1x+' '+jt1y+'L'+jt2x+' '+jt2y+'L'+fcl+' '+'0';
		constr.setAttribute('d', txtcon);
		pen[0].setAttribute('cx', fcr);
		pen[0].setAttribute('cy', 0);
		pen[1].setAttribute('cx', fcl);
		pen[1].setAttribute('cy', 0);
		pen[2].setAttribute('cx', cx);
		pen[2].setAttribute('cy', cy);
		pen[3].setAttribute('cx', jt1x);
		pen[3].setAttribute('cy', jt1y);
		pen[4].setAttribute('cx', jt2x);
		pen[4].setAttribute('cy', jt2y);
		for (let i=0; i < 5; i++)
			{svgEl.appendChild(pen[i]);}
		const cntr	= intersectLines([fcr,0],[jt1x,jt1y], [fcl,0],[jt2x,jt2y] );
		// console.log("j= ",j,"cntr= ",cntr);
		const cntx	= cntr[1][0];
		const cnty	= cntr[1][1];
		txttn	= 'M'+fcr+' '+'0'+'L'+cntx+' '+cnty+'L'+cx+' '+cy+'l'+tanx+' '+tany;
		tanx	= -2*tanx;
		tany	= -2*tany;
		txttn	= txttn + 'l'+tanx+' '+tany+'M'+cntx+' '+cnty+'L'+fcl+' '+'0';
		svgEl.appendChild(centr);
		centr.setAttribute('cx', cntx);
		centr.setAttribute('cy', cnty);
		
		if (checkboxRand.checked)
    	{
    		const mx 	= (jt1x+jt2x)/2;
			const my 	= (jt1y+jt2y)/2;
    		let rnx;
    		let rny;
    		const b0x	= (jt2x-jt1x);
    		const b0y	= (jt2y-jt1y);
    		const b1x	= -b0y;
    		const b1y	= +b0x;
    		// moves the square boundary
//     		const sq1x  = mx + b0x + b1x;
//     		const sq1y  = my + b0y + b1y;
//     		const sq2x  = mx + b0x - b1x;
//     		const sq2y  = my + b0y - b1y;
//     		const sq3x  = mx - b0x - b1x;
//     		const sq3y  = my - b0y - b1y;
//     		const sq4x  = mx - b0x + b1x;
//     		const sq4y  = my - b0y + b1y;
//     		txtst		= txtst+'M'+' '+sq1x+' '+sq1y+' '+'L'+' '+sq2x+' '+sq2y;
//     		txtst		= txtst+'L'+' '+sq3x+' '+sq3y+' '+'L'+' '+sq4x+' '+sq4y;
			if (altern == 0)
			{
				for (let i=0; i<numDots; i++)
				{            //if (i < 3) {console.log("mx",);}
					rnx	= mx + rndx[i]*b0x + rndy[i]*b1x;
					rny	= my + rndx[i]*b0y + rndy[i]*b1y;
					cirrnd0[i].setAttribute("cx", rnx);
					cirrnd0[i].setAttribute("cy", rny);
				}
				altern = 1;
			}
			else
			{
				for (let i=0; i<numDots; i++)
				{
					rnx	= mx + rndx[i]*b0x + rndy[i]*b1x;
					rny	= my + rndx[i]*b0y + rndy[i]*b1y;
					cirrnd1[i].setAttribute("cx", rnx);
					cirrnd1[i].setAttribute("cy", rny);
				}
			altern = 0;
			}	
	
		} // if (checkboxRand.checked)
		else
		{; }
	 } // if (checkboxConstr.checked)
	 else
	 { 	; }
}





/* =================== makes the Bezier Path ================= */
// P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}

function makeTXTforpath(cCurve,stopAt_jjr)   // theCurve(t)
{
	let ttxt = '';
	let t	 = 0;

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

let jjc = 0;
let jjr = 0;

function render() {
	// console.log("txt = ",txt);
	path.setAttribute( "d" , txt );
	
	if ((checkboxConstr.checked)||(checkboxRand.checked))
	{
	 	makeDrawingSvg(jjr);
	 	tancon.setAttribute( "d" , txttn);
	 	constr.setAttribute( "d" , txtcon);
	 	txtd = makeTXTforpath(curve,true);
		pathd.setAttribute( "d" , txtd );  
	 	jjr++; if (jjr == n) {jjr = 0}
	}	
	else	{;
			}			

	if (checkboxOsc.checked)	{
	 	makeOscSvg(jjc);  
	 	jjc++; if (jjc == n) {jjc = 0}
	}	
	else	{ ;	}
	 	
	if (checkboxNormal.checked)			{
			normal.setAttribute( "d" , txtn );	}
	else	{ ;
			}

div.appendChild(svgEl);
	removeOsculating();
}

function removeOsculating()	{
	if (!checkboxOsc.checked)	
	{
	 	if (svgEl.appendChild(cir))
				{svgEl.removeChild(cir);}	
		rline.setAttribute( "d", '');
	}
}

function removeConstruction() {
	if (!checkboxConstr.checked)	
	{
		constr.setAttribute( "d" , '' );
	 	tancon.setAttribute( "d" , '' );
		for (let i=0; i < 5; i++)
			{if (svgEl.appendChild(pen[i]))
				{svgEl.removeChild(pen[i]);}
			}
		if (svgEl.appendChild(centr))
		{	svgEl.removeChild(centr);}
		pathd.setAttribute( "d" , '' );
		hideDots();
	}
}
let rcount = 0;
function hideDots()	{
	if (dotsAreOn)
	{
		for (let i=0; i<numDots; i++)
    	{if (cirrnd1[i].parentElement)		//(svgEl.appendChild(cirrnd1[i]))
    	    {svgEl.removeChild(cirrnd1[i]);}
    	 if (cirrnd0[i].parentElement)		//(svgEl.appendChild(cirrnd0[i]))
    	    {svgEl.removeChild(cirrnd0[i]);}
    	}
    dotsAreOn	= false;
    	//console.log("rcount =", rcount);
    rcount++;
    }
}


/* =========== listener and response ===================== */

let loopID1 = 0;
let loopID2 = 0;
let loopID3 = 0;

const addRandots = (() => {		
    		checkboxOsc.checked = false;
    		removeOsculating();
    		window.clearInterval(loopID1);
    		window.clearInterval(loopID2);
    		window.clearInterval(loopID3);
    if ( checkboxRand.checked ) {
    		checkboxConstr.checked = true;
    		for (let i=0; i<numDots; i++)
    		{svgEl.appendChild(cirrnd0[i]);
    		 svgEl.appendChild(cirrnd1[i]);}
    		 dotsAreOn	= true;
    		loopID3 = window.setInterval(render, 60);
         }
    else {  
        	checkboxConstr.checked = false;
         } 
    });
    
    
const addConstruction = (() => {
    window.clearInterval(loopID1);
    window.clearInterval(loopID2);
    window.clearInterval(loopID3);
    checkboxOsc.checked = false;
    removeOsculating();
    if (!(checkboxRand.checked))
    	{	hideDots();	}
    if ( checkboxConstr.checked ) {
    		loopID2 = window.setInterval(render, 60);
         }
    else {checkboxRand.checked = false;}  
    
    	//render();
    });

const startStopCircles = (() => {
	window.clearInterval(loopID1)
    window.clearInterval(loopID2);
    window.clearInterval(loopID3);
	 	checkboxConstr.checked 	= false;
    	checkboxRand.checked 	= false;
    	removeConstruction();

    if ( checkboxOsc.checked ) {
    		loopID1 = window.setInterval(render, 60);
         }
    else {;} 
    });
    
const addRemoveNormals = (() => {
    if ( checkboxNormal.checked ) {
		 normal.setAttribute( "d" , txtn );
    }
    else { normal.setAttribute( "d" , '' ); }; 
    removeConstruction();
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
    		 rline.setAttribute( 'stroke' , '#FFFF00' );
     		}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 cir.setAttribute( 'stroke' , '#0000FF' );
    		 rline.setAttribute( 'stroke' , '#0000FF' );
    		}
    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
    removeConstruction();
	render();
    });


inputParamff.value = ff;
function StickParam() {
		ff 	= min(0.95, max(0.05, 1.0*inputParamff.value));
		inputParamff.value = ff;
		removeOsculating();
		removeConstruction();
		fillCurve();
		txt = makeTXTforpath(curve,false);
		makeNormalsSVG();
		
		render();
}

inputParamcc.value = cc;
function RodParam() {
		cc 	= min(1.3, max(0.5, 1.0*inputParamcc.value));
		inputParamcc.value = cc;
		removeOsculating();
		removeConstruction();	
		fillCurve();
		txt = makeTXTforpath(curve,false);
		makeNormalsSVG();
		
		render();
}

const init = (() => {
		fillCurve();
		//console.log("curve",curve);
		txt = makeTXTforpath(curve,false);
		makeNormalsSVG();
		addConstruction();
		
		render();      
});


init();

inputParamff.addEventListener("change", StickParam);
inputParamcc.addEventListener("change", RodParam);
checkboxConstr.addEventListener ('change', addConstruction , false);
checkboxRand.addEventListener ('change', addRandots , false);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};