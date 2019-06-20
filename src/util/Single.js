import { assert } from './utils';

/**
 * render the single child or empty
 */
const Single = {
  functional: true,
  render(createElement, context) {
    const children = context.children.filter(item => !!item.tag);

    if (!children.length) return null;

    assert(
      children.length === 1, 
      `The component ${context.props.name || 'Single'} should have only one child!`
    );

    return children[0];
  }
}

export default Single;