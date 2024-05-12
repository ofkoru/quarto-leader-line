# Leader-line Extension For Quarto

Draw a line between in your presentation using [leader-line](https://github.com/anseki/leader-line). It is a wrapper for leader-line to synchronize it with [Reveal.js](https://revealjs.com/) presentation without any coding knowledge. It converts `span` to leader-line object. All you need to know is [how to add divs and spans](https://quarto.org/docs/authoring/markdown-basics.html#sec-divs-and-spans) in your [Quarto](https://quarto.org/) document and utilize [CSS selector](https://www.w3schools.com/cssref/css_selectors.php).

You may check the demo [here](https://omerfarukkoru.com/Packages/quarto-leader-line/example.html).


## Installing


```bash
quarto add ofkoru/quarto-leader-line
```

This will install the extension under the `_extensions` subdirectory.
If you're using version control, you will want to check in this directory.

## Enabling

This package depends on [leader-line](https://github.com/anseki/leader-line); it must be loaded along with the plug-in utilizing `include-in-header`. 
To use the extension, add the following to your document's front matter:

```yaml
format:
  revealjs: 
    include-in-header: 
      - text: '<script src="https://cdnjs.cloudflare.com/ajax/libs/leader-line/1.0.7/leader-line.min.js"></script>'
revealjs-plugins:
  - leader-line
```

## Usage

- To draw a line between two elements, define a span within the slide you want to draw the line with:
  - class `leaderline`,
  - pass the id (or [CSS selector](https://www.w3schools.com/cssref/css_selectors.php)) of elements lines to be drawn between as `start` and `end` attributes.
    - Id of the slide is automatically added to CSS selectors,so you should not include it.
    - `css_selector` becomes `#slide-id css_selector`. 

```{.markdown}
[]{.leaderline start='#element-1' end='#element-2' }
```


- To add a border around `start` or `end` element:
  - add styling of the border to `start-border-style` or `end-border-style` as semicolon separated values.
  - See [__areaAnchor__](https://anseki.github.io/leader-line/#areaanchor) of LeaderLine to check possible components.
```{.markdown}
[]{.leaderline start='#element-1' end=`#element-2` start-border-style='color:red; radius:10;' }
```

- To add a text on the line:
  - add the text as `path-label` or `caption-label` attributes.
    - `path-label` is passed to [`pathLabel`](https://anseki.github.io/leader-line/index.html#pathlabel) method of the leaderline.
    - `caption-label` is passet to [`captionLabel`](https://anseki.github.io/leader-line/index.html#captionlabel) method of the leaderline.
    - Relevant styling options can be passed using `label-style` as semicolon separated values.
```{markdown}
[]{.leaderline  start='#element-1' end='#element-2'  path-label='some text'  label-style='color:orange; fontSize:15;' } 
```

- To animate drawing:
  - assign `draw`, `fade` or `none` (default) to `draw-effect` attribute.
  - It will be passed to [`showEffectName`](https://anseki.github.io/leader-line/#methods-show-hide-showeffectname) of the leaderline.
```{markdown}
[]{.leaderline  start='#element-1' end='#element-2'  draw-effect='draw' } 
```  
  
- All other attributes are converted into a JS object and passed it to [`setOptions`](https://anseki.github.io/leader-line/index.html#setoptions) method of the leaderline.
  - see [leader-line](https://github.com/anseki/leader-line) for set of options.
```{.markdown}
[]{.leaderline start='#element-1' end='#element-2' start-socket="left" color='red' }
```

- To reveal the line at a specific fragment,
  - assign the relevant index to `index` attribute.
```{.markdown}
[]{.leaderline start='#element-1' end=`#element-2` index=1}
```



- To change the style of a line after initialization:
  - add `lineid` to the line at the initialization.
  - define a span with class `leaderline` and `setAttribute`.
  - set `lineid` to the `lineid` of the relevant line.
  - define the attributes you want to change (including `start` and `end`).
  - Assign the fragment index you want to apply these changes to `index` attribute.
```{.markdown}
[]{.leaderline start='#element-1' end='#element-2' lineid='line1' }
[]{.leaderline .setAttribute lineid='line1' start-socket="left" color='red'}
```

- To hide the line at a specific fragment,
  - set `action` attribute to `hide`,
  - assign the relevant index to `index` attribute.
```{.markdown}
[]{.leaderline linei'line1'  index=2 action='hide' }
```
- You must convert attributes with [__camelCase__](https://developer.mozilla.org/en-US/docs/Glossary/Camel_case) to [__kebab-case__](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case).

## Minimal Example

```{markdown}
---
title: "Leader-line Example"
format:
  revealjs:
    width: 1920
    height: 1080
    include-in-header: 
      - text: '<script src="https://cdnjs.cloudflare.com/ajax/libs/leader-line/1.0.7/leader-line.min.js"></script>'
revealjs-plugins:
  - leader-line
---

## Leaderline

:::{#box1 style="width:200px; height:200px; background-color:red; position:absolute; top:100px; left:0" }
:::
:::{#box2 style="width:200px; height:200px; background-color:green;position:absolute; top:100px; left:400px;" }
:::

:::{#list .incremental style="position:absolute; top:400px"}

- Here is some text.
- You can put the [target text]{#target} within a span to select it.
- You can point to any element you can select using CSS selector.

:::

[]{.leaderline start='#box1' end='#box2' start-socket='top' lineid='example'}
[]{.leaderline start='#box2' end='#target' index=1 end-border-style='color:red;' lineid="line1"}
[]{.leaderline start="#box2" end='#list ul li:nth-child(3)' index=2 end-socket="right"}
[]{.leaderline .setAttribute lineid='example' color='blue' end-socket='bottom' index=0 caption-label='an arrow' label-style='color:red; fontSize:20'}
```

## Example

You may check the demo [here](https://omerfarukkoru.com/Packages/quarto-leader-line/example.html).

