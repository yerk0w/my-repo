// src/components/Header.jsx (обновленный)
import { useState, useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaPlus, FaTimes, FaHome, FaTree, FaArchive, FaChartBar, FaCog } from 'react-icons/fa'
import { AppContext } from '../AppContext'

const Header = ({ showAddButton }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { isFormVisible, toggleForm } = useContext(AppContext)
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Главная';
      case '/memories': return 'Дерево воспоминаний';
      case '/archive': return 'Архив';
      case '/statistics': return 'Статистика';
      case '/settings': return 'Настройки';
      default: return 'Дерево воспоминаний';
    }
  }
  
  return (
    <>
      <header className="header">
        <div className="header-content">
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Открыть меню"
          >
            <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <h1>{getPageTitle()}</h1>
          
          {showAddButton && (
            <button 
              className="toggle-button"
              onClick={toggleForm}
              aria-label={isFormVisible ? "Закрыть форму" : "Добавить воспоминание"}
            >
              {isFormVisible ? <FaTimes /> : <FaPlus />}
            </button>
          )}
        </div>
      </header>
      
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <h2>Меню</h2>
          <button 
            className="close-nav"
            onClick={toggleMenu}
            aria-label="Закрыть меню"
          >
            <FaTimes />
          </button>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/" onClick={toggleMenu}>
              <FaHome /> Главная
            </NavLink>
          </li>
          <li>
            <NavLink to="/memories" onClick={toggleMenu}>
              <FaTree /> Воспоминания
            </NavLink>
          </li>
          <li>
            <NavLink to="/archive" onClick={toggleMenu}>
              <FaArchive /> Архив
            </NavLink>
          </li>
          <li>
            <NavLink to="/statistics" onClick={toggleMenu}>
              <FaChartBar /> Статистика
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" onClick={toggleMenu}>
              <FaCog /> Настройки
            </NavLink>
          </li>
        </ul>
        
        <div className="nav-footer">
          <p>Дерево воспоминаний v1.0</p>
        </div>
      </nav>
      
      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  )
}

export default Header