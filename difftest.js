var diff = require('diff');

var merge = function (baseStr, freshStr) {
  var changes = diff.diffChars(baseStr, freshStr);
  console.log('CHANGES:', changes);
  
  var newStr = '';
  changes.forEach(function (part) {
    if (!part.removed) {
      newStr += part.value;
    }
  });
  return newStr;
}

var str = 'The cat sat on the mat';
str = merge(str, 'The dog sat on the mat');
//str = merge(str, 'The cat sat on the mat and rolled');
//str = merge(str, 'The cat sat on the mattress');

console.log(str);