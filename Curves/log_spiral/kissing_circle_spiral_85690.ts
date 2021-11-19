// 2017-12-21

{

"use strict";

const svgPlaceEleID = "svg_08531";

// equiangular spiral angle
const g_angle_param = xd.degreeToRadian(80);

// fx is function. returns the form [x1,y1]
const fx = ((t) => ( xd.vectScale( [Math.cos(t) , Math.sin(t) ], Math.pow( Math.E, (t / Math.tan(g_angle_param))) ) )) ;

/* (array, each is of the form [t, [x,y]]) */
const g_points_data = xd.range (0, 10, 2).map( (x => [x, fx(x)]) );

const svgc = xd.createSVG(undefined, undefined, [-1* 6 ,-1* 4 ,2* 6 ,2* 4.5 ]);

{
    //
const g1 = xd.createGroup();
 // curve path
xd.drawPath (g1, g_points_data.map( (x => x[1]) ), "");

 // dots on curve
g_points_data.forEach( (x => { xd.drawCircle (g1, x[1], 0.05, "fill :red") })  );

 g1.style = "stroke:red;stroke-width:0.2%";

svgc.appendChild(g1);

}

const g_max_bend_angle = xd.degreeToRadian (5);

xd.addPoints (g_points_data, fx, g_max_bend_angle, 3);

{
const g2 = xd.createGroup();
g_points_data.forEach( (x => { xd.drawCircle (g2, x[1], 0.05) }) );
xd.drawPath (g2, g_points_data.map( (x => x[1]) ));
g2.style = "stroke:blue;stroke-width:0.2%; fill :none";
svgc.appendChild(g2);
}

document.getElementById(svgPlaceEleID).appendChild(svgc);

// xd.plot (
//     document.getElementById(svgPlaceEleID),
//     function ff (x) { return Math.sin(x) ; },
//     [0,7],
//     [-2,2]);

}

