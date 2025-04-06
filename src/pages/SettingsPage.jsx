// src/pages/SettingsPage.jsx - с сохранением темы
import { useState, useEffect } from 'react';
import { FaPalette, FaDownload, FaUpload, FaTrash, FaMoon, FaSun } from 'react-icons/fa';
import { getCurrentTheme, toggleTheme } from '../utils/themeManager';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [autoSave, setAutoSave] = useState(true);
  const [confirmDeleteEnabled, setConfirmDeleteEnabled] = useState(true);
  
  // Загружаем настройки при монтировании
  useEffect(() => {
    const loadSettings = () => {
      // Настройка темы
      const currentTheme = getCurrentTheme();
      setDarkMode(currentTheme === 'dark');
      
      // Другие настройки из localStorage
      const savedSettings = localStorage.getItem('app_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setFontSize(settings.fontSize ?? 'medium');
        setAutoSave(settings.autoSave ?? true);
        setConfirmDeleteEnabled(settings.confirmDeleteEnabled ?? true);
      }
    };
    
    loadSettings();
  }, []);
  
  // Сохраняем настройки при изменении
  useEffect(() => {
    const settings = {
      fontSize,
      autoSave,
      confirmDeleteEnabled
    };
    
    localStorage.setItem('app_settings', JSON.stringify(settings));
    
    // Применяем размер шрифта
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
  }, [fontSize, autoSave, confirmDeleteEnabled]);
  
  // Обработчик переключения темы
  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setDarkMode(newTheme === 'dark');
  };
  
  // Функция для экспорта данных
  const exportData = () => {
    try {
      // Получаем основные воспоминания
      const memories = localStorage.getItem('memories') || '[]';
      
      // Получаем архивированные воспоминания
      const archived = localStorage.getItem('archived_memories') || '[]';
      
      // Получаем настройки
      const settings = localStorage.getItem('app_settings') || '{}';
      
      // Формируем полный набор данных
      const dataStr = JSON.stringify({
        memories: JSON.parse(memories),
        archived_memories: JSON.parse(archived),
        settings: JSON.parse(settings),
        theme: getCurrentTheme(),
        exportDate: new Date().toISOString()
      });
      
      // Создаем ссылку для скачивания
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Имя файла с датой
      const exportFileDefaultName = `memory_tree_export_${new Date().toISOString().slice(0,10)}.json`;
      
      // Создаем элемент для скачивания
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Ошибка при экспорте данных:', error);
      alert('Произошла ошибка при экспорте данных');
    }
  };
  
  // Функция для импорта данных
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Проверяем формат данных
        if (data) {
          // Импортируем основные воспоминания
          if (data.memories) {
            localStorage.setItem('memories', JSON.stringify(data.memories));
          }
          
          // Импортируем архивированные воспоминания
          if (data.archived_memories) {
            localStorage.setItem('archived_memories', JSON.stringify(data.archived_memories));
          }
          
          // Импортируем настройки
          if (data.settings) {
            localStorage.setItem('app_settings', JSON.stringify(data.settings));
            
            // Применяем настройки к текущему состоянию
            setFontSize(data.settings.fontSize || 'medium');
            setAutoSave(data.settings.autoSave || true);
            setConfirmDeleteEnabled(data.settings.confirmDeleteEnabled || true);
          }
          
          // Применяем тему, если она указана
          if (data.theme) {
            // Импортируем через localStorage для сохранения между сессиями
            localStorage.setItem('app_theme', data.theme);
            
            // Применяем непосредственно
            document.body.classList.toggle('dark-theme', data.theme === 'dark');
            setDarkMode(data.theme === 'dark');
          }
          
          alert('Данные успешно импортированы. Перезагрузите страницу, чтобы увидеть изменения.');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          alert('Некорректный формат файла');
        }
      } catch (error) {
        console.error('Ошибка при импорте данных:', error);
        alert('Произошла ошибка при импорте данных');
      }
    };
    reader.readAsText(file);
    
    // Сбрасываем значение input, чтобы можно было выбрать тот же файл повторно
    event.target.value = null;
  };
  
  // Функция для очистки всех данных
  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все воспоминания? Это действие нельзя отменить.')) {
      localStorage.removeItem('memories');
      localStorage.removeItem('archived_memories');
      alert('Все воспоминания удалены');
    }
  };
  
  return (
    <div className="settings-page">
      <section className="settings-section">
        <h2>Внешний вид</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="dark-mode-toggle">
              {darkMode ? 
                <><FaMoon /> Темная тема</> : 
                <><FaSun /> Светлая тема</>
              }
            </label>
            <p className="setting-description">
              {darkMode ? 
                "Темный режим активирован" : 
                "Переключить на темный режим отображения"
              }
            </p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input 
                id="dark-mode-toggle"
                type="checkbox" 
                checked={darkMode}
                onChange={handleThemeToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="font-size-select">Размер шрифта</label>
            <p className="setting-description">Настройка размера текста в приложении</p>
          </div>
          <div className="setting-control">
            <select 
              id="font-size-select"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              <option value="small">Маленький</option>
              <option value="medium">Средний</option>
              <option value="large">Большой</option>
            </select>
          </div>
        </div>
      </section>
      
      <section className="settings-section">
        <h2>Параметры приложения</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="auto-save-toggle">Автосохранение</label>
            <p className="setting-description">Автоматически сохранять изменения</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input 
                id="auto-save-toggle"
                type="checkbox" 
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label htmlFor="confirm-delete-toggle">Подтверждение удаления</label>
            <p className="setting-description">Запрашивать подтверждение перед удалением</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input 
                id="confirm-delete-toggle"
                type="checkbox" 
                checked={confirmDeleteEnabled}
                onChange={(e) => setConfirmDeleteEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>
      
      <section className="settings-section">
        <h2>Данные и резервное копирование</h2>
        
        <div className="data-button-container">
          <button 
            className="data-button export-button"
            onClick={exportData}
          >
            <FaDownload /> Экспорт данных
          </button>
          
          <label className="data-button import-button">
            <FaUpload /> Импорт данных
            <input 
              type="file" 
              accept=".json"
              style={{ display: 'none' }}
              onChange={importData}
            />
          </label>
          
          <button 
            className="data-button clear-button"
            onClick={clearAllData}
          >
            <FaTrash /> Удалить все данные
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;