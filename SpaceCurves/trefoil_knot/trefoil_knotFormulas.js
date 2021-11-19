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
		return [-30,45,45];
	}
	
	function drawingWidth() {
		return [0.75, 4];
	}
	
	function frameLengthStepTube() {
		return [setInputParams()[0], 2, 4];
	}

	const RR = 0.6;

	function theCurve(t) {
		const cvx = RR * (41*cos(t) - 18*sin(t) - 83*cos(2*t) - 83*sin(2*t) - 11*cos(3*t) +27*sin(3*t));
		const cvy = RR * (36*cos(t) + 27*sin(t) - 113*cos(2*t) + 30*sin(2*t) + 11*cos(3*t) - 27*sin(3*t));
		const cvz = RR * (45*sin(t) - 30*cos(2*t) +113*sin(2*t) - 11*cos(3*t) + 27*sin(3*t));
		return [cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

