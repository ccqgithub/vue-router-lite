import Route from "../component/Route";

/**
 * wrap Component with Route, 
 * so the Component will have the propeties: location, history, match ...
 */
const withRouter = Component => {
  return {
    functional: true,
    render(h, context) {
      context.data.props.component = Component;
      return h(Route, context.data, context.children);
    }
  }
}

export default withRouter;