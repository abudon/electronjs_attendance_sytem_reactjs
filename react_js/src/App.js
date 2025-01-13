import { useState, useEffect } from "react";
// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

//Dashboard React components
import SoftBox from "components/SoftBox";

//  Dashboard React examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

//Dashboard React themes
import theme from "assets/theme";

// Soft UI Dashboard React routes
import routes from "routes";

// Soft UI Dashboard React contexts
import { usePhotoLabContext, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brand from "assets/images/New-Logo-2-removebg-preview-300x300.png";
import Loader from "./layouts/authentication/loading";
import CurrentRecord from "./layouts/record";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import EditUserPage from "./layouts/users/editusers";
import AddUserPage from "./layouts/users/addusers";

export default function App() {
  const [state, dispatch] = usePhotoLabContext();
  const { miniSidenav, layout, openConfigurator, sidenavColor } = state;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();


  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);


  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  const hiddenPaths = ['/loader', '/record', '*','/'];
  const shouldShowDashboard = !hiddenPaths.includes(pathname);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {shouldShowDashboard && layout === "dashboard" && (
            <>
              <Sidenav
                  color={sidenavColor}
                  brand={brand}
                  brandName="Fortville Academy"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
        )}
        {shouldShowDashboard && layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/loader" />} />
          <Route path="/" element={<Navigate to="/loader" />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/record" element={<CurrentRecord />} />
          <Route path="/authentication/sign-in" element={<SignIn />} />
          <Route path="/authentication/sign-up" element={<SignUp />} />
          <Route path="/edituser/:id" element={<EditUserPage/>} />
          <Route path="/adduser" element={<AddUserPage/>} />
        </Routes>
      </ThemeProvider>
  );
}
