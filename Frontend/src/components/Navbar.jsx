import { Link, useLocation, useNavigate } from "react-router-dom";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import DarkModeToggle from "./DarkMode";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user: authUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");

  const handleLogout = async () => {
    await logout(); // logout handled by context
    navigate("/login");
  };

  return (
    <nav className="bg-base-300 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-9 justify-start w-full">
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  SnippyChat
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <div>
            <DarkModeToggle />
          </div>

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          <button className="btn btn-ghost btn-circle" onClick={handleLogout}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
