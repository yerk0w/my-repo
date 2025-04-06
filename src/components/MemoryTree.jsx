// src/components/MemoryTree.jsx - обновленная версия
import MemoryNode from './MemoryNode';

const MemoryTree = ({ 
  memories, 
  onNodeSelect, 
  onAddChild, 
  onArchiveMemory, 
  onDeleteMemory 
}) => {
  return (
    <div className="memory-tree">
      {memories && memories.length > 0 ? (
        memories.map(memory => (
          <MemoryNode 
            key={memory.id} 
            memory={memory} 
            onNodeSelect={onNodeSelect}
            onAddChild={onAddChild}
            onArchive={onArchiveMemory}
            onDelete={onDeleteMemory}
          />
        ))
      ) : (
        <div className="empty-state">
          <p>У вас пока нет воспоминаний. Нажмите "Добавить воспоминание" чтобы создать первое.</p>
        </div>
      )}
    </div>
  );
};

export default MemoryTree;