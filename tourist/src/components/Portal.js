import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const Portal = (props) => {
  const portalRoot = document.getElementById(props.portalRoot);

  if (portalRoot) {
    return createPortal(props.children, portalRoot);
  }

  return null;
}

export default Portal;

Portal.propTypes = {
  portalRoot: PropTypes.string,
}