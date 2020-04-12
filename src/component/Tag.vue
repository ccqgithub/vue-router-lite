<script>
export default {
  name: 'Tag',
  functional: true,
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  render(createElement, context) {
    return createElement(context.props.tag, context.data, context.children);
  }
};
</script>
