"use strict";

	function setNumberFields()	{
		return 4;	// there are three of them
	}

	function set_s0_s1_n_ns() {
		return [-pi, +pi, 512, 4];
		}

	let [parameter1, parameter2, parameter3, parameter4] = [3,2,5,1];	
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4];
	}

/* =========== Parmeters used in the curve definitions ============== */ 
	

	const scl		= 40;
	const soulRad   = scl*sqrt(2);
	const meridRad 	= scl*1;
	const shft		= meridRad;
	
	let RRnow, mzNow;
	let tubeWidth, soulFreq, meridFreq, confRot;
	let crot, srot;
	
	function switchParameterNames() {  /* this function is called in fillCurve() */
		[tubeWidth, soulFreq, meridFreq, confRot] = setInputParams();
	/*	if ((confRot == 0)||(confRot == 2)) { RRnow = 25000000; mzNow = sqrt( RRnow - sqr(soulRad)); }
		else if (confRot == 1) { RRnow = sqr(soulRad);  mzNow = 0;}
		else { RRnow = sqr(soulRad/sin(pi*confRot/2)); mzNow = soulRad/tan(pi*confRot/2); }  */
		crot = cos(pi*confRot/2);
		srot = sin(pi*confRot/2);
		/* these constants are used in theCurve(t) */
	}
	
	function finalPosition() {
		return [0,-90,45];
	}
	
	function drawingWidth() {
		return [0.75, 4];
	}
	
	function frameLengthStepTube() {	/* this function is called in initializeComp() */
		return [setInputParams()[0], 2, 4];
	}

	
	function conformalRot(RR,p,mz) {
		const qq  	= [p[0], p[1], -p[2] - mz]; /* first reflect in x-y-plane, then in sphere */
		let result	= [p[0], p[1], p[2]];
		const nq2 	= dotProd1(qq,qq);
		if (nq2 > 0) 
			{
				result 		= scalTimesVec1(RR/nq2, qq);
				result[2]	= result[2] + mz;
			}
		return result;
	}
	
	const frShift = 0; //pi/3;
	function theCurveO(t) {      // not used
	/* A conformal rotation around a circle as composition of reflection and inversion */
		const latRad = soulRad + meridRad * cos(meridFreq * t);
		let	  cvx = latRad * sin(soulFreq*t + frShift);
		let   cvy = -shft - latRad * cos(soulFreq*t + frShift);
		let   cvz = meridRad * sin(meridFreq * t);
		const 	q = (cvx - cvz)/sqrt(2);	/* tilt torus 45 degrees */
			  cvz = (cvx + cvz)/sqrt(2);
			  cvx = q;
		if (confRot > 0) {
			[cvx, cvy, cvz] = conformalRot(RRnow, [cvx,cvy,cvz], mzNow );
		}
		return [cvx, cvy, cvz];
	}
	
	const calph = sin(pi/5);
	const salph	= cos(pi/5);
	
	function theCurve(t)	{ 
	 /* First the tori with rotation in S^3, then Stereographic projection */
		const svu = crot*calph*cos(meridFreq * t) - srot*salph*cos(soulFreq * t);
		const svx = crot*calph*sin(meridFreq * t) - srot*salph*sin(soulFreq * t);
		const svy = crot*salph*cos(soulFreq * t) + srot*calph*cos(meridFreq * t);
		const svz = crot*salph*sin(soulFreq * t) + srot*calph*sin(meridFreq * t);
		const nst = 44/ (1 - svu);
		const cvx = svx * nst;
		const cvy = svy * nst;
		const cvz = svz * nst;
		return [16+cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

