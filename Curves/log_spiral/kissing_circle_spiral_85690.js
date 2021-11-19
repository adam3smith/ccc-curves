"use strict";
// 2017-12-21
{
    "use strict";
    var svgPlaceEleID = "svg_08531";
    // equiangular spiral angle
    var g_angle_param_1 = xd.degreeToRadian(80);
    // fx is function. returns the form [x1,y1]
    var fx_1 = (function (t) { return (xd.vectScale([Math.cos(t), Math.sin(t)], Math.pow(Math.E, (t / Math.tan(g_angle_param_1))))); });
    /* (array, each is of the form [t, [x,y]]) */
    var g_points_data = xd.range(0, 10, 2).map((function (x) { return [x, fx_1(x)]; }));
    var svgc = xd.createSVG(undefined, undefined, [-1 * 6, -1 * 4, 2 * 6, 2 * 4.5]);
    svgc.setAttribute("width","600");
	svgc.setAttribute("height","500");
    svgc.setAttribute("viewBox"," -6 -4 9 9");
    {
        //
        var g1_1 = xd.createGroup();
        // curve path
        xd.drawPath(g1_1, g_points_data.map((function (x) { return x[1]; })), "");
        // dots on curve
        g_points_data.forEach((function (x) { xd.drawCircle(g1_1, x[1], 0.05, "fill :red"); }));
        g1_1.style = "stroke:red;stroke-width:0.2%";
        svgc.appendChild(g1_1);
    }
    var g_max_bend_angle = xd.degreeToRadian(5);
    xd.addPoints(g_points_data, fx_1, g_max_bend_angle, 3);
    {
        var g2_1 = xd.createGroup();
        g_points_data.forEach((function (x) { xd.drawCircle(g2_1, x[1], 0.05); }));
        xd.drawPath(g2_1, g_points_data.map((function (x) { return x[1]; })));
        g2_1.style = "stroke:cyan;stroke-width:0.2%; fill :none";
        svgc.appendChild(g2_1);
    }
    document.getElementById(svgPlaceEleID).appendChild(svgc);
    // xd.plot (
    //     document.getElementById(svgPlaceEleID),
    //     function ff (x) { return Math.sin(x) ; },
    //     [0,7],
    //     [-2,2]);
}
