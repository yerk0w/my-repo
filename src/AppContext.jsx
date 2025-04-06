// src/AppContext.jsx (исправленный)
import { createContext, useState, useEffect, useCallback } from 'react';

// Создаем контекст
export const AppContext = createContext();

// Провайдер контекста
export const AppProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [currentPage, setCurrentPage] = useState('/');

  // Загрузка данных из локального JSON
  useEffect(() => {
    const loadMemories = async () => {
      try {
        // Сначала пытаемся загрузить из localStorage
        const savedMemories = localStorage.getItem('memories');
        if (savedMemories) {
          setMemories(JSON.parse(savedMemories));
          return;
        }
        
        // Если в localStorage ничего нет, загружаем из файла
        const response = await fetch('/data.json');
        const data = await response.json();
        setMemories(data.memories || []);
      } catch (error) {
        console.error('Ошибка при загрузке воспоминаний:', error);
        // Если файла нет или произошла ошибка, используем пустой массив
        setMemories([]);
      }
    };
    
    loadMemories();
  }, []);

  // Сохранение данных в localStorage (эмуляция БД)
  useEffect(() => {
    if (memories.length > 0) {
      localStorage.setItem('memories', JSON.stringify(memories));
    }
  }, [memories]);

  // Используем useCallback для стабильных ссылок на функции,
  // чтобы избежать ненужных ререндеров
  const addMemory = useCallback((newMemory) => {
    setMemories(currentMemories => {
      const newMemories = [...currentMemories];
      
      if (selectedNodeId) {
        // Добавляем как дочерний элемент
        const addChildToNode = (nodes) => {
          return nodes.map(node => {
            if (node.id === selectedNodeId) {
              return {
                ...node,
                children: [...(node.children || []), newMemory]
              };
            } else if (node.children && node.children.length > 0) {
              return {
                ...node,
                children: addChildToNode(node.children)
              };
            } else {
              return node;
            }
          });
        };
        
        return addChildToNode(newMemories);
      } else {
        // Добавляем как корневой элемент
        newMemories.push(newMemory);
        return newMemories;
      }
    });
    
    setIsFormVisible(false);
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  const handleNodeSelect = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Обработчик переключения формы
  const toggleForm = useCallback(() => {
    // Показываем форму только на странице воспоминаний
    if (currentPage === '/memories') {
      // Используем функциональную форму setState для получения 
      // самого актуального значения
      setIsFormVisible(prevState => {
        const newState = !prevState;
        
        // Если закрываем форму, сбрасываем выбранный узел
        if (!newState) {
          setSelectedNodeId(null);
        }
        
        return newState;
      });
    }
  }, [currentPage]);

  const addChildMemory = useCallback((parentId) => {
    setSelectedNodeId(parentId);
    // Используем таймаут, чтобы избежать гонки состояний
    setTimeout(() => {
      setIsFormVisible(true);
    }, 10);
  }, []);

  // Значение контекста, которое будет доступно потомкам
  const contextValue = {
    memories,
    setMemories,
    isFormVisible,
    setIsFormVisible,
    selectedNodeId,
    setSelectedNodeId,
    currentPage,
    setCurrentPage,
    addMemory,
    handleNodeSelect,
    toggleForm,
    addChildMemory
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};