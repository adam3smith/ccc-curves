"use strict";
window.onload = init;

	function init()		{
		fillCurve();
		//console.log("curve",curve);
		makeTXTforpath();
		
		render();
	}
	const div = document.getElementById("svgArea");
	const svgEl = document.getElementById("mySVG");
	const backgroundDiv = document.getElementsByClassName("site")[0];
	//svgEl.setAttribute("width", "600");
	//svgEl.setAttribute("height", "600");
	svgEl.setAttribute("viewBox", " -140 -140 280 280");
	
    div.appendChild(svgEl);

	const checkboxRot = document.getElementById('checkboxRot');
	const checkboxOsc = document.getElementById('checkboxOsc');
	const checkboxNormal = document.getElementById('checkboxNormal');
	const checkboxTube = document.getElementById('checkboxTube');
	const checkboxBackgrd = document.getElementById('checkboxBackgrd');
	checkboxOsc.checked = false;
	checkboxNormal.checked 	= false;
	checkboxTube.checked 	= true;
	checkboxBackgrd.checked = false;
	checkboxRot.checked = false;
	let mybackground = "black";
	let myforeground = "white";

/* === The number of input fields depends on the curve, but they do ===
   === not work correctly, when they are not inside window.onload. ====
   === Currently five input fields are provided, more can be added === */
	const numInputs	  	= setNumberFields();
	const allVals		= setInputParams();  
	let inputParam1, inputParam2, inputParam3, inputParam4, inputParam5, inputParam6;
	if (numInputs > 0) 
		{ inputParam1 	= document.getElementById("param1");
		  inputParam1.value	= allVals[0];	}
	if (numInputs > 1) 
		{ inputParam2 	= document.getElementById("param2");	
		  inputParam2.value	= allVals[1];	}
	if (numInputs > 2) 
		{ inputParam3 	= document.getElementById("param3");	
		  inputParam3.value	= allVals[2];	}	
	if (numInputs > 3) 
		{ inputParam4 	= document.getElementById("param4");	
		  inputParam4.value	= allVals[3];	}	
	if (numInputs > 4) 
		{ inputParam5 	= document.getElementById("param5");	
		  inputParam5.value	= allVals[4];	}	
	if (numInputs > 5) 
		{ inputParam6 	= document.getElementById("param6");	
		  inputParam6.value	= allVals[5];	}

	let ODEchoice = 0;
	if (allVals.length > numInputs) 
		{ ODEchoice = allVals[numInputs]; }	
	if ((ODEchoice == 1) || (ODEchoice == 3))
		{ const torsionMenu = document.getElementById("torsionMenu"); }
	let ODEadjust = 0;
	if (!(ODEchoice == 0)) { ODEadjust = abs(ODEchoice); }
	if (ODEchoice == 3) { checkboxNormal.checked 	= true; }
/* allVals has numInputs elements for explicit curves and one boolean more for ODEcurves
   negative numbers for explicit curves. 
   ODEchoice = 1 constant curvature, ODEchoice = 2 constant torsion, ODEchoice = -1 helix 
*/
	let ODEcomputed = false; // curve closing is not attempted before first computation.
	let rep = 1; // used if a curve requires that some procedure is repeated more often


/* ======== Get global constants from the curve pages ======== */
    let [s0,s1,n,ns] 	= set_s0_s1_n_ns();   // curve interval and discretization
    let ds = (s1 - s0) / n;
    let pifr = pi;    // frequency scaling t = fr*t
    let [sWidth,oWidth] = drawingWidth();     // inner and outer drawing widths [0.75,4]
    let [frameLength, frameStep, tubeStep] = frameLengthStepTube();
        // length of frame vectors, steps between normals, length of a tube
	let numTb1 = floor(n/tubeStep);
	let numTb2 = 2*numTb1;
	let numTb3 = 3*numTb1;
			
	let height  = [];  // for sorting curve segments and rims
	let eheight = [];  // to include the evolutes in the sorting
	let key	 	= [];
	let pheight = [];  // For sorting the tubes
	let pkey	= [];
	let bound 	= 0;
	
	function initializeComp()	{   // allows to reset these values from the curve pages
		[s0,s1,n,ns] 	= set_s0_s1_n_ns();
					ds  = (s1 - s0) / n;
		[sWidth,oWidth] = drawingWidth();
		[frameLength, frameStep, tubeStep] = frameLengthStepTube();
		numTb1 = n/tubeStep;	numTb2 = 2*numTb1;	numTb3 = 3*numTb1;
		height	= [];
		key		= [];
		bound = (2 * n - ns + 1);
		//if ((ODEchoice > 0)&&checkboxNormal.checked) {bound = bound + ns*(n-1);}
		//for (let ii = 0; ii * ns < bound; ii++) { key[ii] = ii;	}
		pheight	= [];	
	}
	
	function upDownEvo() {
		return  ((!(ODEchoice == 0)) && checkboxNormal.checked);
	}
	
	function dataToformulas()	{  // cannot be called from formulas
		return 13;
	}
/* ======== global constants ======== */


	let paths = [];  // Draws the curves with double width
	let txt = '';
	for (let i = 0; i * ns < (2 * n - ns + 1); i++) {
		paths[i] = document.createElementNS("http://www.w3.org/2000/svg", "path");
		paths[i].setAttribute('stroke', '#FFFFFF');
		paths[i].setAttribute('stroke-width', 0.75);
		paths[i].setAttribute('fill', 'none');
	}
	
	let evols = [];
	for (let i = 0; i < n; i++) {
		evols[i] = document.createElementNS("http://www.w3.org/2000/svg", "path");
		evols[i].setAttribute('stroke', '#FFFF00');
		evols[i].setAttribute('stroke-width', 0.8);
		evols[i].setAttribute('fill', 'none');
	}
    
    let tube = [];    // Draws the curves as tubes
    for (let i = 0; i * tubeStep < n+(min(1,ODEadjust)*tubeStep); i++) {
		tube[i] = document.createElementNS("http://www.w3.org/2000/svg","polygon");
		tube[i+numTb1] = document.createElementNS("http://www.w3.org/2000/svg","polygon");
		tube[i+numTb2] = document.createElementNS("http://www.w3.org/2000/svg","polygon");
		tube[i+numTb3] = document.createElementNS("http://www.w3.org/2000/svg","polygon");
		tube[i].setAttribute("style", `fill:rgb(250,10,250);stroke:black;stroke-width:0.3`);
		tube[i+numTb1].setAttribute("style", `fill:rgb(250,80,10);stroke:black;stroke-width:0.3`);
		tube[i+numTb2].setAttribute("style", `fill:rgb(10,250,10);stroke:black;stroke-width:0.3`);
		tube[i+numTb3].setAttribute("style", `fill:rgb(10,180,250);stroke:black;stroke-width:0.3`);
	}

	let circlePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	circlePath.setAttribute('stroke', '#FFFF00');
	circlePath.setAttribute('stroke-width', 1.5);
	circlePath.setAttribute('fill', 'none');
	//circlePath.setAttribute('stroke-dasharray', 1);
	let txtcrc = '';
	circlePath.setAttribute('d', txtcrc);

	let hnormal = document.createElementNS("http://www.w3.org/2000/svg", "path");
	hnormal.setAttribute('stroke', '#FF0000');
	hnormal.setAttribute('stroke-width', 0.5);
	hnormal.setAttribute('fill', 'none');
	let txthn = '';
	svgEl.appendChild(hnormal);
	
	let bnormal = document.createElementNS("http://www.w3.org/2000/svg", "path");
	bnormal.setAttribute('stroke', '#00FF00');
	bnormal.setAttribute('stroke-width', 0.5);
	bnormal.setAttribute('fill', 'none');
	let txtbn = '';
	svgEl.appendChild(bnormal);

	let symline = document.createElementNS("http://www.w3.org/2000/svg", "path");
	symline.setAttribute('stroke-width', 0.5);
	symline.setAttribute('fill', 'none');
	symline.setAttribute('stroke', '#FFFF00');
	symline.setAttribute('stroke-dasharray', 1);
	let txtsym = '';
	if (ODEchoice >0)
		{ svgEl.appendChild(symline);	}
	
/*	let evolut = document.createElementNS("http://www.w3.org/2000/svg", "path");
	evolut.setAttribute('stroke-width', 0.5);
	evolut.setAttribute('fill', 'none');
	evolut.setAttribute('stroke', '#FFFF00');
	evolut.setAttribute('stroke-dasharray', 1);
	let txtevo = '';
	if ((ODEchoice > 0)||(ODEchoice == -1))
		{ svgEl.appendChild(evolut); }  */

	let oloid = document.createElementNS("http://www.w3.org/2000/svg", "path");
	oloid.setAttribute('stroke-width', 0.75);
	oloid.setAttribute('fill', 'none');
	oloid.setAttribute('stroke', '#FFFF00');
	oloid.setAttribute('stroke-dasharray', 1);
	let txtolo = '';
	if ((ODEchoice == -1)||(ODEchoice == 3))
		{ svgEl.appendChild(oloid); }
		
	/* ============ used in making path ========== */
	let px = 0;
	let py = 0;
	let pz = 0;
	let mx = 0;
	let my = 0;
	let mz = 0;

	let qx = 0;
	let qy = 0;
	let qz = 0;
	let nx = 0;
	let ny = 0;
	let nz = 0;
	
	function unitTang(t) { // only used in the following curvature computation
		let utan = dtheCurve(t);
		const nut = norm1(utan);
		if (nut > 0) {
			utan = scalTimesVec1(1 / nut, utan);
		}
		else utan = [NaN, NaN, NaN];
		return utan;
	}

	function curvatureVec(t) {
		const denom = norm1(vecDif1(theCurve(t + epsD), theCurve(t - epsD)));
		let crvt = [NaN, NaN, NaN];
		if (denom > epsD * epsD) {
			crvt = scalTimesVec1(1 / denom, vecDif1(unitTang(t + epsD), unitTang(t - epsD)));
		}
		return crvt;
	}



	/* ============ important globals for curve ============= */

	let initial = 0;
	let curve = [];
	let crvtr = [];
	let cval = [];
	let dval = [];
	let RegFalsi = false;
	let cnslPrt	 = true;  // print messages in console.log
	let newFrame = [];
	
	function currentFrame()	{
			let V = [curve[0][1][0],curve[0][1][1],curve[0][1][2]];
			V = normalize(V);
			let N = [crvtr[0][0],crvtr[0][1], crvtr[0][2]];
			N = normalize(N);
			//let TN0 =  [V[0], V[1], V[2], N[0], N[1], N[2] ];
		return [V[0], V[1], V[2], N[0], N[1], N[2] ];
	}
	
/* ============================= fillCurve ========================== */
	
	function fillCurve() { 
		/* theCurve is only called here and for the curvature computation */
		initializeComp();
		switchParameterNames();

		if ((ODEchoice == 1)||(ODEchoice == 2)) {  // adjust parameters
			if (cnslPrt) { console.log("ODEcomputed",ODEcomputed); }
			if ((ODEadjust == 1)&&(a0 == 0))
				{ RegFalsi = symPlaneAngle()[0];
			  	if (RegFalsi) {inputParam1.value = kappa;} 
			  	}
			if (ODEadjust > 0)
				if ((a2 == 0)&&(a0 > 0)&&(ODEadjust == 1))
					{ RegFalsi = symAxDistance()[0];
					if (RegFalsi) {inputParam2.value = a0;} 	
					}
				else if (true&&(ODEadjust == 2))
					{ RegFalsi = symAxDistance()[0];
					if (RegFalsi) {inputParam1.value = tau;} 	
					}
			}
		if (ODEchoice == 3) { ;	//adjust autoevolute fr-parameter
				RegFalsi = symAxDistanceKappa()[0];
				inputParam1.value = kappa; // if RegFalsi = false then the old kappa is kept
				//RegFalsi = symAxDistanceFr()[0];  // does not achieve coplanarity. Why?
				//inputParam4.value = fr; // if RegFalsi = false then the old fr is kept
				//console.log("before Computation, approxRoot",symAxDistanceFr(fr));
				[s0,s1,n,ns] 	= set_s0_s1_n_ns();
					ds  = (s1 - s0) / n;
			}
		let result = [];
		let t = 0;
		if (!(ODEchoice > 0)) { // explicit curves and helix
		for (let i = 0; i < n + 1 + ODEadjust*tubeStep; i++) {
			t = s0 + (s1 - s0) * (i / n);
			result = [theCurve(t), dtheCurve(t)];
			curve[i] = result;
			result = curvatureVec(t);
			crvtr[i] = result;
		} }
		else { // ODEcurve
		  if (!ODEcomputed)
			{ const angxz = pi/2*0.75;
			  result = theODEcurve3D(s0,s1,n,ns,[0,0,0],[cos(angxz),0,-sin(angxz),0,1,0],FrenetODE3D);}
		  else 
		  { newFrame = currentFrame();
		  	result = theODEcurve3D(s0,s1,n,ns,[0,0,0],newFrame,FrenetODE3D);
		  }
			for (let i = 0; i < n + 1+tubeStep; i++) {
			t = s0 + (s1 - s0) * (i / n);
			curve[i] = [result[i][0], result[i][1]];
			crvtr[i] = scalTimesVec1(1, result[i][2]); //kappaFn(t)[1]
			}
			ODEcomputed = true;
			}
		if (!(ODEchoice > 0))	{  // Do not move ODEcurves initially
		rotXspC(finalPosition()[0]);
		rotYspC(finalPosition()[1]);
		rotZspC(finalPosition()[2]);
		}
		
	}
/* ================================================================== */

	// rotate data around X axis
	function rotXspC(deg)	{
		if (!(deg == 0))	{
		const cd = Math.cos(Math.PI / 180 * deg);
		const sd = Math.sin(Math.PI / 180 * deg);
		let y, z = 0;
		for (let i = 0; i < curve.length; i++) {
			y = curve[i][0][1];
			z = curve[i][0][2];
			curve[i][0][1] = cd * y - sd * z;
			curve[i][0][2] = sd * y + cd * z;
			y = curve[i][1][1];
			z = curve[i][1][2];
			curve[i][1][1] = cd * y - sd * z;
			curve[i][1][2] = sd * y + cd * z;
			y = crvtr[i][1];
			z = crvtr[i][2];
			crvtr[i][1] = cd * y - sd * z;
			crvtr[i][2] = sd * y + cd * z;
		 }
		} 
	}

	// rotate data around Y axis
	function rotYspC(deg)	{
		if (!(deg == 0))	{
		const cd = Math.cos(Math.PI / 180 * deg);
		const sd = Math.sin(Math.PI / 180 * deg);
		let x, z = 0;
		for (let i = 0; i < curve.length; i++) {
			x = curve[i][0][0];
			z = curve[i][0][2];
			curve[i][0][0] = cd * x - sd * z;
			curve[i][0][2] = sd * x + cd * z;
			x = curve[i][1][0];
			z = curve[i][1][2];
			curve[i][1][0] = cd * x - sd * z;
			curve[i][1][2] = sd * x + cd * z;
			x = crvtr[i][0];
			z = crvtr[i][2];
			crvtr[i][0] = cd * x - sd * z;
			crvtr[i][2] = sd * x + cd * z;
		 }
		} 
	}

	// rotate data around Z axis
	function rotZspC(deg)	{
		if (!(deg == 0))	{
		const cd = Math.cos(Math.PI / 180 * deg);
		const sd = Math.sin(Math.PI / 180 * deg);
		let x, y = 0;
		for (let i = 0; i < curve.length; i++) {
			x = curve[i][0][0];
			y = curve[i][0][1];
			curve[i][0][0] = cd * x - sd * y;
			curve[i][0][1] = sd * x + cd * y;
			x = curve[i][1][0];
			y = curve[i][1][1];
			curve[i][1][0] = cd * x - sd * y;
			curve[i][1][1] = sd * x + cd * y;
			x = crvtr[i][0];
			y = crvtr[i][1];
			crvtr[i][0] = cd * x - sd * y;
			crvtr[i][1] = sd * x + cd * y;
		 }
		} 
	}

   
	/* ===================================================================== */

	function makeOscSvg(j) {
	// the osculating circles are computed from saved data, no further calls to curve
	if (checkboxOsc.checked)
	{
		let tt0, tt1, rr0, rr1 = 0;
		let snc, acs = 1;
		let rr	= [];
		const dc = 2 * pi / 16 / 3; // used for the middle Bezier control points
		let rad = 1;
		let kru	= 1;
		let kap2 = 1;
		let radVec = [rad, 0, 0];
		let crC	= [];
		let trC = [];  // for cubic spline middle control points of circle
		let ff = 2 * pi;
		let pos = curve[j][0];
		let tan = curve[j][1];
		tan = normalize(tan);
		let curvVec = crvtr[j];   // principal normal for ODE curves
		let curvVecN = [];
		let tOloid	= [];
		let kr = 0;
		const ica = 1;
		if (((ODEchoice == -1)||(ODEchoice == 3)) && checkboxNormal.checked) { rep = 2;}
		if (((ODEchoice == -1)||(ODEchoice == 3)) && !checkboxNormal.checked) { rep = 1;}
		
		// if (rep == 2): declarations cannot be made inside if
			let firstRadVec = [];
			let firstPos 	= [];
			let firstTan 	= [];
		
		txtcrc = [];
		txtolo = [];
		
	while (kr < rep) {  // draw pair of osculating circles in case of constant curvature
				
		if (ODEchoice > 0)
			{ kru  	= kappaFn(s0 + (s1 - s0) * (j / n))[1];
			  kap2 	= sqr(kru); } 
		else { kap2 = dotProd1(curvVec, curvVec); } // for explicit curves 
		
		if (kap2 > 0) 
		{
		    if (ODEchoice > 0) 	{ rad = 1/kru; }
		    else				{ rad = 1 / sqrt(kap2); }
			
		tan = normalize(tan);   // scaled later
		curvVecN = normalize(curvVec);
		radVec = scalTimesVec1(rad, curvVecN);
						
		if (kr == 1)           // osculating circle of evolute
			{ 	firstTan 	= scalTimesVec1(rad,tan);
				firstPos 	= pos;
				firstRadVec	= radVec;
				tan 	= crossProd1( tan,curvVecN) // interchange T,B for evolute
				pos 	= vecSum1( pos, radVec );
				radVec 	= negVec1(radVec);
			}

		} // if (kap2 > 0)
		else { rad = 100000; }  // draws straight line 
		
		function kreisC(phi) {
				const aux = linTripleComb1(1, 1-cos(phi), sin(phi), pos, radVec, tan);
				return aux;
		}
		
		function kreisM(phi,dd) {
				const aux = linTripleComb1(1, dd*sin(phi), dd*cos(phi), crC, radVec, tan);
				return aux;
		}
		
		px = pos[0]; py = pos[1];

		if (abs(rad) > 8000)	 // draw only tangent kap2 < epsD*epsD
		{
			if ((ODEchoice > 0)||(ODEchoice == -1))	
				{ const RR = drawScl; }
			tt0 = 8 * RR * tan[0];
			tt1 = 8 * RR * tan[1];
			txtcrc += 'M' + px + ' ' + py + 'l' + tt0 + ' ' + tt1;
			tt0 = -tt0; tt1 = -tt1;
			txtcrc += 'M' + px + ' ' + py + 'l' + tt0 + ' ' + tt1;
		}
		else
			if (norm1(radVec) < 8000) 
			{
				ff = pi / 8 * min(1, 8000 / abs(rad));
				tan = scalTimesVec1(abs(rad), tan);
				[rr0, rr1] = [radVec[0], radVec[1]];
				if (kr == 0)
				{txtcrc += 'M' + px + ' ' + py + 'l' + rr0 + ' ' + rr1 ;} // radius
				let i0 = -8;
				crC = kreisC(ff * i0);
				[rr0, rr1] = [crC[0],crC[1]];
				trC = kreisM(ff * i0, dc);
				[tt0, tt1] = [trC[0],trC[1]];
				for (let i = i0 + 1; i < i0 + 17; i++) // osculating circle touches at i = 0
				{
					txtcrc += 'M' + rr0 + ' ' + rr1 + 'C' + tt0 + ' ' + tt1;  // for cubic spline
					crC = kreisC(ff * i);
					[rr0, rr1] = [crC[0],crC[1]];
					trC = kreisM(ff * i, -dc);
					[tt0, tt1] = [trC[0],trC[1]];
					txtcrc += ' ' + tt0 + ' ' + tt1 + ' ' + rr0 + ' ' + rr1;
					tt0 = -tt0 + 2 * rr0;
					tt1 = -tt1 + 2 * rr1;
				}   // osculating circle(s) done
				
		/* ================ Oloid segments on boundary ========================== */
				//console.log("rr = ",rr);
				if (((ODEchoice == -1)||(ODEchoice == 3))&&checkboxNormal.checked)  // oloid dashed contour
					{ 
					  rr0 = pos[0] + radVec[0];  //zeichnet den Durchmesser, nächstes 'M' in 'L' ändern
					  rr1 = pos[1] + radVec[1];
					  //txtolo += 'M' + rr0 + ' ' + rr1; 
					  rr0 = pos[0] - radVec[0];
					  rr1 = pos[1] - radVec[1];
					  // First the tangents to the circle
					  	tOloid = linTripleComb1(1, 1 - cos(pi/3), sin(pi/3), pos, radVec, tan);
					  [tt0, tt1] = [tOloid[0], tOloid[1]];
					  txtolo += 'M' + rr0 + ' ' + rr1 + 'L' + tt0 + ' ' + tt1;
					  	tOloid = linComb1(1, 2*sin(-pi/3) , tOloid, tan);
					  [tt0, tt1] = [tOloid[0], tOloid[1]];
					  txtolo += 'M' + rr0 + ' ' + rr1 + 'L' + tt0 + ' ' + tt1;
					  
					if (kr == 1) {for (let ic=4; ic<8; ic = ic+ica){ 
					  // Second the segments between circle points with intersecting tangents
					  snc = -cos(ic*ff); // angle on (kr==0)-circle, opposite from touching point
					  acs = acos(snc/(1+snc))/pi;
					  tOloid = kreisC(pi*acs);  // This is on the second circle
					  //tOloid = linTripleComb1(1, 1 - cos(pi*acs), sin(pi*acs), pos, radVec, tan);
					  [tt0, tt1]  = [tOloid[0],tOloid[1]];
					  crC = linTripleComb1(1, 1-cos(ic*ff), sin(ic*ff), firstPos, firstRadVec, firstTan);
					  rr = [crC[0], crC[1]]; [rr0,rr1] = rr;
					  txtolo += 'M' + rr0 + ' ' + rr1 + 'L' + tt0 + ' ' + tt1;
					  crC = linTripleComb1(1, 1-cos(ic*ff), sin(-ic*ff), firstPos, firstRadVec, firstTan);
					  [rr0,rr1] = [crC[0], crC[1]];
					  txtolo += 'L' + rr0 + ' ' + rr1;
					  tOloid = kreisC(-pi*acs);
					  //tOloid = linTripleComb1(1, 1 - cos(pi*acs), -sin(pi*acs), pos, radVec, tan);
					  [tt0, tt1] = [tOloid[0],tOloid[1]];
					  txtolo += 'L' + tt0 + ' ' + tt1;
					  [rr0,rr1] = rr;
					  txtolo += 'L' + rr0 + ' ' + rr1;
					  // segments between regular points of 1st circle and condensed points on 2nd finished
					  	}
					  	for (let ic=4; ic<8; ic = ic+ica){
					  		crC = kreisC(ff * ic);
					  		[rr0,rr1] = [crC[0], crC[1]]; // the regular points are now on the second circle
					  		snc = -cos(ic*ff); // angle on (kr==1)-circle, opposite from touching point
					  		acs = acos(snc/(1+snc))/pi;
					  		tOloid = linTripleComb1(1, 1 - cos(pi*acs), sin(pi*acs), firstPos, firstRadVec, firstTan);
					  		[tt0, tt1]  = [tOloid[0],tOloid[1]];
					  		txtolo += 'M' + rr0 + ' ' + rr1 + 'L' + tt0 + ' ' + tt1;
					  		crC = kreisC(-ff * ic);
					  		[rr0,rr1] = [crC[0], crC[1]];
					  		txtolo += 'L' + rr0 + ' ' + rr1;
					  		tOloid = linTripleComb1(1, 1 - cos(pi*acs), sin(-pi*acs), firstPos, firstRadVec, firstTan);
					  		[tt0, tt1]  = [tOloid[0],tOloid[1]];
					  		txtolo += 'L' + tt0 + ' ' + tt1;
					  		crC = kreisC(ff * ic);
					  		[rr0,rr1] = [crC[0], crC[1]];
					  		txtolo += 'L' + rr0 + ' ' + rr1;
					  	}
					  }
					} // oloid dashed contour
				if (((ODEchoice == -1)||(ODEchoice == 3))&& !checkboxNormal.checked) {oloid.setAttribute('d', "");}
			}
			kr++;
		} // while
		circlePath.setAttribute('d', txtcrc);
		oloid.setAttribute('d', txtolo);
		}
		else
			oloid.setAttribute('d', ""); 
	} //  make circles with radius -- append in render()


	/* ============================================================= */
	
	function makeSymLinesSVG() {	/* t = s0 + (s1 - s0) * (i / n); */
	
		function indexOf(t)	{
			return round( n*(t-s0)/(s1-s0) );
			}
			
		if (ODEcomputed)			{
		if ((ODEadjust == 3)||(ODEadjust == 2)||((ODEadjust == 1)&&(a2 == 0)))	{
		pifr = pi;
		if (ODEchoice > 0)
			if (!(fr==1)) { pifr = pi/fr }

		if (!checkboxTube.checked)	{ 
				let txtsym 	= '';
				let sym0	= [];
				let sym1	= [];
				let rad1	= 0;
				let is = 0;
				let k  = 1; if (ODEadjust == 2) {k=0;}
				while (k*(pifr/2) < s1)	{              // pifr = pi/fr
					is   = indexOf(k*pifr/2);
					sym0 = curve[is][0];
					rad1  = 1/abs(kappaFn(k*pifr/2)[0]); if (ODEadjust == 2) {rad1 = -2*rad1;}
					sym1 = scalTimesVec1(rad1 ,crvtr[is]);
					txtsym  += ["M", sym0[0], sym0[1], "l", sym1[0], sym1[1] ].join(" ");
					sym1 = scalTimesVec1(-0.5,sym1);
					txtsym  += ["M", sym0[0], sym0[1], "l", sym1[0], sym1[1] ].join(" ");
					k = k+2;
				}
				symline.setAttribute("d", txtsym);
			}
			else {
				symline.setAttribute("d", "");
			}	
		} // if (a2 == 0)&&(a0 > 0)
			else { symline.setAttribute("d", ""); }
		} // if ODEcomputed
		
	}
	
	/* ============================================================= */

	function makeNormalsSVG() {
		let nstep = frameStep; if (!(ODEchoice == 0)) { nstep = 1 }
	 if (checkboxNormal.checked)	{
		let hnrml = [];
		let hnrml0, hnrml1;
		let bnrml = [];
		let tangVec = [];
		let curvVec = [];
		let pf 		= [];
		let ntan = 0;
		let rad	 = 0;
		let kap2 = 0;
		txthn  = '';
		txtbn  = '';
		//txtevo = '';
		let txtevol= '';
		let txtevl = '';
		hnormal.setAttribute("d", '');
		
		for (let i = 0; i < n; i += nstep) {
			tangVec = curve[i][1];
			ntan	= dotProd1(tangVec, tangVec);
			curvVec = crvtr[i]; //curvatureVec(s0+i*ds); -- rotated!
			kap2 = dotProd1(curvVec, curvVec);
			if (ODEchoice > 0) 
				{
					rad  = kappaFn(s0 + (s1 - s0) * (i / n))[0]; // invert later
			  		kap2 = sqr(rad);  
				}
			
			if (!(min(ntan, kap2) < epsD * epsD)) {
				if (ODEchoice == 0)
					  {hnrml 	= scalTimesVec1(4*frameLength/ sqrt(kap2), curvVec);}
				if (ODEchoice < 0)	
					  {hnrml 	= scalTimesVec1(1/kap2, curvVec);}  
				if (ODEchoice > 0)  {
						//curvVec = normalize(curvVec);
						rad = 1/rad;
						hnrml 	= scalTimesVec1(rad, curvVec);
					  }
				
				{ txthn  += ["M", curve[i][0][0], curve[i][0][1], "l", hnrml[0], hnrml[1] ].join(" ");}
				hnrml0	= curve[i][0][0]+hnrml[0];	hnrml1	= curve[i][0][1]+hnrml[1];
				if  (!(ODEchoice == 0))
					{
						if (i == 0) { txtevl = [" M", hnrml0, hnrml1].join(" "); }
						if (!(i == 0) && (abs(rad) < 10))
							{ txtevol = txtevl + [" L", hnrml0, hnrml1].join(" "); 
							  evols[i-1].setAttribute("d", txtevol);
							  eheight[i-1] = curve[i][0][2]+hnrml[2];
							  txtevl = [" M", hnrml0, hnrml1].join(" ");  
							  if (mybackground == "black") 
								   {evols[i-1].setAttribute('stroke', '#FFFF00'); }
							  else {evols[i-1].setAttribute('stroke', '#0000FF'); } 
							 // svgEl.appendChild(evols[i-1]);  
							 }          // evolut with txtevo is not used
												
					/*	if ((i==0)|| (abs(rad) > 6)) 	
									{ ["M", hnrml0, hnrml1].join(" "); }
						else		{ txtevo +=  [" L", hnrml0, hnrml1].join(" "); } 
						// {test : }if (i==8) console.log("txtevo =",txtevo);  */
					}
				if (ODEchoice == 0) // draw binormal instead of evolute
				{
					tangVec = scalTimesVec1(1.0 / sqrt(ntan), tangVec);
					bnrml 	= crossProd1(tangVec, hnrml);
					txtbn  += ["M", curve[i][0][0], curve[i][0][1], "l", bnrml[0], bnrml[1] ].join(" ");
				}
			}
/*			if (i < 4) {	// for testing only
			   pf[i] 		= [curve[i][0][0] + hnrml[0], curve[i][0][1] + hnrml[1]];
			   pf[7 - i]	= [curve[i][0][0] + bnrml[0], curve[i][0][1] + bnrml[1]];
			}	*/
		}
		//console.log("txthn =", txthn);
		hnormal.setAttribute("d", txthn);
		//evolut.setAttribute("d", txtevo);
		if (ODEchoice == 0) { bnormal.setAttribute("d", txtbn); }
	 }
	 else	{
		hnormal.setAttribute("d", "");
		bnormal.setAttribute("d", "");
		//evolut.setAttribute("d", "");
		for (let i = 0; i < n; i += 1) { //nstep
			evols[i].setAttribute("d", "");
		}
	 }
 }
	

 function makeTubeSVG() {
	 {makeNormalsSVG();}
	 if (checkboxTube.checked)	{
		let hnrml = [];
		let bnrml = [];
		let tangVec = [];
		let curvVec = [];
		let pfy 	= [];
		let pfr 	= [];
		let pfg 	= [];
		let pfm 	= [];
		for (let jj = 0; jj < n/tubeStep +1; jj++) {
		pfy[jj]=[];  pfr[jj]=[];  pfg[jj]=[];  pfm[jj]=[];  }
		let ntan 	= 0;
		let kap2 	= 0;
		let kv,kr 	= 0
		let j 		= -1;
		let ie		= 0;
		let addbd	= 0;
		if (upDownEvo()) {addbd = n-1;}
		pkey	= [];
		for (let ii = 0; ii < 4*numTb1+addbd; ii++) { pkey[ii] = ii;	}
		
	for (let i = 0; i < n+(min(1,ODEadjust)*tubeStep); i++) {
			if (i%(tubeStep) == 0)	{
				j = j+1;
				pheight[j] = 0;  pheight[j+numTb1] = 0;
				pheight[j+numTb2] = 0;  pheight[j+numTb3] = 0; 
				kv = 1,  kr = 2*tubeStep;
			}
			
		if (upDownEvo()) {
			for (let i=0; i < n-1; i++) {
					pheight[i+4*numTb1] = eheight[i];}
		}
			
			tangVec = curve[i][1];
			ntan	= dotProd1(tangVec, tangVec);
			curvVec = crvtr[i]; //curvatureVec(s0+i*ds); -- rotated!
			kap2 = dotProd1(curvVec, curvVec);
			
			if (!(min(ntan, kap2) < epsD * epsD)) {
				hnrml 	= scalTimesVec1(frameLength / sqrt(kap2), curvVec);
				tangVec = scalTimesVec1(1.0 / sqrt(ntan), tangVec);
				bnrml 	= crossProd1(tangVec, hnrml);
			}
			
			   pfy[j][kv] 	= [curve[i][0][0] + hnrml[0], curve[i][0][1] + hnrml[1]];
			   pfr[j][kv] 	= [curve[i][0][0] + hnrml[0], curve[i][0][1] + hnrml[1]];
			   pfg[j][kv] 	= [curve[i][0][0] - hnrml[0], curve[i][0][1] - hnrml[1]];
			   pfm[j][kv] 	= [curve[i][0][0] - hnrml[0], curve[i][0][1] - hnrml[1]];
			   
			   pfy[j][kr]	= [curve[i][0][0] + bnrml[0], curve[i][0][1] + bnrml[1]];
			   pfr[j][kr]	= [curve[i][0][0] - bnrml[0], curve[i][0][1] - bnrml[1]];
			   pfg[j][kr]	= [curve[i][0][0] - bnrml[0], curve[i][0][1] - bnrml[1]];
			   pfm[j][kr]	= [curve[i][0][0] + bnrml[0], curve[i][0][1] + bnrml[1]];
	
			   pheight[j]			+= (2*curve[i][0][2] + hnrml[2] + bnrml[2])/2/tubeStep;
			   pheight[j+numTb1]	+= (2*curve[i][0][2] + hnrml[2] - bnrml[2])/2/tubeStep;
			   pheight[j+numTb2]	+= (2*curve[i][0][2] - hnrml[2] - bnrml[2])/2/tubeStep;
			   pheight[j+numTb3]	+= (2*curve[i][0][2] - hnrml[2] + bnrml[2])/2/tubeStep;
			
			kv = kv+1;  kr = kr-1;
			if ((kv == tubeStep+1)&&(j>0))	{
			   pfy[j][0] = pfy[j-1][tubeStep];
			   pfy[j][2*tubeStep+1] = pfy[j-1][tubeStep+1];
			   pfr[j][0] = pfr[j-1][tubeStep];
			   pfr[j][2*tubeStep+1] = pfr[j-1][tubeStep+1];
			   pfg[j][0] = pfg[j-1][tubeStep];
			   pfg[j][2*tubeStep+1] = pfg[j-1][tubeStep+1];
			   pfm[j][0] = pfm[j-1][tubeStep];
			   pfm[j][2*tubeStep+1] = pfm[j-1][tubeStep+1];
			   
			   if (j == n/tubeStep -1)  
			   if (ODEadjust == 0) 
	 /* so far tubes were constructed backwards now add the tube forward.*/
			   {
			   	pfy[0][0] = pfy[j][tubeStep];
			   	pfy[0][2*tubeStep+1] = pfy[j][tubeStep+1];
			   	pfr[0][0] = pfr[j][tubeStep];
			   	pfr[0][2*tubeStep+1] = pfr[j][tubeStep+1];
			   	pfg[0][0] = pfg[j][tubeStep];
			   	pfg[0][2*tubeStep+1] = pfg[j][tubeStep+1];
			   	pfm[0][0] = pfm[j][tubeStep];
			   	pfm[0][2*tubeStep+1] = pfm[j][tubeStep+1];
				}
	/* The tubes are defined backwards. This last one goes from end to beginning */
			}

		  }  // for i
		  
		  for (let j = 0; j < numTb1; j++)
		  	{
		  		tube[j].setAttribute("points", pfy[j].toString());
			   	tube[j+numTb1].setAttribute("points", pfr[j].toString());
			   	tube[j+numTb2].setAttribute("points", pfg[j].toString());
			   	tube[j+numTb3].setAttribute("points", pfm[j].toString());
		  	}
		  
		  function Pkkey(j1,j2)	{
		  	let ret = 0;
				ret = pheight[j1] - pheight[j2];
				return ret;
		  }
		  
		  pkey.sort(Pkkey);
/*		  if (upDownEvo() )
		  console.log("upDownEvo,n, pkey.length = ",1,n,pkey.length, 4*numTb1+(n-1));
		  else
		  console.log("upDownEvo,n, pkey.length = ",0,n,pkey.length, 4*numTb1+(n-1)); */
		  
		  for (let jj = 0; jj < 4*numTb1+addbd; jj++) {
		  ie = pkey[jj];
		  if (ie < 4*numTb1)
		  		{svgEl.appendChild(tube[ie]);}	
		  else	{svgEl.appendChild(evols[ie - 4*numTb1]);}		
		  }
		  
		} 	// if checkbox  
		    
	  else	// no points
	  for (let jj = 0; jj < 4*numTb1; jj++) {
			tube[jj].setAttribute("points", []);			
	  }
 }	// makeTubeSVG()
	

	//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
	function myBezier(t) {
		return py * cube(1 - t) + 3 * (py + my) * sqr(1 - t) * t + 3 * (qy - ny) * (1 - t) * sqr(t) + qy * cube(t);
	}


	/* =================== makes the Bezier Path for the 3D-curve ================= */
	function makeTXTforpath()   // theCurve(t)
	{
	if (!checkboxTube.checked)	
	{ makeSymLinesSVG();
	  	//if (upDownEvo) 
	  	{makeNormalsSVG();}
		txt = '';
		let t = 0;
		let j, jj, ii, ie = 0;
		//let bound = (2 * n - ns + 1); // global
		let addbd = 0;
		if (upDownEvo()) {addbd = ns*(n-1);}
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


		for (let i = 0; i * ns < bound; i++) {
			if (i * ns < n) { height[i] = max(curve[ns * i][0][2], curve[ns * i + ns][0][2]); }
			else { height[i] = min(curve[ns * i - n][0][2], curve[ns * i - n + ns][0][2]) - 0 / 512; }
		}
		if (upDownEvo()) {
			for (let i=0; i < n-1; i++) {
					height[i+ceil(bound/ns)] = eheight[i];}
		}
		
		for (let ii = 0; ii * ns < bound+addbd; ii++) { key[ii] = ii;	}
		
		function Mkkey(j1, j2) {  // want to sort 0 ... key.length-1 according to size of height[j]
			return height[j1] - height[j2];
		}

		key.sort(Mkkey);
		 //console.log("sorted key and length ", key.length);
		
			ie = 0;
		for (let i = 0; i * ns < bound + ns*(n-1); i++) {
			txt = '';
			ii = key[i];  // number of path
			jj = ns * ii; // curve point numbers for the Bezier approximations
			if (jj < n) { j = jj; }
			else if(jj < bound)		{ j = jj - n; }
			else if (!(jj < bound) && upDownEvo())
				{ie = (ii - ceil(bound/ns));}
		if(jj < bound) {
		// left
			px = curve[j][0][0];
			py = curve[j][0][1];
			//pz = curve[j][0][2];
			mx = curve[j][1][0] * ds * ns / 3;
			my = curve[j][1][1] * ds * ns / 3;
			//mz = curve[j][1][2]*ds*ns/3;
		// right
			qx = curve[ns + j][0][0];
			qy = curve[ns + j][0][1];
			//qz = curve[ns+j][0][2];
			nx = curve[ns + j][1][0] * ds * ns / 3;
			ny = curve[ns + j][1][1] * ds * ns / 3;
			//nz = curve[ns+j][1][2]*ds*ns/3;

			txt += ["M", px, py].join(" ");
			txt += [" C", px+mx, py+my, qx-nx, qy-ny, qx, qy].join(" ");
			paths[ii].setAttribute("d", txt);
			}
			if (jj < n) {
				paths[ii].setAttribute('stroke-width', sWidth); // interior
				if (mybackground == "black") {
					paths[ii].setAttribute('stroke', '#FFFFFF');
				}
				else {
					paths[ii].setAttribute('stroke', '#000000');
				}
				svgEl.appendChild(paths[ii]);   // the order of appendChild is very important
			}
			else if(jj < bound) {
				paths[ii].setAttribute('stroke-width', oWidth); // exterior
				if (mybackground == "white") {
					paths[ii].setAttribute('stroke', '#CCCCCC');
				}
				else {
					paths[ii].setAttribute('stroke', '#555555');
				}
			    svgEl.appendChild(paths[ii]);   // the order of appendChild is very important
			}
			else // if (!(jj < bound) && upDownEvo())
				{// console.log("jj,bound,ii,ie = ",key.length,jj,bound,ii,ie);
				svgEl.appendChild(evols[ie]); }  // the order of appendChild is very important
		}
	 }	
	  else
	  {
	  symline.setAttribute("d", "");
	  for (let i = 0; i * ns < bound; i++) {
	  		paths[i].setAttribute('d',""); }
	  }
	}

	/* ==================== no executions so far ============================
	   Default values for all occuring parameters are set initially. 
	   Only one parameter is changed at a time, the others stay with their current value
	*/
		
	function getParameter1() {
		if (numInputs > 0)	{
		//checkboxOsc.checked = false;
		parameter1 = min(inputParam1.max, max(inputParam1.min, inputParam1.value));
		inputParam1.value = parameter1;
		fillCurve();
		makeTXTforpath();

		render();
		}
	}

	function getParameter2() {
		if (numInputs > 1)	{
		//checkboxOsc.checked = false;
		parameter2 = min(inputParam2.max, max(inputParam2.min, inputParam2.value));
		inputParam2.value = parameter2;
		fillCurve();
		makeTXTforpath();

		render();
		}
	}
 
	function getParameter3() {
		if (numInputs > 2)	{
		//checkboxOsc.checked = false;
		parameter3 = min(inputParam3.max, max(inputParam3.min, inputParam3.value));
		inputParam3.value = parameter3;
		fillCurve();
		makeTXTforpath();

		render();
		}
	}

	function getParameter4() {
		if (numInputs > 3)	{
		//checkboxOsc.checked = false;
		parameter4 = min(inputParam4.max, max(inputParam4.min, inputParam4.value));
		inputParam4.value = parameter4;
		fillCurve();
		makeTXTforpath();

		render();
		}
	}
 
	function getParameter5() {
		if (numInputs > 4)	{
		//checkboxOsc.checked = false;
		parameter5 = min(inputParam5.max, max(inputParam5.min, inputParam5.value));
		inputParam5.value = parameter5;
		fillCurve();
		makeTXTforpath();

		render();
		}
	}
 
	function getParameter6() {
		if (numInputs > 5)	{
		//checkboxOsc.checked = false;
		parameter6 = min(inputParam6.max, max(inputParam6.min, inputParam6.value));
		inputParam6.value = parameter6;
		drawScl = exp(parameter6);
		fillCurve();
		makeTXTforpath();

		render();
		}
	}
/* ============================================================================== */

	let jjc = 0;
	const TimePerStep = 100; // for osculating circles
	let oscTimer = 0;
	let pendingRotationX = 0;
	let pendingRotationY = 0;
	const rotSpeed = 0.03;    // degrees per millisecond
	let lastUpdate = Date.now();
	
	window.requestAnimationFrame(timeUpdate); // timeUpdate is the following function

	function timeUpdate() {
		let time = Date.now();
		let deltaT = time - lastUpdate;
		let redraw = false;
		//check for rotation
		if (keys.up) { pendingRotationX += (time - lastUpdate) * rotSpeed }
		if (keys.down) { pendingRotationX -= (time - lastUpdate) * rotSpeed }
		if (pendingRotationX) {
			rotXspC(pendingRotationX);
			pendingRotationX = 0;
			redraw = true;
		}
		if (keys.right) { pendingRotationY -= (time - lastUpdate) * rotSpeed }
		if (keys.left) { pendingRotationY += (time - lastUpdate) * rotSpeed }
		if (checkboxRot.checked) {
			pendingRotationY += (time - lastUpdate) * rotSpeed;
		}
		if (pendingRotationY) {
			rotYspC(pendingRotationY);
			pendingRotationY = 0;
			redraw = true;
		}
		//check for new circles
		if (checkboxOsc.checked) {
			checkboxTube.checked = false;
			oscTimer += deltaT;
			while (oscTimer > TimePerStep) {
				redraw = true;
				jjc++;
				oscTimer -= TimePerStep;
			}
		}
		//redraw
		if (redraw) {
			render(deltaT);  // renders only if deltaT > 0
		}
		lastUpdate = time;
		window.requestAnimationFrame(timeUpdate);
	}
	

	function render(deltaT) {
		// console.log("txt = ",txt);

		makeTXTforpath();
		//if (!upDownEvo || !checkboxNormal.checked)  // avoid duplication
		//	{makeNormalsSVG();}
		makeTubeSVG();
		
		if (checkboxOsc.checked) {
			if (checkboxTube.checked)	{
				//checkboxTube.checked = false;
				//makeTXTforpath();
			}
			makeOscSvg(jjc);       // is only called when render is needed
			if (jjc == n) { jjc = 0; }
			svgEl.appendChild(circlePath);
		} else {
			circlePath.setAttribute('d', '');
			oloid.setAttribute('d', '');
		}
	}




	/* =========== listener and response ===================== */

	function addRemoveNormals()		{
		//checkboxTube.checked = false;
		render();
		checkboxOsc.checked = false;
	}
		
		function renderAsTube()		{
		//checkboxOsc.checked = false;
		//checkboxNormal.checked = false;
		render();
	}

	function toggleBackground ()	{
		if (checkboxBackgrd.checked) {
			mybackground = "white"; myforeground = "black";
		}
		else { mybackground = "black"; myforeground = "white"; };
		backgroundDiv.style.backgroundColor = mybackground;
		//title.style.backgroundColor = mybackground;
		backgroundDiv.style.color = myforeground;
		//svgArea.style.backgroundColor = mybackground;
		//svgArea.style.color = myforeground;
		//mySVG.style.backgroundColor = mybackground;
		//mySVG.style.color = myforeground;
		if (mybackground == "black") {
			circlePath.setAttribute('stroke', '#FFFF00');
			symline.setAttribute('stroke', '#FFFF00');
			//evolut.setAttribute('stroke', '#FFFF00');
			oloid.setAttribute('stroke', '#FFFF00');
		}
		else {
			circlePath.setAttribute('stroke', '#0000FF');
			symline.setAttribute('stroke', '#0000FF');
			//evolut.setAttribute('stroke', '#0000FF');
			oloid.setAttribute('stroke', '#0000FF');
		}
		//menu.style.backgroundColor = mybackground;
		//menu.style.color = myforeground;
		//description.style.backgroundColor = mybackground;
		//description.style.color = myforeground;
		//copyright.style.backgroundColor = mybackground;
		//copyright.style.color = myforeground;
		render();
	}



/* ================ set up event handler ============================== */
		
	const keys = { up: false, down: false, left: false, right: false };
/*  to turn off rotation by keys - since mouse rotation works
	function keyDown(key) {
		if (key.code === "ArrowUp" || (key.keyCode === 38)) { keys.up = true };
		if (key.code === "ArrowDown" || (key.keyCode === 40)) { keys.down = true };
		if (key.code === "ArrowRight" || (key.keyCode === 39)) { keys.right = true };
		if (key.code === "ArrowLeft" || (key.keyCode === 37)) { keys.left = true };
	}
	function keyUp(key) { if (false)
		if (key.code === "ArrowUp" || (key.keyCode === 38)) { keys.up = false };
		if (key.code === "ArrowDown" || (key.keyCode === 40)) { keys.down = false };
		if (key.code === "ArrowRight" || (key.keyCode === 39)) { keys.right = false };
		if (key.code === "ArrowLeft" || (key.keyCode === 37)) { keys.left = false };
	}
	document.body.addEventListener("keydown", keyDown);
	document.body.addEventListener("keyup", keyUp);
	*/
	function mouseMove(e){
		if(e.buttons){
			pendingRotationY-=e.movementX;
			pendingRotationX-=e.movementY;
		}
	}
	svgEl.addEventListener("mousemove",mouseMove);

	const lastTouch={x:0,y:0};
	function touchMove(e){
		e.preventDefault();
		pendingRotationY-= e.touches[0].clientX-lastTouch.x;
		pendingRotationX-= e.touches[0].clientY-lastTouch.y;
		lastTouch.x=e.touches[0].clientX;
		lastTouch.y=e.touches[0].clientY;
	}
	function touchStart(e){
		lastTouch.x=e.touches[0].clientX;
		lastTouch.y=e.touches[0].clientY;
	};
	svgEl.addEventListener('touchmove', touchMove, false);
	svgEl.addEventListener('touchstart', touchStart, false);
	
	if ((ODEchoice == 1)||(ODEchoice == 3))
	{torsionMenu. addEventListener("change", (() => {chooseTorsion(torsionMenu.value); torsionMenu.blur();}));}
	
	checkboxBackgrd.addEventListener('change', toggleBackground, false);
	checkboxNormal.addEventListener('change', addRemoveNormals, false);
	checkboxTube.addEventListener('change', renderAsTube, false);
	
	if (numInputs > 0)
		{ inputParam1.addEventListener("change", getParameter1);	}
	if (numInputs > 1) 
		{ inputParam2.addEventListener("change", getParameter2);	}
	if (numInputs > 2) 
		{ inputParam3.addEventListener("change", getParameter3);	}
	if (numInputs > 3) 
		{ inputParam4.addEventListener("change", getParameter4);	}
	if (numInputs > 4) 
		{ inputParam5.addEventListener("change", getParameter5);	}
	if (numInputs > 5) 
		{ inputParam6.addEventListener("change", getParameter6);	}
	
