<script>
export default {
  name: 'tag',
  functional: true,
  props: {
    tag: String
  },
  render(createElement, context) {
    return createElement(context.props.tag || 'div', context.data, context.children);
  }
}
</script>
