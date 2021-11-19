"use strict";

	function setNumberFields()	{
		return 1;	// there are three of them prepared
	}

	function set_s0_s1_n_ns() {
		return [0.01, 0.01+2*pi, 256, 2];
		}

	let [parameter1, parameter2, parameter3, parameter4] = [6,0,0,0];	
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4];
	}

/* =========== Parmeters used in the curve definitions ============== */
	let lengthOfFrames = 10;
	
	function switchParameterNames() {  // Only needed for parameters in the curve formulas
		//lengthOfFrames = setInputParams()
		;
	}
	
	function finalPosition() {
		return [0,90,0];
	}
	
	function drawingWidth() {
		return [0.75, 4];
	}
	
	function frameLengthStepTube() {
		return [setInputParams()[0], 2, 4];
	}

	const RR = 0.4;

	function theCurve(t) {
		const cvx = RR * (32*cos(t) - 51*sin(t) - 104*cos(2*t) - 34*sin(2*t) + 104*cos(3*t) - 91*sin(3*t));
		const cvy = RR * (94*cos(t) + 41*sin(t) + 113*cos(2*t) - 68*cos(3*t) - 124*sin(3*t));
		const cvz = RR * (16*sin(t) - 138*cos(2*t) - 39*sin(2*t) - 99*cos(3*t) - 21*sin(3*t));
		return [cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

