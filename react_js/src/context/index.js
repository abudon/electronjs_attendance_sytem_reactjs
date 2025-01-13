import { createContext, useContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";




const photo_lab_context = createContext(null);

photo_lab_context.displayName = "PhotoLabContext";


const reducer = (state, action) => {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}


const PhotoLabContextProvider = ({ children }) => {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: true,
    sidenavColor: "success",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    layout: "dashboard",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  return <photo_lab_context.Provider value={value}>{children}</photo_lab_context.Provider>;
}

const usePhotoLabContext = ()=> {
  const context = useContext(photo_lab_context);

  if (!context) {
    throw new Error("usePhotoLabContext should be used inside the PhotoLabContextProvider.");
  }

  return context;
}

PhotoLabContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });

export {
  PhotoLabContextProvider,
  usePhotoLabContext,
  setMiniSidenav,
  setTransparentSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setLayout,
};
