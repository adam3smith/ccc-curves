let arr = [3,4,1,6];
//let x = Math.max(...arr);
let x = minArr(arr);
console.log("x = ", x);
let a = [3.1,5.9];
let yy = Math.floor(...a);  // not understood
let y = floor(a);
console.log("floor:  y = ", y,yy, floor([3.1,5.6,-4.3]));
console.log("swap stuff ",swap(arr,a));
z = ["M", 2,5.1,7.2];  // M is a variable name, "M" is a string
zz = z.join(" ");
console.log(".join() ", z,zz, " l=",zz.length);
zz += zz;
console.log(".join()+= ", z,zz, " l=",zz.length);
console.log("abs: ",abs(-5),"=",5,"  ",abs([-3,4,-6]));
console.log("quadEq: ", quadEq(3,4,5));
console.log("applyArray: ",applyArray(cube,3), applyArray(cube,[-2,4]));
console.log("round: ", round(4.11), round([5.1,pi]));
console.log("sgn: ",sgn(-1), sgn([-2,0,4,-5]));
console.log("pow4: ",pow4([2,3]));
console.log("pow7: ",pow7(3),pow7([2,3]));
console.log("exp: ",exp([1,2]));
console.log("tan: ",tan([pi/4,pi]));
console.log("sinh: ",sinh([1,-1]));