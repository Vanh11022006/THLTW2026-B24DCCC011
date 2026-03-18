import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button, message, Card, Divider } from 'antd';
import type { Service, Appointment } from './types';
import { mockServices } from './mockData';
import { useAppContext } from './AppContext';
import dayjs from 'dayjs';

export const BookingForm: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { appointments, addAppointment, employees } = useAppContext();

  const { Option } = Select;

  const handleServiceChange = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
    }
  };

  const handleDateTimeChange = () => {
    const date = form.getFieldValue('date');
    const startTime = form.getFieldValue('startTime');
    const employeeId = form.getFieldValue('employeeId');
    const serviceId = form.getFieldValue('serviceId');

    if (!date || !startTime || !employeeId || !serviceId) return;

    // Kiểm tra nhân viên có làm việc ngày này không
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      const dayOfWeek = date.day();
      if (!employee.workSchedule.workingDays.includes(dayOfWeek)) {
        message.warning('Nhân viên này không làm việc vào ngày bạn chọn!');
        return;
      }

      // Kiểm tra giờ trong khoảng làm việc
      const startTimeStr = startTime.format('HH:mm');
      if (startTimeStr < employee.workSchedule.start || startTimeStr > employee.workSchedule.end) {
        message.warning('Giờ được chọn ngoài khung giờ làm việc của nhân viên!');
        return;
      }
    }

    // Kiểm tra trùng lịch
    const service = mockServices.find(s => s.id === serviceId);
    if (service) {
      const dateStr = date.format('YYYY-MM-DD');
      const startTimeStr = startTime.format('HH:mm');
      const endTime = dayjs(`${dateStr} ${startTimeStr}`, 'YYYY-MM-DD HH:mm').add(service.durationMinutes, 'minute');
      const endTimeStr = endTime.format('HH:mm');

      const conflicts = appointments.filter(apt => {
        if (apt.employeeId !== employeeId || apt.date !== dateStr || apt.status === 'CANCELLED') {
          return false;
        }

        const aptStart = dayjs(`${apt.date} ${apt.startTime}`, 'YYYY-MM-DD HH:mm');
        const aptEnd = dayjs(`${apt.date} ${apt.endTime}`, 'YYYY-MM-DD HH:mm');
        const newStart = dayjs(`${dateStr} ${startTimeStr}`, 'YYYY-MM-DD HH:mm');
        const newEnd = dayjs(`${dateStr} ${endTimeStr}`, 'YYYY-MM-DD HH:mm');

        return newStart < aptEnd && newEnd > aptStart;
      });

      if (conflicts.length > 0) {
        message.error('Nhân viên này đã có lịch hẹn vào thời gian này!');
        return;
      }

      // Kiểm tra giới hạn khách hàng hàng ngày
      const dailyCount = appointments.filter(
        apt =>
          apt.employeeId === employeeId &&
          apt.date === dateStr &&
          apt.status !== 'CANCELLED'
      ).length;

      if (dailyCount >= employee!.dailyLimit) {
        message.error(`Nhân viên này đã đạt giới hạn ${employee!.dailyLimit} khách trong ngày!`);
        return;
      }

      message.success('Lịch trống! Bạn có thể tiếp tục đặt lịch.');
    }
  };

  const onFinish = (values: any) => {
    const service = mockServices.find(s => s.id === values.serviceId);
    const dateStr = values.date.format('YYYY-MM-DD');
    const startTimeStr = values.startTime.format('HH:mm');
    const endTimeStr = values.startTime.add(service!.durationMinutes, 'minute').format('HH:mm');

    const newAppointment: Appointment = {
      id: `apt${Date.now()}`,
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      customerEmail: values.customerEmail,
      serviceId: values.serviceId,
      employeeId: values.employeeId,
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      status: 'PENDING',
      totalPrice: service!.price,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addAppointment(newAppointment);
    message.success('Đặt lịch thành công! Đang chờ xác nhận từ nhân viên.');
    form.resetFields();
    setSelectedService(null);
  };

  return (
    <Card title="Đặt lịch hẹn dịch vụ" style={{ maxWidth: 600 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="Nhập tên của bạn" />
        </Form.Item>

        <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true }]}>
          <Input placeholder="0901234567" />
        </Form.Item>

        <Form.Item name="customerEmail" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="email@example.com" />
        </Form.Item>

        <Form.Item name="serviceId" label="Chọn dịch vụ" rules={[{ required: true }]}>
          <Select placeholder="Chọn dịch vụ" onChange={handleServiceChange}>
            {mockServices.map(svc => (
              <Option key={svc.id} value={svc.id}>
                {svc.name} - {svc.durationMinutes} phút - {svc.price.toLocaleString('vi-VN')} VND
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="employeeId" label="Nhân viên phục vụ" rules={[{ required: true }]}>
          <Select placeholder="Chọn nhân viên">
            {employees.map(emp => (
              <Option key={emp.id} value={emp.id}>
                {emp.name} (⭐ {emp.averageRating})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabledDate={(current) => current && current < dayjs().startOf('day')} onChange={handleDateTimeChange} />
        </Form.Item>

        <Form.Item name="startTime" label="Giờ hẹn" rules={[{ required: true }]}>
          <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} onChange={handleDateTimeChange} />
        </Form.Item>

        {selectedService && (
          <>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <strong>Dịch vụ:</strong> {selectedService.name} ({selectedService.durationMinutes} phút)
              <br />
              <strong>Giá:</strong> {selectedService.price.toLocaleString('vi-VN')} VND
            </div>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác nhận đặt lịch
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};