import { warning } from './utils';

/**
 * render the single child or empty
 */
const Single = {
  functional: true,
  render(createElement, context) {
    const children = context.children.filter(item => !!item.tag);

    if (!children.length) return null;

    if (children > 1) {
      warning(`The component ${context.props.name || 'Single'} should have only one child!`);
    }

    return children[0];
  }
}

export default Single;