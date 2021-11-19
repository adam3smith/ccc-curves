"use strict"
window.onload=function(){

const div = document.getElementById("svgArea");
const svgEl = document.getElementById("mySVG");
svgEl.setAttribute("width","700");
svgEl.setAttribute("height","600");
svgEl.setAttribute("viewBox"," -120 -110 220 220");

const inputknotinfo  	= document.getElementById("knotinfo");
const inputvJones   	= document.getElementById("vJones");
const currentObject		= document.getElementById("currentObject");
const inputParam1		= document.getElementById("param1");
const inputParamWrd		= document.getElementById("param2");
const inputParam3		= document.getElementById("param3");
//const checkboxConst  	= document.getElementById('checkboxConst');
//const checkboxUp10  		= document.getElementById('checkboxUp10');
//const checkboxDwn10 	= document.getElementById('checkboxDwn10');
const checkboxBackgrd 	= document.getElementById('checkboxBackgrd');
checkboxBackgrd.checked = false;
//checkboxUp10.checked 	= false;
//checkboxDwn10.checked 	= false;
let mybackground     	= "black";
let myforeground     	= "white";
const buttonUp1			= document.getElementById('buttonUp1');
const buttonDwn1		= document.getElementById('buttonDwn1');
const buttonUp10		= document.getElementById('buttonUp10');
const buttonDwn10		= document.getElementById('buttonDwn10');
const buttonUp			= document.getElementById('buttonUp');
const buttonDwn			= document.getElementById('buttonDwn');
buttonUp1.style.width = '60px';
buttonUp1.style.height = '22px';
buttonUp1.style.fontSize = '15px';
buttonDwn1.style.width = '75px';
buttonDwn1.style.height = '22px';
buttonDwn1.style.fontSize = '15px';
buttonUp10.style.width = '60px';
buttonUp10.style.height = '22px';
buttonUp10.style.fontSize = '15px';
buttonDwn10.style.width = '75px';
buttonDwn10.style.height = '22px';
buttonDwn10.style.fontSize = '15px';
buttonUp.style.width = '60px';
buttonUp.style.height = '22px';
buttonUp.style.fontSize = '15px';
buttonDwn.style.width = '75px';
buttonDwn.style.height = '22px';
buttonDwn.style.fontSize = '15px';
//const checkboxUp1  		= document.getElementById('checkboxUp1');
//const checkboxDwn1  	= document.getElementById('checkboxDwn1');
//const checkboxUp  		= document.getElementById('checkboxUp');
//const checkboxDwn  		= document.getElementById('checkboxDwn');
//checkboxUp1.checked 	= false;
//checkboxDwn1.checked 	= false;
//checkboxUp.checked 		= false;
//checkboxDwn.checked 	= false;


let pathUnder = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	pathUnder.setAttribute( 'stroke' , '#555555' );
  	pathUnder.setAttribute( 'stroke-width' , 6 );
  	pathUnder.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(pathUnder);
	
let pathStrands = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	pathStrands.setAttribute( 'stroke' , '#FFFF00' );
  	pathStrands.setAttribute( 'stroke-width' , 2 );
  	pathStrands.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(pathStrands);
let txtStrands  = '';

let bridgesUnder = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	bridgesUnder.setAttribute( 'stroke' , '#555555' );
  	bridgesUnder.setAttribute( 'stroke-width' , 6 );
  	bridgesUnder.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(bridgesUnder);
	
let bridgesOver = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	bridgesOver.setAttribute( 'stroke' , '#FFFF00' );
  	bridgesOver.setAttribute( 'stroke-width' , 2 );
  	bridgesOver.setAttribute( 'fill' , 'none' );
	svgEl.appendChild(bridgesOver);
let txtBridges = '';

/*  	
let normal = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
	normal.setAttribute( 'stroke' , '#FF0000' );
  	normal.setAttribute( 'stroke-width' , 0.5 );
  	normal.setAttribute( 'fill' , 'none' );
  	//svgEl.appendChild(normal);
let txtn  	= '';
	
let cir 	= document.createElementNS("http://www.w3.org/2000/svg","circle");
	cir.setAttribute("style","fill:none; stroke-width:1");
	cir.setAttribute( 'stroke' , '#FFFF00' );
	//svgEl.appendChild(cir);
let rline = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  	rline.setAttribute( 'stroke-width' , 1.0 );
  	rline.setAttribute( 'fill' , 'none' );cir.setAttribute( 'stroke' , '#FFFF00' ); 
 	rline.setAttribute( 'stroke' , '#FFFF00' );
  	//svgEl.appendChild(rline);	
let txtl	= '';
*/

let choose = 1;
let braidList = [];
let bL = [];
let bw = [];
let theBraidWord = "";
let braidAsNums  = [];
let minCrossings = 1;
let braidCrosses = 1;
let numStrands	 = [];
let perm		 = [];
let errorMsg	 = '';
let frq			 = 1;
let BezTang		 = 1.1;
let cst1 = [];
let dst1 = [];
let cst2 = [];
let dst2 = [];
let brd1 = [];
let brd2 = [];
for (let i= 0; i < 13; i++)
	{ cst1[i] = []; cst2[i] = []; 
	  dst1[i] = []; dst2[i] = [];
	  brd1[i] = [[0,1],[1,0]]; brd2[i] = [[0,1],[1,0]];
	 for (let j=0; j<13; j++)
	 {cst1[i][j] = [1,0]; cst2[i][j] = [1,0]; 
	  dst1[i][j] = [0,1]; dst2[i][j] = [0,1];
	  }
	}
	//console.log("brd[0] = ",brd1[0],brd1[0][0],brd1[0][1]);

/* ============ used in making path ========== */
let px = 0;
let py = 0;
let mx = 0;
let my = 0;
let hx = 0;
let hy = 0;

let qx = 0;
let qy = 0;
let nx = 0;
let ny = 0;
let kx = 0;
let ky = 0;


/* ===================================================================== */


function removeOscCirc()	{
		if ( cir.parentElement)
			{svgEl.removeChild(cir);}
		rline.setAttribute("d", '');
}

/*
function makeOscSvg(j) {
let newRadius = "";
let midX = "";
let midY = "";
function getOscCirc(j) {
		const pos = curve[j][0];
		const tan = curve[j][1];
		// const rad = norm1(vecDif1(curve[j+1][0],curve[j][0])) /
// 					norm1(vecDif1(curve[j+1][1],curve[j][1]));
		let rad = 1/kappa(curve[j][1], curve[j+1][1],  curve[j][0], curve[j+1][0]); 
		const unrml = [+tan[1], -tan[0]];
		const mdif  = scalTimesVec1(rad/norm1(unrml), unrml);
		px	= pos[0]*scale;  py  = -pos[1]*scale;
		qx  = (mdif[0]+pos[0])*scale;   qy  = -(mdif[1]+pos[1])*scale;
		txtl = 'M'+px+' '+py+ ' L'+qx+' '+qy;      // for radius
		if (norm1(pos) < epsD) {rad = epsD}
	return [abs(rad), mdif[0]+pos[0], -(mdif[1]+pos[1])];  // not scaled
	}

[newRadius, midX, midY] = scalTimesVec1(scale, getOscCirc(j));

if (abs(midX) + abs(midY) + newRadius < 16000)	
	{
		cir.setAttribute("cx", midX);
		cir.setAttribute("cy", midY);
		cir.setAttribute("r",newRadius);
		svgEl.appendChild(cir);
		rline.setAttribute("d", txtl );
	}
else { removeOscCirc();	}

} //  make circles with radius -- append in render()
*/

/* ============================================================= */

/*
function makeNormalsSVG() {
		let nrml 	= [];
		let tang	= [];
		let aux		= [];
		let kap		= 0;
		let ptsx	= 0;
		let ptsy	= 0;
		let qtsx	= 0;
		let qtsy	= 0;
		let fc		= 1; if ((choose == 8)||(choose < 2)) { fc = 4;}
			txtn  	= '';
			normal.setAttribute( "d" , '' );
		for (let i = 0;  i < n/fc-1; i++)	{
			tang	= curve[fc*i][1];
			aux		= [ tang[1], -tang[0]];
			kap		= kappa(curve[fc*i][1], curve[fc*i+1][1],  curve[fc*i][0], curve[fc*i+1][0]); 
			if (!(abs(kap) < epsD)) {
				nrml	  = scalTimesVec1(scale/kap/norm1(aux), aux);
				ptsx	  = curve[fc*i][0][0]*scale;
				ptsy	  = -curve[fc*i][0][1]*scale;
				qtsx 	  = nrml[0];
				qtsy 	  = -nrml[1];
			
				txtn 	+= 'M' +ptsx +' '+ptsy +'l'+qtsx +' '+qtsy;
			}
		}
		//console.log("txtn =", txtn);
		normal.setAttribute("d",txtn);
		//console.log("n = ",n);
}
*/

//P(t)  = (1−t)^3 P0 + 3(1−t)^2t P1 +3(1−t)t^2 P2 + t^3 P3
function myBezier(t) {
	return py*cube(1-t) + 3*(py+my)*sqr(1-t)*t + 3*(qy-ny)*(1-t)*sqr(t) + qy*cube(t);
	}

let tword  = '11-12-';
let wordOK = false;

/* ========= Vaughan Jones Braid List ======================== 
   Nr 166: '1111-2-21-212'; 201: '-12-32112-32-3';  haben Vorzeichenfehler */
function initializeBraidList() {
braidList[1] = '111'; braidList[2] = '1-21-2'; braidList[3] = '11111'; 
braidList[4] = '1122-12'; braidList[5] = '-12-13-232'; braidList[6] = '-12-1222'; braidList[7] = '-122-1-12';
braidList[8] = '1111111'; braidList[9] = '3211233-2-1'; braidList[10] = '1-2122222'; braidList[11] = '11233-12-32'; 
braidList[12] = '111-21222'; braidList[13] = '1-2-1-132223'; braidList[14] = '1-32-32-12-32';
//  7_7 (14 knots)';
braidList[15] = '-123-2-14432-4'; braidList[16] = '-122222-12'; braidList[17] = '-2-43-1-144-213'; braidList[18] = '1113-2-3-31-2';
braidList[19] = '111-2111-2'; braidList[20] = '-12-1-322233'; braidList[21] = '1111-2-21-2'; braidList[22] = '-1211-322-3-3';
braidList[23] = '2-1-1-1222-1'; braidList[24] = '-122-1-1222'; braidList[25] = '-122-3233-12'; braidList[26] = '3-43-42-31-21-2';
braidList[27] = '112-32-1-3-32'; braidList[28] = '1122-1-32-32'; braidList[29] = '11-2133223'; braidList[30] = '11-211-21-2';
braidList[31] = '2-122-1-12-1'; braidList[32] = '1-21-21-21-2'; braidList[33] = '12121221'; braidList[34] = '1112-1-1-12'; braidList[35] = '111-2-1-1-1-2';
braidList[36] = '111111111'; braidList[37] = '1234443-421-3-2'; braidList[38] = '1-211111122'; braidList[39] = '-1321123333-2';
braidList[40] = '112-13-23443-42'; braidList[41] = '112211111-2'; braidList[42] = '111233-1222-3'; braidList[43] = '1-23-1-1-43-23343';
braidList[44] = '111-2111122'; braidList[45] = '-1211222-3233'; braidList[46] = '-12-32-1222232'; braidList[47] = '1-2-1-13222443-4';
braidList[48] = '112-32-133222'; braidList[49] = '144-32-32-3-1-4223-2';
//  9_14 (49 knots)';
braidList[50] = '1-213-24-3443'; braidList[51] = '111222-1222'; braidList[52] = '1113-21-2-3-21-2'; braidList[53] = '113221-3-2-31122';
braidList[54] = '112-1-3-4-32-324-3'; braidList[55] = '122-32-12-3222'; braidList[56] = '-1-13-43-2134422';
braidList[57] = '1-2333-23-1-23-2'; braidList[58] = '1-21123332-32'; braidList[59] = '133-213-2-2-2';
braidList[60] = '-12-1-4-324434422-3'; braidList[61] = '-122232-12-1-32'; braidList[62] = '-12-1-1-32-12232';
braidList[63] = '1133-2-213-2'; braidList[64] = '-12-32-12-322'; braidList[65] = '-1-122-32-12-31-2'; braidList[66] = '-122-322-123-12';
braidList[67] = '-123-12-1332-32'; braidList[68] = '-1-1-12-12231-23'; braidList[69] = '1-23-21-231-2';
//  9_34';
braidList[70] = '133-4-212332-34-32'; braidList[71] = '-1222-3233-123'; braidList[72] = '1-23-23-14-3-243-2';
braidList[73] = '1123322-12-32'; braidList[74] = '-1-32433-12234-2'; braidList[75] = '13-231-213-2';
braidList[76] = '-122-43-4-21-323-432'; braidList[77] = '1113-23-1-1-2'; braidList[78] = '1211223-21-2-3';
braidList[79] = '-12-13-2322-3'; braidList[80] = '1-2132223-2'; braidList[81] = '132-1-3213-2'; braidList[82] = '-123-12-1232';
braidList[83] = '11-2322-1-32-32'; braidList[84] = '112232-1223-2';
//  9_49';
braidList[85] = '11-4-5-32-134-5432'; braidList[86] = '1-21111111-2'; braidList[87] = '1-3-21-5-523-4532-4';
braidList[88] = '11-4-4-423-2-1-432'; braidList[89] = '-1-12-1222222'; braidList[90] = '1-23-1-2-13222222';
braidList[91] = '1-3-2123-43-4332'; braidList[92] = '111113-21-3-3-2'; braidList[93] = '-1-1-12-122222';
braidList[94] = '-1-3433211-32-4-32-3'; braidList[95] = '-1-1-3-214333-234'; braidList[96] = '-1-12-1332222-3';
braidList[97] = '11-32-1-345543-5-2-2-4'; braidList[98] = '-12-1332222-32'; braidList[99] = '-13-23333-2-1-12';
braidList[100] = '1-2-1-13-2-434433'; braidList[101] = '1111-21-2-2-2-2'; braidList[102] = '13344-3-24-1-13-2';
//  10_18';
braidList[103] = '-1-1-213333-23-2'; braidList[104] = '-1-32223443-4-12'; braidList[105] = '-12-1332-32222';
braidList[106] = '-1-1-1233-1222-3'; braidList[107] = '-12-1222-32-133'; braidList[108] = '-12-3221123-43-4';
braidList[109] = '-133222-322-12'; braidList[110] = '122-3-2-2-21-2113-2'; braidList[111] = '-1-12-323333-12';
//  10_27';
braidList[112] = '112-32-1-43-4-432'; braidList[113] = '1-23-43-2-1-23-24333'; braidList[114] = '112-32-1334-32-3-42';
braidList[115] = '1122-14-3-4-4-32-3'; braidList[116] = '-12-3211-3-3-322'; braidList[117] = '3441-23-43-2-1-1-2';
braidList[118] = '-1-4-433211-4-323'; braidList[119] = '-12-32-34-54-51-23-422'; braidList[120] = '11-3223-43-4-132';
braidList[121] = '2-4-4-3-3-142211-3'; braidList[122] = '-1-12214-322-34433-2-3'; braidList[123] = '-12-1222-32333';
braidList[124] = '112-122-321-3-3'; braidList[125] = '1-23-2-1-43-2343-233'; braidList[126] = '1-2-1-13-4223-4-43';
braidList[127] = '-12-3-42-3-312-3-4322'; braidList[128] = '-1-23-234412-3-2-243';
// 10_44';
braidList[129] = '21-32-324-1-32-32-4-3'; braidList[130] = '-122222-1222'; braidList[131] = '11111-211-2-2';
braidList[132] = '-1-12222-1-1-12'; braidList[133] = '1111322231-2'; braidList[134] = '-122-3233-1222';
// 10_50(134)';
braidList[135] = '112-3-3-122-322'; braidList[136] = '-1-1-233-23331-2'; braidList[137] = '1-23342-133-23-14422';
braidList[138] = '-1-1-233-2333-12'; braidList[139] = '-14342111233-43-2'; braidList[140] = '-12233-23-1222';
braidList[141] = '1112-3-3-122-32'; braidList[142] = '12-54-32-3-4-51-234'; braidList[143] = '1224-1-1-34-3-2344-3';
braidList[144] = '-1-1221-23-43-23-243'; braidList[145] = '1-2-1-1333-2333'; braidList[146] = '-1-1222-12222';
braidList[147] = '11233-14-3-234432'; braidList[148] = '-1-1-1222-1222'; braidList[149] = '13223-1-2333-1-2-2';
// 10_65';
braidList[150] = '112-3221-233332'; braidList[151] = '-12-4-32-41133224-3'; braidList[152] = '-12-34411-2322-4-3-3';
braidList[153] = '1342-34-2-2-1-13222'; braidList[154] = '1-2333-1-122-43-4'; braidList[155] = '11-4-4-2-322-3-423-12';
braidList[156] = '111-2112-32-32'; braidList[157] = '1-2331-43-2343-2'; braidList[158] = '-142-32-4-3211-4332';
// 10_74';
braidList[159] = '1-213-2343-23-4-2'; braidList[160] = '11-2-1333-21-2333'; braidList[161] = '-1222-3-31122-3';
braidList[162] = '-1-143-2133-432223'; braidList[163] = '111-2-211-2-2-2'; braidList[164] = '112-322-1222322';
braidList[165] = '433442-3-1-2-2-1-1'; braidList[166] = '1111-2-21-21-2'; braidList[167] = '-12-32-3-32112-3';
braidList[168] = '11122-32-1-32-3'; braidList[169] = '-122-12-12222'; braidList[170] = '112-322-32-1-32'; braidList[171] = '111-32-3-12-32-3';
braidList[172] = '11-2-431-23-24-3-12-3'; braidList[173] = '12-32-142-324-34'; braidList[174] = '113-2-211-21-23-1-2';
braidList[175] = '111-2-21-2-21-2'; braidList[176] = '11122-32-12-32'; braidList[177] = '-1-133-231-233-2';
braidList[178] = '111-211-2-21-2'; braidList[179] = '-1-12-32-122332'; braidList[180] = '12-34213-2-3-34-3';
// 10_96';
braidList[181] = '11-23-422-1-3233-42'; braidList[182] = '-122332-122-32'; braidList[183] = '-1-12-1-122-122';
braidList[184] = '111-211-211-2'; braidList[185] = '-1322143222334-3-1-2'; braidList[186] = '122-32-1-321-3-3';
// 10_102';
braidList[187] = '1122-322-3-12-3'; braidList[188] = '11-2-2-211-21-2'; braidList[189] = '-1-23-2413-23344-3-2';
braidList[190] = '111-2-211-21-2'; braidList[191] = '143-2334-3-2-2-1-23-2'; braidList[192] = '-1-133-2133-23-2';
braidList[193] = '2-1-122-1-122-1'; braidList[194] = '1-32-3-432221-2-3-42'; braidList[195] = '1122-322-12-32';
braidList[196] = '111-21-21-21-2'; braidList[197] = '1112-32-12-32-3'; braidList[198] = '-1-23-23-2-211-3233';
braidList[199] = '1233-2-1-2-24-1-32-34-34'; braidList[200] = '11-21-21-211-2'; braidList[201] = '-12-32-1-12-32-3';
braidList[202] = '1-211-21-2-21-2'; braidList[203] = '112-3-32-1-32-32'; braidList[204] = '1223-413-23-144332-3';
// 10_120';
braidList[205] = '-12-32-32112-32'; braidList[206] = '1-23-23-2-1-232-122'; braidList[207] = '1-21-21-21-21-2';
braidList[208] = '1222221222'; braidList[209] = '-1-2-2-2-122222'; braidList[210] = '1-2-2-2122222'; braidList[211] = '111112-1-122';
braidList[212] = '11322322-132'; braidList[213] = '-1-13-2-232213-2'; braidList[214] = '-12-3-3-3211233';
// 10_130';
braidList[215] = '-123332112-3-3'; braidList[216] = '-1223-2-212231-2-3'; braidList[217] = '-13233211-3-21-32';
braidList[218] = '122122232-122-3'; braidList[219] = '1223-2-1-1-1-233'; braidList[220] = '112-32-122-3-2-2';
braidList[221] = '113-21-23-1-43-23-24'; braidList[222] = '113-21-234-1-32-32-4'; braidList[223] = '1122211212';
braidList[224] = '1-21-3-3-323332'; braidList[225] = '-1-1-1211-2112'; braidList[226] = '-13332333112'; braidList[227] = '-122-1-121122';
braidList[228] = '11322-12-3-31-2'; braidList[229] = '112-1-3213223'; braidList[230] = '11-2-3-3221-23-2';
//  10_146';
braidList[231] = '-1-2-2332211-2-1-32'; braidList[232] = '11222-1-12-12'; braidList[233] = '-1-122211122';
braidList[234] = '112232-1-233-2'; braidList[235] = '11-32213-2-2-32'; braidList[236] = '1122211122'; braidList[237] = '112-3-3-2-21-322';
braidList[238] = '1-2332211322'; braidList[239] = '1112-1-12-1-12'; braidList[240] = '-123223-1-12-32'; braidList[241] = '-12211-21122';
braidList[242] = '1123-1-2-23-2-23'; braidList[243] = '1-21-212221-2'; braidList[244] = '123311-21-21-3'; braidList[245] = '-1211222112';
braidList[246] = '-1-13-2331223-2'; braidList[247] = '1-23-1211-21-23'; braidList[248] = '1-2-3-31221-23-2';
braidList[249] = '112-32-1233-12';
// 10_166 (249)  This was the last 10-crossing knot. The rest are tests:';
braidList[250] = '11111111111'; braidList[251] = '1-12-23-34-4'; braidList[252] = '-1-1-1-1-122222';
braidList[253] = '2-4-4-3-3-142211-3'; braidList[254] = '1111-21-2-2-2-2';
braidList[255] = '111-2-211-2-2-2'; braidList[256] = '1233-2-1-2-24-1-32-34-34';
braidList[257] = '-12-12-12'; braidList[258] = '123123123123';
braidList[259] = '121212'; braidList[260] = '123123123';

bL = braidList;
//===================================================

bw[1] = '111';
bw[2] = '1-21-2';
bw[3] = '11111';
bw[4] = '1112-12';
bw[6] = '111-21-2';
bw[7] = '11-21-2-2';
bw[5] = '112-1-32-3';
bw[8] = '1111111';
bw[13] = '11-213-23';
bw[14] = '1-21-23-23';
bw[10] = '111112-12';
bw[12] = '11112-122';
bw[9] = '1112-123-23';
bw[11] = '112-1223-23';
bw[16] = '11111-21-2';
bw[21] = '1111-21-2-2';
bw[19] = '111-2111-2';
bw[24] = '111-211-2-2';
bw[23] = '111-21-2-2-2';
bw[30] = '11-211-21-2';
bw[31] = '11-21-21-2-2';
bw[32] = '1-21-21-21-2';
bw[26] = '1-213-2-43-4';
bw[20] = '11112-1-32-3';
bw[18] = '111-21-2-32-3';
bw[28] = '1112-12-32-3';
bw[22] = '1112-1-32-3-3';
bw[27] = '11-21-2-2-32-3';
bw[25] = '112-122-32-3';
bw[29] = '11-2132223';
bw[15] = '112-123-2-43-4';
bw[17] = '112-1-32-3-43-4';
bw[34] = '111-2-1-1-1-2';
bw[33] = '11121112';
bw[35] = '1112-1-122';
bw[36] = '111111111';
bw[46] = '1111-213-23';
bw[71] = '111-2113-23';
bw[61] = '111-21-23-23';
bw[55] = '111-213-233';
bw[67] = '11-21-213-23';
bw[62] = '11-21-2-23-23';
bw[66] = '11-21-23-233';
bw[59] = '11-213-2-2-23';
bw[63] = '11-213-2-233';
bw[65] = '11-2-21-23-23';
bw[68] = '1-21-2-213-23';
bw[52] = '1-21-2-2-23-23';
bw[69] = '1-21-23-21-23';
bw[57] = '1-21-23-2-2-23';
bw[75] = '1-213-213-23';
bw[64] = '1-2-23-21-23-2';
bw[38] = '11111112-12';
bw[41] = '1111112-122';
bw[44] = '111112-1222';
bw[51] = '111122-1222';
bw[50] = '1112-1-324-34';
bw[43] = '11-21-2-324-34';
bw[56] = '112-12-324-34';
bw[60] = '11-21322-43-4';
bw[47] = '11-213-234-34';
bw[49] = '112-1-32-34-34';
bw[54] = '1-21-2-2-324-34';
bw[39] = '111112-123-23';
bw[48] = '11112-1223-23';
bw[42] = '11112-123-233';
bw[53] = '1112-12223-23';
bw[58] = '1112-1223-233';
bw[45] = '112-122223-23';
bw[73] = '1122-32-12332';
bw[37] = '1112-123-234-34';
bw[40] = '112-1223-234-34';
bw[72] = '11-213-2-1-43-23-4';
bw[74] = '112-1-3-2143-234';
bw[76] = '112-1-3-2-243-234';
bw[70] = '112-1223-2-24-3243';
bw[77] = '111-2-1-13-23';
bw[78] = '111211-32-3';
bw[79] = '1112-1-1-32-3';
bw[80] = '112-1213-23';
bw[81] = '1-21-232-123';
bw[82] = '1-21-2-3-21-2-3';
bw[84] = '11211-32-1233';
bw[83] = '112-121-32-12-3';
bw[86] = '1111111-21-2';
bw[89] = '111111-21-2-2';
bw[130] = '11111-2111-2';
bw[131] = '11111-211-2-2';
bw[93] = '11111-21-2-2-2';
bw[146] = '1111-2111-2-2';
bw[169] = '1111-211-21-2';
bw[166] = '1111-21-21-2-2';
bw[101] = '1111-21-2-2-2-2';
bw[132] = '1111-2-21-2-2-2';
bw[148] = '111-2111-2-2-2';
bw[184] = '111-211-211-2';
bw[178] = '111-211-2-21-2';
bw[190] = '111-21-211-2-2';
bw[196] = '111-21-21-21-2';
bw[175] = '111-21-2-21-2-2';
bw[163] = '111-2-211-2-2-2';
bw[188] = '111-2-21-21-2-2';
bw[200] = '11-211-21-21-2';
bw[183] = '11-211-2-21-2-2';
bw[202] = '11-21-21-2-21-2';
bw[193] = '11-21-2-211-2-2';
bw[207] = '1-21-21-21-21-2';
bw[113] = '111-213-2-43-4';
bw[126] = '11-21-23-2-43-4';
bw[155] = '11-213-2-2-43-4';
bw[128] = '11-213-23-43-4';
bw[127] = '11-213-2-43-4-4';
bw[125] = '1-21-2-23-2-43-4';
bw[143] = '1-21-23-2-2-43-4';
bw[129] = '1-21-23-23-43-4';
bw[154] = '1-213-2-2-2-43-4';
bw[172] = '1-213-23-2-43-4';
bw[90] = '1111112-1-32-3';
bw[92] = '11111-21-2-32-3';
bw[98] = '111112-12-32-3';
bw[96] = '111112-1-32-3-3';
bw[103] = '1111-21-2-2-32-3';
bw[109] = '11112-122-32-3';
bw[99] = '1111-21-2-32-3-3';
bw[111] = '11112-12-32-3-3';
bw[133] = '1111-2132223';
bw[160] = '11112-1-3222-3';
bw[161] = '11112-1-322-3-3';
bw[106] = '11112-1-32-3-3-3';
bw[156] = '111122-12-32-3';
bw[145] = '111-2111-2-32-3';
bw[136] = '111-211-2-2-32-3';
bw[138] = '111-211-2-32-3-3';
bw[164] = '111-21132223';
bw[110] = '111-21-2-2-2-32-3';
bw[123] = '1112-1222-32-3';
bw[116] = '111-21-2-2-32-3-3';
bw[124] = '1112-122-32-3-3';
bw[140] = '1112-12-3222-3';
bw[141] = '1112-12-322-3-3';
bw[150] = '111-21322233';
bw[168] = '1112-1-322-32-3';
bw[171] = '1112-1-32-32-3-3';
bw[176] = '11122-32-12-32';
bw[197] = '1112-32-12-32-3';
bw[177] = '11-211-21-2-32-3';
bw[192] = '11-2113-21-2-3-3';
bw[170] = '11-21-21-2-2-32-3';
bw[107] = '11-21-2-2-2-2-32-3';
bw[105] = '112-12222-32-3';
bw[134] = '112-122-3222-3';
bw[135] = '112-122-322-3-3';
bw[174] = '11-21-2-321-3-2-2';
bw[149] = '112-12-3222-3-3';
bw[167] = '112-12-322-32-3';
bw[186] = '11-213-21-2-2-3-3';
bw[203] = '11-213-21-2-3-3-2';
bw[187] = '112-1-322-322-3';
bw[198] = '112-1-32-32-32-3';
bw[182] = '1122-32-122-32';
bw[201] = '1122-32-12-32-3';
bw[179] = '11-2-23-21-2-3-3-2';
bw[195] = '1122-322-12-32';
bw[205] = '112-32-12-32-32';
bw[206] = '112-32-1-32-32-3';
bw[97] = '112-1-324-3-54-5';
bw[119] = '1-21-2-324-3-54-5';
bw[142] = '1-213-2-4-3-35-45';
bw[104] = '11112-123-2-43-4';
bw[95] = '11112-1-32-3-43-4';
bw[122] = '1112-1223-2-43-4';
bw[88] = '111-21-2-32-3-43-4';
bw[120] = '1112-123-23-43-4';
bw[102] = '1112-12-32-3-43-4';
bw[118] = '1112-123-2-43-4-4';
bw[115] = '1112-1-32-3-3-43-4';
bw[121] = '1112-1-32-3-43-4-4';
bw[139] = '1112-1-3243334';
bw[157] = '112-121-32-34-34';
bw[162] = '112-121-324-344';
bw[108] = '112-12223-2-43-4';
bw[94] = '11-21-2-2-32-3-43-4';
bw[114] = '112-1223-23-43-4';
bw[100] = '112-122-32-3-43-4';
bw[112] = '112-1223-2-43-4-4';
bw[91] = '112-123-233-43-4';
bw[117] = '112-12-32-3-3-43-4';
bw[137] = '112-12-3243334';
bw[153] = '112-1-3214-32-34';
bw[147] = '11-21322234-34';
bw[189] = '11-21322-4-32-3-4';
bw[191] = '11-21-3-2-24-32-34';
bw[165] = '11-21322-4-3-3-3-4';
bw[144] = '1-21-2-23-2324-34';
bw[173] = '1-21-2-32143-234';
bw[159] = '1-21-23-2-24-3243';
bw[180] = '1-2-13-2-13-43-23-4';
bw[194] = '1-213222-4-32-3-4';
bw[199] = '1-21322-4-32-3-3-4';
bw[85] = '112-123-234-3-54-5';
bw[87] = '112-123-2-43-4-54-5';
bw[151] = '1112-123-2-2-432-43';
bw[185] = '1112-13-213224-34';
bw[181] = '112-121-32-123-43-4';
bw[152] = '11-21-2-2-322-43-2-4-3';
bw[158] = '112-1223-2-2-432-43';
bw[204] = '112-1-3-214322334';
bw[209] = '11111-2-1-1-1-2';
bw[208] = '1111121112';
bw[210] = '111112-1-1-12';
bw[211] = '111112-1-122';
bw[225] = '1111-2-1-1-1-2-2';
bw[223] = '1111211122';
bw[227] = '11112-1-1-122';
bw[232] = '11112-1-12-12';
bw[233] = '11112-12-122';
bw[239] = '1112-1-12-1-12';
bw[245] = '1112-121122';
bw[243] = '1112-12-1-122';
bw[236] = '1112211222';
bw[241] = '11122-12-122';
bw[221] = '1-21-2322-43-4';
bw[222] = '1-21-2-3-2-24-34';
bw[220] = '1-21-2-3224-34';
bw[224] = '111-2-1-1-1-2-32-3';
bw[226] = '111211123-23';
bw[214] = '111-2-1-1-2-2-32-3';
bw[212] = '111211223-23';
bw[215] = '1112-1-1223-23';
bw[216] = '111-2-1-1-2-32-3-3';
bw[218] = '11121123-233';
bw[217] = '1112-1-123-233';
bw[240] = '111-2-1-132-123';
bw[244] = '111211-32-12-3';
bw[242] = '1112-1-1-3-21-2-3';
bw[234] = '111-2113-2-132';
bw[213] = '111-2-1-13-2-13-2';
bw[235] = '1112-1-13-213-2';
bw[237] = '111211-3-2-2-2-3';
bw[231] = '111-21-2-32-12-3';
bw[219] = '1112-12-3-2-2-2-3';
bw[246] = '112-1-1221-32-3';
bw[247] = '11-2-1-132-1223';
bw[230] = '11-21-2-13-21-23';
bw[229] = '112-12132-123';
bw[228] = '112-121-321-3-2';
bw[238] = '112-12132223';
bw[248] = '11-21-2-2-32-12-3';
bw[249] = '112-1-32-12332';

}

//tword  = '11-12-5345678-1';

function checkForBraidword(tWord) {
	let boolres = false;
	let goodCharSum = 0;
	goodCharSum += (tWord.match(/-/g)||[]).length;
	const aux = goodCharSum;
	goodCharSum += (tWord.match(/1/g)||[]).length;
	goodCharSum += (tWord.match(/2/g)||[]).length;
	goodCharSum += (tWord.match(/3/g)||[]).length;
	goodCharSum += (tWord.match(/4/g)||[]).length;
	goodCharSum += (tWord.match(/5/g)||[]).length;
	goodCharSum += (tWord.match(/6/g)||[]).length;
	goodCharSum += (tWord.match(/7/g)||[]).length;
	goodCharSum += (tWord.match(/8/g)||[]).length;
	goodCharSum += (tWord.match(/9/g)||[]).length;
	boolres = (goodCharSum == tWord.length); // there are only allowed characters
	//boolres = boolres && !(tword.includes('-',tword.length-1));
	boolres = boolres && !(tword[length-1]=='-');
	//console.log("in checkForBraidword", aux, goodCharSum, tword.length-1,boolres);
	boolres = boolres && !tword.includes('--');
	if (boolres)
		{braidCrosses = goodCharSum - aux;
		 boolres = boolres && (braidCrosses < 21); }
	return boolres;
	}
//console.log("tword", tword, (tword.match(/1/g)||[]).length, checkForBraidword(tword));


function minCrosses(n) {
		let val = 10;
		if (n<85) {val = val - 1;}
		if (n<36) {val = val - 1;}
		if (n<15) {val = val - 1;}
		if (n< 8) {val = val - 1;}
		if (n< 5) {val = val - 1;}
		if (n< 3) {val = val - 1;}
		if (n< 2) {val = val - 1;}
		if (n>249) {val = 11;}
		minCrossings = val;
		if (wordOK || n>250 ) { minCrossings = '? unknown for user braid'; }
		return minCrossings;
	}
	
function theCrosses(wd) {
		let val = 0;
		for (let i=0; i< wd.length; i++)
			 if (!(wd[i] == '-')) { val = val+1; }
		
		return braidCrosses = val;
	}
	
function word2Numbers(wd) {
		let result = [];
		let j = 0;
		for (let i=0; i< wd.length; i++)
			{if (!(wd[i] == '-')) 
			 	{	result[j] = wd[i]/1.0;  
			 	    j = j+1;
			 	}
			 else {	i = i+1; 
			 		result[j] = -wd[i]/1.0;
			 		j = j+1;
			 	}
			}
		return braidAsNums = result;
	}
	
function findStrands(wd) {
		let result = 0;
		word2Numbers(wd);
		for (let i=0; i< braidAsNums.length; i++)
			{
				result = max(result,abs(braidAsNums[i])); 
			}
		return numStrands = result+1;
	}
	
function defaultStrands(wd) {
		theCrosses(wd);
		findStrands(wd);
		word2Numbers(wd);
		//console.log("braidCrosses, numStrands = ",braidCrosses, numStrands);
    	let rad = [];
    	let arg = [];
    	rad[0]  = 90;
    	arg[0]  = 0;
    	let aux = 0;
    	let is	= 0;
    	let jss = 1;
    	const da = 2*pi/braidCrosses;
       for (let i = 1; i < numStrands; i++)
       	{ rad[i] = rad[i-1]*exp(-1.5/numStrands); }
       	 	
       for (let j = 1; j < frq*braidCrosses+1; j++)
       	{ arg[j] = arg[j-1] + da/frq;	
       	  //console.log(" arg[j] = ", arg[j]); // first cross from arg[0] to arg[1]
         }
         
       for (let i = 0; i < numStrands; i++)
       {	if (i==0) arg[0] = 0.02; else arg[0] = 0;
        	for (let j = 0; j < frq*braidCrosses+1; j++)
		 {	
			cst1[i][j] = [rad[i]*cos(arg[j]), rad[i]*sin(arg[j])];
			cst2[i][j] = cst1[i][j];
			aux = [-sin(arg[j]), cos(arg[j])];
			dst1[i][j] = scalTimesVec1( BezTang*rad[i]*da/3/frq, aux);
			dst2[i][j] = dst1[i][j];	
		 }
	   }
	   
	   for (let js = 0; js < braidCrosses; js++)
	   	{
	   		is = abs(braidAsNums[js]);
	   		jss = frq*js;
	   		//console.log("is,js =",[is,js],[cst2[is-1][jss+1], cst2[is][jss+1]]);
	   		[cst2[is-1][jss+1], cst2[is][jss+1]] = swap(cst2[is-1][jss+1], cst2[is][jss+1]);
	   		[dst2[is-1][jss+1], dst2[is][jss+1]] = swap(dst2[is-1][jss+1], dst2[is][jss+1]);
	   		//dst2[is-1][jss+1] = scalTimesVec1(rad[is-1]/rad[is] , dst2[is-1][jss+1]);
	   		//dst2[is][jss+1] = scalTimesVec1(rad[is]/rad[is-1] , dst2[is][jss+1]);
	   		//console.log("is,js =",[is,js],[cst2[is-1][jss+1], cst2[is][jss+1]]);
	   		if (braidAsNums[js] > 0)
	   			{brd1[js] = [cst1[is-1][jss],cst2[is-1][jss+1]];
	   			 brd2[js] = [dst1[is-1][jss],dst2[is-1][jss+1]];
	   			}
	   		else
	   			{brd1[js] = [cst1[is][jss],cst2[is][jss+1]];
	   			 brd2[js] = [dst1[is][jss],dst2[is][jss+1]];
	   			}
	   	}
	}
	
function analysePerm(abc) {
	let abcOK = true;
	let cycls = [];
	let aux	  = [];
	let inva  = [];
	let cycln = [];
	let anf	  = 0;
	let k 	  = 0;
	let iter  = 0;
	
	//for (let i=0; i < abc.length; i++) { aux[i] = [];}
	
	for (let i=0; i < abc.length; i++) 
		{
		 abcOK  = abcOK && abc.includes(i);
		 aux[i] = abc[i]; inva[abc[i]] = i;
		 cycln[i] = 0;
		 } // is permutation
	
	if (abcOK)
	for (let s=0; s < abc.length; s++)   // finds and counts cycle of length s+1
	for (let i=0; i < abc.length; i++)
		{ 
			if (aux[i] > -1)     // leaves out points of earlier cycles
			{	anf  = abc[i]; 
				iter = abc[anf];
				k = 0;
				while (k < s) { iter = abc[iter]; k = k+1; } // iterate s-times more
				//console.log("i, anf, iter = ",i,anf,iter);
				if (iter == anf)	
					{ cycln[s] = cycln[s] + 1; 
				      aux[i] = -1;
				      for (let k=0; k < s; k++) { iter = abc[iter]; aux[inva[iter]] = -1; }
					}
			}
		}
	return [abcOK, cycln];
}
	
function checkComponents(wd) {
		let wdOK = checkForBraidword(wd);
		let wdCrosses		= [];
		let currentStrands 	= [];
		const iniStrands 	= [];
		perm				= [];
		
		function crossAction(nc) { // nc = 1 ... 9
		   [currentStrands[nc-1],currentStrands[nc]] = swap(currentStrands[nc-1],currentStrands[nc]);
		}
		
		if (wdOK)
		{
			wdCrosses		= word2Numbers(wd);
			numStrands 		= findStrands(wd);
			braidCrosses	= theCrosses(wd);
			for (let i = 0; i < numStrands; i++) {currentStrands[i] = i; iniStrands[i]=i;}
			
			let j = 0; 
			while (j < braidCrosses + 1)
			  {
				if (j == braidCrosses)
					{	for (let k=0; k < numStrands; k++)
							{ perm[k] = currentStrands[k]; }
					}
				crossAction(abs(wdCrosses[j%braidCrosses]));
				j = (j+1);
			  }
		}
		
		let ana  = analysePerm(perm);
		let sana = 0;
		if (ana[0]) 
		{
			for (let k=0; k<ana[1].length; k++) {sana = sana + ana[1][k];}
		
			// console.log("checkComponents, perm", wd,numStrands,braidCrosses,perm,sana);
			// if (sana > 1) {console.log(" Link in Nr choose", choose, sana);}
		}   else { sana = NaN; console.log("Not a braid word"); }
		return sana;
	}
	
function makeTXTforStrands()
{
	txtStrands 	= '';
	 	
	for (let i=0; i < numStrands; i++)
	for (let j=0; j < frq*braidCrosses; j++)
	{	
	// left
	px = cst1[i][j][0];
	py = cst1[i][j][1];
	mx = dst1[i][j][0];
	my = dst1[i][j][1];
	hx = px + mx;
	hy = py + my;
	// right
	qx = cst2[i][j+1][0];
	qy = cst2[i][j+1][1];
	nx = dst2[i][j+1][0];
	ny = dst2[i][j+1][1];
	kx = qx - nx;
	ky = qy - ny;
	// handle y-up-down:			
	[py,hy,ky,qy] = scalTimesVec1(-1, [py,hy,ky,qy]);
	txtStrands += 'M' +px + ' '+ py;
    txtStrands += 'C' +hx + ' '+ hy;
    txtStrands += ' ' +kx + ' '+ ky;
    txtStrands += ' ' +qx + ' '+ qy;
	}
	
	//	console.log("txtStrands = ",txtStrands);
	pathUnder.setAttribute( "d", txtStrands );
	pathStrands.setAttribute( "d" , txtStrands );
	
	txtBridges = '';
	
	for (let js = 0; js < braidCrosses; js++)
	{	
	// left
	px = brd1[js][0][0];
	py = brd1[js][0][1];
	mx = brd2[js][0][0];
	my = brd2[js][0][1];
	hx = px + mx;
	hy = py + my;
	// right
	qx = brd1[js][1][0];
	qy = brd1[js][1][1];
	nx = brd2[js][1][0];
	ny = brd2[js][1][1];
	kx = qx - nx;
	ky = qy - ny;
	// handle y-up-down:			
	[py,hy,ky,qy] = scalTimesVec1(-1, [py,hy,ky,qy]);
	txtBridges += 'M' +px + ' '+ py;
    txtBridges += 'C' +hx + ' '+ hy;
    txtBridges += ' ' +kx + ' '+ ky;
    txtBridges += ' ' +qx + ' '+ qy;
	}	
	
	bridgesUnder.setAttribute( "d" , txtBridges );
	bridgesOver.setAttribute( "d" , txtBridges );
}




function render() {
		inputParamWrd.value = theBraidWord; // input field description

		div.appendChild(svgEl);
		currentObject.innerHTML=errorMsg+"minimal crossings = "+minCrosses(choose)+"<br>braid crossings = "+braidCrosses+"<br>number of components = "+checkComponents(theBraidWord);
	}

/* =========== listener and response ===================== */

function knotNumberUp()  {
    wordOK = false;
    errorMsg	 = '';
    //checkboxUp10.checked = false;
    choose = min(choose +10, 250);
    inputParam1.value = choose;
    theBraidWord = braidList[choose];
	defaultStrands(theBraidWord);
		makeTXTforStrands();
		disableButtons();
	
	render();
    }
    
function knotNumberDown() {
    wordOK = false;
    errorMsg	 = '';
    //checkboxDwn10.checked = false;
    choose = max(choose -10, 1);
    inputParam1.value = choose;
    theBraidWord = braidList[choose];
	defaultStrands(theBraidWord);
		makeTXTforStrands();
		disableButtons();
	
	render();
    }
    
const toggleBackground = (() => {
    if ( checkboxBackgrd.checked ) {
         mybackground = "white"; myforeground ="black";}
    else {mybackground = "black"; myforeground ="white"; }; 
    if (mybackground == "black")	{
    	pathStrands.setAttribute( 'stroke' , '#FFFF00' );
    	bridgesOver.setAttribute( 'stroke' , '#FFFF00' );
		pathUnder.setAttribute( 'stroke' , '#555555' );
    	bridgesUnder.setAttribute( 'stroke' , '#555555' );
    } else {
    	pathStrands.setAttribute( 'stroke' , '#555555' );
    	bridgesOver.setAttribute( 'stroke' , '#555555' );
		pathUnder.setAttribute( 'stroke' , '#FFFF77' );
    	bridgesUnder.setAttribute( 'stroke' , '#FFFF77' );
    }
    
    title.style.backgroundColor = mybackground;
    title.style.color = myforeground;
    svgArea.style.backgroundColor = mybackground;
    svgArea.style.color = myforeground;
    mySVG.style.backgroundColor = mybackground;
    mySVG.style.color = myforeground;   

    menu.style.backgroundColor = mybackground;
    menu.style.color = myforeground;
    description.style.backgroundColor = mybackground;
    description.style.color = myforeground;
    copyright.style.backgroundColor = mybackground;
    copyright.style.color = myforeground;
    
	render();
    });
    
function disableButtons()	{

		if (choose < 2) 
			{ buttonDwn1.disabled = true; buttonDwn10.disabled = true; 
			}
		else { buttonDwn1.disabled = false; buttonDwn10.disabled = false; 
			}
		if (choose > 248) 
			{ buttonUp1.disabled = true; buttonUp10.disabled = true; 
			}
		else { buttonUp1.disabled = false; buttonUp10.disabled = false; 
			}

}
    
 
inputParam1.value = choose;
function getLevel() {
        wordOK = false;
        errorMsg	 = '';
        if (inputknotinfo.checked)
			{ braidList = bw; }
		else { braidList = bL; }
		choose 	= min(249, max(1, inputParam1.value));
		inputParam1.value = choose;
		theBraidWord = braidList[choose];
	/*	word2Numbers(theBraidWord);
		console.log( "word2Numbers(theBraidWord)=", braidAsNums);  */
		defaultStrands(theBraidWord);
		makeTXTforStrands();
		checkComponents(theBraidWord);
		disableButtons();
		
		render();
}

inputParamWrd.value = theBraidWord; 
function useTheInputBraid() {
 		tword  = inputParamWrd.value;
 		wordOK = checkForBraidword(tword);
 		if (wordOK) { 
 				errorMsg	 = '';
 				theBraidWord = tword 
 				defaultStrands(theBraidWord);
				makeTXTforStrands();
 		}
		else { errorMsg	 = "Not a braid word <br>";
		       theBraidWord = tword;
			 } 
		checkComponents(theBraidWord);
		render();
}

inputParam3.value = BezTang;
function BezierTangents() {
		BezTang = min(2.5, max(0.1,inputParam3.value));
		inputParam3.value = BezTang;
		defaultStrands(theBraidWord);
		makeTXTforStrands();
		
		render();
}

function braidUp() {
	inputParam1.value = choose+1;
	getLevel();
	//checkboxUp1.checked = false;
}

function braidDown() {
	inputParam1.value = choose-1;
	//checkboxDwn1.checked = false;
	getLevel();
}

function bezierUp() {
	inputParam3.value = round(10*BezTang + 1)/10;
	//checkboxUp.checked = false;
	BezierTangents();
}

function bezierDown() {
	inputParam3.value = round(10*BezTang - 1)/10;
	//checkboxDwn.checked = false;
	BezierTangents();
}

const init = (() => {
		initializeBraidList();
		if (inputknotinfo.checked)
			{ braidList = bw; }
		else { braidList = bL; }
		inputParam1.value = choose;
		inputParam3.value = BezTang;
		theBraidWord = braidList[choose];
		defaultStrands(theBraidWord);
		makeTXTforStrands();
		disableButtons();
	
		render();      
});


init();

inputParam1.addEventListener("change", getLevel); 
inputParamWrd.addEventListener("change", useTheInputBraid, false);
inputParam3.addEventListener("change", BezierTangents);
checkboxBackgrd.addEventListener ('change', toggleBackground , false);
buttonUp1.addEventListener('click', braidUp);
buttonDwn1.addEventListener('click', braidDown);
buttonUp10.addEventListener('click', knotNumberUp);
buttonDwn10.addEventListener('click', knotNumberDown);
buttonUp.addEventListener('click', bezierUp);
buttonDwn.addEventListener('click', bezierDown);
inputknotinfo.addEventListener("change", getLevel);
inputvJones.addEventListener("change", getLevel);
//checkboxUp10.addEventListener ('change', knotNumberUp , false);
//checkboxDwn10.addEventListener ('change', knotNumberDown , false); 
//checkboxUp1.addEventListener ('change', braidUp , false);
//checkboxDwn1.addEventListener ('change', braidDown , false);
//checkboxUp.addEventListener ('change', bezierUp , false);
//checkboxDwn.addEventListener ('change', bezierDown , false);

};