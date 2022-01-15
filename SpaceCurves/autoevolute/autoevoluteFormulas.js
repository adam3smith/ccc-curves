"use strict";

	function setNumberFields()	{
		return 6;	// there are 0,1,2,3,4,5 of them
	}

	let [parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, paramChoice] = [0.6069,1.536,-0.26,1,3.6,3.8,3];
	//let [parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, paramChoice] = [1.47,0.719,-1.249,1,2,4.2,3];	
	/* the last entry "1" is for ODEcurves */
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, paramChoice];
	}
	const kpi = 22; // > 4
	function set_s0_s1_n_ns() {
		return [pi/2/parameter4, (kpi+0.5)*pi/parameter4, kpi*128, 4];
		}

/* =========== Parmeters used in the curve definitions ============== */
	let kappa = 1, a0 = 1, a1 = 1, a2 = 0, a3 = 0, fr = 1, tbwdth =2;	
	let drawScl;
	let tw0 = true;
	let tw1 = false;
	let tw2 = false;
	torsionMenu.value = "default";
	
	function switchParameterNames() {
		[kappa, a1, a3, fr, tbwdth, parameter6] = setInputParams();
		drawScl = exp(parameter6); 
	}
	
	function kappaFn(s)	{
		return [kappa, kappa/drawScl]; // scaled curvature needed for osculating circles
	}
	
	function flatFn(s) {
		return pi/2*sin(pi/2*sin(s));
	}
		
	function hFn(s)	{
		let value = 0;
		if (tw0)
			{value = a1*sin(s) + a3*sin(3*s);}
		if (tw1)
			{value = a1*pow9(sin(s)) + a3*pow9(sin(3*s));} // kappa = 2.4 a1 = 1.43 a3 = -0.4693
		if (tw2)
			{value = a1*flatFn(flatFn(s)) + a3*flatFn(flatFn(3*s));} // a1 = 0.2843  kappa = 2  a1 = 0.3009; = 0.5742 kappa = 3; a3 = -0.2391
		return value;
	}
	
	function velFn(s)	{
			const hss = hFn(fr*s);
			let value = 0;
			if (tw0)
				{ if (hss <= 0)
					{value = sqrt(1+sqr(hss)) - hss;}
				   else
					{value = 1/(sqrt(1+sqr(hss)) + hss);}
				}
			if (tw2 || tw1)	
				{value = exp(hss);}
			return value;
	}
	
	function drawingWidth() {
		return [0.75, 4];	// [0.5, 3];
	}
	
	function frameLengthStepTube() {
		return [setInputParams()[4], 2, 4];
	}
		
	function finalPosition() {
		return [0,30,0];  // not used; computation restarts in the rotated position
	}
	
	function FrenetODE3D(s,TNA) {
			const kappa = kappaFn(s)[0];
			const vel	= velFn(s);
			const kv	= kappa*vel;
			const k_v	= kappa/vel;
			const T = [TNA[0], TNA[1], TNA[2]];
			const N = [TNA[3], TNA[4], TNA[5]];
			const B = crossProd1(T, N);
			const result = [kv*N[0],kv*N[1],kv*N[2], -kv*T[0] + k_v*B[0],-kv*T[1] + k_v*B[1],-kv*T[2] + k_v*B[2]];
			return result;
	}

	
	function theODEcurve3D(s0,s1,n,inStp,FF0,TN0,theFrenetODE3D)	{
	// the velFn has to be used in the Simpson integration and c'(t) = velFn(t)*T(t)
		let ODEresult 	= [];
					//[s0,s1,n,ns] 	= set_s0_s1_n_ns();
					ds  = (s1 - s0) / n;
		let tA   	= s0;
		let cA = vecSum1(FF0,[0,0.25,0]);       // start point of curve
		let fA = TN0;       // initial Frame
		let v0 = [TN0[0], TN0[1], TN0[2]];	// initial tangent
		let vl = velFn(tA);
		let N0 = [TN0[3], TN0[4], TN0[5]];
		let fM = fA;		// intermediate frame for simpson
		let mA 	 = theFrenetODE3D(tA, fA);
		let intSecant;   let intSimpson;  // for the curve integration
		
		ODEresult[0] = [ scalTimesVec1(drawScl,cA), scalTimesVec1(velFn(tA)*drawScl,v0), scalTimesVec1(drawScl,N0)];
		for (let i=0; i<n+4; i++)
		{	
			for (let j=0; j< inStp; j++) {
				[tA, fA, mA]   =	RungeKutta(tA, fA, mA, ds/(2*inStp), theFrenetODE3D);
			}
			fM = fA;	// save the middle value
			vl = velFn(tA);
			for (let j=0; j< inStp; j++) {
				[tA, fA, mA]   =	RungeKutta(tA, fA, mA, ds/(2*inStp), theFrenetODE3D);
			}
			intSecant  = linComb1(velFn(tA-ds)*0.5, velFn(tA)*0.5, v0, [fA[0], fA[1], fA[2]]);
			intSimpson = linComb1(2*vl*ds/3, ds/3, [fM[0], fM[1], fM[2]], intSecant);
			v0 = [fA[0], fA[1], fA[2]];
			N0 = [fA[3], fA[4], fA[5]] 
			cA = vecSum1(cA,intSimpson);
			ODEresult[i+1] = [ scalTimesVec1(drawScl,cA), scalTimesVec1(velFn(tA)*drawScl,v0), scalTimesVec1(drawScl,N0)]; 
			// Output:  [c(t), T(t), N(t)]
	/*		if (i<9) {
		console.log("tA=",tA," in function theODEcurve ",ODEresult[i]); }*/
		}
		
		function getIndexOf(t)	{
			return round(n*(t-s0)/(s1-s0));
		}
		if (n > 300)	{ // center curve
			let k 	= 1;
			let is	= 0;
			let theSum = ODEresult[is][0];
			while (k*pi/2/fr < s1) {
					is = getIndexOf(k*pi/fr/2);
					theSum = vecSum1(theSum, ODEresult[is][0]);
					k++;
				}
				const avrg = scalTimesVec1(1/(k+1), theSum);
				for (let ii = 0; ii < n+1; ii++) {
					ODEresult[ii][0] = vecDif1(ODEresult[ii][0], avrg); }
			}
		return ODEresult;
	}
	
let kappaArr =  [0.5993,1.675,1.022,0.9413,0.6526,0.9707,1.3703,0.5386,1.6505,0.6493,1.527,1.0818,1.5696,2.6929,2.8708,2.602,2.525];
let a1Arr   = [1.5618, 0.7238,1.2444,1.2439,0.8551,2.3695,1.2699,2.1197,0.71586,0.6138,0.8852,1.9439,0.93736,1.50452,1.504,1.755,1.7975];
let a3Arr   = [-0.5206, 0.6718,-2.1667,-2.581,-0.5073,-0.8647,0.2991,-0.386,-0.61383,-0.6142,-0.6485,-0.6474,0.1875,0.5017,-0.502,-0.61775,-0.0917];
let tb0Arr  = [3.6,3.6,2.8,2.8,3.6,1.8,3.6,3.6,3.6,3.6,3.6,3.4,3.6,3.2,2.8,2.0,2.8];
let scl0Arr = [3.8,4.5,4.0,3.9,3.7,4.1,4.2,3.8,4.1,3.5,3.8,4.0,3.9,4.3,3.8,3.8,3.8];	
//console.log("k120 = ",kappaArr[2],a1Arr[2],a3Arr[2]);

let kappa1Arr =  [1.8462,1.7826,0.5473,0.6414,0.4756,0.6706,1.5439,1.632,1.9824,2.4805,0.684,0.8626,1.3963,2.0506,2.6042,1.32];
let a11Arr   = [0.9613,2.2494,2.204,1.44478,2.6157,1.08167,1.4407,2.4007,0.6824,1.5634,0.8622,2.681466,1.66526,0.48842,1.43,1.7856];
let a31Arr   = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];	
let tb1Arr  = [3.6,1.6,3.6,3.6,3.6,3.6,3.4,1.0,3.0,3.0,3.6,1.0,3.2,2.4,2.6,3.0];
let scl1Arr = [3.8,4.1,3.8,3.7,3.7,3.5,3.9,4.0,3.8,4.0,3.4,3.6,3.6,3.5,3.7,3.5];
//console.log("k121 = ",kappa1Arr[2],a11Arr[2],a31Arr[2]);

let kappa2Arr =  [0.6424,1.87,0.68,0.579,0.9616,1.220,0.6672, 1.40, 1.9175,2.8246,3.042,0.6873,2.9954,3.4153,0.6953,1.8335,2.7764,3.987];
let a12Arr   = [0.4914,0.929,0.3312,0.667,0.88673,1.0309,0.39492,0.5454,0.67, 0.9392,1.0015,0.28542,0.5742,0.6609,0.22366,0.2843,0.3669,0.5465];
let a32Arr   = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let tb2Arr  = [3.6,2.8,3.6,3.6,3.6,3.6,3.6,3.2,3.6,2.0,2.0,3.6,3.2,3.0,3.6,3.2,2.8,2.4];
let scl2Arr = [3.8,4.7,3.6,3.8,4.3,4.5,3.8,4.2,4.3,4.8,4.8,3.6,4.2,4.3,3.4,3.6,3.7,3.9];	
//console.log("k122 = ",kappa2Arr[2],a12Arr[2],a32Arr[2]);

	
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
	
 function symAxDistanceFr()	{
/* The program checks whether fr can be used to make the symmetry axes of autoevolutes coplanar */
		const fr0 = fr;
		const fr1 = fr+0.001;
		function symDist(a) {   // This function keeps the value of the global variable fr
			const frSave = fr;
			fr  = a;
			const testCompute 	= theODEcurve3D(pi/fr/2,3*pi/fr/2,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
			const Bvec	  		= crossProd1(testCompute[0][2], testCompute[256][2] );
			const nbv2			= dotProd1(Bvec,Bvec)/sqr(drawScl); // sin^2 of angle between normals
			let dist
			if (nbv2 < 1/sqr(512)) { dist = NaN; } // if normals are nearly parallel, do not compute distance
			else	
				{
				  const cDif	= vecDif1(testCompute[0][0], testCompute[256][0] );
			 			dist	= dotProd1(Bvec, cDif)/ (drawScl*sqrt(nbv2));
			 	}
			fr  = frSave;  // The value of the global variable fr is not changed
			return dist;
		}
		
		let fr2;
		let success 	= false;
		const dist0		= symDist(fr0);
		const dist1		= symDist(fr1);
		let NaNflg		= !isNaN(dist0) && !isNaN(dist1);
		
		if (NaNflg)
		{
			const Ddist		= (dist1 - dist0)/ (fr1 - fr0); // derivative
		
			fr2			= fr - 1*(dist0)/Ddist;
			let dist2		= symDist( fr2 );
			NaNflg 			= NaNflg && !isNaN(dist2);
			if (NaNflg)
			{	success		= sgn(dist0) != sgn(dist2); }
		
		if (NaNflg && !success) { fr2 = fr - 2*(dist0)/Ddist;
						dist2	= symDist( fr2 );
						NaNflg 	= NaNflg && !isNaN(dist2);
						if (NaNflg)
						{	success	= sgn(dist0) != sgn(dist2); }
					  }
		 console.log("sign change found?", symDist(fr0), symDist(fr2));
		}
		else { console.log("NO sign change found or NaN"); }
		
		
		let RFsuccess = false;
		let approxRoot = NaN; 
		let value, message;
		if (success && NaNflg) 
		{
		[RFsuccess, approxRoot, value, message]= ImprovedRegulaFalsi([min(fr0,fr2),max(fr0,fr2)], 1/1024/1024/1024, symDist);
			if (RFsuccess)	{fr = approxRoot;}
			message = "found zero? new fr, function value";
		}
		console.log("old/new fr, fr-RegulaFalsi: ", fr, message,[ RFsuccess, approxRoot, value],"symDist=",symDist(fr));
		return [RFsuccess, fr, value];	// returns old fr if RFsuccess = false	
	}
		
function symAxDistanceKappa()	{
/* The program checks whether kappa can be used to make the symmetry axes of autoevolutes coplanar */
		const kappa0 = kappa;
		const kappa1 = kappa+0.001;
		function symDist(a) {
			const kappaSave = kappa;
			kappa  = a;
			const testCompute 	= theODEcurve3D(pi/fr/2,3*pi/fr/2,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
			const Bvec	  		= crossProd1(testCompute[0][2], testCompute[256][2] );
			const nbv2			= dotProd1(Bvec,Bvec)/sqr(drawScl);
			let dist
			if (nbv2 < 1/sqr(512)) { dist = NaN; }
			else	
				{
				  const cDif	= vecDif1(testCompute[0][0], testCompute[256][0] );
			 			dist	= dotProd1(Bvec, cDif)/ (drawScl*sqrt(nbv2));
			 	}
			kappa  = kappaSave;
			return dist;
		}
		
		let kappa2;
		let success 	= false;
		const dist0		= symDist(kappa0);
		const dist1		= symDist(kappa1);
		let NaNflg		= !isNaN(dist0) && !isNaN(dist1);
		
		if (NaNflg)
		{
			const Ddist		= (dist1 - dist0)/ (kappa1 - kappa0); // derivative
		
			kappa2			= kappa - 1*(dist0)/Ddist;
			let dist2		= symDist( kappa2 );
			NaNflg 			= NaNflg && !isNaN(dist2);
			if (NaNflg)
			{	success		= sgn(dist0) != sgn(dist2); }
		
		if (NaNflg && !success) { kappa2 = kappa - 2*(dist0)/Ddist;
						dist2	= symDist( kappa2 );
						NaNflg 	= NaNflg && !isNaN(dist2);
						if (NaNflg)
						{	success	= sgn(dist0) != sgn(dist2); }
					  }
		 console.log("sign change found?", symDist(kappa0), symDist(kappa2));
		}
		else { console.log("NO sign change found or NaN"); }
		
		
		let RFsuccess = false;
		let approxRoot = NaN; 
		let value, message;
		if (success && NaNflg) 
		{
		[RFsuccess, approxRoot, value, message]= ImprovedRegulaFalsi([min(kappa0,kappa2),max(kappa0,kappa2)], 1/1024/1024/1024, symDist);
			if (RFsuccess)	{kappa = approxRoot;}
			message = "found zero? new kappa, function value";
		}
		console.log("old/new kappa, kappa-RegulaFalsi: ", kappa, message,[ RFsuccess, approxRoot, value]);
		return [RFsuccess, kappa, value];	// returns old kappa if RFsuccess = false	
	}

		
	let slider0 = document.getElementById("myRange0");
	let output0 = document.getElementById("giveValue0");
	slider0.value = 1;
	output0.innerHTML = slider0.value;

	slider0.oninput = function() {
		tw0 = true; tw1 = false; tw2 = false;
		torsionMenu.value = "default";
  		output0.innerHTML = this.value;
  		inputParam2.value = a1Arr[this.value];
  		parameter2  = inputParam2.value;
  		inputParam3.value = a3Arr[this.value];
  		parameter3  = inputParam3.value;
  		inputParam5.value = tb0Arr[this.value];
  		parameter5  = inputParam5.value;
  		inputParam6.value = scl0Arr[this.value];
  		parameter6  = inputParam6.value;
  		drawScl = exp(parameter6);	
  		inputParam1.value = kappaArr[this.value];
  		ODEcomputed = false;
  		getParameter1();  		
	}
	
	let slider1 = document.getElementById("myRange1");
	let output1 = document.getElementById("giveValue1");
	slider1.value = 4;
	output1.innerHTML = slider1.value;

	slider1.oninput = function() {
		tw0 = false; tw1 = true; tw2 = false;
		checkboxTube.checked = false;
		torsionMenu.value = "flatZeros";
  		output1.innerHTML = this.value;
		inputParam2.value = a11Arr[this.value];
  		parameter2  = inputParam2.value;
  		inputParam3.value = a31Arr[this.value];
  		parameter3  = inputParam3.value;
  		inputParam5.value = tb1Arr[this.value];
  		parameter5  = inputParam5.value;
  		inputParam6.value = scl1Arr[this.value];
  		parameter6  = inputParam6.value;
  		drawScl = exp(parameter6);	
  		inputParam1.value = kappa1Arr[this.value];
  		ODEcomputed = false;
  		getParameter1(); 		
	}
	
	let slider2 = document.getElementById("myRange2");
	let output2 = document.getElementById("giveValue2");
	slider2.value = 3;
	output2.innerHTML = slider2.value;

	slider2.oninput = function() {
		tw0 = false; tw1 = false; tw2 = true;
		checkboxTube.checked = false;
		torsionMenu.value = "flatExtrema";
  		output2.innerHTML = this.value;
  		inputParam2.value = a12Arr[this.value];
  		parameter2  = inputParam2.value;
  		inputParam3.value = a32Arr[this.value];
  		parameter3  = inputParam3.value;
  		inputParam5.value = tb2Arr[this.value];
  		parameter5  = inputParam5.value;
  		inputParam6.value = scl2Arr[this.value];
  		parameter6  = inputParam6.value;
  		drawScl = exp(parameter6);	
  		inputParam1.value = kappa2Arr[this.value];
  		ODEcomputed = false;
  		getParameter1();  		
	}
	
		function chooseTorsion(torsionName) {
			switch (torsionMenu.value) {
        		case "default":{
          			tw0 = true; tw1 = false; tw2 = false;
          			kappa = 0.6069; a0 = 1; a1 = 1.536; a3 = -0.26; fr = 1; tbwdth = 3.6;
          			parameter6 = 3.8;
          			checkboxTube.checked = true;
          			checkboxNormal.checked = true;
          			checkboxRot.checked = false;
        		}break;
        		case "flatZeros":{
          			tw0 = false; tw1 = true; tw2 = false;
          			kappa = 2.6; a0 = 1; a1 = 1.43; a3 = 0; fr = 1; tbwdth = 3.6; // a3 = -0.4693
          			//kappa = 1.6; a0 = 1; a1 = 1.4408; a3 = 0; fr = 1; tbwdth = 3.6;
          			parameter6 = 3.8;
          			checkboxNormal.checked = true;
          			checkboxRot.checked = false;
        		}break;
        		case "flatExtrema":{
          			tw0 = false; tw1 = false; tw2 = true;
          			kappa = 3; a0 = 1; a1 = 0.5742 ; a3 = 0; fr = 1; tbwdth = 3.6;
          			parameter6 = 4.2;
          			checkboxTube.checked = false;
          			checkboxNormal.checked = true;
          			checkboxRot.checked = false;
        		}break;
        		default:
        			{tw0 = true; tw1 = false; tw2 = false;}
      		}
      		checkboxOsc.checked = false;
      		[parameter1, parameter2, parameter3, parameter4, parameter5] =
      		[kappa, a1, a3, fr, tbwdth];
      		inputParam1.value = parameter1; inputParam2.value = parameter2;
      		inputParam3.value = parameter3; inputParam4.value = parameter4;
      		inputParam5.value = parameter5; inputParam6.value = parameter6;
      		drawScl = exp(parameter6);
			fillCurve();
			makeTXTforpath();
			render();		
		}