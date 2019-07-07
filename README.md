# vue-route-lite

> A component-based, declarative router for `vue@2.6+`. Inspired by `react-router@4.x`.

## Introduction

`vue-router-lite` is a component-based router for [Vue.js](http://vuejs.org/). Read [Documents](https://github.chenchangqin.com/vue-router-lite/docs/) for more details.

Features include:

- Component-Based: just use some HOC(Higher-Order Components) to control your routes.
- Nested routes or mapping routes.
- Modal support.
- Fine-grained navigation control.
- View transition effects powered by Vue.js' transition system.
- Keep Alive.
- Links with automatic active CSS classes.
- HTML5 history mode or hash mode or memory mode.
- Some other features that [vue-router](https://github.com/vuejs/vue-router) and [react-router4](https://reacttraining.com/react-router/) can do.

## Doccuments And Examples

- [Examples](https://github.chenchangqin.com/vue-router-lite/examples/).
- [Examples Code](https://github.com/ccqgithub/vue-router-lite/tree/master/examples).
- [Documentations](https://github.chenchangqin.com/vue-router-lite/docs/).
- [Documentations Code](https://github.com/ccqgithub/vue-router-lite/tree/master/docs).

## Development Setup

```sh
# install deps
npm install

# build dist files
npm run build

# unit test
npm run test

# serve examples at localhost:8080
npm run examples

# serve docs at localhost:8080
cd docs
npm install
npm run docs
```

## Inspired By

- [react-router4](https://reacttraining.com/react-router/)
- [vue-router](https://github.com/vuejs/vue-router)
- [vue-component-router](https://github.com/blocka/vue-component-router)

## Dependences

- [vue@2.6+](https://vuejs.org/): peer dependence, need vue2.6+'s new unified slot syntax.
- [history@4.x](https://github.com/ReactTraining/history)
- [path-to-regexp@3.x](https://github.com/pillarjs/path-to-regexp)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present [Season Chen](https://github.com/ccqgithub)