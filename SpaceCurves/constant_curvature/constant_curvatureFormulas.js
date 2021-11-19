"use strict";

	function setNumberFields()	{
		return 6;	// there are 0,1,2,3,4,5 of them
	}
	const kpi = 22; // > 4
	function set_s0_s1_n_ns() {
		return [pi/2, (kpi+0.5)*pi, kpi*32, 4];
		}

	let [parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, paramChoice] = [1.0,0.51,0.8552,0,0,4,1];	
	/* the last entry "1" is for ODEcurves */
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, paramChoice];
	}

/* =========== Parmeters used in the curve definitions ============== */
	let kappa = 1, a0 = 1, a1 = 1, a2 = 1, a3 = 0;	
	let drawScl = exp(parameter6);
	let tw0 = true;
	let tw1 = false;
	let tw2 = false;
	torsionMenu.value = "default";
	let fr 	= 1;  // used in autoevolutes as frequency
	
	function switchParameterNames() {
		[kappa, a0, a1, a2, a3, parameter6] = setInputParams();
		checkboxTube.checked = false;
	}
	
	function kappaFn(s)	{
		return [kappa, kappa/drawScl]; // scaled curvature needed for osculating circles
	}
	
	function h2Fn(s) {
		return pi/2*sin(pi/2*sin(s));
	}
	
	function h4Fn(s) {
		return h2Fn(h2Fn(s));
	}
	
	function tauFn(s)	{
		let value = 0;
	if (tw0)
		{value = a0 + a1*sin(s) + a2*sin(2*s) + a3*sin(3*s);}
	if (tw1)
		value = a0 + a1*2*pow9(sin(s));
	if (tw2)
		{value = a0 + a1*h2Fn(h2Fn(h2Fn(s)));}
	return value;
      		}
		
	
	function drawingWidth() {
		return [0.75, 4];	// [0.5, 3];
	}
	
	function frameLengthStepTube() {
		return [2.5, 2, 4];
	}
		
	function finalPosition() {
		return [0,0,0];  // not used; computation restarts in the rotated position
	}
	
	function FrenetODE3D(s,TNA) {
			const kappa = kappaFn(s)[0];
			const tau	= tauFn(s);
			const T = [TNA[0], TNA[1], TNA[2]];
			const N = [TNA[3], TNA[4], TNA[5]];
			const B = crossProd1(T, N);
			const result = [kappa*N[0],kappa*N[1],kappa*N[2], -kappa*T[0] + tau*B[0],-kappa*T[1] + tau*B[1],-kappa*T[2] + tau*B[2]];
			return result;
	}

	
	function theODEcurve3D(s0,s1,n,inStp,FF0,TN0,theFrenetODE3D)	{
		let ODEresult 	= [];
		const ds 	= (s1 - s0)/n;
		let tA   	= s0;
		let cA = vecSum1(FF0,[0,0.25,0]);       // start point of curve
		let fA = TN0;       // initial Frame
		let v0 = [TN0[0], TN0[1], TN0[2]];	// initial tangent
		let N0 = [TN0[3], TN0[4], TN0[5]];
		let fM = fA;		// intermediate frame for simpson
		let mA 	 = FrenetODE3D(tA, fA);
		let intSecant;   let intSimpson;  // for the curve integration
		
		ODEresult[0] = [ scalTimesVec1(drawScl,cA), scalTimesVec1(drawScl,v0), scalTimesVec1(drawScl,N0)];
		for (let i=0; i<n+4; i++)
		{	
			for (let j=0; j< inStp; j++) {
				[tA, fA, mA]   =	RungeKutta(tA, fA, mA, ds/(2*inStp), theFrenetODE3D);
			}
			fM = fA;	// save the middle value
			for (let j=0; j< inStp; j++) {
				[tA, fA, mA]   =	RungeKutta(tA, fA, mA, ds/(2*inStp), theFrenetODE3D);
			}
			intSecant  = linComb1(0.5, 0.5, v0, [fA[0], fA[1], fA[2]]);
			intSimpson = linComb1(2*ds/3, ds/3, [fM[0], fM[1], fM[2]], intSecant);
			v0 = [fA[0], fA[1], fA[2]];
			N0 = [fA[3], fA[4], fA[5]] 
			cA = vecSum1(cA,intSimpson);
			ODEresult[i+1] = [ scalTimesVec1(drawScl,cA), scalTimesVec1(drawScl,v0), scalTimesVec1(drawScl,N0)]; 
			// Output:  [c(t), T(t), N(t)]
	/*		if (i<9) {
		console.log("tA=",tA," in function theODEcurve ",ODEresult[i]); }*/
		}
		
		function getIndexOf(t)	{
			return round(n*(t-s0)/(s1-s0));
		}
		if (n > 300)	{ // center curve
			let k 	= 0;
			let is	= 0;
			let theSum = ODEresult[is][0];
			while (k*pi/2 < s1) {
					k++;
					is = getIndexOf(k*pi/2);
					theSum = vecSum1(theSum, ODEresult[is][0]);
				}
				const avrg = scalTimesVec1(1/(k+1), theSum);
				for (let ii = 0; ii < n+1; ii++) {
					ODEresult[ii][0] = vecDif1(ODEresult[ii][0], avrg); }
			}
		return ODEresult;
	}
	
	function symPlaneAngle()	{
	/* If one is near a closed curve, this program varies kappa to really close the curve 
	   The console shows when one is "near enough" and also gives the regula falsi message.
	   In some cases the angle between the symmetry planes doesn't depend monotonly on kappa. */
		const kappaSave = kappa;
		let testCompute = theODEcurve3D(0,pi,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
		let cosSym	  = dotProd1(testCompute[0][1], testCompute[256][1] )/ sqr(drawScl);
		let cosOK = [cos(pi/2), cos(pi/3),-cos(pi/3), cos(pi/4),-cos(pi/4), cos(pi/5),-cos(pi/5),
		 cos(pi/6),-cos(pi/6), cos(pi/7),-cos(pi/7), cos(pi/8),-cos(pi/8), cos(2*pi/5),-cos(2*pi/5),
		 cos(pi/7), -cos(pi/7), cos(2*pi/7), -cos(2*pi/7), cos(3*pi/7), -cos(3*pi/7)];
		let success = false;
		let theCos 	= NaN;
		let cosDiff1 = NaN;
		let cosDiff2 = NaN;
		let kappa1	= NaN;
		let kappa2	= NaN;
		let message = "";

		let i = 0;
		while ((i < 21) && !success)	{  // this first number is compatible with pixel closing
				if (abs(cosSym - cosOK[i]) < 0.005) { success = true; theCos = cosOK[i]; }
				i++; 
			}
			
	    kappa = kappaSave - 0.0001;
	    testCompute = theODEcurve3D(0,pi,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
	    const DcosSym = (cosSym - dotProd1(testCompute[0][1], testCompute[256][1] )/ sqr(drawScl))/0.0001;
	    
			
		if (success) {
				kappa1 	= kappa; 
				cosDiff1 = cosSym - theCos;
				//kappa = kappaSave - 0.005;  // this number is chosen experimentally
				kappa = kappaSave - 1.5*cosDiff1/DcosSym
				testCompute = theODEcurve3D(0,pi,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
				cosSym	  = dotProd1(testCompute[0][1], testCompute[256][1] )/ sqr(drawScl);
					
				if (!(sgn(cosDiff1) == sgn(cosSym - theCos)))	{kappa2 = kappa; cosDiff2 = cosSym - theCos;}
				else {  console.log("it did not work");}
		/*				kappa = kappaSave + 0.005;
						testCompute = theODEcurve3D(0,pi,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
						cosSym	  = dotProd1(testCompute[0][1], testCompute[256][1] )/ sqr(drawScl);
						{
						if (!(sgn(cosDiff1) == sgn(cosSym - theCos)))	{kappa2 = kappa; cosDiff2 = cosSym - theCos;}
						else { success = false; }
						}
					 } */
				}
		kappa = kappaSave;
		console.log("sign change found? ",[success, cosDiff1, cosDiff2], "approximate and correct cos = ",cosSym,theCos );
		
		function betterKappa(kap) {
				kappa = kap;
				testCompute = theODEcurve3D(0,pi,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
				cosSym	  = dotProd1(testCompute[0][1], testCompute[256][1] )/ sqr(drawScl);
				return cosSym - theCos;
		}
		let RFsuccess = false;
		let approxRoot, value;
		if (success) // i.e. there is a sign change
		{
		[RFsuccess, approxRoot, value, message]= ImprovedRegulaFalsi([min(kappa1,kappa2),max(kappa1,kappa2)], 1/1024/1024/1024, betterKappa);
			kappa = approxRoot; 
		}
		message = "found? new kappa, function value";
		console.log("kappa-RegulaFalsi: ", message,[RFsuccess, approxRoot, value]);
		return [RFsuccess, cosDiff1, cosDiff2];		
	}
	
	function symAxDistance()	{
/* if a2 = 0 then the program checks whether a0 can be used to make the symmetry axes coplanar */
		const a00 = a0;
		const a01 = a0+0.001;
		function symDist(a) {
			const a0Save = a0;
			a0  = a;
			const testCompute 	= theODEcurve3D(pi/2,3*pi/2,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
			const Bvec	  		= crossProd1(testCompute[0][2], testCompute[256][2] );
			const cDif			= vecDif1(testCompute[0][0], testCompute[256][0] );
			const dist			= dotProd1(Bvec, cDif)/ sqr(drawScl);
			a0  = a0Save;
			return dist;
		}
		
		const dist0		= symDist(a00);
		const dist1		= symDist(a01);
		const Ddist		= (dist1 - dist0)/ (a01 - a00); // derivative
		
		let success 	= false;
		let a02			= a0 - 0.8*(dist0)/Ddist;
		let dist2		= symDist( a02 );
		success			= sgn(dist0) != sgn(dist2);
		
		
		if (!success) { a02		= a0 - 1.8*(dist0)/Ddist;
						dist2	= symDist( a02 ); 
						success	= sgn(dist0) != sgn(dist2);
		}
		
		//console.log("Ddist= ",[success, Ddist, dist0, dist2]);
		console.log("sign change found?", symDist(a00), symDist(a02));
		
		let RFsuccess = false;
		let approxRoot, value, message;
		if (success) 
		{
		[RFsuccess, approxRoot, value, message]= ImprovedRegulaFalsi([min(a00,a02),max(a00,a02)], 1/1024/1024/1024, symDist);
			a0 = approxRoot; message = "found? new a0, function value";
		}
		console.log("a0-RegulaFalsi: ", message,[RFsuccess, approxRoot, value]);
		return [RFsuccess, approxRoot, value];		
	}
	
		function chooseTorsion(torsionName) {
			switch (torsionMenu.value) {
        		case "default":{
          			tw0 = true; tw1 = false; tw2 = false;
          			kappa = 1; a0 = 0.51; a1 = 0.8552; a2 = 0; a3 = 0;
          			parameter6 = 4;
          			checkboxNormal.checked = false;
          			checkboxRot.checked = false;
        		}break;
        		case "flatZeros":{
          			tw0 = false; tw1 = true; tw2 = false;
          			kappa = 1; a0 = 0; a1 = 1.02; a2 = 0; a3 = 0;
          			parameter6 = 4.2;
          			checkboxNormal.checked = true;
          			checkboxRot.checked = true;
        		}break;
        		case "flatExtrema":{
          			tw0 = false; tw1 = false; tw2 = true;
          			kappa = 3.5; a0 = 0; a1 = 2.06; a2 = 0; a3 = 0;
          			parameter6 = 4.4;
          			checkboxNormal.checked = true;
          			checkboxRot.checked = true;
        		}break;
        		default:
        			{tw0 = true; tw1 = false; tw2 = false;}
      		}
      		[parameter1, parameter2, parameter3, parameter4, parameter5] = 
      		[kappa, a0,a1,a2,a3];
      		inputParam1.value = parameter1; inputParam2.value = parameter2;
      		inputParam3.value = parameter3; inputParam4.value = parameter4;
      		inputParam5.value = parameter5; inputParam6.value = parameter6;
      		drawScl = exp(parameter6);
			fillCurve();
			makeTXTforpath();
			render();		
		}

