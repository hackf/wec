import { createPortal } from "react-dom";
import { useRef, useCallback } from "react";
import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent } from "leaflet";

/**
 * This component extends then replaces the map's Control object with one
 * that allows for the reference to the created controls container element to be
 * sent by a callback to this component's parent. This is required so that
 * the controls container element can then be used as a portal so that react
 * can render components within the control container. This is needed because when
 * the map is initialized, leaflet will create an element for each of the possible
 * control locations. When a new control is created, it will be placed within one of
 * those control location elements, therefore, to be able to create custom controls
 * and use react components to control the DOM, a portal needs to be created for each
 * new control.
 *
 * NOTE: `createControlComponent` will deal with disposing of the Control object when
 * the map is unmounted
 *
 * For more information refer to the controls docs: https://leafletjs.com/reference.html#control)
 */
const ControlContainer = createControlComponent(
  /**
   * @param {Object} options
   * @param {*} [options.useLeafletStyles=true] A flag to use leaflet styles or not. Sometimes they make customization hard
   * @param {*} options.onContainerCreate The callback that will be invoked with the reference to the control element
   * @param {...*} options.props Any additional options will be passed to the extended Control constructor
   */
  function createControlContainer({
    useLeafletStyles = true,
    onContainerCreate,
    ...props
  }) {
    const CustomControl = Control.extend({
      onAdd() {
        const container = DomUtil.create("div", "");
        if (useLeafletStyles) {
          // These are the default leaflet class names that would be applied
          // to the container. Though, leaflet will still add "leaflet-control"
          // to the element if it doesn't exist.
          //
          // NOTE: They can make styling the controls more difficult
          DomUtil.addClass(container, "leaflet-bar leaflet-control");
        }
        // This callback passes the reference to the container element
        // back up to the parent. Leaflet will insert this element into
        // the DOM then the reference can be used to create a portal so
        // that react components can be rendered within that container
        // element
        onContainerCreate(container);
        return container;
      },
    });
    return new CustomControl({ ...props });
  }
);

function ControlPortal({ root, children, }) {
  return createPortal(children, root);
}

/**
  * Create the control element and applies a few listeners to that curtain events
  * don't propagate down to the map
  */
function createControlElement(className) {
  const element = DomUtil.create("div", className)
  // event.stopPropagation will not stop click events from bubbling up the DOM
  // or being swallowed by the Map. This is because Leatlet handles a lot of the
  // events using an internal event system. Therefore, the only way to prevent
  // click issues, the DomEvent.disableClickPropagation function has to be used
  // on the control element container.
  // See: https://leafletjs.com/reference.html#domevent-disableclickpropagation
  DomEvent.disableClickPropagation(element);
  DomEvent.disableScrollPropagation(element);
  return element
}

/**
  * Creates the new custom control and portal. Any children of this component
  * will be rendered within the portal.
  */
function CustomControls({ children, className, ...props }) {
  const controlElementRef = useRef(createControlElement(className));

  const onContainerCreate = useCallback(
    (container) => {
      container.appendChild(controlElementRef.current);
    },
    [],
  );

  return (
    <>
      <ControlContainer onContainerCreate={onContainerCreate} {...props} />
      <ControlPortal root={controlElementRef.current}>{children}</ControlPortal>
    </>
  );
}

export default CustomControls;
