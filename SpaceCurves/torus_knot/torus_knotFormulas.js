"use strict";

	function setNumberFields()	{
		return 4;	// there are 0,1,2,3 of them
	}

	function set_s0_s1_n_ns() {
		return [0.01, 0.01+2*pi, 512, 4];
		}

	let [parameter1, parameter2, parameter3, parameter4] = [80,30,2,7];	
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4];
	}

/* =========== Parmeters used in the curve definitions ============== */
	let soulRad, meridRad, soulFreq, meridFreq;
	
	function switchParameterNames() {
		[soulRad, meridRad, soulFreq, meridFreq] = setInputParams()
		;
	}
	
	function finalPosition() {
		return [0,0,0];
	}
	
	function drawingWidth() {
		return [0.75, 4];
	}
	
	function frameLengthStepTube() {
		return [5, 2, 4];
	}

	function theCurve(t) {
		const latRad = soulRad + meridRad*cos(meridFreq*t);
		const cvx = latRad * cos(soulFreq * t);
		const cvy = latRad * sin(soulFreq * t);
		const cvz = meridRad * sin(meridFreq*t);
		return [cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

