import React, { useState, useMemo } from 'react';
import { Card, Form, Input, DatePicker, Button, Table, Space, Drawer, Row, Col, Alert, Tag, Statistic } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ThongTinVanBang, DiplomaSearchParams } from './types';
import { useAppContext } from './AppContext';

export const TraCuuVanBang: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<DiplomaSearchParams>({});
  const [selectedRecord, setSelectedRecord] = useState<ThongTinVanBang | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    thongTinVanBangList,
    quyetDinhList,
    soVanBangList,
    incrementTroCuuCount,
  } = useAppContext();

  const handleSearch = (values: any) => {
    console.log('=== SEARCH START ===');
    console.log('Form values:', values);
    console.log('MockData count:', thongTinVanBangList.length);
    
    const paramChecks = {
      soHieuVanBang: values.soHieuVanBang && values.soHieuVanBang.trim() !== '',
      soVaoSo: values.soVaoSo !== undefined && values.soVaoSo !== null && String(values.soVaoSo).trim() !== '',
      maSinhVien: values.maSinhVien && values.maSinhVien.trim() !== '',
      hoTen: values.hoTen && values.hoTen.trim() !== '',
      ngaySinh: values.ngaySinh !== undefined && values.ngaySinh !== null,
    };
    console.log('Parameter checks:', paramChecks);
    
    const filledParams = Object.values(paramChecks).filter(Boolean).length;
    console.log('Filled params count:', filledParams);

    if (filledParams < 2) {
      setErrorMessage('Vui lòng nhập ít nhất 2 tham số tìm kiếm');
      return;
    }

    setErrorMessage('');
    const params: DiplomaSearchParams = {
      soHieuVanBang: values.soHieuVanBang?.trim() || undefined,
      soVaoSo: values.soVaoSo !== undefined && values.soVaoSo !== null ? Number(values.soVaoSo) : undefined,
      maSinhVien: values.maSinhVien?.trim() || undefined,
      hoTen: values.hoTen?.trim() || undefined,
      ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : undefined,
    };
    console.log('Final search params:', params);
    setSearchParams(params);
  };

  const searchResults = useMemo(() => {
    if (!Object.keys(searchParams).length) {
      return [];
    }
    
    console.log('=== FILTER START ===');
    console.log('Search params:', searchParams);
    console.log('Total records:', thongTinVanBangList.length);
    
    const results = thongTinVanBangList.filter((item) => {
      let matches = true;

      if (searchParams.soHieuVanBang) {
        const itemVal = String(item.soHieuVanBang).toLowerCase();
        const searchVal = String(searchParams.soHieuVanBang).toLowerCase();
        const match = itemVal.includes(searchVal);
        matches = matches && match;
      }

      if (searchParams.soVaoSo !== undefined && searchParams.soVaoSo !== null) {
        const match = Number(item.soVaoSo) === Number(searchParams.soVaoSo);
        matches = matches && match;
      }

      if (searchParams.maSinhVien) {
        const itemVal = String(item.maSinhVien).toLowerCase();
        const searchVal = String(searchParams.maSinhVien).toLowerCase();
        const match = itemVal.includes(searchVal);
        matches = matches && match;
      }

      if (searchParams.hoTen) {
        const itemVal = String(item.hoTen).toLowerCase();
        const searchVal = String(searchParams.hoTen).toLowerCase();
        const match = itemVal.includes(searchVal);
        matches = matches && match;
      }

      if (searchParams.ngaySinh) {
        const match = String(item.ngaySinh) === String(searchParams.ngaySinh);
        matches = matches && match;
      }

      if (matches) {
        console.log('✓ MATCHED:', item.soHieuVanBang, item.hoTen);
      }

      return matches;
    });
    
    console.log('Results found:', results.length);
    return results;
  }, [searchParams, thongTinVanBangList]);

  const handleViewDetail = (record: ThongTinVanBang) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
    // Tăng lượt tra cứu cho quyết định
    incrementTroCuuCount(record.quyetDinhId);
  };

  const getQuyetDinhInfo = (id: string) => {
    return quyetDinhList.find((q) => q.id === id);
  };

  const getSoVanBangInfo = (id: string) => {
    return soVanBangList.find((s) => s.id === id);
  };

  const columns = [
    {
      title: 'Số Vào Sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      width: 100,
    },
    {
      title: 'Số Hiệu VB',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 130,
    },
    {
      title: 'Mã SV',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 100,
    },
    {
      title: 'Họ Tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
      width: 110,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_: any, record: ThongTinVanBang) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <h2>Tra Cứu Văn Bằng</h2>
      <Alert
        message="Vui lòng nhập ít nhất 2 tham số tìm kiếm"
        type="info"
        style={{ marginBottom: '20px' }}
      />
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          style={{ marginBottom: '20px' }}
          closable
        />
      )}

      <Card style={{ marginBottom: '20px' }} title="Tìm Kiếm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Số Hiệu Văn Bằng"
                name="soHieuVanBang"
              >
                <Input placeholder="VD: VB-2024-00001" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Số Vào Sổ"
                name="soVaoSo"
              >
                <Input type="number" placeholder="1, 2, 3..." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Mã Sinh Viên"
                name="maSinhVien"
              >
                <Input placeholder="VD: SV001" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Họ Tên"
                name="hoTen"
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Ngày Sinh"
                name="ngaySinh"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" block icon={<SearchOutlined />}>
                  Tìm Kiếm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {searchResults.length > 0 && (
        <Card title={`Kết quả tìm kiếm (${searchResults.length} kết quả)`}>
          <Table
            dataSource={searchResults}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
      
      {Object.keys(searchParams).length > 0 && searchResults.length === 0 && (
        <Alert
          message="Không tìm thấy kết quả phù hợp"
          type="warning"
          style={{ marginTop: '20px' }}
        />
      )}
      )}

      <Drawer
        title="Chi Tiết Văn Bằng"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={800}
      >
        {selectedRecord && (() => {
          const soVanBang = getSoVanBangInfo(selectedRecord.soVanBangId);
          const quyetDinh = getQuyetDinhInfo(selectedRecord.quyetDinhId);
          
          const detailData = [
            { key: 'soVaoSo', label: 'Số Vào Sổ', value: selectedRecord.soVaoSo },
            { key: 'soHieuVanBang', label: 'Số Hiệu Văn Bằng', value: selectedRecord.soHieuVanBang },
            { key: 'maSinhVien', label: 'Mã Sinh Viên', value: selectedRecord.maSinhVien },
            { key: 'hoTen', label: 'Họ Tên', value: selectedRecord.hoTen },
            { key: 'ngaySinh', label: 'Ngày Sinh', value: dayjs(selectedRecord.ngaySinh).format('DD/MM/YYYY') },
            { key: 'divider1', label: '', value: '', isDivider: true },
            { key: 'soHieuSo', label: 'Số Hiệu Sổ', value: soVanBang?.soHieu },
            { key: 'nam', label: 'Năm', value: soVanBang?.nam },
            { key: 'trangThaiSo', label: 'Trạng Thái Sổ', value: <Tag color="green">{soVanBang?.trangThai}</Tag> },
            { key: 'divider2', label: '', value: '', isDivider: true },
            { key: 'soQD', label: 'Số Quyết Định', value: quyetDinh?.soQD },
            { key: 'ngayBanHanh', label: 'Ngày Ban Hành', value: dayjs(quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') },
            { key: 'trichYeu', label: 'Trích Yếu', value: quyetDinh?.trichYeu },
            { key: 'trangThaiQD', label: 'Trạng Thái QĐ', value: <Tag color="blue">{quyetDinh?.trangThai}</Tag> },
          ];
          
          // Add supplementary info
          if (Object.keys(selectedRecord.thongTinPhuLuc).length > 0) {
            detailData.push({ key: 'divider3', label: '', value: '', isDivider: true });
            Object.entries(selectedRecord.thongTinPhuLuc).forEach(([fieldKey, fieldValue]) => {
              detailData.push({ key: fieldKey, label: fieldKey, value: String(fieldValue) });
            });
          }
          
          const columns = [
            {
              title: 'Trường Thông Tin',
              dataIndex: 'label',
              key: 'label',
              width: '40%',
              render: (text: string, record: any) => record.isDivider ? '' : <strong>{text}</strong>,
            },
            {
              title: 'Giá Trị',
              dataIndex: 'value',
              key: 'value',
              width: '60%',
              render: (text: any) => text,
            },
          ];
          
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%' }}>
                <Table
                  dataSource={detailData}
                  columns={columns}
                  rowKey="key"
                  pagination={false}
                  bordered
                  size="small"
                  rowClassName={(record) => record.isDivider ? 'divider-row' : ''}
                />
              </div>
            </div>
          );
        })()}
        <style>{`
          .divider-row {
            background-color: #f5f5f5;
            height: 1px;
          }
          .divider-row td {
            padding: 2px 0 !important;
            border: none;
          }
        `}</style>
      </Drawer>
    </Card>
  );
};
