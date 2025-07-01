import "./Header.css";
import { IoSearchSharp } from "react-icons/io5";
const Header = ({
  menuState,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className='header-container'>
      <header className='header'>
        <div className='header-content'>
          <div className='header-search'>
            <div className='search-container'>
              <IoSearchSharp size={26} />
              <input
                disabled={
                  menuState === "Dashboard" ||
                  menuState === "Settings"
                }
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                type='text'
                placeholder='Search here...'
                className='search-input'
              />
            </div>
          </div>
        </div>
      </header>
      <nav className='breadcrumb'>
        <span className='breadcrumb-item'>Home</span>
        <span className='breadcrumb-separator'>›</span>
        <span className='breadcrumb-item breadcrumb-active'>
          {menuState}
        </span>
      </nav>
    </div>
  );
};

export default Header;
