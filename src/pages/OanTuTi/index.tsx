import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Typography, Space, Alert, List, Tag, Result } from 'antd';
import { ReloadOutlined , SendOutlined } from '@ant-design/icons';   

const { Title , Text } = Typography ;
const OanTuTi: React.FC = () => {
    const [randomNumber , setRandomNumber] = useState<number>(0) ;
    const choices = ['kéo', 'búa', 'bao'];
    const [computerChoice, setComputerChoice] = useState<string>('');
    const [guessValue , setGuessValue] = useState<number | null>(null);
    const [history , setHistory] = useState<{ value: number; hint: string }[]>([]);
    const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [message, setMessage] = useState<string>('Hãy chọn kéo, búa hoặc bao');

const initGame = () => {
    setRandomNumber(Math.floor(Math.random()));
    setHistory([]);
    setGuessValue(null);
    setStatus('playing');
    setMessage('Trò chơi bắt đầu! Vui lòng chon kéo, búa hoặc bao');
};

useEffect(() => {
    initGame();
}, []);

const handleGuess = () => {
    if (guessValue === null || status !== 'playing') return;

    let hint = '';
    const newHistory = [...history];
    const userChoice = choices[guessValue - 1];
    const computerRandomIndex = Math.floor(Math.random() * 3);
    const computerRandomChoice = choices[computerRandomIndex];
    
    setComputerChoice(computerRandomChoice);
    
    if (userChoice === computerRandomChoice) {
        hint = `Hòa! Cả hai chọn ${userChoice}`;
        setMessage(hint);
    } else if (
        (userChoice === 'kéo' && computerRandomChoice === 'bao') ||
        (userChoice === 'búa' && computerRandomChoice === 'kéo') ||
        (userChoice === 'bao' && computerRandomChoice === 'búa')
    ) {
        setStatus('won');
        hint = `Bạn thắng! ${userChoice} đánh bại ${computerRandomChoice}`;
        setMessage(hint);
        return;
    } else {
        hint = `Bạn thua! ${computerRandomChoice} đánh bại ${userChoice}`;
        setMessage(hint);
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
    title={<Title level={3}>Bài 1: Trò chơi oản tù tì</Title>}
    style={{ maxWidth: 600, margin: '20px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        
        {status === 'playing' ? (
          <>
            <Alert message={message} type="info" showIcon />
            <Text strong>Lượt chơi còn lại: <Tag color="orange">{10 - history.length}</Tag></Text>
            
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Space direction="horizontal" style={{ width: '100%' }} size="large">
                <Button 
                  size="large"
                  onClick={() => { setGuessValue(1); setGuessValue(1); handleGuess(); }}
                  style={{ flex: 1 }}
                >
                  ✌️ Kéo
                </Button>
                <Button 
                  size="large"
                  onClick={() => { setGuessValue(2); setGuessValue(2); handleGuess(); }}
                  style={{ flex: 1 }}
                >
                  ✊ Búa
                </Button>
                <Button 
                  size="large"
                  onClick={() => { setGuessValue(3); setGuessValue(3); handleGuess(); }}
                  style={{ flex: 1 }}
                >
                  ✋ Bao
                </Button>
              </Space>
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
          header={<div>Lịch sử trò chơi</div>}
          bordered
          dataSource={history}
          renderItem={(item, index) => (
            <List.Item>
              <Text>Lần {10 - (history.length - 1 - index)}: </Text>
              <Tag color="blue">{choices[item.value - 1]}</Tag>
              <Text type="secondary">{item.hint}</Text>
            </List.Item>
          )}
          style={{ maxHeight: 200, overflow: 'auto' }}
        />
      </Space>
    </Card>
  );
};

export default OanTuTi;


