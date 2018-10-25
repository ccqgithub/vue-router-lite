import Route from "../component/Route.vue";

/**
 * wrap Component with Route, 
 * so the Component will have the propeties: location, history, match ...
 */
const withRouter = (Component) => {
  return {
    functional: true,
    render(createElement, context) {
      context.data.props.component = Component;
      return createElement(Route, context.data, context.children);
    }
  }
}

export default withRouter;