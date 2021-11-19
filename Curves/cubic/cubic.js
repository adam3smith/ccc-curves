"use strict"

window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","800");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -140 -140 340 320");
div.appendChild(svgEl);

var currentObject		= document.getElementById("description");
var belowImage			= document.getElementById("copyright");
const inputaParam		= document.getElementById("aParam");
const inputbParam		= document.getElementById("bParam");
const checkboxOsc  		= document.getElementById('checkboxOsc');
const checkboxNormal 	= document.getElementById('checkboxNormal');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxOsc.checked 	= false;
checkboxNormal.checked 	= false;

checkboxBackgrd.checked = false;
let mybackground     	= "black";
let myforeground     	= "white";
let explanation			= new String('');
let toPage1				= new String('');
let bottomLines			= new String('');


let achsen = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	achsen.setAttribute( 'stroke' , '#FFFFFF' );
  	achsen.setAttribute( 'stroke-width' , 0.25 );
  	achsen.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(achsen);
let txta = 'M'+' '+'-200'+' '+'0'+'L'+' '+'200'+' '+'0';
	txta = txta+'M'+' '+'0'+' '+'-180'+'L'+' '+'0'+' '+'180';
	achsen.setAttribute('d', txta);

let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path.setAttribute( 'stroke' , '#FFFFFF' );
  	path.setAttribute( 'stroke-width' , 1.5 );
  	path.setAttribute( 'fill' , 'none' );
let txt  = '';
	svgEl.appendChild(path);
	
let path2 = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path2.setAttribute( 'stroke' , '#007700' );
  	path2.setAttribute( 'stroke-width' , 0.75 );
  	path2.setAttribute( 'fill' , 'none' );
let txtp2  = '';
	path2.setAttribute( 'd' , txtp2 );
	svgEl.appendChild(path2);
	
let path3 = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	path3.setAttribute( 'stroke' , '#FF6600' );
  	path3.setAttribute( 'stroke-width' , 0.75 );
  	path3.setAttribute( 'fill' , 'none' );
let txtp3  = '';
	path3.setAttribute( 'd' , txtp3 );
	svgEl.appendChild(path3);	
  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
let txtn  	= '';
	normal.setAttribute( "d" , txtn ); 
	svgEl.appendChild(normal);

let cir = document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	cir.setAttribute( 'stroke' , '#FFFF00' );
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'stroke' , '#FFFF00' );
  	rline.setAttribute( 'fill' , 'none' );
let txtl	= '';
	svgEl.appendChild(rline)
let choose  =  0;
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

let aParam	= 4;
let bParam	= 1;
let condit	= 1;
if (!(aParam < 0)) {condit = bParam-sqrt(4/27*cube(aParam));}
let n = 128;     // may be changed in fillCurve
const ns = 4;    // steps in makeTXTforpath(cCurve)

function cubicEqu([x,y]) {
		return	(y*y - x*(aParam - x*x));
	}
	
function df2(t) {
	return t*(aParam - t*t) + bParam;
	}	
function ddf(t) {     // see initialize()
	return (aParam - 3*t*t)/2;
	}
	
function kappa2(tan0,tan1,p0,p1)	{
 			const n0	= norm1(tan0);
 			const nrm	= [+tan0[1]/n0, -tan0[0]/n0];
 			const n1	= norm1(tan1);
 			const kap	= dotProd1(nrm, linComb1(1/n1, -1/n0, tan1, tan0))/
 						  norm1(vecDif1(p1,p0));
		return kap;
 }
let s0;
let s1;
let ds 	= (s1 - s0)/n;

let start	= 0;
let dstart	= sqrt(df2(start));	
 

/* ============ important globals for curve ============= */

let scale	= 25;  // scaling factor for drawing

let curve	= [];
let curve0	= [];  // for second, non-closed component of solution
let curve2	= [];  // for the two graphs
let curve3	= [];
let step	= [];
let cuspid	= false;

function initialize(iStart) {
	n		= 256;
	curve2	= [];
	curve3	= [];
	condit	= 1;
	if (!(aParam < 0)) 
		{condit = bParam-sqrt(4/27*cube(aParam));} // condit < 0 ==> aParam > 0
	if ((condit < 0)&&(iStart < -1))
		{curve0	= [];}               // needed, because the curves have varying length
	else
		{curve	= [];}
	cuspid	= (aParam == 0)&&(bParam == 0);
	start 	= iStart;
    s0		= 0;
	if ((condit < -0.0000001) && (start < -1))
	    {start = -8; s0 = -4;}  // solution starts farther left
	s1 		= s0+12;            // In most cases too large, terminated in fillCurve
	if ((condit < 0.01) && (condit > -0.0000001))
		{s1 = s0+24;}          //  solution spends too much time at double point
	ds 		= (s1 - s0)/n;
	
	dstart	= sqrt(df2(start));
}

function fillCurve(iStart) {
	let itest	= 0;
	initialize(iStart);
	let nextv = myODEdf2(ds,start,dstart,ddf(start), df2,ddf);
		for (let i=0; i<n+1; i++)
		{
			if (abs(nextv[1]) < 1.0e+6)
			{
				if ((condit < 0)&&(iStart < -1))
					 {curve0[i] 	= [ [nextv[0],-nextv[1]], [nextv[1],-nextv[2]] ];}
				else {curve[i] 		= [ [nextv[0],-nextv[1]], [nextv[1],-nextv[2]] ];}
				curve2[i] 	= [ [s0+i*ds,-nextv[0]], [1,-nextv[1]] ];
				curve3[i] 	= [ [s0+i*ds,-nextv[1]], [1,-nextv[2]] ];
				step[i]		= ds;
				nextv = myODEdf2(ds,nextv[0],nextv[1],nextv[2], df2,ddf);
				itest = i;
			}
			else {i = n+1; n = itest-1; } //console.log("n, s0+n*ds, aParam = ",n, s0+n*ds,aParam);
		}
}

explanation = 'The solution set of equations `y^2 = x(a-x^2) + b` is usually studied with complex numbers,'
explanation += ' but for drawings one takes the real solutions only.'
explanation += ' One can define functions f such that'
explanation += ' `z -> (`<font color="green"> x=f(z)</font>, <font color="orange"> y=`dot{f}`(z)</font>) '
explanation += ' parametrizes the complex solution set.'
explanation += ' To do so, consider the ODE `dot{f}(z)^2 = f(z)*(a - f(z)^2) + b`.'
explanation += ' This ODE is at the simple zeros of the right side not Lipschitz continuous.'
explanation += ' One can differentiate further and cancel `dot{f}` to obtain a 2nd order Lipschitz ODE:'
explanation += ' `ddot{f}(z) = 0.5*a - 1.5*f(z)^2`. The solutions are well defined'
explanation += ' in the whole complex plane, differentiable (with poles) and doubly periodic.'
explanation += ' They are called elliptic functions. They satisfy the 1st order ODE if the initial conditions do.'
explanation += ' Over the real numbers it depends on the initial conditions whether a solution is defined on'
explanation += ' the whole real line as a periodic function (a > 0,  e.g. f(0) = 0 = `dot{f}`(0) ) or'
explanation += ' on a smaller interval, with poles at the endpoints (a < 0).'

toPage1		=  ' &nbsp Set of solutions (x,y) of the equation. <font color="green"> Parametrizing function f </font>'
toPage1		+= ' and <font color="orange"> function derivative df/dz</font> which solve </br>&nbsp'
toPage1		+= ' `({df}/dz)^2 = f*(a - f^2)+b`  so that <font color="green"> x = f(z)</font> and'
toPage1		+= ' <font color="orange">y=df/dz</font> parametrize the solution set. </br>&nbsp'
toPage1		+= ' If `b-sqrt(4*(a/3)^3) < 0`, the real solution set has two components;'
toPage1		+= ' their parametrizing functions are different real solutions'
toPage1		+= ' of the same ODE.</br>&nbsp  The complex ODE solution is defined in the whole complex plane,' 
toPage1		+= ' <font color="green">f</font> and <font color="orange">df/dz</font> are real again on certain parallels to the real axis.'
toPage1		+= ' </br>&nbsp The normals show how fast the different parts of the solution set are traversed - very slow near a singularity.'

bottomLines	 = ' <p><a href="../../docs/Addition_on_Cubic_Curves.pdf">Addition_on_Cubic_Curves.pdf</a></p>'
bottomLines	+= '<nav class="nav1"><a href="../index.html"><h2f style="text-align: center;"> Return To Plane Curves </h2></a></nav>'
bottomLines	+= '<footer>© Copyright 2004-2020 <a href="http://3D-XplorMath.org/consortium.html">3DXM Consortium</a>.'
bottomLines	+= '&nbsp Please send comments or suggestions to <a href="mailto:palais%40uci.edu">palais&#64;uci.edu</a>'
bottomLines	+= '&nbsp or to Karcher at <a href="mailto:unm16%40uni-bonn.de"><font>unm416&#64;uni-bonn.de</font></a>'				
bottomLines	+= '</footer>'
/* ===================================================================== */

function makeOscSvg(j) {
let newRadius = "";
let midX = "";
let midY = "";
function getOscCirc(j) {
		const pos = curve[j][0];
		const tan = curve[j][1];
		const rad = 1.0/kappa2(tan,curve[j+1][1], pos,curve[j+1][0]);
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

function makeNormalsSVG(cCurve) {
		let nrml 	= [];
		let aux		= [];
		let naux	= 0;
		let kappa	= 0;
		let ptsx	= 0;
		let ptsy	= 0;
		let qtsx	= 0;
		let qtsy	= 0;
		let	ttxtn  	= '';
		const n = cCurve.length - 2;    // not called immediately after fillCurve
		for (let i = 0;  i < n-1; i++)	{
			aux		  = [cCurve[i][1][1], - cCurve[i][1][0]];
			if  (abs(cCurve[i][0][1]) < 1.0e+8)              // else does not occur because of fillCurve(iStart)
			{
				naux	  = max(1.0e-8,abs(norm1(aux)) );
				kappa	  = kappa2(cCurve[i][1],cCurve[i+1][1], cCurve[i][0],cCurve[i+1][0]);
				kappa	  = sgn(kappa)*max(1.0e-8,abs(kappa));
				nrml[i]   = scalTimesVec1(scale/kappa/naux, aux);
				ptsx	  = cCurve[i][0][0]*scale;
				ptsy	  = cCurve[i][0][1]*scale;
				qtsx 	  = ptsx + nrml[i][0];
				qtsy 	  = ptsy + nrml[i][1];
			
				//if (i > n-3) {console.log("kappa,naux,aux ",kappa,naux,aux);}
				ttxtn 	+= 'M' +ptsx +' '+ptsy +'L' +qtsx +' '+qtsy;
			}
			else { console.log("i, aux ",i,aux);  i=n-1;}  //console.log("aux ",aux);
		}
	return ttxtn;	
		//if (aParam == -0.8) {console.log(" txtn = ", txtn);}
}

//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}




/* =================== makes the Bezier Path =================*/
function makeTXTforpath(cCurve, sign)
{ 
	let ttxt  = '';  
	for (let i=0; i<floor(n/ns)-1; i++)   //  n is set correctly in fillCurve
	{	
	// left
	px = cCurve[ns*i][0][0];
	py = sign*cCurve[ns*i][0][1];
	mx = cCurve[ns*i][1][0]*ds*4/3;
	my = sign*cCurve[ns*i][1][1]*ds*4/3;
	hx = px + mx;
	hy = py + my;
	// right
	qx = cCurve[ns*(i+1)][0][0];
	qy = sign*cCurve[ns*(i+1)][0][1];
	nx = cCurve[ns*(i+1)][1][0]*ds*ns/3;
	ny = sign*cCurve[ns*(i+1)][1][1]*ds*ns/3;
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


let jjc = 0;

function render() {
	// console.log("txt = ",txt);
	path.setAttribute( "d" , txt );
	path2.setAttribute( "d" , txtp2 );
	path3.setAttribute( "d" , txtp3 );
	
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
   	 		normal.setAttribute( "d" , '' );
   	 		normal.setAttribute( "d" , txtn ); }
   	else {	normal.setAttribute( "d" , '' ); }

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
		txtn = makeNormalsSVG(curve);
		if (condit < 0)
		   { txtn = txtn + makeNormalsSVG(curve0);	}
        }
    else { 
    		txtn = '';//normal.setAttribute( "d" , '' );
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
     		 achsen.setAttribute( 'stroke' , '#FFFFFF' );
     		 //path3.setAttribute( 'stroke' , '#FFFFFF' );
     		 cir.setAttribute( 'stroke' , '#FFFF00' ); 
    		 rline.setAttribute( 'stroke' , '#FFFF00' );}
    else	{path.setAttribute( 'stroke' , '#000000' );
    		 achsen.setAttribute( 'stroke' , '#000000' );
   			 //path3.setAttribute( 'stroke' , '#000000' );
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

inputaParam.value = aParam;
inputbParam.value = bParam;
function SetParam() {
		window.clearInterval(loopID);
		checkboxOsc.checked = false;
		aParam = min(8, max(-5, 1.0*inputaParam.value)); // without 1.0* "value" is an array of characters
		//aParam = round(5.0*aParam)/5.0;
		inputaParam.value = aParam;
		bParam = min(4, max(0, 1.0*inputbParam.value));
		//bParam = round(10.0*bParam)/10.0;
		inputbParam.value = bParam;
		{ txtn = '';
		fillCurve(-6);
		console.log("condit = ",condit);
		//console.log("curve",curve);
		if (condit < 0)
			{txt = makeTXTforpath(curve0,1);
			 txtn = makeNormalsSVG(curve0);	}
		else
			{txt = makeTXTforpath(curve,1);
			 txtn = makeNormalsSVG(curve);	}
		txtp2 = makeTXTforpath(curve2,1);
		txtp3 = makeTXTforpath(curve3,1);
		if (cuspid) {txt = txt+makeTXTforpath(curve,-1);}
		}
		if ( condit < 0 )
		{
		fillCurve(0);
		//console.log("curve",curve);
		txt		= txt + makeTXTforpath(curve,1);
		txtn	= txtn + makeNormalsSVG(curve);
		txtp2	= txtp2 + makeTXTforpath(curve2,1);
		txtp3	= txtp3 + makeTXTforpath(curve3,1);		
		}
		
		render();
}

function myMessage() {
       let actualExplanation = new String('');
       if (inputaParam.value == 4.2)
       	{actualExplanation="test4.2";
       	currentObject.innerHTML = actualExplanation;}
       else
        {actualExplanation=explanation;
        currentObject.innerHTML = actualExplanation;}
}

const init = (() => {
		
		{
		fillCurve(-6);
		//console.log("curve",curve);
		if (condit < 0)
			{txt = makeTXTforpath(curve0,1);
			 txtn = makeNormalsSVG(curve0);	}
		else
			{txt = makeTXTforpath(curve,1);
			 txtn = makeNormalsSVG(curve);	}
		txtp2 = makeTXTforpath(curve2,1);
		txtp3 = makeTXTforpath(curve3,1);
		}
		if ( condit < 0 )
		{
		fillCurve(0);
		//console.log("curve",curve);
		txt		= txt + makeTXTforpath(curve,1);
		txtn	= txtn + makeNormalsSVG(curve);
		txtp2 = txtp2+makeTXTforpath(curve2,1);
		txtp3 = txtp3+makeTXTforpath(curve3,1);		
		}
		txtn = makeNormalsSVG(curve);
		render();
		myMessage();
		belowImage.innerHTML = toPage1+bottomLines;      
});


init();

inputaParam.addEventListener("change", SetParam);
inputbParam.addEventListener("change", SetParam);
checkboxOsc.addEventListener ('change', startStopCircles , false);
checkboxNormal.addEventListener ('change', addRemoveNormals , false);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
};