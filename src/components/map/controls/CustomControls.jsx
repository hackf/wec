import { createPortal } from "react-dom";
import { useRef, useEffect, useCallback, forwardRef } from "react";
import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil, DomEvent } from "leaflet";

const ControlContainer = createControlComponent(
  function createControlContainer({
    useLeafletStyles = true,
    onContainerCreate,
    ...props
  }) {
    const CustomControl = Control.extend({
      onAdd() {
        const container = DomUtil.create("div", "");
        if (useLeafletStyles) {
          DomUtil.addClass(container, "leaflet-bar leaflet-control");
        }
        onContainerCreate(container);
        return container;
      },
    });
    return new CustomControl({ ...props });
  }
);

/**
 * Creates a Control (see: https://leafletjs.com/reference.html#control) allows access
 * to that object using a ref.
 *
 * NOTE: `createControlComponent` will deal with disposing of the Control object when
 * the map is unmounted
 */
const ControlWrapper = forwardRef((props, ref) => {
  return <ControlContainer ref={ref} {...props} />;
});
ControlWrapper.displayName = "ControlWrapper";

function ControlPortal ({ root, children, }) {
  return createPortal(children, root);
}

function CustomControls({ children, ...props }) {
  const controlElementRef = useRef(document.createElement("div"));

  useEffect(() => {
    // event.stopPropagation will not stop click events from bubbling up the DOM
    // or being swallowed by the Map. This is because Leatlet handles a lot of the
    // events using an internal event system. Therefore, the only way to prevent
    // click issues, the DomEvent.disableClickPropagation function has to be used
    // on the control element container.
    // See: https://leafletjs.com/reference.html#domevent-disableclickpropagation
    DomEvent.disableClickPropagation(controlElementRef.current);
    DomEvent.disableScrollPropagation(controlElementRef.current);
  });

  const onContainerCreate = useCallback(
    (container) => {
      container.appendChild(controlElementRef.current);
    },
    [],
  );

  return (
    <>
      <ControlWrapper onContainerCreate={onContainerCreate} {...props} />
      <ControlPortal root={controlElementRef.current}>{children}</ControlPortal>
    </>
  );
}

export default CustomControls;
