// src/pages/ArchivePage.jsx - обновленная версия
import { useState, useEffect } from 'react';
import { FaSearch, FaTrashRestore, FaTrash, FaCalendarAlt } from 'react-icons/fa';

const ArchivePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [archivedMemories, setArchivedMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Загрузка архивированных воспоминаний
  useEffect(() => {
    const loadArchive = () => {
      try {
        setIsLoading(true);
        
        const savedArchive = localStorage.getItem('archived_memories');
        if (savedArchive) {
          setArchivedMemories(JSON.parse(savedArchive));
        }
      } catch (error) {
        console.error('Ошибка при загрузке архива:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArchive();
  }, []);
  
  // Сохранение изменений в архиве
  useEffect(() => {
    if (archivedMemories.length > 0) {
      localStorage.setItem('archived_memories', JSON.stringify(archivedMemories));
    } else if (archivedMemories.length === 0) {
      localStorage.setItem('archived_memories', JSON.stringify([]));
    }
  }, [archivedMemories]);
  
  // Обработчик восстановления воспоминания
  const handleRestore = (memoryId) => {
    try {
      // Находим воспоминание в архиве
      const memoryIndex = archivedMemories.findIndex(memory => memory.id === memoryId);
      if (memoryIndex === -1) return;
      
      const memoryToRestore = archivedMemories[memoryIndex];
      
      // Загружаем текущие активные воспоминания
      const currentMemories = JSON.parse(localStorage.getItem('memories') || '[]');
      
      // Добавляем восстановленное воспоминание
      const updatedMemories = [...currentMemories, memoryToRestore];
      
      // Сохраняем обновленные активные воспоминания
      localStorage.setItem('memories', JSON.stringify(updatedMemories));
      
      // Удаляем из архива
      const updatedArchive = archivedMemories.filter(memory => memory.id !== memoryId);
      setArchivedMemories(updatedArchive);
      
      alert('Воспоминание успешно восстановлено!');
    } catch (error) {
      console.error('Ошибка при восстановлении воспоминания:', error);
      alert('Произошла ошибка при восстановлении воспоминания.');
    }
  };
  
  // Обработчик удаления воспоминания из архива
  const handleDelete = (memoryId) => {
    try {
      if (window.confirm('Вы уверены, что хотите безвозвратно удалить это воспоминание?')) {
        const updatedArchive = archivedMemories.filter(memory => memory.id !== memoryId);
        setArchivedMemories(updatedArchive);
        
        alert('Воспоминание удалено из архива.');
      }
    } catch (error) {
      console.error('Ошибка при удалении воспоминания из архива:', error);
      alert('Произошла ошибка при удалении воспоминания.');
    }
  };
  
  // Получаем все уникальные годы из архивированных воспоминаний
  const years = [...new Set(archivedMemories.map(memory => 
    new Date(memory.date).getFullYear()
  ))].sort((a, b) => b - a); // Сортировка по убыванию
  
  // Фильтрация по поиску и году
  const filteredMemories = archivedMemories.filter(memory => {
    const matchesSearch = 
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      memory.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = 
      selectedYear === 'all' || 
      new Date(memory.date).getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesYear;
  });
  
  // Форматирование даты
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка архива...</p>
      </div>
    );
  }
  
  return (
    <div className="archive-page">
      <div className="archive-header">
        <h2>Архив воспоминаний</h2>
        <p className="archive-description">
          Здесь хранятся архивированные воспоминания. Вы можете восстановить их или удалить безвозвратно.
        </p>
      </div>
      
      <div className="archive-filters">
        <div className="search-bar">
          <FaSearch />
          <input 
            type="text"
            placeholder="Поиск в архиве..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="year-filter">
          <label htmlFor="year-select">Фильтр по году:</label>
          <select 
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">Все годы</option>
            {years.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="archive-list">
        {filteredMemories.length > 0 ? (
          filteredMemories.map(memory => (
            <div key={memory.id} className="archive-item">
              <div className="archive-item-header">
                <h3>{memory.title}</h3>
                <div className="archive-dates">
                  <span className="archive-date" title="Дата создания">
                    <FaCalendarAlt /> {formatDate(memory.date)}
                  </span>
                  {memory.archiveDate && (
                    <span className="archive-date archived-date" title="Дата архивирования">
                      Архивировано: {formatDate(memory.archiveDate)}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="archive-content">{memory.content}</p>
              
              {/* Медиа галерея, если есть */}
              {memory.media && memory.media.length > 0 && (
                <div className="archive-media">
                  <div className="archive-media-preview">
                    {memory.media[0].type && memory.media[0].type.startsWith('image/') ? (
                      <img 
                        src={memory.media[0].data} 
                        alt={memory.media[0].name || 'Изображение'}
                      />
                    ) : (
                      <div className="video-thumbnail">
                        <div className="play-icon"></div>
                      </div>
                    )}
                  </div>
                  {memory.media.length > 1 && (
                    <span className="more-media-badge">+{memory.media.length - 1}</span>
                  )}
                </div>
              )}
              
              <div className="archive-actions">
                <button 
                  className="restore-button"
                  onClick={() => handleRestore(memory.id)}
                  title="Восстановить воспоминание"
                >
                  <FaTrashRestore /> Восстановить
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(memory.id)}
                  title="Удалить безвозвратно"
                >
                  <FaTrash /> Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-archive">
            <p>Архив пуст или по вашему запросу ничего не найдено.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;