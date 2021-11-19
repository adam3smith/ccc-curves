"use strict";

	function setNumberFields()	{
		return 3;	// there are three of them
	}

	function set_s0_s1_n_ns() {
		return [0.01, 0.01+2*pi, 512, 4];
		}

	let [parameter1, parameter2, parameter3, paramchoice] = [2,3,7,0];	
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, paramchoice];
	}

/* =========== Parmeters used in the curve definitions ============== */
	let xfrequency, yfrequency, zfrequency;
	
	function switchParameterNames() {
		[xfrequency, yfrequency, zfrequency] = setInputParams();
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

	const RR = 16 * 6;

	function theCurve(t) {
		const cvx = RR * sin(xfrequency * t);
		const cvy = RR * cos(yfrequency * t);
		const cvz = RR * sin(zfrequency * t) / 4;
		return [cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		return [RR * xfrequency * cos(xfrequency * t), -RR * yfrequency * sin(yfrequency * t), RR * zfrequency * cos(zfrequency * t) / 4];
		//return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

