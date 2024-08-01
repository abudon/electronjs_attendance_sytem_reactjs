
// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/users";
import AnalyticsPage from "layouts/billing";
import Profile from "layouts/profile";
import SignOut from "./layouts/authentication/sign-out";

// Soft UI Dashboard React icons

import CustomerSupport from "examples/Icons/CustomerSupport";
import {Analytics, DashboardTwoTone, ExitToApp, Person} from "@mui/icons-material";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <DashboardTwoTone size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Users Management",
    key: "users",
    route: "/users",
    icon: <Person size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Analytics",
    key: "billing",
    route: "/analysis",
    icon: <Analytics size="12px" />,
    component: <AnalyticsPage />,
    noCollapse: true,
  },

  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    route: "/authentication/sign-out",
    icon: <ExitToApp size="12px" />,
    component: <SignOut />,
    noCollapse: true,
  },

];

export default routes;
