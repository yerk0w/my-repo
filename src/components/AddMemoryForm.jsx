// src/components/AddMemoryForm.jsx - с поддержкой медиафайлов
import { useState, useRef } from 'react';
import { FaImage, FaVideo, FaFileUpload, FaTimes } from 'react-icons/fa';

const AddMemoryForm = ({ onSubmit, onCancel, isChildMemory = false }) => {
  // Локальное состояние формы
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  // Состояние для медиафайлов
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  
  // Refs для кнопок загрузки медиа
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const gifInputRef = useRef(null);
  
  // Обработчик загрузки файлов
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Проверка размера (ограничение 5MB на файл)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Файлы слишком большие (макс. 5MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Создаем URL для предпросмотра
    const newMediaPreviews = files.map(file => {
      return {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        name: file.name
      };
    });
    
    // Добавляем файлы и предпросмотры
    setMediaFiles(prevFiles => [...prevFiles, ...files]);
    setMediaPreview(prevPreviews => [...prevPreviews, ...newMediaPreviews]);
  };
  
  // Удаление файла
  const removeMedia = (previewId) => {
    const previewIndex = mediaPreview.findIndex(preview => preview.id === previewId);
    
    if (previewIndex !== -1) {
      // Освобождаем URL объект для предотвращения утечек памяти
      URL.revokeObjectURL(mediaPreview[previewIndex].url);
      
      // Удаляем превью и файл
      const newPreviews = mediaPreview.filter(preview => preview.id !== previewId);
      const newFiles = [...mediaFiles];
      newFiles.splice(previewIndex, 1);
      
      setMediaPreview(newPreviews);
      setMediaFiles(newFiles);
    }
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!title.trim() || !content.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    // Преобразуем файлы в base64 для локального хранения
    const processFiles = async () => {
      const mediaData = await Promise.all(
        mediaFiles.map(async (file, index) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                id: mediaPreview[index].id,
                data: reader.result,
                type: file.type,
                name: file.name
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );
      
      // Передаем данные родительскому компоненту
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        date,
        media: mediaData
      });
    };
    
    // Обрабатываем файлы и отправляем форму
    processFiles();
    
    // Сбрасываем форму
    resetForm();
  };
  
  // Сброс формы
  const resetForm = () => {
    setTitle('');
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    
    // Очищаем медиафайлы
    mediaPreview.forEach(preview => URL.revokeObjectURL(preview.url));
    setMediaFiles([]);
    setMediaPreview([]);
  };
  
  // Обработчик отмены
  const handleCancel = () => {
    // Сбрасываем форму
    resetForm();
    
    // Вызываем функцию отмены из родительского компонента
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };
  
  return (
    <div className="memory-form-container">
      <h2>{isChildMemory ? 'Добавить подвоспоминание' : 'Добавить новое воспоминание'}</h2>
      
      <form onSubmit={handleSubmit} className="memory-form">
        <div className="form-group">
          <label htmlFor="memory-title">Заголовок:</label>
          <input
            id="memory-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название воспоминания"
            required
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="memory-date">Дата:</label>
          <input
            id="memory-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="memory-content">Содержание:</label>
          <textarea
            id="memory-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Описание вашего воспоминания..."
            rows={5}
            required
          />
        </div>
        
        {/* Медиа файлы */}
        <div className="form-group">
          <label>Медиа файлы:</label>
          <div className="media-buttons">
            <button 
              type="button" 
              className="media-button"
              onClick={() => imageInputRef.current.click()}
            >
              <FaImage /> Изображение
            </button>
            <button 
              type="button" 
              className="media-button"
              onClick={() => videoInputRef.current.click()}
            >
              <FaVideo /> Видео
            </button>
            <button 
              type="button" 
              className="media-button"
              onClick={() => gifInputRef.current.click()}
            >
              <FaFileUpload /> GIF
            </button>
          </div>
          
          {/* Скрытые инпуты для загрузки файлов */}
          <input 
            type="file" 
            ref={imageInputRef} 
            style={{ display: 'none' }}
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
            multiple
          />
          <input 
            type="file" 
            ref={videoInputRef} 
            style={{ display: 'none' }}
            accept="video/mp4, video/webm"
            onChange={handleFileChange}
            multiple
          />
          <input 
            type="file" 
            ref={gifInputRef} 
            style={{ display: 'none' }}
            accept="image/gif"
            onChange={handleFileChange}
            multiple
          />
          
          {/* Превью загруженных файлов */}
          {mediaPreview.length > 0 && (
            <div className="media-preview-container">
              {mediaPreview.map((preview) => (
                <div key={preview.id} className="media-preview-item">
                  <button 
                    type="button"
                    className="remove-media-button"
                    onClick={() => removeMedia(preview.id)}
                  >
                    <FaTimes />
                  </button>
                  
                  {preview.type === 'image' ? (
                    <img 
                      src={preview.url} 
                      alt={preview.name}
                      className="media-preview-image"
                    />
                  ) : (
                    <video 
                      src={preview.url}
                      controls
                      className="media-preview-video"
                    />
                  )}
                  
                  <span className="media-preview-name">{preview.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Сохранить</button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={handleCancel}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemoryForm;