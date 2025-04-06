import { useNavigate } from 'react-router-dom'
import { FaTree, FaArchive, FaChartBar, FaCog } from 'react-icons/fa'

const HomePage = () => {
  const navigate = useNavigate()
  
  const menuItems = [
    { icon: <FaTree />, title: 'Воспоминания', description: 'Создавайте и просматривайте свои воспоминания', path: '/memories' },
    { icon: <FaArchive />, title: 'Архив', description: 'Просматривайте архивированные воспоминания', path: '/archive' },
    { icon: <FaChartBar />, title: 'Статистика', description: 'Анализируйте свое дерево воспоминаний', path: '/statistics' },
    { icon: <FaCog />, title: 'Настройки', description: 'Настройте приложение под себя', path: '/settings' }
  ]
  
  return (
    <div className="home-page">
      <div className="welcome-section">
        <h2>Добро пожаловать в Дерево Воспоминаний</h2>
        <p>Сохраняйте важные моменты вашей жизни в виде интерактивного дерева.</p>
      </div>
      
      <div className="feature-grid">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="feature-card"
            onClick={() => navigate(item.path)}
          >
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      
      <div className="quick-start">
        <h3>Быстрый старт</h3>
        <p>Чтобы начать, перейдите в раздел "Воспоминания" и нажмите кнопку "+" для создания первого воспоминания.</p>
        <button 
          className="start-button"
          onClick={() => navigate('/memories')}
        >
          Начать сейчас
        </button>
      </div>
    </div>
  )
}

export default HomePage