/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from 'views/Index.js';
import Profile from "views/main/Profile.js";
import Maps from "views/main/Maps.js";
import Register from "views/main/Register.js";
import Login from "views/main/Login.js";
import Tables from "views/main/Tables.js";
import FamilyList from "views/main/FamilyList";
import Add_Family from "views/main/Add_Family";

//Relif Data
import RelifDatta from 'views/main/ReliefList'
import ReliefGood from 'views/main/ReliefGood'
import InfectedData from 'views/main/Infected/Index'

//VACINATION
import VaccinationList from './views/main/Vaccinations/Index'
import QuarantinedList from './views/main/Quarantined/Index'

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-chart-bar-32 text-blue",
    component: Index,
    layout: "/admin"
  },
    {
    path: "/families",
    name: "Families Data",
    icon: "ni ni-circle-08 text-pink",
    component: FamilyList,
    layout: "/admin"
  },
  {
    path: "/Quarantined",
    name: "Quarantined",
    icon: "ni ni-building text-green",
    component: QuarantinedList,
    layout: "/admin"
  },
  {
    path: "/relief",
    name: "Relief Funds",
    icon: "ni ni-single-02 text-purple",
    component: RelifDatta,
    layout: "/admin"
  },
  {
    path: "/relief_goods",
    name: "Relief Goods",
    icon: "ni ni-basket text-yellow",
    component: ReliefGood,
    layout: "/admin"
  },

  {
    path: "/vaccinations",
    name: "Vaccinations",
    icon: "ni ni-fat-add text-red",
    component: VaccinationList,
    layout: "/admin"
  },
  {
    path: "/infected",
    name: "Infected",
    icon: "ni ni-ambulance text-green",
    component: InfectedData,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "",
    icon: "",
    component: Login,
    layout: "/auth"
  },
/*   {
    path: "/register",
    name: "",
    icon: "",
    component: Register,
    layout: "/auth"
  }, */
  {
    path: "/Add_Family",
    name: "",
    icon: "",
    component: Add_Family,
    layout: "/admin"
  },
];
export default routes;
