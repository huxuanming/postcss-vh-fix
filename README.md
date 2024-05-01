# PostCSS Viewport Height Fix

[PostCSS] plugin to solve the popular problem when 100vh doesn’t fit the mobile browser screen.

![](https://res.cloudinary.com/css-tricks/image/upload/c_scale,w_1000,f_auto,q_auto/v1532099222/viewport-units-mobile-crop_gxa4yw.jpg)

## Inspiration

The viewport height which we use as "vh" unit in css does not give the actual viewport height but gives the height of the browser window. This plugin is an implememtation of [CSS Tricks article](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/) on this issue.

## Installation

```shell
yarn add postcss-vh-fix
# --- or ----
npm install --save postcss-vh-fix
```

And then add this javascript to `public/index.html`.

```js
;(function () {
  var viewportVariable = 'vh'
  function setViewportProperty(doc) {
    var prevClientHeight
    var variable = '--' + (viewportVariable || 'vh')
    function handleResize() {
      var clientHeight = doc.clientHeight
      if (clientHeight === prevClientHeight) return
      requestAnimationFrame(function updateViewportHeight() {
        doc.style.setProperty(variable, clientHeight * 0.01 + 'px')
        prevClientHeight = clientHeight
      })
    }
    handleResize()
    return handleResize
  }
  window.addEventListener('resize', setViewportProperty(document.documentElement))
})()
```

[PostCSS]: https://github.com/postcss/postcss

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-vh-fix'),
    require('autoprefixer')
  ]
}
```

If you use it in Nuxt：

```diff
export default defineNuxtConfig({
	postcss: {
	  plugins: {
	    'tailwindcss': {},
+      'postcss-vh-fix': {},
		},
	},
})
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

## Configuration

**You really will rarely need this.** Use this when you have some conflicting css variable.
We use `--vh` as variable to fix the viewport height. You can use `--vh` or any other variable of your choice.

Configure postcss to use your variable.

```diff
export default defineNuxtConfig({
	postcss: {
	  plugins: {
	    'tailwindcss': {},
+      'postcss-vh-fix': {
+          variable: 'xxvh'
+       },
		},
	},
})
```

## Example Output

```css
.container {
  /* Input example */
  height: 100vh;
  min-height: 50vh;
  max-height: 75vh;
  margin: -1vh;
}
```

```css
.container {
  /* Output example */
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  min-height: calc(var(--vh, 1vh) * 50);
  max-height: calc(var(--vh, 1vh) * 75);
  margin: calc(var(--vh, 1vh) * -1);
}
```
