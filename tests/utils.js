const _ = require("lodash");

/**
 * count node in ast tree by type
 * @description not work for estree !!!
 * 
 * @param {Object} ast 
 * @param {String} type 
 * @returns {number} count
 */
function walkAstCountType (ast, type) {
  if (!ast) {
    throw new Error('arguments require a valid ast');
  }
  if (!type) {
    throw new Error('arguments require a valid type');
  }

  let count = 0;

  function walk (ast, type) {
    if (_.isArray(_.get(ast, 'body'))) {
      ast.body.map(node => {
        if (_.get(node, 'type') === type) {
          count++;
        }
        walk(node, type);
      });
    }

    if (_.isArray(_.get(ast, 'children'))) {
      ast.children.map(node => {
        if (_.get(node, 'type') === type) {
          count++;
        }
        walk(node, type);
      });
    }

    if (_.isObjectLike(_.get(ast, 'body'))) {
      if (_.get(ast, 'body.type') === type) {
        count++;
      }
    }

  }

  walk(ast ,type);

  return count;
}

module.exports = {
  walkAstCountType: walkAstCountType
}
