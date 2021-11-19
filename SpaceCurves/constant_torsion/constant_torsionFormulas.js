"use strict";

	function setNumberFields()	{
		return 6;	// there are 0,1,2,3,4,5 of them
	}
	const kpi = 16; // > 4
	function set_s0_s1_n_ns() {
		return [-pi/2, (kpi-0.5)*pi, kpi*32, 4];
		}

	let [parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, paramChoice] = [1.085,2.699,2.079,0,0.066,3.6,2];	
	/* the last entry "1" is for ODEcurves */
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, paramChoice];
	}

/* =========== Parmeters used in the curve definitions ============== */
	let tau = 1, a0 = 1, a1 = 1, a2 = 1, a3 = 0;	
	let drawScl = exp(parameter6);
	let fr 	= 1;  // used in autoevolutes as frequency
	let kappa = 1;

	
	function switchParameterNames() {
		[tau, a0, a1, a2, a3, parameter6] = setInputParams();
		checkboxTube.checked = false;
	}
	
	function kappaFn(s)	{
	    kappa = a0 + a1*cos(s) + a2*cos(2*s) + a3*cos(3*s);
		return [kappa, kappa/drawScl]; // scaled curvature needed for osculating circles
	}
	
	function tauFn(s)	{
		return tau;
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
	
	function symAxDistance()	{
/* if a2 = 0 then the program checks whether a0 can be used to make the symmetry axes coplanar */
		const tau0 = tau;
		const tau1 = tau+0.001;
		function symDist(ta) {
			const tauSave = tau;
			tau  = ta;
			const testCompute 	= theODEcurve3D(0,pi,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
			const Bvec	  		= crossProd1(testCompute[0][2], testCompute[256][2] );
			const cDif			= vecDif1(testCompute[0][0], testCompute[256][0] );
			const dist			= dotProd1(Bvec, cDif)/ sqr(drawScl);
			tau  = tauSave;
			return dist;
		}
		
		const dist0		= symDist(tau0);
		const dist1		= symDist(tau1);
		const Ddist		= (dist1 - dist0)/ (tau1 - tau0); // derivative
		
		let success 	= false;
		let tau2		= tau - 0.8*(dist0)/Ddist;
		let dist2		= symDist( tau2 );
		success			= sgn(dist0) != sgn(dist2);
		
		
		if (!success) { tau2		= tau - 1.8*(dist0)/Ddist;
						dist2	= symDist( tau2 ); 
						success	= sgn(dist0) != sgn(dist2);
		}
		
		//console.log("Ddist= ",[success, Ddist, dist0, dist2]);
		console.log("sign change found?", symDist(tau0), symDist(tau2));
		
		let RFsuccess = false;
		let approxRoot, value, message;
		if (success) 
		{
		[RFsuccess, approxRoot, value, message]= ImprovedRegulaFalsi([min(tau0,tau2),max(tau0,tau2)], 1/1024/1024/1024, symDist);
			tau = approxRoot; message = "found? new tau, function value";
		}
		console.log("tau-RegulaFalsi: ", message,[RFsuccess, approxRoot, value]);
		return [RFsuccess, approxRoot, value];		
	}
