var stylelint = require("stylelint");
var _ = require("lodash");

var ruleName = "tmi/no-multiple-top-level-components"

module.exports = stylelint.createPlugin(ruleName, function (enabled) {
  return function (root, result) {
    var validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: enabled,
      possible: [
        true,
        false
      ]
    })

    if (!validOptions) { return }

    /**
     * SUPER lazy. This checks to see if we're in the "components" directory because these
     * rules shouldn't apply to any other directory. I might change this someday.
     * ...maybe.
     */
    var path = result.opts.from.split('/');
    if (path[path.length - 3] !== 'components') { return }

    root.walkRules(function (statement) {
      if (statement.parent.type === 'root' && _.values(statement.parent.indexes)[0] !== 0) {
        let selector = statement.selector.slice(1).replace(/,\n(.*)/g, '');

        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: statement,
          message: `Only one top-level selector should exist in a module stylesheet. If this is a new module move this into its own _${selector}.css file.`
        });
      }
    })
  }
})

module.exports.ruleName = ruleName
