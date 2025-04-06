// src/App.jsx - с инициализацией темы
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes, FaHome, FaTree, FaArchive, FaChartBar, FaCog } from 'react-icons/fa';
import { initTheme } from './utils/themeManager';

// Страницы
import HomePage from './pages/HomePage';
import MemoriesPage from './pages/MemoriesPage';
import ArchivePage from './pages/ArchivePage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Инициализация темы при загрузке приложения
  useEffect(() => {
    initTheme();
  }, []);
  
  // Переключение меню
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Переход на страницу и закрытие меню
  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };
  
  // Определение заголовка страницы
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Главная';
      case '/memories': return 'Дерево воспоминаний';
      case '/archive': return 'Архив';
      case '/statistics': return 'Статистика';
      case '/settings': return 'Настройки';
      default: return 'Дерево воспоминаний';
    }
  };
  
  return (
    <div className="app">
      {/* Шапка */}
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
        </div>
      </header>
      
      {/* Боковое меню */}
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
            <button 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={() => navigateTo('/')}
            >
              <FaHome /> Главная
            </button>
          </li>
          <li>
            <button 
              className={location.pathname === '/memories' ? 'active' : ''}
              onClick={() => navigateTo('/memories')}
            >
              <FaTree /> Воспоминания
            </button>
          </li>
          <li>
            <button 
              className={location.pathname === '/archive' ? 'active' : ''}
              onClick={() => navigateTo('/archive')}
            >
              <FaArchive /> Архив
            </button>
          </li>
          <li>
            <button 
              className={location.pathname === '/statistics' ? 'active' : ''}
              onClick={() => navigateTo('/statistics')}
            >
              <FaChartBar /> Статистика
            </button>
          </li>
          <li>
            <button 
              className={location.pathname === '/settings' ? 'active' : ''}
              onClick={() => navigateTo('/settings')}
            >
              <FaCog /> Настройки
            </button>
          </li>
        </ul>
        
        <div className="nav-footer">
          <p>Дерево воспоминаний v1.2.0</p>
        </div>
      </nav>
      
      {/* Затемнение при открытом меню */}
      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
      
      {/* Основное содержимое */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {/* Футер */}
      <Footer />
    </div>
  );
}

export default App;