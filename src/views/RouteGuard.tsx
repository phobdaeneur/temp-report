import React, { useState, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { StoreContext } from "../store";
import { isAuth as isAuthService } from "../service/auth";
import { useNavigate } from "react-router-dom";

function RouteGuard(): JSX.Element {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loggedIn } = useContext(StoreContext);
  const navigate = useNavigate();

  /**
   * If user lands on home grab token in localStorage to authorize user.
   * if token is valid then access is granted otherwise reject to login page.
   */
  const checkAuth = async () => {
    try {
      const authUser = await isAuthService(localStorage.getItem("token"));
      loggedIn(authUser);
      setLoading(false);
      setIsAuth(true);
    } catch (err) {
      setLoading(false);
      setIsAuth(false);
      navigate("/login");
    }
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  return !isAuth ? <Navigate to="/login" /> : <Outlet />;
}

export default RouteGuard;
