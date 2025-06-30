import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function MenuItem({ label, to, onClick, icon }) {
  return (
    <li className="mb-2">
      <Link
        to={to}
        className="bg-gray-700 hover:bg-gray-600  flex items-center rounded pe-3 ps-2 py-2"
        onClick={onClick}
      >
        {icon} <span className="ms-2">{label}</span>
      </Link>
    </li>
  );
}

MenuItem.propTypes = {
  label: PropTypes.string,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  isAdmin: PropTypes.bool,
};
export default MenuItem;
