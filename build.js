const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
registerTransforms(StyleDictionary);

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
    name: 'css/variables',
    formatter: function (dictionary, config) {
      return `${this.selector} {
        ${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
      }`
    }
});  

StyleDictionary.registerTransform({
  name: 'sizes/px',
  type: 'value',
  matcher: function(prop) {
      // You can be more specific here if you only want 'em' units for font sizes    
      return ["fontSize", "spacing", "borderRadius", "borderWidth", "sizing"].includes(prop.attributes.category);
  },
  transformer: function(prop) {
      // You can also modify the value here if you want to convert pixels to ems
      return parseFloat(prop.original.value) + 'px';
  }
});

function getStyleDictionaryConfig(theme) {
  return {
    "source": [
      `tokens/figma/${theme}.json`,
    ],
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px"],
        "buildPath": `output/`,
        "files": [{
            "destination": `${theme}.css`,
            "format": "css/variables",
            "selector": `.${theme}-theme`
          }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['global', 'dark', 'light'].map(function (theme) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('web');

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');