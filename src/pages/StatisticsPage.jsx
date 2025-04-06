// src/pages/StatisticsPage.jsx - исправленная версия
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaLayerGroup, FaBrain } from 'react-icons/fa';

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    totalMemories: 0,
    rootMemories: 0,
    deepestBranch: 0,
    recentActivity: [],
    byMonth: {},
    byYear: {}
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const calculateStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Загружаем данные из localStorage
        const memoriesData = localStorage.getItem('memories');
        let memories = [];
        
        if (memoriesData) {
          memories = JSON.parse(memoriesData);
        }
        
        // Если данных нет, устанавливаем нулевые значения
        if (!memories || memories.length === 0) {
          setStats({
            totalMemories: 0,
            rootMemories: 0,
            deepestBranch: 0,
            recentActivity: [],
            byMonth: {},
            byYear: {}
          });
          setIsLoading(false);
          return;
        }
        
        // Рассчитываем статистику
        // 1. Подсчет общего количества воспоминаний
        const countAllMemories = (nodes) => {
          if (!nodes || !Array.isArray(nodes)) return 0;
          
          let count = nodes.length;
          for (const node of nodes) {
            if (node.children && node.children.length > 0) {
              count += countAllMemories(node.children);
            }
          }
          return count;
        };
        
        // 2. Определение глубины ветви
        const findDeepestBranch = (nodes, currentDepth = 1) => {
          if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return currentDepth - 1;
          
          let maxDepth = currentDepth;
          
          for (const node of nodes) {
            if (node.children && node.children.length > 0) {
              const childDepth = findDeepestBranch(node.children, currentDepth + 1);
              maxDepth = Math.max(maxDepth, childDepth);
            }
          }
          
          return maxDepth;
        };
        
        // 3. Сбор статистики по датам
        const collectDateStats = () => {
          const byMonth = {};
          const byYear = {};
          const recentNodes = [];
          
          const processNode = (node) => {
            if (!node || !node.date) return;
            
            try {
              const date = new Date(node.date);
              if (isNaN(date.getTime())) return; // Пропускаем, если дата невалидна
              
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              
              // По годам
              byYear[year] = (byYear[year] || 0) + 1;
              
              // По месяцам текущего года
              const currentYear = new Date().getFullYear();
              if (year === currentYear) {
                byMonth[month] = (byMonth[month] || 0) + 1;
              }
              
              // Собираем недавние воспоминания
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
              
              if (date >= sixMonthsAgo) {
                recentNodes.push({
                  id: node.id,
                  title: node.title,
                  date: node.date
                });
              }
              
              // Рекурсивно обрабатываем дочерние элементы
              if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                  processNode(child);
                }
              }
            } catch (e) {
              console.error("Ошибка при обработке узла:", e);
            }
          };
          
          for (const node of memories) {
            processNode(node);
          }
          
          // Сортируем недавние по дате (новые первыми)
          recentNodes.sort((a, b) => {
            try {
              return new Date(b.date) - new Date(a.date);
            } catch (e) {
              return 0;
            }
          });
          
          return { 
            byMonth, 
            byYear, 
            recentNodes: recentNodes.slice(0, 5) 
          };
        };
        
        const totalMemories = countAllMemories(memories);
        const rootMemories = memories.length;
        const deepestBranch = findDeepestBranch(memories);
        const { byMonth, byYear, recentNodes } = collectDateStats();
        
        setStats({
          totalMemories,
          rootMemories,
          deepestBranch,
          recentActivity: recentNodes,
          byMonth,
          byYear
        });
      } catch (err) {
        console.error("Ошибка при расчете статистики:", err);
        setError("Произошла ошибка при формировании статистики");
      } finally {
        setIsLoading(false);
      }
    };
    
    calculateStats();
  }, []);
  
  // Названия месяцев
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка статистики...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Попробовать снова
        </button>
      </div>
    );
  }
  
  return (
    <div className="statistics-page">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaBrain /></div>
          <div className="stat-content">
            <h3>Всего воспоминаний</h3>
            <p className="stat-number">{stats.totalMemories}</p>
            <p className="stat-detail">Корневых: {stats.rootMemories}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon"><FaLayerGroup /></div>
          <div className="stat-content">
            <h3>Глубина дерева</h3>
            <p className="stat-number">{stats.deepestBranch}</p>
            <p className="stat-detail">уровней в самой длинной ветви</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon"><FaCalendarAlt /></div>
          <div className="stat-content">
            <h3>Активность</h3>
            <p className="stat-number">
              {Object.keys(stats.byMonth).length} месяцев
            </p>
            <p className="stat-detail">с добавленными воспоминаниями в этом году</p>
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <h3>Недавние воспоминания</h3>
        <div className="recent-activity">
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            <ul className="activity-list">
              {stats.recentActivity.map(memory => (
                <li key={memory.id} className="activity-item">
                  <span className="activity-title">{memory.title}</span>
                  <span className="activity-date">
                    {new Date(memory.date).toLocaleDateString('ru-RU')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Нет недавних воспоминаний</p>
          )}
        </div>
      </div>
      
      <div className="stats-section">
        <h3>Распределение по месяцам (текущий год)</h3>
        <div className="month-chart">
          {stats.byMonth && Object.keys(stats.byMonth).length > 0 ? (
            <div className="chart-bars">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <div key={month} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(stats.byMonth[month] || 0) * 20}px`,
                      backgroundColor: stats.byMonth[month] ? 'var(--color-primary)' : '#e0e0e0'
                    }}
                  >
                    {stats.byMonth[month] > 0 && (
                      <span className="bar-value">{stats.byMonth[month]}</span>
                    )}
                  </div>
                  <div className="bar-label">{monthNames[month - 1].substring(0, 3)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Нет данных для отображения</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;