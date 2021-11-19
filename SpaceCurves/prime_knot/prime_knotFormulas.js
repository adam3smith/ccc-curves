"use strict";

	function setNumberFields()	{
		return 4;	// there are three of them
	}

	function set_s0_s1_n_ns() {
		return [-pi, +pi, 512, 4];
		}

	let [parameter1, parameter2, parameter3, parameter4] = [5,5,3,1.2];	
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4];
	}

/* =========== Parmeters used in the curve definitions ============== */
	
	function chooseCut(dd) {
		return pi/(1.5 + (dd - 3)*0.7*(1 - (dd-5)/16) ); /* best for dd = 3 */
	}
	
	let tt0;
	
	let tubeWidth, soulRad, meridFreq, twistPar;
	
	function switchParameterNames() {  /* this function is called in fillCurve() */
		[tubeWidth, soulRad, meridFreq, twistPar] = setInputParams();
		tt0		= chooseCut(meridFreq);	/* this constant is used in theCurve(t) */
	}
	
	function finalPosition() {
		return [0,0,0];
	}
	
	function drawingWidth() {
		return [0.75, 4];
	}
	
	function frameLengthStepTube() {	/* this function is called in initializeComp() */
		return [setInputParams()[0], 2, 4];
	}

	const meridRad 	= 2;
	const scl		= 16;

	function theCurve(t) {
		let   tt = abs(t);
		const latRad = scl*(soulRad + meridRad * cos(meridFreq * t));
		const cvx = latRad * cos(2*t);
		let   cvy = latRad * sin(2*t);
		let   cvz = scl * meridRad * sin(meridFreq * t);
		if (tt <= tt0)
			{	tt = -pi*twistPar*sqr(sqr(sqr(1- sqr(sqr(t/tt0)) )));
				const ct = cos(tt);
				const st = sin(tt);
				const q	 =  cvy * ct + cvz * st;
					cvz  = -cvy * st + cvz * ct;
					cvy	 = q;
			}
		return [cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

