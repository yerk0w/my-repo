// src/components/Footer.jsx
import { FaHeart, FaGithub, FaTelegram, FaEnvelope, FaTree, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-sections">
          <div className="footer-section">
            <h3 className="footer-title">Дерево Воспоминаний</h3>
            <p className="footer-description">
              Храните самые ценные моменты вашей жизни в виде интерактивного дерева.
              Добавляйте фото, видео и создавайте удивительную историю о себе.
            </p>
            <div className="footer-app-info">
              <span className="app-version">
                <FaTree /> Версия 1.2.0
              </span>
              <span className="app-update">
                <FaCalendarAlt /> Обновлено: 10 апреля 2025
              </span>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Навигация</h3>
            <ul className="footer-links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/memories">Воспоминания</Link></li>
              <li><Link to="/archive">Архив</Link></li>
              <li><Link to="/statistics">Статистика</Link></li>
              <li><Link to="/settings">Настройки</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Свяжитесь с нами</h3>
            <ul className="footer-contact">
              <li>
                <a href="mailto:zamirasadibekova59@gmail.com" target="_blank" rel="noopener noreferrer">
                  <FaEnvelope /> zamirasadibekova59@gmail.com
                </a>
              </li>
              <li>
                <a href="https://t.me/zamiraaa" target="_blank" rel="noopener noreferrer">
                  <FaTelegram /> @zamiraaa
                </a>
              </li>
            </ul>
          </div>
        </div>
            
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} Дерево Воспоминаний. Все права защищены.
          </div>
          <div className="made-with">
            Сделано с <FaHeart className="heart-icon" /> в Казахстане
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;