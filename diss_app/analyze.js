var plato = require('plato');

var files = [
  './src/**/*.js'
];
var outputDir = './output';
var options = {
  title: 'Static Code Analysis'
};

var callback = function (report){
  var overview = plato.getOverviewReport(report);

  var halstead = {
    bugs: 0,
    difficulty: 0,
    effort: 0,
    length: 0,
    time: 0,
    vocabulary: 0,
    volume:0,
    operands: {
      distinct: 0,
      total: 0
    },
    operators: {
      distinct: 0, 
      total: 0
    }
  }
  
  var cyclomaticComplexity = 0;
  var loc = 0;

  console.log('\n'+"Files: ");
  overview.reports.forEach(report => {
    console.log(" " + report.info.file);
    
    halstead.bugs += report.complexity.methodAggregate.halstead.bugs;
    halstead.difficulty += report.complexity.methodAggregate.halstead.difficulty;
    halstead.effort += report.complexity.methodAggregate.halstead.effort;
    halstead.length += report.complexity.methodAggregate.halstead.length;
    halstead.time += report.complexity.methodAggregate.halstead.time;
    halstead.vocabulary += report.complexity.methodAggregate.halstead.vocabulary;
    halstead.volume += report.complexity.methodAggregate.halstead.volume;
    halstead.operands.distinct += report.complexity.methodAggregate.halstead.operands.distinct;
    halstead.operands.total += report.complexity.methodAggregate.halstead.operands.total;
    halstead.operators.distinct += report.complexity.methodAggregate.halstead.operators.distinct;
    halstead.operators.total += report.complexity.methodAggregate.halstead.operators.total;

    cyclomaticComplexity += report.complexity.methodAggregate.cyclomatic;
    loc += report.complexity.methodAggregate.sloc.physical;
  }) 
  console.log("Number of files: " + overview.reports.length);
  console.log(`
  Metric Avarage
  ----------------------

  Halstead: 
    bugs: ${halstead.bugs/overview.reports.length}
    difficulty: ${halstead.difficulty/overview.reports.length}
    effort: ${halstead.effort/overview.reports.length}
    length: ${halstead.length/overview.reports.length}
    time: ${halstead.time/overview.reports.length}
    vocabulary: ${halstead.vocabulary/overview.reports.length}
    volume: ${halstead.volume/overview.reports.length}
    operands.distinct: ${halstead.operands.distinct/overview.reports.length}
    operands.total: ${halstead.operands.total/overview.reports.length}
    operators.distinct: ${halstead.operators.distinct/overview.reports.length}
    operators.total: ${halstead.operators.total/overview.reports.length}

  Complexity: ${cyclomaticComplexity/overview.reports.length}
  LOC: ${loc/overview.reports.length} 

  ----------------------
  `)
};

plato.inspect(files, outputDir, options, callback);