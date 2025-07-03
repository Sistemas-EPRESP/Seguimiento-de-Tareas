import PropTypes from "prop-types";
function MainInfo({ children }) {
  return (
    <div
      id="Datos basicos"
      className="flex flex-col justify-between w-full md:w-3/4 h-auto md:h-[350px] gap-4 bg-gray-800 text-gray-100 rounded-lg p-6"
    >
      {children}
    </div>
  );
}

MainInfo.propTypes = {
  children: PropTypes.node,
};

export default MainInfo;
