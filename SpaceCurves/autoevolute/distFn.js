 function symAxDistanceFr()	{
/* The program checks whether fr can be used to make the symmetry axes of autoevolutes coplanar */
		const fr0 = fr;
		const fr1 = fr+0.001;
		function symDist(a) {   // This function keeps the value of the global variable fr
			const frSave = fr;
			fr  = a;
			const testCompute 	= theODEcurve3D(pi/fr/2,3*pi/fr/2,256,4,[0,0,0],[1,0,0,0,1,0],FrenetODE3D);
			const Bvec	  		= crossProd1(testCompute[0][2], testCompute[256][2] );
			const nbv2			= dotProd1(Bvec,Bvec)/sqr(drawScl); // sin^2 of angle between normals
			let dist
			if (nbv2 < 1/sqr(512)) { dist = NaN; } // if normals are nearly parallel, do not compute distance
			else	
				{
				  const cDif	= vecDif1(testCompute[0][0], testCompute[256][0] );
			 			dist	= dotProd1(Bvec, cDif)/ (drawScl*sqrt(nbv2));
			 	}
			fr  = frSave;
			return dist;
		}
		
		let fr2;
		let success 	= false;
		const dist0		= symDist(fr0);
		const dist1		= symDist(fr1);
		let NaNflg		= !isNaN(dist0) && !isNaN(dist1);
		
		if (NaNflg)
		{
			const Ddist		= (dist1 - dist0)/ (fr1 - fr0); // derivative
		
			fr2			= fr - 1*(dist0)/Ddist;
			let dist2		= symDist( fr2 );
			NaNflg 			= NaNflg && !isNaN(dist2);
			if (NaNflg)
			{	success		= sgn(dist0) != sgn(dist2); }
		
		if (NaNflg && !success) { fr2 = fr - 2*(dist0)/Ddist;
						dist2	= symDist( fr2 );
						NaNflg 	= NaNflg && !isNaN(dist2);
						if (NaNflg)
						{	success	= sgn(dist0) != sgn(dist2); }
					  }
		 console.log("sign change found?", symDist(fr0), symDist(fr2));
		}
		else { console.log("NO sign change found or NaN"); }
		
		
		let RFsuccess = false;
		let approxRoot = NaN; 
		let value, message;
		if (success && NaNflg) 
		{
		[RFsuccess, approxRoot, value, message]= ImprovedRegulaFalsi([min(fr0,fr2),max(fr0,fr2)], 1/1024/1024/1024, symDist);
			if (RFsuccess)	{fr = approxRoot;}
			message = "found zero? new fr, function value";
		}
		console.log("old/new fr, fr-RegulaFalsi: ", fr, message,[ RFsuccess, approxRoot, value]);
		return [RFsuccess, fr, value];	// returns old fr if RFsuccess = false	
	}