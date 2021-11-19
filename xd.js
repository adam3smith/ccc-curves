// github https://github.com/xahlee/xahdraw.js
"use strict";
// xd is the namespace for this module. All functions/variables starts with “xd.”
var xd = {
    "version": "2017-10-30",
    // dot product of 2 vectors
    dot: (function (u, v) { return ((u[0] * v[0]) + (u[1] * v[1])); }),
    //  norm of a vector
    norm: (function (v) { return (Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2))); }),
    normalize: (function (v) {
        // computes unit vector
        // v cannot be zero vector
        if (v[0] === 0 && v[1] === 0) {
            throw "Error 73096: zero vector in xd.normalize().";
        }
        else {
            return (function (x) { return [v[0] / x, v[1] / x]; })(xd.norm(v));
        }
    }),
    // return the angle of 2 vectors
    vectorAngle: (function (a, b) { return (Math.acos(xd.dot(a, b) / (xd.norm(a) * xd.norm(b)))); }),
    // add vectors
    vectAdd: (function (v1, v2) { return [v1[0] + v2[0], v1[1] + v2[1]]; }),
    // vectors substraction
    vectSubstract: (function (v1, v2) { return [v1[0] - v2[0], v1[1] - v2[1]]; }),
    // scale vector
    vectScale: (function (v, s) { return [v[0] * s, v[1] * s]; }),
    // radian to degree
    radianToDegree: (function (x) { return (x * 360 / (2 * Math.PI)); }),
    // degree to radian
    degreeToRadian: (function (x) { return (x * 2 * Math.PI / 360); }),
    createSVG: (function (φw, φh, φviewBox, φpoint) {
        /* [
         create svg element.
          φw - View port width. optional
          φh - View port height. optional
          φviewBox - φview box attributes. [x y w h]. optional
          φpoint - array of the form [x,y]. coordinates for position inside outer svg
         @return - SVG element.
         ] */
        var ξsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        if (φw) {
            ξsvg.setAttribute("width", φw.toString());
        }
        if (φh) {
            ξsvg.setAttribute("height", φh.toString());
        }
        if (φviewBox) {
            ξsvg.setAttribute("viewBox", φviewBox[0] + " " + φviewBox[1] + " " + φviewBox[2] + " " + φviewBox[3]);
        }
        if (φpoint) {
            (ξsvg.setAttribute("x", φpoint[0].toString()));
            (ξsvg.setAttribute("y", φpoint[1].toString()));
        }
        return ξsvg;
    }),
    drawCircle: (function (φsvgEle, φcenter, φr, φstyle) {
        /**
         * draw circle, append to φsvgEle. Returns the append circle. use 「undefined」 for φsvgEle if you don't want it to be attached to anything.
         * @param φsvgEle - SVG container element.
         * @param φcenter - circle's center. arrary of the form [x,y]
         * @param φr - radius
         * @param φstyle - the value for style attribute. optional
         * @return - SVG circle element
         */
        var ξcir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ξcir.setAttribute("cx", φcenter[0].toString());
        ξcir.setAttribute("cy", φcenter[1].toString());
        ξcir.setAttribute("r", φr.toString());
        if (φstyle) {
            ξcir.setAttribute("style", φstyle);
        }
        if (φsvgEle) {
            φsvgEle.appendChild(ξcir);
        }
        return ξcir;
    }),
    drawPath: (function (φsvgEle, φpoints, φstyle) {
        /**
         * generate a svg path, append it to φsvgEle.
         * @param φsvgEle - HTML element. Result will be appended to it.
         * @param φpoints - array of the form [[x1,y1], [x2,y2], …]
         * @param φstyle - a string for the style attribute. Default to 「"stroke:black"」
         * @return - svg path element
         */
        // issues. default style is fill:black. Usually not what we want.
        var ξpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        ξpath.setAttribute("d", "M " + φpoints.join(" L "));
        if (φstyle) {
            ξpath.setAttribute("style", φstyle);
        }
        if (φsvgEle) {
            φsvgEle.appendChild(ξpath);
        }
        return ξpath;
    }),
    createGroup: (function (φid) {
        /**
         * create svg group element “g”
         * @param {string=} φid - id. optional. Must start with letter.
         * @return - svg group element “g”
         */
        var ξg = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if (φid) {
            ξg.setAttribute("id", φid);
        }
        return ξg;
    }),
    /**
     * return string of the form " translate(φx, φy) " for use with svg transform attribute.
     * @return {string} - " translate(φx, φy) "
     */
    translateString: (function (φx, φy) { return (" translate(" + φx + " " + φy + ") "); }),
    /**
     * return string of the form " scale(φx φy) " for use with svg transform attribute.
     * @return {string} - " scale(φx φy) "
     */
    scaleString: (function (φx, φy) { return (" scale(" + φx + " " + φy + ") "); }),
    drawRect: (function (φsvgEle, φposition, φwh, φrxry, φstyle) {
        /**
         * create a svg rect element.
         * @param φsvgEle - HTML element. Result will be appended to it.
         * @param {array} - φposition - [x,y] for top left corner of rect.
         * @param {array} - φwh - [width,height] of rect.
         * @param {array} - φrxry - [x,y] coner radius of rect.
         * @param {string} - φstyle - value for style attribute
         * @return - svg rect element
         */
        var ξrect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        ξrect.setAttribute("x", φposition[0].toString());
        ξrect.setAttribute("y", φposition[1].toString());
        ξrect.setAttribute("width", φwh[0].toString());
        ξrect.setAttribute("height", φwh[1].toString());
        if (φrxry) {
            ξrect.setAttribute("rx", φrxry[0].toString());
            ξrect.setAttribute("ry", φrxry[1].toString());
        }
        if (φstyle) {
            (ξrect.setAttribute("style", φstyle));
        }
        if (φsvgEle) {
            φsvgEle.appendChild(ξrect);
        }
        return ξrect;
    }),
    drawGrids: (function (φsvgEle, φxMinMaxStep, φyMinMaxStep, φstyle) {
        // draw horizontal grid lines, and vertical grid lines
        // φxMinMaxStep is of the form [xMin, xMax, xStep]
        // if the xStep is not given, then no vertical grids are drawn.
        // similar for φyMinMaxStep
        // append svg elements to φsvgEle
        // returns a array of svg path element. each represents a line
        var ξxMin = φxMinMaxStep[0];
        var ξxMax = φxMinMaxStep[1];
        var ξxStep = φxMinMaxStep[2];
        var ξyMin = φyMinMaxStep[0];
        var ξyMax = φyMinMaxStep[1];
        var ξyStep = φyMinMaxStep[2];
        var ξxCount = (ξxMax - ξxMin) / ξxStep;
        var ξyCount = (ξyMax - ξyMin) / ξyStep;
        var ξresult = [];
        if (ξxStep) {
            for (var ξi = 0; ξi <= ξxCount; ξi++) {
                var ξpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                var ξx = ξxMin + ξi * ξxStep;
                ξpath.setAttribute("d", "M " + ξx + " " + ξyMin + " L " + ξx + " " + ξyMax);
                if (φstyle) {
                    ξpath.setAttribute("style", φstyle);
                }
                if (φsvgEle) {
                    φsvgEle.appendChild(ξpath);
                }
                ξresult.push(ξpath);
            }
        }
        if (ξyStep) {
            for (var ξi = 0; ξi <= ξyCount; ξi++) {
                var ξpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                var ξy = ξyMin + ξi * ξyStep;
                ξpath.setAttribute("d", "M " + ξxMin + " " + ξy + " L " + ξxMax + " " + ξy);
                if (φstyle) {
                    ξpath.setAttribute("style", φstyle);
                }
                if (φsvgEle) {
                    φsvgEle.appendChild(ξpath);
                }
                ξresult.push(ξpath);
            }
        }
        return ξresult;
    }),
    drawText: (function (φsvgEle, φposition, φtext, φflipUpDownQ, φstyle) {
        /**
         * create a svg text element
         * @param φposition. text anchor position. [x,y].
         * @return - svg text element
         */
        var ξx = φposition[0];
        var ξy = φposition[1];
        var ξtextEle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        ξtextEle.setAttribute("x", ξx.toString());
        ξtextEle.setAttribute("y", ξy.toString());
        if (φflipUpDownQ) {
            ξtextEle.setAttribute("transform", (xd.translateString(0, ξy) +
                xd.scaleString(1, -1) +
                xd.translateString(0, -ξy)));
        }
        ξtextEle.appendChild(document.createTextNode(φtext));
        if (φstyle) {
            ξtextEle.setAttribute("style", φstyle);
        }
        if (φsvgEle) {
            φsvgEle.appendChild(ξtextEle);
        }
        return ξtextEle;
    }),
    drawXLabels: (function (φsvgEle, φxMinMax, φyCoord, φincrement, φflipUpDownQ, φstyle) {
        /**
         * generate numerical labels for the x axes
         * @param φxMinMax is a vector [xmin, xmax]
         * @param φflipUpDownQ is boolean. if true, attach transformation to each element, so text is flipped at φxMinMax
         * @param φstyle is a string for style attribute
         * @return {array} - array of text elements
         */
        var ξxMin = φxMinMax[0];
        var ξxMax = φxMinMax[1];
        var ξtotal = (ξxMax - ξxMin) / φincrement + 1;
        var ξresult = [], ξxCoord, ξtext;
        for (var ξi = 0; ξi <= ξtotal; ξi++) {
            ξxCoord = ξxMin + ξi * φincrement;
            ξtext = xd.drawText(φsvgEle, [ξxCoord, φyCoord], ξxCoord.toString(), φflipUpDownQ, φstyle);
            ξresult.push(ξtext);
        }
        return ξresult;
    }),
    /**
     * @return {array} - of text elements
     */
    drawYLabels: (function (φsvgEle, φxCoord, φyMinMax, φincrement, φflipUpDownQ, φstyle) {
        var ξyMin = φyMinMax[0];
        var ξyMax = φyMinMax[1];
        var ξtotal = (ξyMax - ξyMin) / φincrement + 1;
        var ξresult = [], ξi, ξyCoord, ξtext;
        for (ξi = 0; ξi <= ξtotal; ξi++) {
            ξyCoord = ξyMin + ξi * φincrement;
            ξtext = xd.drawText(φsvgEle, [φxCoord, ξyCoord], ξyCoord.toString(), φflipUpDownQ, φstyle);
            ξresult.push(ξtext);
        }
        return ξresult;
    }),
    // /**
    //  * @return “array” of 4 elements. [x path, y path, [x axis labels], [x axis labels]]
    //  * @param φstyle is optional
    //  * @return “array” of 4 elements. [x path, y path, [x axis labels], [x axis labels]]
    //  */
    // xd.drawAxes = function (φxmin, φxmax, φymin, φymax, φorigin, φstyle) {
    //     return "todo"
    // }
    /**
    // create array
    // range(n) creates a array from 1 to n, including n
    // range(n,m) creates a array from n to m, by step of 1. May not include m, if n or m are not integer.
    // range(n,m,delta) creates a array from n to m, by step of delta. May not include m
     */
    range: (function (min, max, delta) {
        if (delta === void 0) { delta = 1; }
        // return a array from min to max, inclusive, in steps of delta.
        // if delta is not integer, then max may not be included
        // version 2017-04-20
        var arr = [];
        var myStepCount = Math.floor((max - min) / delta);
        for (var ii = 0; ii <= myStepCount; ii++) {
            arr.push(ii * delta + min);
        }
        return arr;
    }),
    addPoints: (function (φpts, φf, φmaxAngleRad, φrecurseLevel) {
        /**
         * given a list of points on a curve, add points so it's smoother. Modifies the input array.
         * @param {array} - φpts - each element is of the form [t,[x,y]] where t is a parameter and the [x,y] is the point
         * @param {function} - φf - is a function, that takes 1 number and returns array [x,y]
         * @param {number} - φmaxAngleRad - in radians. if a path's angle at point is greater than this, insert point.
         * @param {number} - φrecurseLevel - is positive int or 0. recurse no more that that many times.
         * @return {array} - undefinied
         */
        if (φrecurseLevel <= 0) {
            return φpts;
        }
        if (φpts.length < 2) {
            throw "Logic error. less than 2 points to work with";
        }
        var vects = [];
        var vectsCount = φpts.length - 1;
        for (var i_1 = 0; i_1 < vectsCount; i_1++) {
            vects.push(xd.vectSubstract(φpts[i_1 + 1][1], φpts[i_1][1]));
        }
        var angles = [];
        var anglesCount = vectsCount - 1;
        for (var i_2 = 0; i_2 < anglesCount; i_2++) {
            angles.push(xd.vectorAngle(vects[i_2], vects[i_2 + 1]));
        }
        // check the the last vector
        var i = anglesCount - 1;
        if (angles[i] > φmaxAngleRad) {
            var pBefore = φpts[i + 1];
            var pAfter = φpts[i + 2];
            var pMid = (function (t) { return [t, φf(t)]; })((pBefore[0] + pAfter[0]) / 2);
            φpts.pop();
            φpts.push(pMid, pAfter);
        }
        // if angle is small, add point
        // for nth angle, break the vector before it
        for (var i_3 = anglesCount - 1; i_3 >= 0; i_3--) {
            if (angles[i_3] > φmaxAngleRad) {
                var pBefore = φpts[i_3];
                var pAfter = φpts[i_3 + 1];
                var pMid = (function (t) { return [t, φf(t)]; })((pBefore[0] + pAfter[0]) / 2);
                // Array.prototype.splice.apply(φpts, [i, 2].concat([ pBefore, pMid, pAfter ]))
                φpts.splice(i_3 + 1, 0, pMid);
            }
        }
        xd.addPoints(φpts, φf, φmaxAngleRad, φrecurseLevel - 1);
    }),
    /**
     * plot a math function
     * @param φsvgEle - svg element to attach to.
     * @param φf - a function of 1 parameter, returns [x,y]
     * @param φxminmax - [min,max,step] for x axes
     * @param φyminmax - [min,max,step] for y axes
     * @param φoptions - a object. Each key value pair is a named option.
     * @return - SVG element.
     */
    parametricPlot: (function (φsvgEle, φf, φtminmax, φxminmax, φyminmax, φoptions) {
        var ξoptions = φoptions || {};
        var ξmaxAngle = ξoptions["maxAngle"] || 5;
        var ξmaxRecursionCount = (typeof ξoptions["maxRecursionCount"] === "number" ? ξoptions["maxRecursionCount"] : 20); // must accept 0
        var xmin = φxminmax[0];
        var xmax = φxminmax[1];
        var ymin = φyminmax[0];
        var ymax = φyminmax[1];
        var xwidth = xmax - xmin;
        var ywidth = ymax - ymin;
        var ξsvgBox = xd.createSVG(undefined, undefined, [xmin, ymin, xwidth, ywidth]);
        var gp = xd.createGroup("x93106");
        ξsvgBox.appendChild(gp);
        xd.drawGrids(gp, [xmin, xmax, (xmax - xmin) / 10], [ymin, ymax, (ymax - ymin) / 10], "stroke:grey;stroke-width:.05%");
        xd.drawXLabels(gp, [xmin, xmax], ymin + (ymax - ymin) * .2, 2, true, "font-size:2%");
        xd.drawYLabels(gp, 5, [ymin, ymax], 2, true, "font-size:2%");
        var ξdata = xd.range(φtminmax[0], φtminmax[1], φtminmax[2]).map(function (t) { return [t, φf(t)]; });
        xd.addPoints(ξdata, φf, ξmaxAngle * 2 * Math.PI / 360, ξmaxRecursionCount);
        var points = ξdata.map(function (x) { return x[1]; });
        points.map(function (x) { xd.drawCircle(gp, x, 0.05, "stroke:red;stroke-width:.03;fill:none;"); });
        xd.drawPath(gp, points, "stroke:blue;stroke-width:.02;fill:green;fill:none;");
        gp.setAttribute("transform", xd.translateString(0, 2 * ymin + ywidth) + xd.scaleString(1, -1));
        return φsvgEle.appendChild(ξsvgBox);
    }),
    /**
     * plot a math function
     * @param φsvgEle - svg element to attach to.
     * @param φf - a function of 1 parameter, returns y
     * @param φxminmax - [min,max,step] for x axes
     * @param φyminmax - [min,max,step] for y axes
     * @param φoptions - a object. Each key value pair is a named option.
     * @return - SVG element.
     */
    plot: (function (φsvgEle, φf, φxminmax, φyminmax, φoptions) {
        return xd.parametricPlot(φsvgEle, function (x) { return [x, φf(x)]; }, φxminmax, φxminmax, φyminmax, φoptions);
    }),
};
