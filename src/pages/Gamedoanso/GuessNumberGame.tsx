import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Typography, Space, Alert, List, Tag, Result } from 'antd';
import { ReloadOutlined , SendOutlined } from '@ant-design/icons';   

const { Title , Text } = Typography ;

const GuessNumberGame: React.FC = () => {
    const [randomNumber , setRandomNumber] = useState<number>(0) ;
    const [guessValue , setGuessValue] = useState<number | null>(null);
    const [history , setHistory] = useState<{ value: number; hint: string }[]>([]);
    const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [message, setMessage] = useState<string>('Hãy nhập một số từ 1 đến 100');

const initGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setHistory([]);
    setGuessValue(null);
    setStatus('playing');
    setMessage('Hệ thống trò chơi đã sinh số mới! Bạn có 10 lượt đoán số');
};

useEffect(() => {
    initGame();
}, []);

const handleGuess = () => {
    if (guessValue === null || status !== 'playing') return;

    let hint = '';
    const newHistory = [...history];

    if (guessValue < randomNumber) {
        hint = 'Bạn đoán quá thấp!';
        setMessage(hint);
    } else if(guessValue > randomNumber) {
        hint = 'Bạn đoán quá cao!';
        setMessage(hint);
    } else {
        setStatus('won');
        setMessage('Chúc mừng! Bạn đã đoán đúng!') ;
        return;
    }
    
    newHistory.unshift({ value: guessValue, hint});
    setHistory(newHistory);
    setGuessValue(null);

    if ( newHistory.length >= 10) {
        setStatus('lost');
        setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);      
    }
};
return (
    <Card 
    title={<Title level={3}>Bài 1: Trò chơi đoán số</Title>}
    style={{ maxWidth: 600, margin: '20px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        
        {status === 'playing' ? (
          <>
            <Alert message={message} type="info" showIcon />
            <Text strong>Lượt đoán còn lại: <Tag color="orange">{10 - history.length}</Tag></Text>
            
            <Space direction="horizontal" style={{ width: '100%' }} size="middle">
              <InputNumber
                min={1}
                max={100}
                style={{ flex: 1 }}
                placeholder="Nhập số từ 1-100..."
                value={guessValue}
                onChange={(val) => setGuessValue(val)}
                onPressEnter={handleGuess}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleGuess}>
                Đoán
              </Button>
            </Space>
          </>
        ) : (
          <Result
            status={status === 'won' ? 'success' : 'error'}
            title={message}
            extra={
              <Button type="primary" icon={<ReloadOutlined />} onClick={initGame}>
                Chơi lại
              </Button>
            }
          />
        )}

        <List
          header={<div>Lịch sử dự đoán</div>}
          bordered
          dataSource={history}
          renderItem={(item, index) => (
            <List.Item>
              <Text>Lần {10 - (history.length - 1 - index)}: </Text>
              <Tag color="blue">{item.value}</Tag>
              <Text type="secondary">{item.hint}</Text>
            </List.Item>
          )}
          style={{ maxHeight: 200, overflow: 'auto' }}
        />
      </Space>
    </Card>
  );
};

export default GuessNumberGame;
