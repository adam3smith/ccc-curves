"use strict";

	function setNumberFields()	{
		return 1;	// there are three of them
	}

	function set_s0_s1_n_ns() {
		return [0.01, 0.01+2*pi, 512, 2];
		}

	let [parameter1, parameter2, parameter3] = [5,0,0,0];	
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3];
	}

/* =========== Parmeters used in the curve definitions ============== */
	//let xfrequency, yfrequency, zfrequency;
	
	function switchParameterNames() {
		//[xfrequency, yfrequency, zfrequency] = setInputParams()
		;
	}
	
	function finalPosition() {
		return [-75,0,-5];
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
		const cvy = RR * ( 11*cos(t) -43*sin(3*t) +34*cos(5*t) -39*sin(5*t));
		const cvz = RR * (70*cos(3*t) -40*sin(3*t) +18*cos(5*t) -9*sin(5*t));
		return [cvx, cvy, cvz];
	}
	
	function dtheCurve(t) {
		//return [RR * xfrequency * cos(xfrequency * t), -RR * yfrequency * sin(yfrequency * t), RR * zfrequency * cos(zfrequency * t) / 4];
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

