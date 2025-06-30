import PropTypes from "prop-types";

export default function Container({ children, hasMenu }) {
  return (
    <div
      className={`min-h-screen p-6 bg-gray-700 text-gray-100 transition-all ${
        hasMenu ? "lg:w-5/6 w-full ml-0" : "w-full ml-0"
      }`}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  hasMenu: PropTypes.bool,
};
