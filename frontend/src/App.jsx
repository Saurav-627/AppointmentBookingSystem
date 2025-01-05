import SignUp from "./entities/user/components/SignUp";
import OtpPage from "./entities/user/components/OtpPage";
import { useRoutes, Navigate } from "react-router-dom";
import AuthRoute from "./routes/AuthRoute";
import Navbar from "./entities/user/components/Navbar";
import About from "./entities/user/About";
import Home from "./entities/user/Home";
import FindHospital from "./entities/user/FindHospital";
import Contact from "./entities/user/Contact";
import GeneralQuery from "./entities/user/GeneralQuery";
import Speciality from "./entities/user/Speciality";
import Profile from "./entities/user/Profile";
import NotFound from "./entities/user/NotFound";
import Testimonial from "./entities/user/Testimonial";
import Sidebar from "./entities/manager/components/Sidebar";

import ManageDoctor from "./entities/manager/ManageDoctor";
import Appointments from "./entities/manager/AppointmentPage";
import Specialist from "./entities/user/Specialist";
import Specialities from "./entities/manager/Specialities";
import ManagerLogin from "./entities/manager/ManagerLogin";
import Checkout from "./entities/user/Checkout";
import AdminLogin from "./entities/admin/adminlogin";
import AdminSidebar from "./entities/admin/components/sidebar";
import AdminDashboard from "./entities/admin/dashboard";
import HistoryPage from "./entities/manager/HistoryPage";
import AddManager from "./entities/admin/addManager";
import { useState, useEffect } from "react";
import UserData from "./entities/admin/userData";
import ManagerProfile from "./entities/manager/ManagerProfile";

const isAuthenticated = (indicator) => {
  if (indicator === "user") {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? true : false;
  }
  if (indicator === "manager") {
    const manager = localStorage.getItem("manager");
    return manager ? true : false;
  }
  if (indicator === "admin") {
    const admin = localStorage.getItem("admin");
    console.log(admin);
    return admin ? true : false;
  }
};

const ProtectedRoute = ({ path, element, user }) => {
  return isAuthenticated(user) ? (
    <>{element}</>
  ) : (
    <Navigate to={path} replace={true} />
  );
};

function App() {
  const [updated, setUpdated] = useState(false);
  const [userData, setUserData] = useState([]);
  const [managerUpdated, setManagerUpdated] = useState(false);
  const phone = localStorage.getItem("phone");

  const fetchUser = async (phoneNumber) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/data/${phoneNumber}`
      );
      const data = await response.json();
      console.log(data.user);
      setUserData(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchUser(phone);
    }
  }, [updated]);

  const route = useRoutes([
    {
      element: (
        <Navbar updated={updated} setUpdated={setUpdated} userData={userData} />
      ),
      children: [
        {
          path: "/login",
          element: <AuthRoute />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/otp",
          element: <OtpPage />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/testimonial",
          element: <Testimonial />,
        },
        {
          path: "/find",
          element: <FindHospital />,
        },
        {
          path: "/usercontact",
          element: <Contact />,
        },
        {
          path: "/query",
          element: <GeneralQuery />,
        },
        {
          path: "/hospital/:id",
          element: <Speciality />,
        },
        {
          path: "/profile",
          element: (
            <AuthRoute
              NextComponent={
                <Profile updated={updated} setUpdated={setUpdated} />
              }
            />
          ),
        },
        {
          path: "/specialist/",
          element: <Specialist />,
        },
        {
          path: "/checkout",
          element: <Checkout />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
    {
      element: <Sidebar updateManager={managerUpdated} />,
      children: [
        {
          path: "/manager",
          element: (
            <ProtectedRoute
              user={"manager"}
              path="/manager/login"
              element={<ManageDoctor />}
            />
          ),
        },
        {
          path: "/manager/appointments",
          element: (
            <ProtectedRoute
              user={"manager"}
              path="/manager/login"
              element={<Appointments />}
            />
          ),
        },
        {
          path: "/manager/speciality",
          element: (
            <ProtectedRoute
              user={"manager"}
              path="/manager/login"
              element={<Specialities />}
            />
          ),
        },
        {
          path: "/manager/history",
          element: (
            <ProtectedRoute
              user={"manager"}
              path="/manager/login"
              element={<HistoryPage />}
            />
          ),
        },
        {
          path: "/manager/profile",
          element: (
            <ProtectedRoute
              user={"manager"}
              path="/manager/login"
              element={<ManagerProfile setManagerUpdated={setManagerUpdated} />}
            />
          ),
        },
      ],
    },
    {
      path: "manager/login",
      element: <ManagerLogin />,
    },
    {
      path: "admin/login",
      element: <AdminLogin />,
    },
    {
      element: <AdminSidebar />,
      children: [
        {
          path: "/admin",
          element: (
            <ProtectedRoute
              user={"admin"}
              path="/admin/login"
              element={<AdminDashboard />}
            />
          ),
        },
        {
          path: "/admin/addManager",
          element: (
            <ProtectedRoute
              user={"admin"}
              path="/admin/login"
              element={<AddManager />}
            />
          ),
        },
        {
          path: "/admin/userData",
          element: (
            <ProtectedRoute
              user={"admin"}
              path="/admin/login"
              element={<UserData />}
            />
          ),
        },
      ],
    },
  ]);

  return route;
}

export default App;
