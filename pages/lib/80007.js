

function preventDefault(event) {
    if (event.cancelable) {
      event.preventDefault();
    }
  }
  
  function wrapHandlerWithPreventEvent(handler) {
    return (event) => {
      preventDefault(event);
      handler();
    };
  }
  
  function preventScrollByWheelClick(element) {
    if (isChrome) {
      element.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
          event.preventDefault();
          return false;
        }
      });
    }
  }
  
  export { preventDefault, preventScrollByWheelClick, wrapHandlerWithPreventEvent };