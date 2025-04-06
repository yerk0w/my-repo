import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

const NotFoundPage = () => {
  const navigate = useNavigate()
  
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h2>404</h2>
        <h3>Страница не найдена</h3>
        <p>Запрашиваемая страница не существует или была перемещена.</p>
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft /> Вернуться на главную
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage