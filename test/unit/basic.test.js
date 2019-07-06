import { mount } from '@vue/test-utils';
import Basic from './apps/Basic.vue';

describe('basic', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Component);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});