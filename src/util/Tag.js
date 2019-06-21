/**
 * custom tag element
 */
const Tag = {
  functional: true,
  props: {
    tag: String
  },
  render(createElement, context) {
    return createElement(context.props.tag || 'div', context.data, context.children);
  }
}

export default Tag;