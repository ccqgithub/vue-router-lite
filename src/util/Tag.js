/**
 * custom tag element
 */
const Tag = {
  functional: true,
  render(h, context) {
    return h(context.props.tag || 'div', context.data, context.children);
  }
}

export default Tag;