var base = require("../Core/BaseSolver");
var reader = function () {
    var test = new base.solver.BaseSolver("input.txt");
    console.log(test.reader.getFile());
};
reader();
