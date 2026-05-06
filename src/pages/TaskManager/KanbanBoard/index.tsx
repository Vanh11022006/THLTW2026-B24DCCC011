import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Typography } from 'antd';
import { getTasks, saveTasks, Task, PriorityConfig } from '../data';

const { Title, Text } = Typography;

const COLUMNS = [
  { id: 'TODO', title: 'Cần làm' },
  { id: 'IN_PROGRESS', title: 'Đang làm' },
  { id: 'DONE', title: 'Hoàn thành' }
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const updatedTasks = tasks.map(t => {
      if (t.id === draggableId) {
        return { ...t, status: destination.droppableId as Task['status'] };
      }
      return t;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <PageContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} style={{ flex: '1', minWidth: '320px', background: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  {col.title} ({colTasks.length})
                </Title>
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '500px' }}>
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              {...provided.dragHandleProps} 
                              style={{ marginBottom: '12px', ...provided.draggableProps.style }}
                            >
                              <Card size="small" hoverable>
                                <div style={{ marginBottom: 8 }}>
                                  <Tag color={PriorityConfig[task.priority].color}>
                                    {PriorityConfig[task.priority].text}
                                  </Tag>
                                </div>
                                <Text strong>{task.title}</Text>
                                <div style={{ marginTop: 8 }}>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Hạn: {task.deadline}
                                  </Text>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </PageContainer>
  );
};

export default KanbanBoard;