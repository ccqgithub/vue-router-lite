# GentX: 辅助[RxJS](https://github.com/ReactiveX/RxJS)的数据流管理工具。

> 使用[RxJS](https://github.com/ReactiveX/RxJS)更好地管理数据流。

> 使用此工具时请确保你已经会使用[RxJS](https://github.com/ReactiveX/RxJS)。

## 安装使用

安装：

```sh
npm i rxjs gentx -S
```

使用：

```js
import {
  catchError,
  logGuard,
  makeObservable,
  groupFlows,
  flowSource,
  flowSources
} from 'gentx';
```

## 概念

> 这里的概念指`gentx`新加入的概念，其他rxjs的概念请看[RxJS文档](http://reactivex.io/rxjs/manual/overview.html), 或[RxJS文档2](https://robin-front.gitbooks.io/rxjs-doc-chinese/content/why_rxjs.html), 或[RxJS中文文档](https://cn.rx.js.org/manual/index.html)。

### 0：GentX的数据理念

GentX想应用中数据管理的所有部分分为三个部分：

- 数据存储：自定义数据Store，LocalStore，SessionStore，Cookie等…
- 数据流动变换：将一定事件循环内的所有数据变换抽象为数据的流动，比如点击添加用户按钮的过程，会产生这样一个数据流： `点击按钮` => `参数封装器` => `接口请求器` => `结果处理器` => `数据Store` => `UI`。
- 数据反应：数据改变是产生一些副作用，比如修改数据自动更新UI。

### 1：动态数据源：Source

> `动态数据源（Source）`是指：能根据一定条件（入参）触发多次，并且每次都能独立地、有规律地发射一个或者多个数据，并且可以随时终止数据发射的所在。

- 动态数据源（Source）是一个函数
- 动态数据源（Source）接受一个参数
- 动态数据源（Source）执行后返回一个 [observable](http://reactivex.io/rxjs/manual/overview.html#observable) 对象

```js
// can cancel source
export function canCancelSource(val) {
  let timer = null;
  let promise = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      resolve(`${val}-cancel`);
    }, 1000);
  });

  // crate a observable with a promise and a cancel function
  return makeObservable(promise, () => {
    console.log('source canceled...');
    clearTimeout(timer);
  });
}

// create a observable from a source and a value
let observable = canCancelSource(1);
let subscription = observable.subscribe({ 
  // ... 
});
// unsubscribe
subscription.unsubscribe();
```

### 2：数据流：Flow

> 前面说了，我们在进行app 操作的时候会产生一条条数据流，`Flow`就是这一条条数据流中其中的一段，对流经的数据进行变换。

- Flow是一个函数，用来对`Observable数据流`进行转换。
- 传入一个(http://reactivex.io/rxjs/manual/overview.html#observable) 对象，传出一个(http://reactivex.io/rxjs/manual/overview.html#observable) 对象。
- 数据流转换中可以用`Source`来连接，比如和`rxjs`的`concatMap`,`mergeMap`,`switchMap`等操作符一起用。

```js
import { map } from 'rxjs/operators';

export function testFlow(input) {
  return input.pipe(
    map(v => `${v}-test`)
  );
}

// can use source to concat flow
export function testFlow2(input) {
  return input.pipe(
    concatMap(source2)
  );
}
```

### 3：数据流组：Flow Group

> `Flow Group` 主要是flow很多的情况下用来对flow进行分组，方便调用和调试。

- `Flow Group`对`Flow`进行分组。
- `Flow Group`可以添加守卫，便于调试和统一变换。

```js
import { flowSources, groupFlows } from '../../index';
import * as TestSoureces from '../sources/test';
import { testFlow } from '../flows/test';
import { logGuard } from '../logGuard';

export const srcFlows = groupFlows(flowSources(TestSoureces), {
  groupName: 'src'
});

export const guardFlows = groupFlows({
  test: testFlow
}, {
  groupName: 'guard',
  beforeGuards: [logGuard],
  afterGuards: [logGuard]
});
```

### 4：数据流守卫：Flow Guard

> `数据流守卫` 和`Flow`一样，只是会多接受一个参数`opts`，和`Flow Group`一起配合使用。

```js
import { map } from 'rxjs/operators';
import { log } from '../utils';

export function logGuard(input, opts={}) {
  let {flowName, groupName, guardType} = opts;

  // not use as a middleware
  if (!guardType) return input;

  let typeMsg = { before: 'in', after: 'out' }[guardType];

  return input.pipe(
    map(value => {
      let logData;
      
      try {
        logData = JSON.parse(JSON.stringify(value));
      } catch(e) {
        logData = e.message;
      }

      log(`[gentx log] ~ flow ${typeMsg} <${groupName}>.<${flowName}>:`, logData);

      return value;
    })
  );
}
```

## API

### `makeObservable(input, cancel)`: 

根据一个[ObservableInput: input](http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObservableInputDoc.html)，创建一个新的`Observable`对象。这个新的`Observable`对象如被取消订阅，会调用函数`cancel`。

### `groupFlows(flowMap={}, opts={})`: 

创建一个`Flow` 分组。

- `flowMap`: flow集合，`{flowName: flowFn}`的格式。
- `opts`默认为：

  ```js
  {
    groupName= 'Anonymous', //分组名，便于调试
    beforeGuards= [], // 前置守卫
    afterGuards= [] // 后置守卫
  }
  ```

```js
import { flowSources, groupFlows } from '../../index';
import * as TestSoureces from '../sources/test';
import { testFlow } from '../flows/test';
import { logGuard } from '../logGuard';

export const guardFlows = groupFlows({
  test: testFlow
}, {
  groupName: 'guard',
  beforeGuards: [logGuard],
  afterGuards: [logGuard]
});
```

### `flowSource(source, operatorType='concatMap')`: 

根据`Source`创建一个`Flow`。

> operatorType可以取三个值：concatMap, mergeMap, switchMap。

### `flowSources(sourceMap, operatorType='concatMap')`: 

根据一组`Source`返回一个`Flow`集合，内部调用`flowSource`。

```js
import { flowSources, groupFlows } from '../../index';
import * as TestSoureces from '../sources/test';
import { testFlow } from '../flows/test';
import { logGuard } from '../logGuard';

export const srcFlows = groupFlows(flowSources(TestSoureces), {
  groupName: 'src'
});
```

### `logGuard`

内置守卫，打印调试信息。

## 推荐目录结构

```
----data           ## 所有数据相关存在data目录
  |---- apis       ## api请求
  |---- sources    ## 动态数据源
  |---- flows      ## 数据流
  |---- stores     ## 数据存储
```

## 推荐和其他工具配合使用

### 和`React`一起使用

建议：`rxjs` + `gentx` + `mobx` + `mobx-react` + `react`。

为react组件提供一个装饰器`gentx`, 使用装饰器后，组件实例会多两个属性`$subs`, `$unsubscribe`。

- `$subs`: 用来挂载组件内进行的所有订阅(rxjs)。
- `$unsubscribe(key)`: 取消绑定在`$subs`上得订阅，key不传时取消所有订阅，`componentWillUnmount`时会默认调用此函数来移除所有订阅。

```js
import {gentx} from 'gentx';
import React from 'react';
import {from} from 'rxjs';

@gentx({
  $subs: '$subs', // 可以不传，默认`$shubs`
  $unsubscribe: '$unsubscribe' //可以不传，默认`$unsubscribe`
})
class App extends React.Component {
  constructor() {
    supper();
  }

  componentDidMount() {
    let promise = api.get('xxx');
    let observable = from([1]);

    // 挂载订阅
    this.$subs.test = observable.subscribe({
      // ...
    });

    this.$subs.test2 = observable.subscribe({
      // ...
    });

    this.$subs.test3 = observable.subscribe({
      // ...
    });
  }

  // 可以不写，因为默认会执行这个行为
  componentWillUnmount() {
    // 取消所有订阅
    this.$unsubscribe();
  }

  // 点击test按钮
  onClickTest() {
    //...
    // 取消上一次test订阅，并新建一个test订阅
    this.$unsubscribe(test);
    this.$subs.test = observable.subscribe({
      // ...
    });
  }
}
```

### 和`Vue`一起使用

建议：`rxjs` + `gentx` + `vuex(不用它的action)` + `vue`。

为vue提供一个插件`VueGentX`, 安装插件后，组件实例会多两个属性`$subs`, `$unsubscribe`。

- `$subs`: 用来挂载组件内进行的所有订阅(rxjs)。
- `$unsubscribe(key)`: 取消绑定在`$subs`上得订阅，key不传时取消所有订阅，`beforeDestory`时会默认调用此函数来移除所有订阅。

```js
import Vue from 'vue';
import {VueGentX} from 'gentx';

new Vue({
  el: '#app',
  data() {
    //...
  },

  mounted() {
    let promise = api.get('xxx');
    let observable = from([1]);

    // 挂载订阅
    this.$subs.test = observable.subscribe({
      // ...
    });

    this.$subs.test2 = observable.subscribe({
      // ...
    });

    this.$subs.test3 = observable.subscribe({
      // ...
    });
  },

  // 可以不写，因为默认会执行这个行为
  beforeDestroy() {
    // 取消所有订阅
    this.$unsubscribe();
  }

  methods: {
    // 点击test按钮
    onClickTest() {
      //...
      // 取消上一次test订阅，并新建一个test订阅
      this.$unsubscribe(test);
      this.$subs.test = observable.subscribe({
        // ...
      });
    }
  }
})
```