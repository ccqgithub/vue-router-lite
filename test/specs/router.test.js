import { mount } from '@vue/test-utils';
import BrowserRouter from './apps/BrowserRouter.vue';
import HashRouter from './apps/HashRouter.vue';
import MemoryRouter from './apps/MemoryRouter.vue';
import StaticRouter from './apps/StaticRouter.vue';

describe('browser router', () => {
  test('home', () => {
    jsdom.reconfigure({
      url: "http://localhost/test/"
    });
    const wrapper = mount(BrowserRouter, {
      propsData: {
        basename: '/test/'
      }
    });
    const pages = wrapper.findAll('.mod');
    expect(pages.at(0).is('.home')).toBe(true);
  });

  test('tpoic: props-v-state', () => {
    jsdom.reconfigure({
      url: "http://localhost/test/topics/props-v-state"
    });
    const wrapper = mount(BrowserRouter, {
      propsData: {
        basename: '/test/'
      }
    });
    const h3 = wrapper.find('.mod.topic').find('h3');
    expect(h3.text()).toBe('props-v-state');
  });
});

describe('hash router', () => {
  test('home', () => {
    jsdom.reconfigure({
      url: "http://localhost/#/"
    });
    const wrapper = mount(HashRouter, {
      propsData: {
        basename: '/'
      }
    });
    const pages = wrapper.findAll('.mod');
    expect(pages.at(0).is('.home')).toBe(true);
  });

  test('tpoic: props-v-state', () => {
    jsdom.reconfigure({
      url: "http://localhost/#/topics/props-v-state"
    });
    const wrapper = mount(HashRouter, {
      propsData: {
        basename: '/'
      }
    });
    const h3 = wrapper.find('.mod.topic').find('h3');
    expect(h3.text()).toBe('props-v-state');
  });
});

describe('memory router', () => {
  test('home', () => {
    const wrapper = mount(MemoryRouter, {
      propsData: {
        initialEntries: ['/']
      }
    });
    const pages = wrapper.findAll('.mod');
    // console.log(pages.at(0).html())
    expect(pages.at(0).is('.home')).toBe(true);
  });

  test('tpoic: props-v-state', () => {
    const wrapper = mount(MemoryRouter, {
      propsData: {
        initialEntries: ['/topics/props-v-state']
      }
    });
    const h3 = wrapper.find('.mod.topic').find('h3');
    expect(h3.text()).toBe('props-v-state');
  });
});

describe('static router', () => {
  test('home', () => {
    const wrapper = mount(StaticRouter, {
      propsData: {
        basename: '/test/',
        location: '/'
      }
    });
    const pages = wrapper.findAll('.mod');
    expect(pages.at(0).is('.home')).toBe(true);
  });

  test('tpoic: props-v-state', () => {
    const wrapper = mount(StaticRouter, {
      propsData: {
        basename: '/test/',
        location: '/topics/props-v-state'
      }
    });
    const h3 = wrapper.find('.mod.topic').find('h3');
    expect(h3.text()).toBe('props-v-state');
  });
});