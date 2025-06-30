import "./Header.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdPower } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function Header({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className='header'>
      <div className='header-content'>
        <div className='header-title'>
          <h1 className='app-title'>
            Canova<p className='title'>CRM</p>
          </h1>
          <button
            className='logout-btn'
            onClick={async () => {
              await logout();
              toast.info("You have been logged out 👋", {
                position: "top-right",
                autoClose: 2000,
              });
            }}
          >
            <IoMdPower size={30} />
          </button>
        </div>

        {activeTab === "Home" ? (
          <>
            <p className='greeting'>{getGreeting()}</p>
            <h2 className='user-name'>{user.name}</h2>
          </>
        ) : (
          <button
            className='back-button'
            onClick={() => setActiveTab("Home")}
          >
            <IoIosArrowBack size={25} />
            <p>{activeTab}</p>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
