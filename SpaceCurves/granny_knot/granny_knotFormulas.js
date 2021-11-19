"use strict";

	function setNumberFields()	{
		return 1;	// there are three of them prepared
	}

	function set_s0_s1_n_ns() {
		return [0.01, 0.01+2*pi, 256, 2];
		}

	let [parameter1, parameter2, parameter3, parameter4] = [10,0,0,0];	
	
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
		return [+90,0,45];
	}
	
	function drawingWidth() {
		return [0.75, 4];
	}
	
	function frameLengthStepTube() {
		return [setInputParams()[0], 2, 4];
	}

	const RR = 0.7;

	function theCurve(t) {
		const cvx = RR * (-22*cos(t) -128*sin(t)  -44*cos(3*t) -78*sin(3*t));
		const cvy = RR * (-10*cos(2*t) -27*sin(2*t) +38*cos(4*t) +46*sin(4*t));
		const cvz = RR * (70*cos(3*t) -40*sin(3*t) );
		return [cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		//return [RR * xfrequency * cos(xfrequency * t), -RR * yfrequency * sin(yfrequency * t), RR * zfrequency * cos(zfrequency * t) / 4];
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

