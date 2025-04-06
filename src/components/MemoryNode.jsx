// src/components/MemoryNode.jsx - с функциями архивирования и удаления
import { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaPlus, FaArchive, FaTrash, FaEllipsisV } from 'react-icons/fa';

const MemoryNode = ({ memory, level = 0, onNodeSelect, onAddChild, onArchive, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  
  const hasChildren = memory.children && memory.children.length > 0;
  const hasMedia = memory.media && memory.media.length > 0;
  
  // Обработчик нажатия на кнопку раскрытия/скрытия
  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  // Обработчик добавления дочернего воспоминания
  const handleAddChild = (e) => {
    e.stopPropagation();
    if (typeof onAddChild === 'function') {
      onAddChild(memory.id);
    }
  };
  
  // Обработчик архивирования воспоминания
  const handleArchive = (e) => {
    e.stopPropagation();
    if (typeof onArchive === 'function') {
      onArchive(memory.id);
    }
    setShowActions(false);
  };
  
  // Обработчик удаления воспоминания
  const handleDelete = (e) => {
    e.stopPropagation();
    if (typeof onDelete === 'function') {
      const confirmDelete = window.confirm(`Вы уверены, что хотите удалить воспоминание "${memory.title}"? Это действие нельзя отменить.`);
      if (confirmDelete) {
        onDelete(memory.id);
      }
    }
    setShowActions(false);
  };
  
  // Обработчик показа/скрытия меню действий
  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };
  
  // Обработчик клика на медиафайл
  const openMediaViewer = (index) => {
    setActiveMediaIndex(index);
    setMediaViewerOpen(true);
  };
  
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
  
  // Определение типа медиа
  const getMediaType = (media) => {
    if (!media || !media.type) return 'unknown';
    
    if (media.type.startsWith('image/')) {
      return 'image';
    } else if (media.type.startsWith('video/')) {
      return 'video';
    }
    
    return 'unknown';
  };
  
  // Навигация по медиа в полноэкранном режиме
  const navigateMedia = (direction) => {
    if (!hasMedia) return;
    
    const newIndex = direction === 'next'
      ? (activeMediaIndex + 1) % memory.media.length
      : (activeMediaIndex - 1 + memory.media.length) % memory.media.length;
    
    setActiveMediaIndex(newIndex);
  };
  
  return (
    <>
      <div className="memory-node-container" style={{ marginLeft: `${level * 20}px` }}>
        <div 
          className="memory-node"
          onClick={() => onNodeSelect && onNodeSelect(memory.id)}
        >
          <div className="memory-node-header">
            {hasChildren && (
              <button 
                className="toggle-expand"
                onClick={toggleExpand}
                aria-label={isExpanded ? "Свернуть" : "Развернуть"}
              >
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            )}
            <h3 className="memory-title">{memory.title}</h3>
            
            <div className="memory-actions">
              <button 
                className="add-child-button"
                onClick={handleAddChild}
                title="Добавить подвоспоминание"
              >
                <FaPlus />
              </button>
              
              <button 
                className="more-actions-button"
                onClick={toggleActions}
                title="Действия"
              >
                <FaEllipsisV />
              </button>
              
              {showActions && (
                <div className="actions-dropdown">
                  <button
                    className="action-button archive-button"
                    onClick={handleArchive}
                    title="Архивировать воспоминание"
                  >
                    <FaArchive /> Архивировать
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={handleDelete}
                    title="Удалить воспоминание"
                  >
                    <FaTrash /> Удалить
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="memory-date">{formatDate(memory.date)}</div>
          
          <div className={`memory-content ${showFullContent ? 'expanded' : ''}`}>
            {memory.content}
            
            {memory.content.length > 150 && !showFullContent && (
              <button 
                className="show-more-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullContent(true);
                }}
              >
                Показать полностью
              </button>
            )}
          </div>
          
          {/* Медиа галерея */}
          {hasMedia && (
            <div className="memory-media-gallery">
              {memory.media.slice(0, 4).map((media, index) => {
                const mediaType = getMediaType(media);
                return (
                  <div 
                    key={media.id || index} 
                    className="memory-media-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      openMediaViewer(index);
                    }}
                  >
                    {mediaType === 'image' && (
                      <img src={media.data} alt={media.name || 'Изображение'} />
                    )}
                    
                    {mediaType === 'video' && (
                      <div className="video-thumbnail">
                        <video src={media.data} />
                        <div className="play-icon"></div>
                      </div>
                    )}
                    
                    {index === 3 && memory.media.length > 4 && (
                      <div className="more-media-overlay">
                        +{memory.media.length - 4}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="children-container">
            {memory.children.map(child => (
              <MemoryNode 
                key={child.id} 
                memory={child} 
                level={level + 1} 
                onNodeSelect={onNodeSelect}
                onAddChild={onAddChild}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Полноэкранный просмотр медиа */}
      {mediaViewerOpen && hasMedia && (
        <div className="media-viewer">
          <div className="media-viewer-overlay" onClick={() => setMediaViewerOpen(false)}></div>
          <div className="media-viewer-content">
            <button 
              className="media-viewer-close" 
              onClick={() => setMediaViewerOpen(false)}
            >
              ×
            </button>
            
            <button 
              className="media-nav prev" 
              onClick={(e) => {
                e.stopPropagation();
                navigateMedia('prev');
              }}
            >
              ‹
            </button>
            
            <div className="media-display">
              {getMediaType(memory.media[activeMediaIndex]) === 'image' && (
                <img 
                  src={memory.media[activeMediaIndex].data} 
                  alt={memory.media[activeMediaIndex].name || 'Изображение'} 
                />
              )}
              
              {getMediaType(memory.media[activeMediaIndex]) === 'video' && (
                <video 
                  src={memory.media[activeMediaIndex].data} 
                  controls 
                  autoPlay
                />
              )}
            </div>
            
            <button 
              className="media-nav next" 
              onClick={(e) => {
                e.stopPropagation();
                navigateMedia('next');
              }}
            >
              ›
            </button>
            
            <div className="media-counter">
              {activeMediaIndex + 1} / {memory.media.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemoryNode;