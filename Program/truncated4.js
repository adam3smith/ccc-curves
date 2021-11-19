"use strict"
window.onload = function () {
const svgArea        	= document.getElementById("svgArea");
const polyhedronMenu 	= document.getElementById("polyhedronMenu");
const truncateMenu   	= document.getElementById("truncateMenu");
const checkboxRotate 	= document.getElementById('checkboxRotate');
const checkboxStereo	= document.getElementById('checkboxStereo');
const checkboxDual		= document.getElementById('checkboxDual');
const inputViewDist  	= document.getElementById("viewdist");
const inputTruncParam	= document.getElementById("truncParam");

const inputPatchStyle  	= document.getElementById("patchstyle");
const inputWireFrame   	= document.getElementById("wireframe");
const inputBlack       	= document.getElementById("black");
const inputWhite       	= document.getElementById("white");
const inputOrtho       	= document.getElementById("ortho");
const inputPersp       	= document.getElementById("persp");

const currentObject		= document.getElementById("currentObject");
const verticesPosition	= document.getElementById("verticesPosition");

const viewBoxWidth  = "40";
const viewBoxHeight = "40";
let mybackground    = "black";
let myforeground    = "cyan";
let wantsStereo		= false;
let wantsDual		= false;

// ========== create the svg element ====================================
const svgEl = document.getElementById("mySVG");

// =========================== svg initialization up to here ===========

// =============================== global parameters ===================
// rotationKeyIncrement is the degree for each key press
let rotationKeyIncrement = 5;

// For basic drawing
const patch = "patch";
const wire  = "wire";
let renderstyle = patch;
let renderVal  = "patchstyle";  // needed for "refresh"
const underl = 0;
const overl  = 1;
let drawLine = overl;

// For perspective drawing
let buttonEye  = 0;		// value = 3 set in: function toggleStereo()	{
let eye        = 0;
let viewLength = 80;    // the eventListener returns strings!!
let viewPoint  = [eye,0,viewLength];
const ortho    = "ortho"; // orthogonal
const persp    = "persp"; // perspective
let projType   = persp;

// For changing the truncation parameter
let truncParam = "32"; // max = 48
let vParam     = truncParam/96; // see function TruncParam()

// For Truncation
const regular  = "regular"; // no truncation
const vtrunc   = "vtrunc";  // vertex truncation
const etrunc   = "etrunc";  // edge truncation
const strunc   = "strunc";  // snub truncation
const ktrunc   = "ktrunc";  // shrink truncation
let truncationMode = "regular";
let truncationFlag = (truncationMode == vtrunc)||(truncationMode == etrunc)||(truncationMode==strunc)||(truncationMode==ktrunc);
truncateMenu.value = truncationMode; // refresh ok
let truncationName	= "no truncation";

// ==== EXPLANATION of GLOBALS for PLATONIC polyhedra. The truncated polyhedra get other names.========
// number of vertices = vertices.length; vertices[i] = 3D-coordinates of the i.th vertex
let vertices    = [];
// number of faces = faceIndexes.length; faceIndexes[j] gives the vertices of j.th face in cyclic order
let faceIndexes = [];
// number of edges = edgeIndexes.length; edgeIndexes[k] gives edge, face of edge, index of edge in face
let edgeIndexes = [];
// edge2num[i,j] is -1 if i,j are not the vertices of an edge, otherwise the number of the edge
let edge2num    = [];
// vertex2edge[i] gives for each vertex i the number of an edge that starts at i
let vert2edge   = [];
// number of edges from a vertex = vertexStar.length; vertexStar[i] gives edges from i.th vertex in cyclic order
let vertexStar  = [];
let numVertices;      // = vertices.length
let numFaces;         // = faceIndexes.length
let numEdges;         // = edgeIndexes.length = numFaces * faceIndexes[0].length
let edgesFromVertex;  // = vertexStar.length  = numEdges / numVertices
let numFaceVert;	  // number of vertices per face

// The truncated polyhedra also have the property, that the vector to a face-midpoint is orthogonal
// to that face. We do not truncate them further, therefore we only need their vertices and their
// faceIndexes (which is all the drawing program uses). They are computed in getVTrunc, getETrunc, getSTrunc
// using getEdgeIndexes and getVertexStars. For the snubTruncation the rotation parameter is adjusted, so
// that the cut-off triangles are isocele.
let vVertices    = [];
let vFaceIndexes = [];
let fChgColor    = [];
let vDone        = false;  	// Do not recompute vVertices for rotations or switch to wireFrame.

let edgeTrIndexes = [];		// The next three are needed to make the TrVertexStars for truncated Polyhedra
let edgeTr2num	  = [];
let vertTr2edge	  = [];
let TrVertexStars = [];		// The dual faces are made with the TrVertexStars of the truncated polyhedra
let dVertices	  = [];		// Contains vertices of dual polyhedra
let dFaceIndexes  = [];

// ================================= The platonic input data ============================
// ======================================================================================

    
const v  = 10;
const vo = 15;
const gg = vo*(Math.sqrt(5)-1)/2;
const hd = v*(Math.sqrt(5)+1)/2;
const gd = v*(Math.sqrt(5)-1)/2;
    
const polyData = {

        tetrahedron: {
            "vertices": [
                [v,v,v],
                [-v,-v,v],
                [v,-v,-v],
                [-v,v,-v]
            ],
            "faces":[
                [0,1,2],
                [1,0,3],
                [2,3,0],
                [3,2,1]
            ]
        },
        "cube": {
            "vertices": [
                [ v, v, v],
                [-v, v, v],
                [-v,-v, v],
                [ v,-v, v],
                [ v, v,-v],
                [-v, v,-v],
                [-v,-v,-v],
                [ v,-v,-v]
            ],
            "faces":[
                [0,1,2,3],
                [1,0,4,5],
                [2,1,5,6],
                [3,2,6,7],
                [0,3,7,4],
                [7,6,5,4]
            ]
        },
        "octahedron": {
            "vertices":[
                [vo,0,0],
                [0,vo,0],
                [0,0,vo],
                [0,-vo,0],
                [0,0,-vo],
                [-vo,0,0]
            ],
            "faces":[
                [0,1,2],
                [0,2,3],
                [0,3,4],
                [0,4,1],
                [5,2,1],
                [5,3,2],
                [5,4,3],
                [5,1,4],
            ]
        },
        "icosahedron": {
            "vertices":[
                [ gg, 0, vo],
                [-gg, 0, vo],
                [ gg, 0,-vo],
                [-gg, 0,-vo],
                [ 0,-vo, gg],
                [ 0,-vo,-gg],
                [ 0, vo, gg],
                [ 0, vo,-gg],
                [ vo,-gg, 0],
                [ vo, gg, 0],
                [-vo,-gg, 0],
                [-vo, gg, 0]
            ],
            "faces":[
                [0,1,4],
                [1,0,6],
                [4,8,0],
                [9,6,0],
                [8,9,0],
                [4,5,8],
                [8,5,2],
                [11,1,6],
                [5,3,2],
                [7,2,3],
                [2,7,9],
                [11,7,3],
                [6,7,11],
                [7,6,9],
                [9,8,2],
                [5,4,10],
                [10,4,1],
                [11,10,1],
                [10,11,3],
                [5,10,3],
            ]
        },
        "dodecahedron": {
            "vertices": [
                [ v, v, v],
                [-v, v, v],
                [-v,-v, v],
                [ v,-v, v],
                [ v, v,-v],
                [-v, v,-v],
                [-v,-v,-v],
                [ v,-v,-v],
                [0, gd, hd],
                [0,-gd, hd],
                [0, gd,-hd],
                [0,-gd,-hd],
                [ hd, 0, gd],
                [ hd, 0,-gd],
                [-hd, 0, gd],
                [-hd, 0,-gd],
                [ gd, hd, 0],
                [-gd, hd, 0],
                [ gd,-hd, 0],
                [-gd,-hd, 0]
            ],
            "faces":[
                [0,8,9,3,12],
                [2,9,8,1,14],
                [7,11,10,4,13],
                [5,10,11,6,15],
                [7,13,12,3,18],
                [0,12,13,4,16],
                [5,15,14,1,17],
                [2,14,15,6,19],
                [0,16,17,1,8],
                [5,17,16,4,10],
                [2,19,18,3,9],
                [7,18,19,6,11],
            ]
        }
 };
 
 function specialETruncParam()		{
          	switch (polyhedronMenu.value) {
        		case "tetrahedron":{
          			truncParam = "36";
        		}break;
        		case "cube":{
          			truncParam = "28";
        		}break;
        		case "dodecahedron":{
          			truncParam = "23";
        		}break;
        		case "icosahedron":{
          			truncParam = "31";
        		}break;
        		default:
        			truncParam = "32";
      		}
      	return truncParam;
	}
    
// initVertices("cube") will fill the values of global variables vertices and faceIndexes.
// arguments must be string, one of "tetrahedron", "cube", etc
function initVertices(polyhedronName)	{
	
    // NOTE: The following names are used for the Platonics ONLY
    let polyMenuVal = polyhedronMenu.value;
    vertices    = polyData[polyMenuVal].vertices;
     //vertices = reflectNormalToVector([1,1,1],vertices);  // check reflection map
     //vertices = reflectParallelToVector([1,1,1],vertices);  // check reflection map
    //  =========== All index-arrays only change with a new platonic ===============
    faceIndexes = polyData[polyMenuVal].faces;

    numVertices = vertices.length;
    numFaces    = faceIndexes.length;
    numEdges    = 2*(numVertices+numFaces-2);
    // These are needed for the truncation. They are only recomputed when the platonic changes
    getEdgeIndexes();
    numFaceVert = faceIndexes[0].length;
    
//     let resultArrays = getEdgeTrIndexes(numVertices,faceIndexes);
//     edgeIndexes = resultArrays[0];
//     edge2num 	= resultArrays[1];
//     vert2edge 	= resultArrays[2];
    getVertexStars();
    fChgColor[0] = numFaces;
    vDone = false;
    // use default values for the truncation that give Archimedean solids:
    if (truncationMode == vtrunc) {getVFaceIndexes(); truncParam = "32";}
    if (truncationMode == etrunc) {getEFaceIndexes(); specialETruncParam();}
    if (truncationMode == strunc) {getSFaceIndexes(); truncParam = "48"; }
    if (truncationMode == ktrunc) {wantsDual = false; getKFaceIndexes(); truncParam = "48"; }
    
    inputTruncParam.value = truncParam;
    vParam = truncParam/96;  // automatic conversion to number
    const vb = viewBoxWidth;
    const vh = viewBoxHeight;
	svgEl.setAttribute("viewBox"," -20 -20 "+vb+" "+vh);
	
    updateDVerticesFaces();
    rotY(30); rotX(-30); rotY(40);
// =========== These index computations are done only once for each polyhedron =====
// ======= vertices and vVertices are rotated; vVertices depend on vParam ==========
	//console.log("reflectNormalToVector(vertices) = ", reflectNormalToVector([1,1,1],vertices));
}


// =================== The routines for computing the index arrays =================
/*
   The array faceIndexes[j] contains for the j.th face the array of the vertex-indices
   of its vertices. This information also contains the edges of that face.
   The edges are also numbered and in getEdgeIndexes() we use faceIndexes to number
   the edges; the array edgeIndexes[k] contains for the k.th oriented edge the indices
   of its initial and end vertices, the face number of its face and the number of that
   edge as an edge in the face.
   We also need the opposite: given the endpoints of and edge we need to know its number.
   This is stored in the array edge2num. k = edge2num[j1][j2] gives the number of the
   edge with vertex-indices j1, j2. This is used to truncate the platonic polyhedra. It
   cannot be used for a second truncation.
  */

function getEdgeIndexes() 	{
    // fills the arrays edgeIndexes, edge2num, vert2edge and prepares for vertexStar
	const vl = vertices.length;
	let fl 	 = faceIndexes[0].length;  // reset for other faces below
	// initialize:
	edge2num = []; vert2edge = [];
	for (let i = 0; i < vl; i++)  {
	    edge2num[i]   = [] ;
	    vert2edge[i]  = -1;
	    }
  	for (let i = 0; i < vl; i++)  {
	    for(let j = 0; j < vl; j++)  {
	     edge2num[i][j]   = -1; }}
	     
	// edgeIndexes[k] ist the k.th edge = [vertexStart, vertexEnd, itsFace, indexInFace]
	// edge2num gives for each edge its number and for non-edge pairs gives -1
	// vert2edge[j]  gives for the j.th vertex the number of an edge starting at it
	let k = 0;
	for (let j = 0; j < faceIndexes.length; j++)
	{
		const f = faceIndexes[j];
		fl = f.length;
		// f is the set of indices of vertices of the j.th face in cyclic order
	    for (let i = 0; i < fl; i++) {
	        // contains: 1st edgeVertex, 2nd edgeVertex, itsFace, indexInFace
	    	edgeIndexes[k] = [f[i],f[(i+1)%fl],j,i];
	    	edge2num [f[i]] [f[(i+1)%fl]] = k;  // 2-index array syntax: array[i] [j]
	    	vert2edge[f[i]] = k;				// at vertex f[i] starts edge Nr k
	    	// for each vertex this assignment occurs several times, but not in cyclic order
	    	k++;
	    	}
	}
}

// ====== getInverseEdge( number of edge[j1,j2]) = number of inverseEdge[j2,j1]  =======
function getInverseEdge(k)  {
          const inEdge = edgeIndexes[k];     // an array of four numbers
   return edge2num[inEdge[1]] [inEdge[0]];   // number of inverse edge; entries not filled here are -1
}

// getVertexStars fills the array vertexStar; it must be called after getEdgeIndexes
function getVertexStars()	{ 
		vertexStar = [];
      	// vertexStar is a global variable, initialized as double array:
      	for (let i=0; i < vertices.length; i++) {vertexStar[i] = []; }

			const fl = faceIndexes[0].length;       // = number of vertices of the face
			let ke;
			let ecount;
			let edgeNum;
			let edge3; 
	
			edgesFromVertex = numEdges/numVertices; // Only used for platonics where all vertices are the same
    		for (let i = 0; i < numVertices; i++)  {
	   		ke      = vert2edge[i];               // number of the last stored edge leaving i.th vertex
	   		ecount  = 0;
	   		while (ecount < edgesFromVertex) {
	   			edge3   = edgeIndexes[ke];
	   			vertexStar[i][ecount] = edge3;	 // next edge from vertex i; the stored edge at i = 0.
	   			edgeNum = ke - 1;                // the edges are numbered face by face in cyclic order
	   			if (edge3[3] == 0) {edgeNum = ke - 1 + fl}
	   		// edgeNum is the number of the edge, which, in the face of edge ke, ends at vertex i
	   		ke = getInverseEdge(edgeNum); // the inverse of edge edgeNum is the next edge from vertex i
	   		ecount++;
	   }}
}
/*
function checkTruncDetailsF()  {          // ======== helps debugging the following routine ==========
				console.log("The separate vFaceIndexes follow:");
				for (let i = 0; i < numVertices; i++) {
				console.log(i,".th vFaceIndex ",vFaceIndexes[i][0],vFaceIndexes[i][1],vFaceIndexes[i][2]);}
}
*/
function getVFaceIndexes() 	{
	 		vFaceIndexes = []; //
			for (let j = 0; j < numVertices + numFaces ; j++) {
			    vFaceIndexes[j] = [];          }  // initialize as double array

			for (let j = 0; j < numVertices; j++)
				{
			    for (let ec = 0; ec < edgesFromVertex; ec++)
			    	{
			         // vFaceIndexes[j][ec] is the ivVertex-Index of the ks.th vertex around the j.th vertex
			         // vertexStar[j][ec] is the 4-array of the ec.th edge leaving vertex j
			         // ke = edge2num[j] [vertexStar[j][ec]]; is the number of this edge
			         // the nearest vVertex on this edge has this same number ke - by construction
						vFaceIndexes[j][ec] = edge2num[j][vertexStar[j][ec][1]];
			          //console.log("j:",j,"vertexStar[j][ec] = ",vertexStar[j][ec]," vFaceIndexes[j][ec] = ",edge2num[j] [vertexStar[j][ec][1]]);
			        } //console.log("j:",j,"vertexStar[j] = ",vertexStar[j]);
			    }
			fChgColor[1] = numVertices;
				//console.log("First Part of getVFaceIndexes: ","edge2num=",edge2num);

			// the nearer vVertex on an edge has the same number as this edge
			const faceLength = faceIndexes[0].length;
			let currentEdgeNum;
			let inverseEdgeNum;
			let currentEdge;
			
			for (let j = 0; j < numFaces; j++)
			{
    			currentEdge = [];        //  console.log(j,"th face=",faceIndexes[j] );
			 	currentEdgeNum = -1;
			 	inverseEdgeNum = -1;
			 	for (let ec = 0; ec < faceLength; ec++)
			 		{	currentEdge = [ faceIndexes[j][ec], faceIndexes[j][(ec+1)%faceLength] ];
			 		   	currentEdgeNum = edge2num[currentEdge[0]] [currentEdge[1]];
			 		   	inverseEdgeNum = edge2num[currentEdge[1]] [currentEdge[0]];
			 			//console.log("currentEdge= ",currentEdge, currentEdgeNum,inverseEdgeNum);
			 			vFaceIndexes[numVertices + j][2*ec]     = edge2num[currentEdge[0]] [currentEdge[1]];
			 			vFaceIndexes[numVertices + j][2*ec+1] = edge2num[currentEdge[1]] [currentEdge[0]];
			 	  	}

				//console.log("vFaceIndexes[numVertices + j][all]= ",vFaceIndexes[numVertices + j]);
			}
			fChgColor[2] = numVertices + numFaces ;
			//	console.log("vFaceIndexes=",vFaceIndexes);
		}

	//checkTruncDetailsF();

function getEFaceIndexes()  			// stored in vFaceIndexes
           {	vFaceIndexes = [];
                let ke     = -1;       	// edgeNumber
                let nextV  = -1;       	// vVertexNumber underneath a platonic vertex
                const auxV = numFaces + numVertices; // first two groups of faces
                numFaceVert = faceIndexes[0].length;
                let currentEdge   = [];

			for (let j = 0; j < numFaces + numVertices + numEdges/2; j++) { //
			    vFaceIndexes[j] = [];          }  // initialize as double array

			for (let j = 0; j < numFaces; j++)  // Faces inside old faces
				{
			    for (let ec = 0; ec < numFaceVert; ec++)
						vFaceIndexes[j][ec] = j*numFaceVert + ec; // Faces inside the old Faces
			    }
			fChgColor[1] =  numFaces;

			for (let j = 0; j < numVertices; j++) // Faces underneath vertices
				{
			    for (let ec = 0; ec < edgesFromVertex; ec++)
			    	{
			    		currentEdge = vertexStar[j][ec];  // ke = number of ec.th edge from vertex j
			    		//console.log("vertexStar[j][ec] ",vertexStar[j][ec],currentEdge,currentEdge[2],currentEdge[3]);
						nextV = currentEdge[2] * numFaceVert + currentEdge[3];
						vFaceIndexes[numFaces+j][ec] = nextV;
					}
			    }
			 fChgColor[2] =  numFaces + numVertices;

				ke = 0;
			   	for (let j=0; j < numEdges; j++)
				{
					currentEdge = edgeIndexes[j];
					//currentEdge[2] is the faceNum of this edge
					if (currentEdge[0] < currentEdge[1])  // below we use both sides of the edge
					{
			    	  vFaceIndexes[auxV + ke][0] = currentEdge[2] * numFaceVert + currentEdge[3];
			    	  vFaceIndexes[auxV + ke][3] = currentEdge[2] * numFaceVert + (currentEdge[3]+1)%numFaceVert;
			    	  currentEdge = edgeIndexes[getInverseEdge(j)];
			    	  vFaceIndexes[auxV + ke][2] = currentEdge[2] * numFaceVert + currentEdge[3];
			    	  vFaceIndexes[auxV + ke][1] = currentEdge[2] * numFaceVert + (currentEdge[3]+1)%numFaceVert;
			    	  ke++;
			    	}
			    }
			 fChgColor[3] =  numFaces + numVertices + numEdges/2;

		}
		

function getKFaceIndexes()  			// stored in vFaceIndexes. Almost the same as getEFaceIndexes
           {							// The truncated vertices are numbered by the Platonic edges 2e, 2e+1
           		numFaceVert = faceIndexes[0].length;
           		vFaceIndexes = [];          
			for (let j = 0; j < numFaces+ numVertices + numEdges/2; j++) { // 
			    vFaceIndexes[j] = [];            }  // initialize as double array  
			    
			    let star	= [];
			    let inve	= -1;
			    let cen		= -1;
			    let ec2		= -1;
				let j 		= 0;  // Counting
				for (let e=0; e < numEdges; e++)
                {	inve = getInverseEdge(e);
                	if (e < inve)
                	{	vFaceIndexes[j] = [2*e, 2*inve+1, 2*inve, 2*e+1];
                		j++;
                	}
                }
     		 fChgColor[1] =  numEdges/2; 
                // number of faces = faceIndexes.length; faceIndexes[j] gives the vertices of j.th face in cyclic order
                // edge2num[i,j] is -1 if i,j are not the vertices of an edge, otherwise the number of the edge
                for (let k=0; k < numFaces; k++)
                {	for (let ec = 0; ec < numFaceVert; ec++)
                		{   ec2 = 2*ec;
                			cen = edge2num[faceIndexes[k][ec]][faceIndexes[k][(ec+1)%numFaceVert]];
                			vFaceIndexes[j][ec2] 	= 2*cen;
                			vFaceIndexes[j][ec2+1]  = 2*cen + 1;
                		}
                		//if (k==0) {console.log("j,vFaceIndexes[j] = ",j,vFaceIndexes[j]);}
                	j++;
                }   
    		fChgColor[2] =  numFaces + numEdges/2;
    			// number of edges = edgeIndexes.length; edgeIndexes[k] gives edge=[v0,v1], face of edge, index of edge in face
    			// number of edges from a vertex = vertexStar[i].length; vertexStar[i] gives edges from i.th vertex in cyclic order
    			// edge3   = edgeIndexes[ke];
	   			// vertexStar[i][ecount] = edge3;	 // next edge from vertex i; the stored edge at ecount = 0.
    			for (let i=0; i < numVertices; i++)
                {
                	star	= vertexStar[i];
                	for (let ec = 0; ec < star.length; ec++)
                		{	//if (i==0){console.log("length,vertexStar[0] = ",star.length,star,star[ec]);}
                			ec2 = 2*ec;
                			cen 	= edge2num[ star[ec][0] ] [ star[ec][1] ];
                			inve	= edge2num[ star[ec][1] ] [ star[ec][0] ];
                			vFaceIndexes[j][ec2] 	= 2*inve +1;
                			vFaceIndexes[j][ec2+1]  = 2*cen;
                		}
                	j++;
                }
            fChgColor[3] =  numFaces+ numVertices + numEdges/2; 
		}
		
		
function getSFaceIndexes()  			// stored in vFaceIndexes. Almost the same as getEFaceIndexes
           {	vFaceIndexes = [];
                let ke     = -1;     	// edgeNumber
                let nextV  = -1;       	// vVertexNumber underneath a platonic vertex
                const auxV = numFaces + numVertices; // first two groups of faces
                numFaceVert = faceIndexes[0].length;
                let currentEdge   = [];

			for (let j = 0; j < numFaces + numVertices + numEdges; j++) { //
			    vFaceIndexes[j] = [];          }  // initialize as double array

			for (let j = 0; j < numFaces; j++)  // Faces inside old faces
				{
			    for (let ec = 0; ec < numFaceVert; ec++)
						vFaceIndexes[j][ec] = j*numFaceVert + ec; // Faces inside the old Faces
			    }
			fChgColor[1] =  numFaces;

			for (let j = 0; j < numVertices; j++) // Faces underneath vertices
				{
			    for (let ec = 0; ec < edgesFromVertex; ec++)
			    	{
			    		currentEdge = vertexStar[j][ec];  // ke = number of ec.th edge from vertex j
			    		//console.log("vertexStar[j][ec] ",vertexStar[j][ec],currentEdge,currentEdge[2],currentEdge[3]);
						nextV = currentEdge[2] * numFaceVert + currentEdge[3];
						vFaceIndexes[numFaces+j][ec] = nextV;
					}
			    }
			 fChgColor[2] =  numFaces + numVertices;

				ke = 0;
			   	for (let j=0; j < numEdges; j++)
				{
					currentEdge = edgeIndexes[j];
					//currentEdge[2] is the faceNum of this edge
					{
			    	  vFaceIndexes[auxV + ke][0] = currentEdge[2] * numFaceVert + currentEdge[3];
			    	  vFaceIndexes[auxV + ke][2] = currentEdge[2] * numFaceVert + (currentEdge[3]+1)%numFaceVert;
			    	  currentEdge = edgeIndexes[getInverseEdge(j)];
			    	  vFaceIndexes[auxV + ke][1] = currentEdge[2] * numFaceVert + currentEdge[3];
			    	  ke++;
			    	}
			    }
			 fChgColor[3] =  numFaces + numVertices + numEdges;

		}
		
function getDFaceIndexes(vertStar) {
				dFaceIndexes	= [];
				let auxedge 	= [];
				for (let j=0; j< vertStar.length; j++)
					{dFaceIndexes[j] = [];}
				for (let j=0; j< vertStar.length; j++)
				{
					for (let i=0; i < vertStar[j].length; i++)
					{
						auxedge = vertStar[j][i];
						dFaceIndexes[j][i] = auxedge[2];
					}
				}
		return dFaceIndexes;
}

/* ========= index arrays for truncated polyhedra finished, next for duals =========  */

	
function getEdgeTrIndexes(numVerts,faceTrIndexes) {
    // fills the arrays edgeIndexes, edge2num, vert2edge and prepares for vertexStar
    // assumes that the FaceIndexes for the truncated polyhedron have been computed
	// const edgeTrIndexes = [];
// 	const edgeTr2num	= [];
// 	const vertTr2edge	= [];
	
	const vl = numVerts;
	let fl;
	// initialize:
	for (let i = 0; i < vl; i++)  {
	    edgeTr2num[i]   = [] ;
	    vertTr2edge[i]  = -1;
	    }
  	for (let i = 0; i < vl; i++)  {
	    for(let j = 0; j < vl; j++)  {
	     edgeTr2num[i][j]   = -1; }}
	     
	// edgeIndexes[k] ist the k.th edge = [vertexStart, vertexEnd, itsFace, indexInFace]
	// edge2num gives for each edge its number and for non-edge pairs gives -1
	// vert2edge[j]  gives for the j.th vertex the number of an edge starting at it
	let k = 0;
	for (let j = 0; j < faceTrIndexes.length; j++)
	{
		const f = faceTrIndexes[j];
		//console.log("faceTrIndexes[j] = ", f);
		fl = f.length;
		// f is the set of indices of vertices of the j.th face in cyclic order
	    for (let i = 0; i < fl; i++) {
	        // contains: 1st edgeVertex, 2nd edgeVertex, itsFace, indexInFace
	    	edgeTrIndexes[k] = [f[i],f[(i+1)%fl],j,i];
	    	//console.log("vl,f[i] = ", vl,f[i]);
	    	edgeTr2num [f[i]] [f[(i+1)%fl]] = k;  // 2-index array syntax: array[i] [j]
	    	vertTr2edge[f[i]] = k;				// at vertex f[i] starts edge Nr k
	    	// for each vertex this assignment occurs several times, but not in cyclic order
	    	k++;
	    	}
	}
	return [edgeTrIndexes,edgeTr2num,vertTr2edge];
}

function prepareTrVertexStar()	{
    // intended for duals of truncated polyhedra
	const numVverts = numEdges;
	const numEverts = numFaces * numFaceVert;
	const numSverts = numFaces * numFaceVert;
	const numKverts = 2*numEdges;;
	//console.log("numVverts,numEverts,numSverts = ",numVverts,numEverts,numSverts);
		edgeTrIndexes	= [];
		edgeTr2num		= [];
		vertTr2edge		= [];
    if (truncationMode == vtrunc) { 
    	[edgeTrIndexes,edgeTr2num,vertTr2edge] = getEdgeTrIndexes(numVverts,vFaceIndexes); }
    if (truncationMode == etrunc) { 
    	[edgeTrIndexes,edgeTr2num,vertTr2edge] = getEdgeTrIndexes(numEverts,vFaceIndexes); }
    if (truncationMode == strunc) { 
    	[edgeTrIndexes,edgeTr2num,vertTr2edge] = getEdgeTrIndexes(numSverts,vFaceIndexes); }
    if (truncationMode == ktrunc) { 
    	[edgeTrIndexes,edgeTr2num,vertTr2edge] = getEdgeTrIndexes(numKverts,vFaceIndexes); }
}

// ====== getInverseEdge( number of edge[j1,j2]) = number of inverseEdge[j2,j1]  =======
function getInverseTrEdge(k)  {
          const inEdge = edgeTrIndexes[k];     // an array of four numbers
   return edgeTr2num[inEdge[1]] [inEdge[0]];   // number of inverse edge; entries not filled here are -1
}


// getVertexTrStars fills the array vertexTrStar; it must be called after getEdgeTrIndexes
function getTrVertexStars()		{ 
		 TrVertexStars 	= [];
		 const vtl		= vVertices.length;
		 const etl		= edgeTrIndexes.length;
      	// vertexStar is a global variable, initialized as double array:
      	for (let i=0; i < vVertices.length; i++) {TrVertexStars[i] = []; }

			let fl;       // = number of vertices of current face
			let ke;
			let ecount;
			let edgeNum;
			let edge3; 
	
			edgesFromVertex = etl/vtl; // For Archimedean solids all vertices are equivalent
    		for (let i = 0; i < vtl; i++)  {
	   		ke      = vertTr2edge[i];               // number of the last stored edge leaving i.th vertex
	   		ecount  = 0;
	   		while (ecount < edgesFromVertex) {
	   			edge3   = edgeTrIndexes[ke];
	   			TrVertexStars[i][ecount] = edge3; // next edge from vertex i; the stored edge at i = 0.
	   			fl = vFaceIndexes[edge3[2]].length
	   			edgeNum = ke - 1;                // the edges are numbered face by face in cyclic order
	   			if (edge3[3] == 0) {edgeNum = ke - 1 + fl}
	   		// edgeNum is the number of the edge, which, in the face of edge ke, ends at vertex i
	   		ke = getInverseTrEdge(edgeNum); // the inverse of edge edgeNum is the next edge from vertex i
	   		ecount++;
	   }}
	   //console.log("TrVertexStars = ", TrVertexStars);
	 return TrVertexStars;  
}


// ================== The parameter dependent vertices are computed here ===========

// =============== getFace(j) computes the 3D-faces. Recompute after rotations or parameter changes!! =========
  // getFace(j) returns the array of vertices (their numbers in cyclic order) of the j.th face
  // faceIndexes.length = numberOfFaces, faceIndexes[j].length = number of vertices of j.th face
  // faceIndexes[j] is the array of the numbers of the vertices of the j.th face in cyclic order
  // getFace(j,faceIndexes,vertices) sends faceIndexes[j] to the corresponding array of 3D-vertices
  //old: const getFace = ((j) => faceIndexes[j] . map ((x) => vertices[x]) );
  
//const getFace = ((j,fInd,vert) => fInd[j] . map ((x) => vert[x]) );  // will be called for platonics and their truncations
function getFace(j,fInd,vert) { return fInd[j] . map ((x) => vert[x]);}  // will be called for platonics and their truncations
/*
function checkTruncDetailsV()	{         // ======== helps debugging the following routine ==========
				console.log("The vertices ",vertices); console.log("The vVertices ", vVertices);
			    for (let i = 0; i < numEdges; i++) {
			    console.log(i,".th vVertex ",vVertices[i]);}
}
 */

function getVTrunc()	{
			if ( !vDone )  // Do not recompute for rotations in render()
			{
			    vVertices = [];
        	    for (let j = 0; j < numEdges; j++) {
                	vVertices[j] = [];
                }  // initialize as 2D-array
                let vec0 = [];
                let vec1 = [];

           for (let k = 0; k < numEdges; k++) {
            	vec0 = vertices[edgeIndexes[k][0]];
            	vec1 = vertices[edgeIndexes[k][1]];
            	//console.log("k= ",k," EdgeIndexes = ",edgeIndexes[k][0],edgeIndexes[k][1],"  vec0, vec1 ", vec0,vec1);
            	//This check is ok
            	vVertices[k] = linComb1(1 - vParam, vParam, vec0, vec1);
            	// on each oriented edge we have one vertex of the vertex truncation
            	// and vVertex[k] lies on the k.th edge
			}
	// checkTruncDetailsV();		//looks good
 			vDone = true;
 		}
		}
// =============================== vertex truncations finished ==================================

function getETrunc()	{
			if ( !vDone )
			{
				vVertices = [];
				const numEVertices = numFaces * faceIndexes[0].length;
				for (let k = 0; k < numEVertices; k++) {
                vVertices[k] =  [];                }  // initialize as 2D-array
                let jMidpoint = [];
                let curVertex = [];
                let vc        = 0;            // counting index

                for (let j=0; j < numFaces; j++)
                {
                	jMidpoint = getCentroid(getFace(j,faceIndexes,vertices));
                	for (let cf = 0; cf < faceIndexes[0].length; cf++)
                    {
                    	curVertex = vertices[faceIndexes[j][cf]]; // vertexNr cf in faceNr j
                    	vVertices[vc] = linComb1((1-2*vParam), 2*vParam, curVertex, jMidpoint);
                    	vc++;
                    }
                }
                vDone = true;
            }
		}
// =============================== edge truncations finished ==================================

// edgeIndexes[k] ist the k.th edge = [vertexStart, vertexEnd, itsFace, indexInFace]
function getKTrunc()	{
                const polyCor = (() =>
                  ({
                    tetrahedron   :1,
                    cube          :0.7388,
                    octahedron    :0.82844,
                    dodecahedron  :0.5528,
                    icosahedron   :0.7639
                  }[polyhedronMenu.value])
                );

			if ( !vDone )
			{
				const numKVertices = 2*numEdges;
				vVertices = [];
				for (let k = 0; k < numKVertices; k++) {
                vVertices[k] =  [];   }  // initialize as 2D-array
                
                const tanQuot = tan(0.5*pi/numFaceVert)/tan(pi/numFaceVert);
                const prm	  = max(1/128, vParam*polyCor());
                let FMidpoint = [];
                let KMidpoint = [];
                let curVertex = [];
                let vc        = 0;            // counting index

                for (let e=0; e < numEdges; e++)
                {
                	KMidpoint = linComb1(0.5, 0.5, vertices[edgeIndexes[e][0]], vertices[edgeIndexes[e][1]]);
                	FMidpoint = getCentroid(getFace(edgeIndexes[e][2],faceIndexes,vertices));
                	curVertex = linComb1(1-tanQuot, tanQuot, KMidpoint, vertices[edgeIndexes[e][0]] );
                    	vVertices[vc] = linComb1((1-prm), prm, curVertex, FMidpoint);
                    	vc++;
                    curVertex = linComb1(1-tanQuot, tanQuot, KMidpoint, vertices[edgeIndexes[e][1]] );
                    	vVertices[vc] = linComb1((1-prm), prm, curVertex, FMidpoint);
                    	vc++;
                }
               // vDone = true;
            }
           // console.log("KtruncVertices = ", vVertices);
		}
// =============================== shrink truncations finished ==================================

function getSTrunc()	{  // the e-vertices have to be rotated in the original face			
			if ( !vDone )
			{
				vVertices = [];
				const numEVertices = numFaces * faceIndexes[0].length;
				for (let k = 0; k < numEVertices; k++) {
                vVertices[k] =  [];        }  // initialize as 2D-array
                let jMidpoint = [];
                let firstVert = [];
                let faceB	  = [];
                let curVertex = [];
                let triang1   = [];
                let auxV      = [];
                let vc        = 0; 	           // counting index
                    // Needed for the isocele triangles on the snub polyhedra
                	let ang       = 0;
                	let angn      = 0;
                	let angp      = vParam/4
                	let difTn     = 0;
                	let difTest   = 0;
                	let difTest1  = 0;
                	let difTest2  = 0;
                	let difTp     = 0;
                	let dt1       = 0;
                	let dt2       = 0;

                triang1    = vFaceIndexes[numFaces + numVertices];
                // T: [ 0, 1, 3 ], C: [ 0, 1, 4 ], O: [ 0, 1, 11 ], D: [ 0, 1, 44 ], I: [ 0, 1, 3 ]
                // console.log("first triangle: ", triang1);
// ========= The following corrects the vParam-range so that Archimedean solids appear =====
                const polyCor = (() =>
                  ({
                    tetrahedron   :1.46,
                    cube          :1.1248,
                    octahedron    :1.327,
                    dodecahedron  :0.8872,
                    icosahedron   :1.2722
                  }[polyhedronMenu.value])
                );

            	vParam = Math.max(vParam, 1.0/1024);
            	let ev = 0; ang = 0; angp = 0;  angn = 0;
         	while  (ev < 5)  {  // Repeat computation with different angle
                jMidpoint = [];
                firstVert = [];
                curVertex = [];
                auxV      = [];
                vc        = 0;
                vVertices = [];
				for (let k = 0; k < numEVertices; k++) {
                vVertices[k] =  [];   }

                for (let j=0; j < numFaces; j++)
                {
                	jMidpoint = getCentroid(getFace(j,faceIndexes,vertices));
                	firstVert = vertices[faceIndexes[j][0]];
                	faceB 	  = faceBasis(jMidpoint, firstVert);
                	// console.log(["midpoint,firstVertex: ",jMidpoint,firstVert]); console.log("faceBasis= ", faceB);
                	for (let cf = 0; cf < faceIndexes[0].length; cf++)
                    {
                    	curVertex = vertices[faceIndexes[j][cf]]; // vertexNr cf in faceNr j
                    	auxV =  linComb1((1 - vParam * polyCor()), vParam * polyCor(), curVertex, jMidpoint);
                    	vVertices[vc] = rotateInFace(ang, auxV, jMidpoint, firstVert);
                    	vc++;  			 // const rotateInFace =((ang,qpt,midp,fvert)
                    }
                }// console.log("getSTrunc, vVertices: ",vVertices);

// ==================== Snub truncation finished, but dependent also on the rotation parameter ang ===================
// ==================== adjust rotation angle ang with the help of the first triangle, dependent on vParam ===========

                dt1 = distance1(vVertices[triang1[0]],vVertices[triang1[1]]);
                dt2 = distance1(vVertices[triang1[0]],vVertices[triang1[2]]);
                difTest =  dt1 - dt2;
                difTest1 = distance1(vVertices[triang1[1]],vVertices[triang1[0]]) - distance1(vVertices[triang1[1]],vVertices[triang1[2]]);
                difTest2 = distance1(vVertices[triang1[2]],vVertices[triang1[1]]) - distance1(vVertices[triang1[0]],vVertices[triang1[2]]);
        //console.log("ev=",ev,"distDiff= ",difTest, " 2,3  ",difTest1, difTest2 );
                if (ev == 0)
                   {difTn = difTest;  // result of computation at ang = 0, is positive.
                    ang   = vParam/4;
                    }
                if (ev == 1)
                	{
                		if (difTest > 0) { angn = ang; ang = 2*ang; difTn = difTest; }
                		else {
                				angp  = ang;
                				ang   = (Math.abs(dt2)*angn + Math.abs(dt1)*angp)/(Math.abs(dt2)+Math.abs(dt1));
                				difTp = difTest;
                			}
                	}
                if (ev == 2)   // good initial values for ang are different in different ranges of vParam
                	{
                		if ((difTest > 0)&&(Math.abs(angn) > 0)) { angn = ang; ang = 2*ang; difTn = difTest; }
                		else
                		{	if (difTest < 0)
                				{
                				angp  = ang;
                				difTp = difTest;
                				ang   = (Math.abs(difTp)*angn + Math.abs(difTn)*angp)/(Math.abs(difTn)+Math.abs(difTp));
                				}
                			else{
                				angn  = ang;
                				difTn = difTest;
                				ang   = (Math.abs(difTp)*angn + Math.abs(difTn)*angp)/(Math.abs(difTn)+Math.abs(difTp));
                				}
                		}
                	}
                if (ev > 2)    // from now on we can improve ang by iteration, since difTest(angn) * difTest(angp) < 0
                		{	if (difTest < 0)
                				{
                				angp  = ang;
                				difTp = difTest;
                				ang   = (Math.abs(difTp)*angn + Math.abs(difTn)*angp)/(Math.abs(difTn)+Math.abs(difTp));
                				}
                			else{
                				angn  = ang;
                				difTn = difTest;
                				ang   = (Math.abs(difTp)*angn + Math.abs(difTn)*angp)/(Math.abs(difTn)+Math.abs(difTp));
                				}
                		}
                ev++;
            	}
                vDone = true;  // this avoids recomputation under rotation
            }
		}

// === For the dual polyhedra we do not need the centroid but the center of the spherical circumcircle
// === through three vectors v1, v2, v3 of the same length (vertices of snub-polyhedra).
// === This center is the normal of the plane
function centerOfCircumCircle([v1, v2, v3]) {
				const rr 	= dotProd1(v1,v1);
				let res		= [];
				const d12	= vecDif1(v2,v1);
				const d23	= vecDif1(v3,v2);
				const xxx	= crossProd1(d12, d23);
				let nn		= dotProd1(xxx, xxx);
				if (nn < 1/128) 
					{ res = getCentroid([v1,v2,v3]); }
				else
					{ res	= xxx; }
				nn			= dotProd1(v1,res);
// 				const rr 	= dotProd1(v1, v1);
// 				const a12	= dotProd1(v1, v2)/rr;
// 				const a23	= dotProd1(v2, v3)/rr;
// 				const a31	= dotProd1(v3, v1)/rr;
// 				const x3	= 1+(a12-a31)/(1-a23);
// 				const x1	= 1+(a23-a31)/(1-a12);
// 				const x2    = x1 + x3*(a31-a23)/(1-a12);
// 				const res	= linTripleComb1(x1,x2,x3, v1,v2,v3);
// 				const nn	= dotProd1(v1,res);
				//console.log("nn = ",nn,dotProd1(v2,res),dotProd1(v3,res) );
			return scalTimesVec1(rr/nn, res);
}
		
// function getFace(j,fInd,vert) { fInd[j] . map ((x) => vert[x]); }	array of vertices	
function getdVertices(verts, faceInds)  {
					const rad2 	= 1.0*dotProd1(verts[0],verts[0]);
					let sc		= 0;
					let dverts	= [];
					let cp		= [];
					for (let j=0; j < faceInds.length; j++)
					{	
            			
						if (truncationFlag&&(truncationMode == strunc))
						{   if (j > fChgColor[2]-1) {
								dverts[j] = centerOfCircumCircle(getFace(j,faceInds,verts)); }
							else {
								cp = getCentroid(getFace(j,faceInds,verts));
								dverts[j] = scalTimesVec1( rad2/dotProd1(cp,cp), cp );
							} 
						}
						else
						{
							cp = getCentroid(getFace(j,faceInds,verts));
							dverts[j] = scalTimesVec1( rad2/dotProd1(cp,cp), cp );
						}
					}
			return dverts;
}




/* ======================================================================================================= */
// ============== In the next routines the look of each face is decided ===========
// viewLength is changed in an input field and is used for all polyhedra

function zProjS(pt)  {
                let result = [pt[0]-eye/4, pt[1]];  // if (!wantsStereo) {eye = 0;}
                if (projType == persp) {
        			let ratio = viewLength/(viewLength - pt[2]);
   					result    = [ratio*(pt[0]-eye)+eye, ratio*pt[1]];
   				}
   	return result; }

function zProj(pts) { let results = [];
                if ( !Array.isArray(pts[0]) ) { results = [zProjS(pts)]; }
				else {
				for (let j=0; j < pts.length; j++)
				    {results[j] = zProjS(pts[j]); }
				}
	return results; }

function projectedFaceFct(j,faceInd,vert) {
					let pf 	 = [];
                    const ff = getFace(j,faceInd,vert);
                       // console.log("projectedFace ",j,faceInd[j],vert[j]);
                    for (let i=0; i < ff.length; i++) {
                         pf[i] = zProjS(ff[i]);
                     }
                return pf;
        }

// ====================== First the Platonics =========================
// createSvgFace(j) creates a svg polygon element and return it. j is an int
function createSvgFace(j,zCoord)	{       // both of the following calls work
        //const projectedFace = getFace(j,faceIndexes,vertices). map( zProj );
        const projectedFace = projectedFaceFct(j,faceIndexes,vertices);
        const poly = document.createElementNS("http://www.w3.org/2000/svg","polygon");
        poly.setAttribute("points", projectedFace .toString());

  if ((renderstyle == patch) || (wantsDual && (renderstyle == wire) ))
  {
    if (zCoord >= 0)
     {if (mybackground == "black")
           poly.setAttribute("style", `fill:rgb(95%,95%,5%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);
      else
           poly.setAttribute("style", `fill:rgb(80%,80%,100%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);
     }
  }
  // ========================= now wireFrame =========================
  if ((renderstyle == wire) && !wantsDual) {
     if (zCoord >= 0)
       {
        if (drawLine == overl)
          {
        	if (mybackground == "black"){
        		poly.setAttribute("style", `fill:none;stroke:lawngreen;stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/192).toString()}`);}
        	else {
        		poly.setAttribute("style", `fill:none;stroke:red;stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/256).toString()}`);}
          }
        if (drawLine == underl)
          {
          poly.setAttribute("style", `fill:none;stroke:rgb(0,0,0);stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/96).toString()}`);
          }
     }
     if (zCoord < 0)
       if (drawLine == overl)
        {
         poly.setAttribute("style", `fill:none;stroke:red;stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/256).toString()}`);
        }
  }
    return poly;
}

// ====================== Second the Archimedean Polyhedra =========================

// createSvgFace(j) creates a svg polygon element and return it. j is a int
function createSvgTVFace(j,zCoord) 	{       // both of the following calls work
        const vProjectedFace = getFace(j,vFaceIndexes,vVertices). map( zProj );
        //const vProjectedFace = projectedFaceFct(j,vFaceIndexes,vVertices);
        const vpoly = document.createElementNS("http://www.w3.org/2000/svg","polygon");
        vpoly.setAttribute("points", vProjectedFace .toString());
     	// console.log("vFaceIndexes[",j,"]= ",vFaceIndexes[j],vFaceIndexes[j][2], vVertices[vFaceIndexes[j][2]]);

  if ((renderstyle == patch) || (wantsDual && (renderstyle == wire) )) {
    if (zCoord >= 0)
     {if (mybackground == "black"){
        	if (j < fChgColor[1]) {
              vpoly.setAttribute("style", `fill:rgb(20%,80%,20%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);}
            else { if (j < fChgColor[2]) {
              vpoly.setAttribute("style", `fill:rgb(80%,80%,0%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);}
            else
              vpoly.setAttribute("style", `fill:rgb(20%,70%,50%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);
                 }
           }
      else {
        	if (j < fChgColor[1]) {
              vpoly.setAttribute("style", `fill:rgb(15%,35%,90%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);}
            else { if (j < fChgColor[2]) {
              vpoly.setAttribute("style", `fill:rgb(80%,80%,100%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);}
            else
              vpoly.setAttribute("style", `fill:rgb(70%,45%,100%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);
                 }
           }
     }
/*    else // lower part, for debugging only
			vpoly.setAttribute("style", `fill:none;stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`); */
   }
	// ========================== now wireFrame ==============
  if ((renderstyle == wire) && !wantsDual) {
     if (zCoord >= 0)
       {
        if (drawLine == overl)
          {
        	if (mybackground == "black"){
        		vpoly.setAttribute("style", `fill:none;stroke:lawngreen;stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/192).toString()}`);}
        	else {
        		vpoly.setAttribute("style", `fill:none;stroke:red;stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/256).toString()}`);}
          }
        if (drawLine == underl)
          {
          	vpoly.setAttribute("style", `fill:none;stroke:rgb(0,0,0);stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/96).toString()}`);
          }
        }
     if (zCoord < 0)
       if (drawLine == overl)
        {
         	vpoly.setAttribute("style", `fill:none;stroke:red;stroke-linecap:round;stroke-linejoin:round;stroke-width:${(viewBoxWidth/256).toString()}`);
        }
  }
    return vpoly;
}

function createSvgDFace(j,zCoord)	{       // both of the following calls work
        //const projectedFace = getFace(j,faceIndexes,vertices). map( zProj );
        const projectedFace = projectedFaceFct(j,dFaceIndexes,dVertices);
        //console.log("projectedFace = ",projectedFace );
        const dpoly = document.createElementNS("http://www.w3.org/2000/svg","polygon");
        dpoly.setAttribute("points", projectedFace .toString());

 if (renderstyle == patch) 	
  {
    if (zCoord >= 0)
     {if (mybackground == "black")
           {dpoly.setAttribute("style", `fill:rgb(20%,80%,20%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);}
      else
           {dpoly.setAttribute("style", `fill:rgb(70%,45%,100%);stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);}
     }
  }
  if (renderstyle == wire) {
     if (zCoord >= 0)		{
           dpoly.setAttribute("style", `fill:none;stroke:red;stroke-width:${(viewBoxWidth/128).toString()}`);	}
      else					{
           dpoly.setAttribute("style", `fill:none;stroke:red;stroke-width:${(viewBoxWidth/256).toString()}`);   }
	}
     return dpoly;
}


// =========== The render routine decides what is added to the screen ============

// The viewVector to FaceMidpoints decides about visibility
/*
function viewVector([x,y,z])	{ let vpt = [-x, -y, viewLength -z];
                if (projType == ortho) {vpt = [0,0,10]}
     return vpt;
}  // This and the next version both work
*/

function viewVector(point) { let vpt = [eye/2,0,100];  // not really used
				if  (projType == persp) {
					vpt = [- point[0] + eye, - point[1], - point[2] + viewLength];
				}  // eventListener returns viewLength as string, needs conversion
     return vpt;
}

function visible(j)		{
   const midpt 	= getCentroid(getFace(j,faceIndexes,vertices));
   let result 	= midpt[2];
   if (projType == persp) {
   		result 	= dotProd1(midpt, viewVector(midpt));
   }
   return result;
}

function TVvisible(j)	{
	let result;
   	const vMidpt  = getCentroid(getFace(j,vFaceIndexes,vVertices));
   	if ((truncationMode == vtrunc)||(truncationMode == etrunc))
   	{            // vMidpt is normal of the face
   		result = dotProd1(vMidpt, viewVector(vMidpt));
   	} else
   	{
   	const Fj  = getFace(j,vFaceIndexes,vVertices);

    const vNormal = normalOf3Pts(Fj[0],Fj[1],Fj[2]); // all faces are correctly oriented
   	
   	result = dotProd1(vNormal, viewVector(vMidpt));
   	}
   return result;
}

function Dvisible(j)	{
	let result;
	const Fj  = getFace(j,dFaceIndexes,dVertices);
   	const vMidpt  = getCentroid(Fj);
    const vNormal = normalOf3Pts(Fj[0],Fj[1],Fj[2]); // all faces are correctly oriented   	
   	result = dotProd1(vNormal, viewVector(vMidpt));
   return result;
}


	let eyeLeft  = -buttonEye;
	let eyeRight = +buttonEye;
// ============================== Now put on Screen ============================
/* ============================== From Ben ===================================== */

	let jjc = 0;
	const TimePerStep = 100; // for osculating circles
	let oscTimer = 0;
	let pendingRotationX = 0;
	let pendingRotationY = 0;
	const rotSpeed = 0.03;    // degrees per millisecond
	let lastUpdate = Date.now();
	const keys = { up: false, down: false, left: false, right: false };
	
	window.requestAnimationFrame(timeUpdate); // timeUpdate is the following function

	function timeUpdate() {
		let time = Date.now();
		let deltaT = time - lastUpdate;
		let redraw = false;
		//check for rotation
		if (keys.up) { pendingRotationX += (time - lastUpdate) * rotSpeed }
		if (keys.down) { pendingRotationX -= (time - lastUpdate) * rotSpeed }
		if (pendingRotationX) {
			rotX(pendingRotationX);
			pendingRotationX = 0;
			redraw = true;
		}
		if (keys.right) { pendingRotationY -= (time - lastUpdate) * rotSpeed }
		if (keys.left) { pendingRotationY += (time - lastUpdate) * rotSpeed }
		if (checkboxRotate.checked) {
			pendingRotationY += (time - lastUpdate) * rotSpeed;
		}
		if (pendingRotationY) {
			rotY(pendingRotationY);
			pendingRotationY = 0;
			redraw = true;
		}
		//check for new circles
//		if (checkboxOsc.checked) {
//			oscTimer += deltaT;
//			while (oscTimer > TimePerStep) {
//				redraw = true;
//				jjc++;
//				oscTimer -= TimePerStep;
//			}
//		}
		//redraw
		if (redraw) {
			render(deltaT);  // renders only if deltaT > 0
		}
		lastUpdate = time;
		window.requestAnimationFrame(timeUpdate);
	}

/* ============================== Ben End ====================================== */

// In render() the created svgEl are put to the screen; order matters
function render(deltaT)	{
	let Fc = [];
    if (truncationMode == vtrunc) { getVTrunc(); }
    if (truncationMode == etrunc) { getETrunc(); }
    if (truncationMode == strunc) { getSTrunc(); }
    if (truncationMode == ktrunc) { getKTrunc();}
    if (wantsDual) 
    	{ if (!truncationFlag) 	{
    			dVertices = getdVertices(vertices, faceIndexes);}
    	  else					{
    	  		dVertices = getdVertices(vVertices, vFaceIndexes);}
    	}

    svgEl . innerHTML = "";
    let zCoord;

if (wantsStereo)
	{
	    if (renderstyle == patch)
    {
	   if ( !truncationFlag )          {
	   for (let j = 0; j < faceIndexes.length; j++) {
       		zCoord = visible(j);
       		if (zCoord >= 0) {svgEl.appendChild(createSvgFace(j,zCoord));}
       }}
	if ( truncationFlag)                             {
	   		for (let j = 0; j < vFaceIndexes.length; j++) {
       			zCoord = TVvisible(j);
       			if (zCoord >= 0)
       			{svgEl.appendChild(createSvgTVFace(j,zCoord));}
       		}}
	}// end patch

	 if (renderstyle == wire)
	 {
	   for(let st=0; st < 2; st++) 
	 { 
	   if (mybackground == "black") { 
	   		if (st == 0) {eye = eyeRight}  else {eye = eyeLeft}
	   		if ( !truncationFlag ) {
	   		drawLine = overl;
	   		for (let j = 0; j < faceIndexes.length; j++) {
              zCoord = visible(j);
              	Fc = createSvgFace(j,zCoord); //if (zCoord < 0)
              	if (st == 0)
              		 {Fc.setAttribute("style", `fill:none;stroke:rgb(0,255,0);stroke-width: 0.125`);}
              	else {Fc.setAttribute("style", `fill:none;stroke:rgba(255,0,0,0.5);stroke-width: 0.125`);} 
	            svgEl.appendChild(Fc);
	   		 }}
	    	if ( truncationFlag )                     {
	    	for (let j = 0; j < vFaceIndexes.length; j++) {
	            zCoord = TVvisible(j);
	            Fc = createSvgTVFace(j,zCoord);	//if (zCoord < 0)
              	if (st == 0)
              		 {Fc.setAttribute("style", `fill:none;stroke:rgb(0,255,0);stroke-width: 0.125`);}
              	else {Fc.setAttribute("style", `fill:none;stroke:rgba(255,0,0,0.5);stroke-width: 0.125`);}		
	            svgEl.appendChild(Fc);
	    }}
	    }
	    else  //(mybackground == "white")
	    { 
	    if (st == 0) {eye = eyeLeft}  else {eye = eyeRight}
	    if ( truncationMode == regular ) {
	   drawLine = overl;
	    for (let j = 0; j < faceIndexes.length; j++) {
	          {
	            zCoord = visible(j);
	            Fc = createSvgFace(j,zCoord);  //if (zCoord >= 0)vgTVFace(j,zCoord);	//if (zCoord < 0)
              	if (st == 0)
              		 {Fc.setAttribute("style", `fill:none;stroke:cyan;stroke-width: 0.175`);}
              	else {Fc.setAttribute("style", `fill:none;stroke:rgb(255,0,0);stroke-width: 0.175`);}
	              svgEl.appendChild(Fc);
	          }
	    }}

	    if ( truncationFlag  )                    {
	    drawLine = overl;
	    for (let j = 0; j < vFaceIndexes.length; j++) {
	          {
	           	zCoord = TVvisible(j);
	            Fc = createSvgTVFace(j,zCoord);		//if (zCoord >= 0)
              	if (st == 0)
              		 {Fc.setAttribute("style", `fill:none;stroke:cyan;stroke-width: 0.175`);}
              	else {Fc.setAttribute("style", `fill:none;stroke:rgb(255,0,0);stroke-width: 0.175`);}
	            svgEl.appendChild(Fc);
	          }
	    	}
	    }
		} //(mybackground == "white")
		} // st = 0,1 stereo
	 } // end wire
	} // wantsStereo == true
	
else  /* ============ End of Stereo, Begin of Monocular =========== */
	
	{
    if ((renderstyle == patch)|| wantsDual)
    {
    	if ((wantsDual) && (renderstyle == patch))		{
    	for (let j = 0; j < dFaceIndexes.length; j++) {
       		zCoord = Dvisible(j);
       		if (zCoord >= 0) {svgEl.appendChild(createSvgDFace(j,zCoord));
       		//console.log("Dvisible(j) = ",Dvisible(j),"Index ",dFaceIndexes.length);
       		}	
    	}}
    	else {
    		if ((wantsDual) && (renderstyle == wire))		{
    			for (let j = 0; j < dFaceIndexes.length; j++) {
       				zCoord = Dvisible(j);
       				if (zCoord < 0) {svgEl.appendChild(createSvgDFace(j,zCoord));
       				//console.log("Dvisible(j) = ",Dvisible(j));
       				}	
    		}}
    	
	   		if ( !truncationFlag )          {
	   			for (let j = 0; j < faceIndexes.length; j++) {
       				zCoord = visible(j);
       				if (zCoord >= 0) {svgEl.appendChild(createSvgFace(j,zCoord));}
       		}}
			if ( truncationFlag)                             {
	   			for (let j = 0; j < vFaceIndexes.length; j++) {
       				zCoord = TVvisible(j);
       				if (zCoord >= 0) {svgEl.appendChild(createSvgTVFace(j,zCoord));}
       		}}
       		
    		if ((wantsDual) && (renderstyle == wire))		{
    			for (let j = 0; j < dFaceIndexes.length; j++) {
       				zCoord = Dvisible(j);
       			if (zCoord >= 0) {svgEl.appendChild(createSvgDFace(j,zCoord));}	
    		}}
        }	
	}// end patch

	 if ((renderstyle == wire)&& !wantsDual)
	 {
	   if ( !truncationFlag ) {
	   drawLine = overl;
	   for (let j = 0; j < faceIndexes.length; j++) {
              zCoord = visible(j);
              if (zCoord < 0)
	            svgEl.appendChild(createSvgFace(j,zCoord));
	    }}
	    if ( truncationFlag )                     {
	    for (let j = 0; j < vFaceIndexes.length; j++) {
	          {
	            zCoord = TVvisible(j);
	            if (zCoord < 0)
	               svgEl.appendChild(createSvgTVFace(j,zCoord));
	          }
	    }}

	    if ( truncationMode == regular ) {
	    drawLine = underl;  // Top parts here
	    for (let j = 0; j < faceIndexes.length; j++) {
	          {
	            zCoord = visible(j);
	            if (zCoord >= 0)
	               svgEl.appendChild(createSvgFace(j,zCoord));
	          }
	    }
	   drawLine = overl;
	    for (let j = 0; j < faceIndexes.length; j++) {
	          {
	            zCoord = visible(j);
	            if (zCoord >= 0)
	               svgEl.appendChild(createSvgFace(j,zCoord));
	          }
	    }}

	    if ( truncationFlag  )                    {
	    drawLine = underl;
	    for (let j = 0; j < vFaceIndexes.length; j++) {
	          {
	            zCoord = TVvisible(j);
	            if (zCoord >= 0)
	               svgEl.appendChild(createSvgTVFace(j,zCoord));
	          }
	    	}
	    drawLine = overl;
	    for (let j = 0; j < vFaceIndexes.length; j++) {
	          {
	            zCoord = TVvisible(j);
	            if (zCoord >= 0)
	               svgEl.appendChild(createSvgTVFace(j,zCoord));
	          }
	    	}
	    }
	 } // end wire
} // wantsStereo == false
} // end render()

// ============= more debugging help, turned off in init() ========================
function checkComputedData()	{
	console.log(edgeIndexes);
	jl = 3;
	console.log(faceIndexes[0].length);
	console.log(numEdges);
	console.log(edgeIndexes[jl]);
	console.log(vert2edge);
	console.log([jl,edgeIndexes[vert2edge[jl]][0]]);
	console.log(edge2num[edgeIndexes[jl][0]][edgeIndexes[jl][1]]);
	let ki = edge2num[edgeIndexes[jl][1]][edgeIndexes[jl][0]];
	console.log(ki);
	console.log(edgeIndexes[ki][0],edgeIndexes[ki][1]);

	// check for each vertex its edges:
 	for (let i=0; i < vertices.length; i++) {
    	for (let j=0; j < edgesFromVertex; j++) {
			console.log(vertexStar[i][j]);
	}}

	let midpoint = getCentroid(getFace(0,faceIndexes,vertices));
	console.log(midpoint);
}

function checkTruncComputation()	{
    if (truncationFlag) {
	      console.log(vVertices.length)
		 	for (let i=0; i < vertices.length; i++) {
		 	   for (let j=0; j < edgesFromVertex; j++) {
				console.log(vFaceIndexes[i][j]);
		}}
	}
}

// ===================== response functions for input and init() ====================
function updateDVerticesFaces()			{
		if (wantsDual)
		{
				if (!truncationFlag) {
					dVertices = getdVertices(vertices, faceIndexes);
					//console.log("dVertices = ",dVertices);
				} else 
				{ 
					if (truncationMode == vtrunc) 		{ getVTrunc(); }
					if (truncationMode == etrunc) 		{ getETrunc(); }
					if (truncationMode == strunc) 		{ getSTrunc(); }
					if (truncationMode == ktrunc) 		{ getKTrunc(); }
					dVertices = getdVertices(vVertices, vFaceIndexes);
					//console.log("dVertices = ",dVertices);	
					prepareTrVertexStar();
					TrVertexStars = getTrVertexStars();
					dFaceIndexes  = getDFaceIndexes(TrVertexStars);
				}
				if (!truncationFlag) {
					//console.log("vertexStar = ",vertexStar);
					dFaceIndexes = getDFaceIndexes(vertexStar);
					//console.log("dFaceIndexes = ",dFaceIndexes); // looks correct
					}
		}
	}

function gettruncationMode(truncateName)	{
	let message = '';
	wantsDual = false;
	checkboxDual.checked = wantsDual;
	//svgEl.setAttribute("viewBox"," -20 -20 40 40");
	initVertices(polyhedronMenu.value);
	//rotY(20); rotX(10);
	 
	switch (truncateName) {
        case "regular":{
          truncationMode = regular;
          truncationName = "no truncation";
        }break;
        case "vtrunc":{
          	truncationMode = vtrunc;
           	getVFaceIndexes();  truncParam = "32";
           	truncationName = "vertex truncation";
        }break;
        case "etrunc":{
          	truncationMode = etrunc;
          	getEFaceIndexes();
			truncParam = specialETruncParam();
			truncationName = "edge truncation";
        }break;
        case "strunc":{
          	truncationMode = strunc;
          	getSFaceIndexes();  truncParam = "48";
          	truncationName = "snub truncation";
        }break;
        case "ktrunc":{
          	truncationMode = ktrunc;
          	getKFaceIndexes();  truncParam = "48";
          	truncationName = "shrink truncation";
        }break;
    }
	truncationFlag = (truncationMode == vtrunc)||(truncationMode == etrunc)||(truncationMode == strunc)||(truncationMode == ktrunc);
    inputTruncParam.value = truncParam;
    vParam = truncParam/96;  // Automatic conversion
	vDone = false;
	currentObject.innerHTML=objectDescription();	
	verticesPosition.innerHTML=positionOfVertices();
	updateDVerticesFaces();
}

inputViewDist.value = viewLength;
function ViewDist() {
		viewLength = 1.0*inputViewDist.value; // 1* converts string to number
		viewPoint  = [eye,0,viewLength];
		vDone = false;  // recomputation needed
		render();
}

inputTruncParam.value = truncParam;
function TruncParam() {
		truncParam = inputTruncParam.value;
		vParam     = truncParam/96;  // Automatic conversion
		vDone = false;
		render();
}

checkboxRotate.checked = false;

checkboxStereo.checked = wantsStereo;
function toggleStereo()		{
    wantsDual = false;
    checkboxDual.checked = wantsDual;
    if ( checkboxStereo.checked )
    		{wantsStereo = true;  buttonEye = 3; eyeLeft = -buttonEye; eyeRight = buttonEye}
    else	{wantsStereo = false; buttonEye = 0; eyeLeft = 0; eyeRight = 0;}
    render();
}

checkboxDual.checked = wantsDual;
function toggleDual()	{
    wantsStereo	= false;
    checkboxStereo.checked = wantsStereo;
    if ( checkboxDual.checked )
    		{	wantsDual = true; 
    			if (!truncationFlag)
    			{	if (polyhedronMenu.value =="tetrahedron")
    						{ svgEl.setAttribute("viewBox"," -40 -40 80 80"); }
    				else if (polyhedronMenu.value =="cube")
    			   			{ svgEl.setAttribute("viewBox"," -35 -35 70 70"); }	
    			   	else	{ svgEl.setAttribute("viewBox"," -25 -25 50 50"); }	    		
    			}
    			updateDVerticesFaces();
    		}
    else	{wantsDual = false;	
    vDone = false;
    initVertices(polyhedronMenu.value);
    }
    render();
}

function PatchWire()	{
	if (inputWireFrame.checked) {renderstyle = wire; inputPatchStyle.value = "";}
	if (inputPatchStyle.checked) {renderstyle = patch; inputWireFrame.value = "";}
	render();
}
function BlackWhite(){
	if (inputBlack.checked)
		{mybackground = "black"; myforeground = "cyan"; inputWhite.checked = false;}
	if (inputWhite.checked)
		{mybackground = "white"; myforeground = "#306000"; inputBlack.checked = false;}
	document.body.style.backgroundColor = mybackground;
    document.body.style.color = myforeground;	
	verticesPosition.innerHTML=positionOfVertices();
	render();
}
function OrthoPersp()	{
	if (inputOrtho.checked) {projType = ortho; inputPersp.checked = false;}
	if (inputPersp.checked) {projType = persp; inputOrtho.checked = false;}
	render();
}

function objectDescription() {
		let message  = "Platonic Polyhedron: "+polyhedronMenu.value;
		message 	+= "<br>Archimedean Family: "+truncationName;
		if (!(truncationMode == regular))
			{message 	+= "<br>Archimedean Solid: Param = "+truncParam;}
		if (truncationMode == vtrunc)  {message += " or 48";}
	return message;
}

function positionOfVertices() {
		let myTextColor = "white";
			if (inputWhite.checked) {myTextColor = "black";}
		let theText	= "<p><font size=4>&nbsp &nbsp &nbsp Position of vertices of Archimedean solids on their Platonic parents:</font>";
			theText += "<br> <font size=4>Midpoint Truncation:</font> <font color="+myTextColor+">";
			theText += "Choose the midpoints of the Platonic edges as the vertices of a new polyhedron. From the tetrahedron we get the octahedron."
			theText += " From cube or octahedron we get the cuboctahedron which has 6 square faces and 8 triangular faces. ";
			theText += "From icosahedron or dodecahedron we get the icosidodecahedron which has 12 pentagon faces and 20 triangular faces.</font>";
			theText += "<br>  <font size=4>Standard Truncation:</font>  <font color="+myTextColor+"> ";
			theText += "Cut the k-edged vertices so that the Platonic n-gon faces ";
			theText += "become regular 2n-gons and new k-gon faces appear below the Platonic vertices. Names: truncated tetrahedron, ";
			theText += "truncated octahedron, truncated cube, truncated icosahedron, truncated dodecahedron.</font>";
			theText += "<br> <font size=4>Edge Truncation:</font>  <font color="+myTextColor+"> ";
			theText += "Scale each Platonic n-face from its midpoint down and take ";
			theText += "the vertices of these smaller n-gons as the vertices of a new polyhedron. Below the k-edged vertices appear regular ";
			theText += "k-gon faces and below the edges appear rectangular faces. With the correct scaling these rectangles ";
			theText += "are squares. From the tetrahedron we get the cuboctahedron. From cube or octahedron we get the rhombicuboctahedron ";
			theText += "which has (6+12) square faces and 8 triangular faces. From dodecahedron or icosahedron we get the ";
			theText += "rhombicosidodecahedron which has 12 pentagon faces, 20 triangular faces and 30 square faces.</font>";
			theText += "<br>  <font size=4>Snub Truncation:</font>  <font color="+myTextColor+"> ";
			theText += "Scale the Platonic n-faces down as before but also rotate them around their midpoints and take ";
			theText += "the vertices of these smaller n-gons as the vertices of a new polyhedron. Again we get k-gon faces ";
			theText += "below the k-edged vertices and below each edge appear two triangular faces. One can adjust the ";
			theText += "rotation parameter so that all these triangles are isoceles; with the correct scaling they are ";
			theText += "also equilateral. From the tetrahedron one gets the icosahedron. From cube or octahedron one ";
			theText += "gets the snub cube which has 6 square faces and (8+24) triangular faces. From dodecahedron or ";
			theText += "icosahedron one gets the snub dodecahedron which has 12 pentagon faces and (20+60)  ";
			theText += "triangular faces. These two snub polyhedra are different from their mirror images.</font>";
			theText += "<br> <font size=4>Shrink Truncation:</font>  <font color="+myTextColor+"> ";
			theText += "The two remaining Archimedean solids are often described as a modified vertex truncation of the ";
			theText += "cuboctahedron and the icosidodecahedron. It is maybe simpler to start from the standard truncation above, "; 
			theText += "shrink the regular 2n-gon faces from their midpoints and take the vertices of all these smaller 2n-gons  ";
			theText += "as the vertices of a new polyhedron. As with edge truncation we get rectangles under the edges; these are  ";
			theText += "made squares with the correct scaling. Under the k-edged old vertices we get new 2k-gon faces. The tetrahedron "; 
			theText += "thus gives the truncated octahedron (4 squares and 8 hexagons). Cube or octahedron give the truncated ";
			theText += "cuboctahedron (6 eight-gons, 8 hexagons and 12 squares). Dodecahedron or icosahedron give the truncated ";
			theText += "icosidodecahedron (12 ten-gons, 20 hexagons and 30 squares).</font> ";
			theText += "</p>";
	return theText;
}


	inputBlack.checked 		= true;
    inputPatchStyle.checked = true;
    inputPersp.checked 		= true;

function init()	{
    document.body.style.backgroundColor = mybackground;
	gettruncationMode(truncateMenu.value);
    initVertices(polyhedronMenu.value);
	render();
}



init();



{
    // ================ setup events and handler ===========================
    
    // ================ From Ben ===========================================
/*       		
	function keyDown(key) {
		if (key.code === "ArrowUp" || (key.keyCode === 38)) { keys.up = true };
		if (key.code === "ArrowDown" || (key.keyCode === 40)) { keys.down = true };
		if (key.code === "ArrowRight" || (key.keyCode === 39)) { keys.right = true };
		if (key.code === "ArrowLeft" || (key.keyCode === 37)) { keys.left = true };
	}
	function keyUp(key) {
		if (key.code === "ArrowUp" || (key.keyCode === 38)) { keys.up = false };
		if (key.code === "ArrowDown" || (key.keyCode === 40)) { keys.down = false };
		if (key.code === "ArrowRight" || (key.keyCode === 39)) { keys.right = false };
		if (key.code === "ArrowLeft" || (key.keyCode === 37)) { keys.left = false };
	}
	document.body.addEventListener("keydown", keyDown);
	document.body.addEventListener("keyup", keyUp);
*/
	function mouseMove(e){
		if(e.buttons){
			pendingRotationY-=e.movementX;
			pendingRotationX-=e.movementY;
		}
	}
	svgEl.addEventListener("mousemove",mouseMove);

	const lastTouch={x:0,y:0};
	function touchMove(e){
		e.preventDefault();
		pendingRotationY-= e.touches[0].clientX-lastTouch.x;
		pendingRotationX-= e.touches[0].clientY-lastTouch.y;
		lastTouch.x=e.touches[0].clientX;
		lastTouch.y=e.touches[0].clientY;
	}
	function touchStart(e){
		lastTouch.x=e.touches[0].clientX;
		lastTouch.y=e.touches[0].clientY;
	};
	svgEl.addEventListener('touchmove', touchMove, false);
	svgEl.addEventListener('touchstart', touchStart, false);
	
	// =================== Ben End =================================

    // when user selects an object in menu, draw it
    polyhedronMenu. addEventListener("change", (() => {initVertices(polyhedronMenu.value); toggleDual(); polyhedronMenu.blur();}));

    truncateMenu. addEventListener("change", (() => {gettruncationMode(truncateMenu.value); render(); truncateMenu.blur()}));

    //checkboxRotate.addEventListener ('change', toggleAutoRotation , false);
    checkboxStereo.addEventListener ('change', toggleStereo , false);
    checkboxDual.addEventListener ('change', toggleDual , false);

	inputOrtho.addEventListener("change", OrthoPersp);
	inputPersp.addEventListener("change", OrthoPersp);
	inputBlack.addEventListener("change", BlackWhite);
	inputWhite.addEventListener("change", BlackWhite);
	inputPatchStyle.addEventListener("change", PatchWire);
	inputWireFrame.addEventListener("change", PatchWire);

    inputViewDist . addEventListener("change", ViewDist);  // returns number as string
    inputTruncParam.addEventListener("change", TruncParam);
}
function rotX(deg)	{
	if (!(deg == 0))
	{
    const cd = Math.cos(Math.PI/180 * deg);
    const sd = Math.sin(Math.PI/180 * deg);
    vertices = vertices . map ( ([x,y,z]) => [
        x,
        cd * y - sd  * z ,
        sd * y + cd  * z ] );
    if (truncationFlag) {
	vVertices = vVertices . map(([x,y,z]) => [
        x,
        cd * y - sd  * z ,
        sd * y + cd  * z ] );
    }
    if (wantsDual) {
	dVertices = dVertices . map(([x,y,z]) => [
        x,
        cd * y - sd  * z ,
        sd * y + cd  * z ] );
    }
    }
}


// rotate vertices around Y axis in R^3
function rotY(deg)	{
	if (!(deg == 0))
	{
    const cd = Math.cos(Math.PI/180 * deg);
    const sd = Math.sin(Math.PI/180 * deg);
    vertices = vertices . map ( ([x,y,z]) => [
        cd * x - sd  * z ,
        y,
        sd * x + cd  * z ] );
    if (truncationFlag){
	vVertices = vVertices . map(([x,y,z]) => [
        cd * x - sd  * z ,
        y,
        sd * x + cd  * z ] );
    }
    if (wantsDual){
	dVertices = dVertices . map(([x,y,z]) => [
        cd * x - sd  * z ,
        y,
        sd * x + cd  * z ] );
    }
    }
}


// rotate vertices around Z axis in R^3
function rotZ(deg)	{
	if (!(deg == 0))
	{
    const cd = Math.cos(Math.PI/180 * deg);
    const sd = Math.sin(Math.PI/180 * deg);
    vertices = vertices . map ( ([x,y,z]) => [
        cd * x - sd  * y ,
        sd * x + cd  * y ,
        z] );
    if (truncationFlag){
	vVertices = vVertices . map(([x,y,z]) => [
        cd * x - sd  * y ,
        sd * x + cd  * y ,
        z] );
    }
    if (wantsDual){
	dVertices = dVertices . map(([x,y,z]) => [
        cd * x - sd  * y ,
        sd * x + cd  * y ,
        z] );
    }
    }
}
};
