"use strict";

	function setNumberFields()	{
		return 4;	// there are 0,1,2,3,4,5 of them
	}

	function set_s0_s1_n_ns() {
		return [-5*pi, 5*pi, 256, 4];
		}

	let [parameter1, parameter2, parameter3, parameter4, paramChoice] = [4,1.4,0.15,4,-1];	
	
	function setInputParams() {
		return [parameter1, parameter2, parameter3, parameter4, paramChoice];
	}

/* =========== Parmeters used in the curve definitions ============== */
	
	let tubeWidth, Rad, slope;
	let ht, Erad, frq, drawScl, dataTrans;
	
	function switchParameterNames() {  /* this function is called in fillCurve() */
		[tubeWidth, Rad, slope, parameter4, paramChoice] = setInputParams();
		ht 		= Rad*slope;
		Erad	= sqr(slope)*Rad;
		frq		= 1/sqrt(sqr(Rad) + sqr(ht));
		drawScl	= exp(parameter4);
		checkboxNormal.checked = true;
	}
	
	function finalPosition() {
		return [0,60,90];
	}
	
	function drawingWidth() {
		return [0.75, 4];
	}
	
	function frameLengthStepTube() {	/* this function is called in initializeComp() */
		return [setInputParams()[0], 2, 4];
	}
	
	function itsEvolute(t)	{
				const tt  = frq*t;
				const evx = drawScl*Erad*cos(tt);
				const evy = drawScl*Erad*sin(tt);
				const evz = drawScl*ht*tt;
		return [evx, evy, evz];
	}
	
	function helix(t)	{
				const tt  = frq*t;
				const cvx = drawScl*Rad*cos(tt);
				const cvy = drawScl*Rad*sin(tt);
				const cvz = drawScl*ht*tt;
		return [cvx, cvy, cvz];	
	}

	function theCurve(t) {
		return helix(t);
		//return itsEvolute(t);
	}
	
	function dtheCurve(t) {
		return scalTimesVec1(1/(2*epsD), vecDif1(theCurve(t+epsD), theCurve(t-epsD)) );
	}
	
	

