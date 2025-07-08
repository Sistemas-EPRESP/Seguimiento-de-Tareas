import MenuItem from "../components/MenuItem";
import { mapURItoIcon } from "../utils/menuIconMapper";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PropTypes from "prop-types";

function MenuItemSet({ menuItems, onClick, adminMode = false }) {
  return (
    <>
      <section>
        <h1 className="text-xl font-semibold mb-3 md:text-2xl">Principal</h1>
        <ul>
          {menuItems?.length > 0 &&
            menuItems.map((i, k) => {
              if (!adminMode && i.adminOnly) return;
              return (
                <MenuItem
                  label={i.label}
                  to={i.to}
                  icon={mapURItoIcon(i.to)}
                  key={k}
                  onClick={onClick}
                />
              );
            })}
        </ul>
      </section>
      {adminMode && (
        <section>
          <h1 className="text-xl mb-3 font-semibold md:text-2xl">
            Información
          </h1>
          <ul>
            <MenuItem
              label={"Reportes"}
              to={"/reportes"}
              icon={<AssessmentIcon className="mr-2" onClick={onClick} />}
            />
          </ul>
        </section>
      )}
    </>
  );
}

MenuItemSet.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
  adminMode: PropTypes.bool,
};
export default MenuItemSet;
