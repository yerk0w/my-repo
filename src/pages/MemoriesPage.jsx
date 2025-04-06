// src/pages/MemoriesPage.jsx - с функциями архивирования и удаления
import { useState, useEffect } from 'react';
import MemoryTree from '../components/MemoryTree';
import AddMemoryForm from '../components/AddMemoryForm';
import { FaArchive } from 'react-icons/fa';

// Локальная функция для генерации уникального ID
const generateId = () => `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const MemoriesPage = () => {
  // Локальное состояние для этой страницы
  const [memories, setMemories] = useState([]);
  const [archivedMemories, setArchivedMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояние формы и выбранного узла
  const [showForm, setShowForm] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Загружаем активные воспоминания
        const savedMemories = localStorage.getItem('memories');
        if (savedMemories) {
          setMemories(JSON.parse(savedMemories));
        }
        
        // Загружаем архивированные воспоминания
        const savedArchive = localStorage.getItem('archived_memories');
        if (savedArchive) {
          setArchivedMemories(JSON.parse(savedArchive));
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Сохраняем данные при их изменении
  useEffect(() => {
    if (memories.length > 0) {
      localStorage.setItem('memories', JSON.stringify(memories));
    } else {
      localStorage.setItem('memories', JSON.stringify([]));
    }
  }, [memories]);
  
  // Сохраняем архив при его изменении
  useEffect(() => {
    if (archivedMemories.length > 0) {
      localStorage.setItem('archived_memories', JSON.stringify(archivedMemories));
    } else {
      localStorage.setItem('archived_memories', JSON.stringify([]));
    }
  }, [archivedMemories]);
  
  // Обработчик добавления воспоминания
  const handleAddMemory = (memoryData) => {
    const newMemory = {
      id: generateId(),
      title: memoryData.title,
      content: memoryData.content,
      date: memoryData.date,
      media: memoryData.media || [],
      children: []
    };
    
    // Новое состояние для проверки
    let newMemories;
    
    if (selectedNodeId) {
      // Добавляем как дочерний элемент к выбранному узлу
      newMemories = memories.map(memory => addToNode(memory, selectedNodeId, newMemory));
    } else {
      // Добавляем как корневой элемент
      newMemories = [...memories, newMemory];
    }
    
    // Обновляем состояние
    setMemories(newMemories);
    
    // Закрываем форму
    setShowForm(false);
    
    // Сбрасываем выбранный узел
    setSelectedNodeId(null);
  };
  
  // Рекурсивная функция для добавления к конкретному узлу
  const addToNode = (node, targetId, newChild) => {
    if (node.id === targetId) {
      return {
        ...node,
        children: [...(node.children || []), newChild]
      };
    }
    
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: node.children.map(childNode => addToNode(childNode, targetId, newChild))
      };
    }
    
    return node;
  };
  
  // Рекурсивная функция для поиска узла по ID
  const findNodeById = (nodes, id, parentNodes = []) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === id) {
        return { node, path: [...parentNodes, i] };
      }
      
      if (node.children && node.children.length > 0) {
        const result = findNodeById(node.children, id, [...parentNodes, i, 'children']);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  // Функция архивирования воспоминания
  const handleArchiveMemory = (memoryId) => {
    const result = findNodeById(memories, memoryId);
    
    if (!result) return;
    
    const { node: memoryToArchive, path } = result;
    
    // Создаем копию для архива
    const archivedNode = { ...memoryToArchive, archiveDate: new Date().toISOString() };
    
    // Добавляем в архив
    setArchivedMemories(prev => [...prev, archivedNode]);
    
    // Удаляем из активных воспоминаний
    const newMemories = [...memories];
    let current = newMemories;
    
    // Проходим по пути до родительского массива
    for (let i = 0; i < path.length - 1; i += 2) {
      const idx = path[i];
      const prop = path[i + 1];
      current = current[idx][prop];
    }
    
    // Удаляем из родительского массива
    current.splice(path[path.length - 1], 1);
    
    setMemories(newMemories);
  };
  
  // Функция удаления воспоминания
  const handleDeleteMemory = (memoryId) => {
    const result = findNodeById(memories, memoryId);
    
    if (!result) return;
    
    const { path } = result;
    
    // Удаляем из активных воспоминаний
    const newMemories = [...memories];
    let current = newMemories;
    
    // Проходим по пути до родительского массива
    for (let i = 0; i < path.length - 1; i += 2) {
      const idx = path[i];
      const prop = path[i + 1];
      current = current[idx][prop];
    }
    
    // Удаляем из родительского массива
    current.splice(path[path.length - 1], 1);
    
    setMemories(newMemories);
  };
  
  // Обработчик для кнопки "+"
  const handleToggleForm = () => {
    setShowForm(prev => !prev);
    if (showForm) {
      setSelectedNodeId(null);
    }
  };
  
  // Функция для добавления подвоспоминания
  const handleAddChild = (parentId) => {
    setSelectedNodeId(parentId);
    setShowForm(true);
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка воспоминаний...</p>
      </div>
    );
  }
  
  return (
    <div className="memories-page">
      <div className="memories-header">
        <h2>{showForm ? (selectedNodeId ? 'Добавить подвоспоминание' : 'Новое воспоминание') : 'Ваши воспоминания'}</h2>
        <div className="header-actions">
          {!showForm && (
            <div className="archive-info">
              <FaArchive /> В архиве: {archivedMemories.length}
            </div>
          )}
          <button 
            className={`toggle-form-button ${showForm ? 'cancel' : 'add'}`}
            onClick={handleToggleForm}
          >
            {showForm ? 'Отменить' : 'Добавить воспоминание'}
          </button>
        </div>
      </div>
      
      <div className="memories-content">
        {showForm ? (
          <AddMemoryForm 
            onSubmit={handleAddMemory}
            onCancel={() => {
              setShowForm(false);
              setSelectedNodeId(null);
            }}
            isChildMemory={selectedNodeId !== null}
          />
        ) : (
          <MemoryTree 
            memories={memories}
            onAddChild={handleAddChild}
            onNodeSelect={setSelectedNodeId}
            onArchiveMemory={handleArchiveMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        )}
      </div>
    </div>
  );
};

export default MemoriesPage;