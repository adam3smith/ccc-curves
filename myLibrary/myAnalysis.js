const pi   = Math.PI;
const epsD = 1/1024/128;
const E    = Math.exp(1);
const ln2  = Math.log(2);

function random(n) {
	if (n == 1)
		 { return Math.random(); }
	else {  // output column of numbers
			const rnd = [];
			for( let i=0; i < n; i++)
			rnd[i] = Math.random();
			return rnd;
		 }
	}
	
function random_(n) {
	if (n == 1)
		 { return 2*Math.random()-1; }
	else {  // output column of numbers
			const rnd = [];
			for( let i=0; i < n; i++)
			rnd[i] = 2*Math.random()-1;
			return rnd;
		 }
	}
	
function applyArray(fcn, x) {
	if (!Array.isArray(x))
		 { return fcn(x); }
	else {  // apply to column of numbers
			const val = [];
			for( let i=0; i < x.length; i++)
			val[i] = fcn(x[i]);
			return val;
		 }
	}
	
function round(x) {
	return applyArray(Math.round, x);
	}
	
function floor(x) {
	return applyArray(Math.floor, x);
	}
function ceil(x) {
	return applyArray(Math.ceil,x);
	}

function max(x,y) {
	return Math.max(x,y);
	}
function maxArr(arr) {
	return Math.max(...arr);
	}
function min(x,y) {
	return Math.min(x,y);
	}
function minArr(arr) {
	return Math.min(...arr);
	}
	
function swap(x,y) {
		return [y,x];		
	}

function mul1(x,y) {
	return x*y;
	}
function sqr1(x) {
	return x*x;
	}
function sqr(x) {
	return applyArray(sqr1,x);
	}
function cube1(x) {
	return x*x*x;
	}
function cube(x) {
	return applyArray(cube1,x);
	}
function pow4(x) {
	return sqr(sqr(x));
	}
function pow51(x) {
	return sqr1(sqr1(x))*x;
	}
function pow5(x) {
	return applyArray(pow51,x);
	}
function pow6(x) {
	return sqr(cube(x));
	}
function pow71(x) {
	return sqr1(cube1(x))*x;
	}
function pow7(x) {
	return applyArray(pow71,x);
	}
function pow8(x) {
	return sqr(pow4(x));
	}
function pow9(x) {
	return cube(cube(x));
	}
	
function sgn1(x) {
	if ( x==0 )	{ return 0 }
	else		{ return x/abs(x);}
	}
function sgn(x) {
	return applyArray(sgn1,x);
	}

function abs(x) {
	return applyArray(Math.abs, x);
	}

function inv(x) {
	return 1/x;
	}
function sqrt(x) {
	return Math.sqrt(x);
	}
function sqrtCloser(x,oldRt) {
         let result = Math.sqrt(x);
         if ( (result+oldRt) < (result-oldRt) )
         	{result = -result;}
	return result;
	}

function exp(t) {
	return applyArray(Math.exp,t);
	}
function log(t) {
	return applyArray(Math.log,t);
	}
function cosh1(t) {
	return (Math.exp(t)+ Math.exp(-t))/2;
	}
function cosh(t) {
	return applyArray(cosh1,t);
	}
function sinh1(t) {
	return (Math.exp(t)- Math.exp(-t))/2;
	}
function sinh(t) {
	return applyArray(sinh1,t);
	}

function sin(t) {
	return applyArray(Math.sin,t);
	}
function asin(t) {
	return applyArray(Math.asin,t);
	}
function cos(t) {
	return applyArray(Math.cos,t);
	}
function acos(t) {
	return applyArray(Math.acos,t);
	}
function tan(t) {
	return applyArray(Math.tan,t);
	}
function atan(t) {
	return applyArray(Math.atan,t);
	}

function quadEq(A,B,C)	{ // solves Ax^2 + Bx = C
			const aux	= 0.5*B/A;
			const succ	= ((4*C*A + B*B) >= 0); // true if solutions are real
			let root1	= -aux; // if succ == false by rounding error, then this value is ok
			let root2	= -aux;
			if (succ)	{
				root1	= -aux + sqrt(abs(C/A + sqr(aux)));
				root2	= -root1 -2*aux;
				if (abs(root1) > abs(root2))	{
					const auy	= root1;
					root1		= root2;
					root2		= auy;
				}
			}		
		return [succ, root1, root2]; // abs(root1) <= abs(root2)
	}  

function numDerive(x, function1) {
	return (function1(x+epsD) - function1(x-epsD))/(2*epsD);
	}
	
function numCurvature(t, fdFct) {
			const drvVl = fdFct(t);
			const denom	= cube(norm1(drvVl)) + cube(epsD);
			const drv2	= scalTimesVec1(1/(2*epsD), vecDif1(fdFct(t+epsD), fdFct(t-epsD)) );
			const d90dF	= [-drvVl[1], drvVl[0]];
		return dotProd1(drv2, d90dF)/denom;
	} 
	
function IndIn(RR, ud) {  // invert curve with derivative in circle with rad^2 = RR
			const nuu 	= RR/dotProd1(ud[0], ud[0]);
			const sud	= 2*dotProd1(ud[0], ud[1])/RR;
			const fdf	= [];
			fdf[0]		= scalTimesVec1(nuu, ud[0]);
			fdf[1]		= linComb1(nuu, -sud*sqr(nuu), ud[1], ud[0]);
		return fdf;
	}

function invertCircle(RR,mxyr)	{ // inversion in |vec| = R
			let res	= [];
			const mx 	= mxyr[0];
			const my 	= mxyr[1];
			const r 	= mxyr[2];
			const denom	= sqr(r) - sqr(mx) - sqr(my);
			const dx	= -1*RR*mx/denom;
			const dy	= -1*RR*my/denom;
			const dr	= sqrt(sqr(RR)/denom + sqr(dx) + sqr(dy));
			res			= [ dx, dy, dr];
	return res;
	}
	
function antiDerivative(s0, s, n, inStp, A0, integrand)	{
		inStp = max(1, round(inStp));
		const DS = s-s0;
		const ss = [];
		const ff = [];
		const AA = [];
		let ds;
		let dA;
		AA[0]  	= [A0, integrand(s0)];
		for (let i=0; i < n+1; i++)		{
			ss[i] = s0 + (i/n)*DS;
			ff[i] = integrand(ss[i]);	}
		for (let i=1; i < n+1; i++)			{
			ds = (ss[i]-ss[i-1])/2/inStp;
			dA = vecSum1(ff[i-1], ff[i]);
			dA = vecSum1(dA, scalTimesVec1(4,integrand(ss[i-1]+ds)));
			if (inStp > 1) {
				for (let j=2; j < 2*inStp; j=j+2)	{
					dA = vecSum1(dA, scalTimesVec1(2,integrand(ss[i-1]+j*ds)));
					dA = vecSum1(dA, scalTimesVec1(4,integrand(ss[i-1]+(j+1)*ds)));
				}
			}
				
			AA[i] 	= [vecSum1(AA[i-1][0],scalTimesVec1(ds/3,dA)), integrand(ss[i])];
		//if (i==1) {console.log("AA[i]  	=",AA[i]);}
		}
	return AA;
	}
	
function numGrad(x,y, hFct)	{  // 2D
			const dh 	= [];
				  dh[0] = (hFct(x+epsD,y) - hFct(x-epsD,y))/(2*epsD);
		 		  dh[1] = (hFct(x,y+epsD) - hFct(x,y-epsD))/(2*epsD); 
		return dh;
	}

function numHesse(x,y, grdFct)	{  // 2D
			const ddh 	 = [];
				  ddh[0] = scalTimesVec1(0.5/epsD, vecDif1(grdFct(x+epsD,y), grdFct(x-epsD,y)));
				  ddh[1] = scalTimesVec1(0.5/epsD, vecDif1(grdFct(x,y+epsD), grdFct(x,y-epsD)));
		return ddh;
	}

// First the 1-dim case:		
function RungeKutta1(tA, fA, mA, dt, ODEfct1) {
		const h  = dt/2;
		const f1 = fA + mA * h;
		const m1 = ODEfct1(tA + h, f1);
		const f2 = fA + m1 * h;
		const m2 = ODEfct1(tA + h, f2);
		const f3 = fA + m2 * dt;
		const m3 = ODEfct1(tA + dt, f3);
		const fB = fA + (mA+ 2*m1+ 2*m2+ m3)*h/3;
		const mB = ODEfct1(tA + dt, fB);
	return [tA+dt, fB, mB];				
	}
	
// Now fA, mA and ODEfct are column-arraysof the same length > 1	
function RungeKutta(tA, fA, mA, dt, ODEfct) {
		const h  = dt/2;
		const f1 = linComb1(1, h, fA, mA);
		const m1 = ODEfct(tA + h, f1);
		const f2 = linComb1(1, h, fA, m1);
		const m2 = ODEfct(tA + h, f2);
		const f3 = linComb1(1, dt, fA, m2);
		const m3 = ODEfct(tA + dt, f3);
		const n1 = linComb1(1,2, mA, m1);
		const n2 = linComb1(2,1, m2, m3);
		const fB = linComb1(1, h/3, fA, vecSum1(n1,n2));
		           // fA + (mA+ 2*m1+ 2*m2+ m3)*h/3;
		const mB = ODEfct(tA + dt, fB);
	return [tA+dt, fB, mB];
	}
	
function CurveByCurvature2D(s0,s1,n,inStp, kappa, c0,v0) {
		function FrenetODE(t, v) {
			const kap = kappa(t);
			return [v[1]*kap, -v[0]*kap];
		}
		let result = [];
		const ds = (s1 - s0)/n;
		let tA   = s0; let fA = v0; let fM = 0;
		let mA 	 = FrenetODE(tA, fA);
		let intSecant;   let intSimpson; let cA = c0;
		result[0] = [cA,fA];
		
		for (let i=0; i<n; i++)
		{	
			for (let j=0; j< inStp; j++) {
				[tA, fA, mA]   =	RungeKutta(tA, fA, mA, ds/(2*inStp), FrenetODE);
			}
			fM = fA;
			for (let j=0; j< inStp; j++) {
				[tA, fA, mA]   =	RungeKutta(tA, fA, mA, ds/(2*inStp), FrenetODE);
			}
			intSecant  = linComb1(0.5, 0.5, v0, fA);
			intSimpson = linComb1(2*ds/3, ds/3, fM, intSecant);
			v0 = fA;
			cA = vecSum1(cA,intSimpson);
			result[i+1] = [cA,fA];
		}
	return result;
	}
	
function LevelODEt2(step, start, tang, ddLevel) { // tang = 1st deriv of levelFct, rotated 90
		const dt		= step/2;
		const tan1		= tang(start);
		const ddL1		= ddLevel(start);
		const hess1		= [-dotProd1(ddL1[1],tan1 ), dotProd1(ddL1[0], tan1 )];
		const middle	= linTripleComb1(1, dt, dt*dt/2, start, tan1, hess1);
		const tan2		= tang(middle);
		const ddL2		= ddLevel(middle);
		const hess2		= linComb1(1.0/6,2.0/6, hess1, [-dotProd1(ddL2[1],tan2 ), dotProd1(ddL2[0], tan2 )] );
		const nextPt	= linTripleComb1(1, step, step*step, start, tan1, hess2);
	return nextPt;
	}
	
function myODEdf2(step, start, dstart, ddstart, df2,ddODE)  {  // solves x'(t)^2 = df2(x), using x''(t) = ddODE(x)
		const dt		= step/2;
		const middle	= start+dt*(dstart+0.5*dt*ddstart);
		const ddxm		= ddODE(middle);
		const nextPt	= start + step*dstart + 0.5*step*step*(ddstart + 2*ddxm)/3;
		const nextDDx	= ddODE(nextPt);
		const nextDx	= sqrtCloser(df2(nextPt), dstart + step*ddxm);
		//const nextDx	= dstart + (ddstart + 4*ddxm + nextDDx)*step/6; // if previous update is not available
	return [nextPt, nextDx, nextDDx];
	}
	
function ImprovedRegulaFalsi(argIntrvl, tolerance, rootFunc)	{
		// argIntrvl[0], argIntrvl[1] is the initial search interval and updated in the program
		let success		= false;
		let NaNflag		= true;
		let approxRoot	= NaN;
		let value		= NaN;
		let message		= 'No sign-change at search interval ends';
		let numIter		= 0;
		
		let index 	= 0;
		let count 	= 0;
		let weight	= 0;
		let valIntrvl = [rootFunc(argIntrvl[0]), rootFunc(argIntrvl[1])];
		let um	  = (argIntrvl[0] + argIntrvl[1])/2;  // the guess variable
		let vm    = rootFunc(um);
		
	 if (!isNaN(vm))
	 {	
		if (NaNflag && !(valIntrvl[0]*valIntrvl[1] > 0))
		{ // we will find a root
			success = true;
			if      (valIntrvl[0] == 0) {approxRoot = argIntrvl[0]; value = 0; message = 'boundary zero';}
			else if (valIntrvl[1] == 0)	{approxRoot = argIntrvl[1]; value = 0; message = 'boundary zero';}
			else // now we need to iterate
			{ message = 'iteration to tolerance';
			    um  = ( argIntrvl[0]*valIntrvl[1] - argIntrvl[1]*valIntrvl[0] ) / (valIntrvl[1] - valIntrvl[0]); // Secant root
     			vm  = rootFunc(um);
     			// The first guess is the secant root. Linear functions do not enter the while loop.
     			
     			while ((abs(vm) > tolerance )&&(numIter < 36)&& NaNflag)
     			{	// The following "if - else" decides which end of the search interval is replaced by um
     				if (sgn(vm) == sgn(valIntrvl[index]) )
						{ count = count + 1; }  // change the same end as before
          			else
            			{ index = 1 - index;    // change the other end 
               		  	  count = 1;
               			}
        			weight = min(0.66, count*sqr(vm/valIntrvl[index] )) ;
        			argIntrvl[index] = um;      // replace one end of the search interval by the next guess
        			valIntrvl[index] = vm;
        			numIter = numIter + 1;
        			console.log("num Iterations =",numIter," arg-interval, value-interval = ",argIntrvl, valIntrvl);
        			
        			um = ( argIntrvl[0]*valIntrvl[1] - argIntrvl[1]*valIntrvl[0] )/(valIntrvl[1] - valIntrvl[0]);  // Secant root 
            		// Next we use the weight to improve all further guesses 
        			um = ( um + weight * argIntrvl[1-index] ) / (1 + weight);
        			vm = rootFunc(um);
        			NaNflag = !isNaN(vm);
     			} // end while
     			if (NaNflag) 
     				{
     					approxRoot 	= um;
     					value		= vm;
     				}  else { success = false; message = "value is NaN during iteration"; }  
     			if (numIter == 36) { success = false; message = 'iteration not finished';}
			} // end else of iteration
		}
	  }  else {message = "middle value is NaN";}
	return [success, approxRoot, value, message]; /* = ImprovedRegulaFalsi(argIntrvl, tolerance, rootFunc) */
	}