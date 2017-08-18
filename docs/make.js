const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const headings = require('metalsmith-headings')
const layouts = require('metalsmith-layouts')
const collections = require('metalsmith-collections')
const paths = require('metalsmith-paths')
const highlight = require('metalsmith-code-highlight')

const Handlebars = require('handlebars')
Handlebars.registerHelper('eq', (a, b) => a === b)

/*
const debug = (files, metalsmith, done) => {
  setImmediate(done)
  console.log(metalsmith.metadata().collections.articles)
  console.log(metalsmith.metadata().collections.articles[0].paths)
}
*/

const docs = articles => (files, metalsmith, done) => {
  setImmediate(done)
  Object.assign(metalsmith.metadata(), {
    docs: articles.map(name => {
      const f = files[name + '.md']
      f.isDoc = true
      return f
    }),
  })
}

Metalsmith(__dirname)
  .metadata({
    version: require('../package.json').version,
  })
  .source('md/')
  .destination('.')
  .clean(false)
  .use(paths({
    property: 'paths'
  }))
  .use(docs([
    'accessing-parse-table',
    'how-to-grammar-good',
    'custom-tokens-and-lexers',
    'glossary',

    // install
    'index',
    'language',
    'usage',
    'tooling',
    'tokenizers',

    'using-in-frontend',
  ]))
  //.use(debug)
  .use(markdown({
    smartypants: true,
    gfm: true,
  }))
  .use(highlight())
  .use(headings('h3'))
  .use(layouts({
    engine: 'handlebars',
    default: 'template.html',
  }))
  .build(function(err) {
    if (err) throw err;
  })

