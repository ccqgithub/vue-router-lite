/**
 * custom tag element
 */
const Tag = {
  functional: true,
  render(createElement, context) {
    return createElement(context.props.tag || 'div', context.data, context.children);
  }
}

export default Tag;