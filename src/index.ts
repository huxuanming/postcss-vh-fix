import { Plugin } from 'postcss'

type Options = {
  variable: string
}

const postcssViewportHeightFix = (options: Partial<Options>): Plugin => {
  const variable = options?.variable || 'vh'
  const finderRegex = /(-?[0-9.]+)vh/g
  const excludeRegex = new RegExp(`var\\(--${variable},\\s*1vh\\)`)
  const replaceBy = `calc(var(--${variable}, 1vh) * $1)`
  return {
    postcssPlugin: 'postcss-vh-fix',
    OnceExit: (css) => {
      css.walkRules((rule) => {
        rule.walkDecls((decl) => {
          const value = decl.value
          const isImportant = decl.important
          const isMatch = value.match(finderRegex) !== null
          const isPreParsed = value.match(excludeRegex) !== null
          if (isMatch && !isPreParsed) {
            let correctedViewport = value.replace(finderRegex, replaceBy)

            if (isImportant) {
              correctedViewport += decl.raws.important || ' !important'
            }

            rule.insertAfter(decl, {
              prop: decl.prop,
              value: correctedViewport,
            })
          }
        })
      })
    },
  }
}

postcssViewportHeightFix.postcss = true
module.exports = postcssViewportHeightFix

export default postcssViewportHeightFix
