import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useRequest } from 'umi';
import ReactApexChart from 'react-apexcharts';
import { getReportStats, exportReport, getChartData } from '@/services/QuanlyCLB';
import dayjs from 'dayjs';

const Reports: React.FC = () => {
  // Fetch report stats
  const { data: statsData, loading: loadingStats } = useRequest(() => getReportStats(), {
    manual: false,
  });

  // Fetch chart data
  const { data: chartDataResp, loading: loadingChart } = useRequest(() => getChartData(), {
    manual: false,
  });

  const stats = statsData?.data || {};
  const chartData = chartDataResp?.data || [];

  // Transform chart data for ApexCharts
  const chartOptions = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        chart: { type: 'bar' },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories: [] },
        yaxis: { title: { text: 'Số lượng đơn' } },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: function(val: number) { return val.toString(); } } },
        series: [],
      };
    }

    // Group data by clubName
    const clubGroups: { [key: string]: { [key: string]: number } } = {};
    chartData.forEach((item: any) => {
      if (!clubGroups[item.clubName]) {
        clubGroups[item.clubName] = {};
      }
      clubGroups[item.clubName][item.status] = item.count;
    });

    const categories = Object.keys(clubGroups);
    const statuses = ['Pending', 'Approved', 'Rejected'];
    const series = statuses.map(status => ({
      name: status === 'Pending' ? 'Chờ duyệt' : status === 'Approved' ? 'Đã duyệt' : 'Từ chối',
      data: categories.map(club => clubGroups[club][status] || 0),
    }));

    return {
      chart: {
        type: 'bar',
        toolbar: { show: true },
        background: '#fff',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          distributed: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: categories,
        title: { text: 'Câu lạc bộ' },
      },
      yaxis: {
        title: { text: 'Số lượng đơn' },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toString(),
        },
      },
      colors: ['#faad14', '#52c41a', '#ff4d4f'],
      states: {
        hover: { filter: { type: 'darken', value: 0.05 } },
        active: { filter: { type: 'darken', value: 0.05 } },
      },
      series: series,
    };
  }, [chartData]);

  // Handle export report
  const handleExport = async (format: 'xlsx' | 'csv') => {
    try {
      const response = await exportReport(format);
      const blob = new Blob([response.data], {
        type: format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${dayjs().format('YYYY-MM-DD_HHmmss')}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success(`Xuất báo cáo ${format.toUpperCase()} thành công`);
    } catch (error) {
      message.error('Xuất báo cáo thất bại');
      console.error(error);
    }
  };

  return (
    <Spin spinning={loadingStats || loadingChart}>
      <div style={{ padding: '24px 0' }}>
        {/* Overview Statistics */}
        <Card title="Tổng hợp thống kê" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Tổng số câu lạc bộ"
                value={stats.totalClubs || 0}
                suffix="câu lạc bộ"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Tổng đơn đăng ký"
                value={stats.totalApplications || 0}
                suffix="đơn"
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Chờ duyệt"
                value={stats.pendingCount || 0}
                suffix="đơn"
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Đã duyệt"
                value={stats.approvedCount || 0}
                suffix="đơn"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Từ chối"
                value={stats.rejectedCount || 0}
                suffix="đơn"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
          </Row>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => handleExport('xlsx')}
              >
                Xuất Excel
              </Button>
              <Button
                type="dashed"
                icon={<DownloadOutlined />}
                onClick={() => handleExport('csv')}
              >
                Xuất CSV
              </Button>
            </Space>
          </div>
        </Card>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card title="Phân tích đơn đăng ký theo câu lạc bộ và trạng thái">
            <ReactApexChart
              options={chartOptions}
              series={chartOptions.series}
              type="bar"
              height={400}
            />
          </Card>
        )}

        {/* Status Distribution */}
        <Card title="Phân bố trạng thái" style={{ marginTop: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', backgroundColor: '#fef3c7' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                  {stats.pendingCount || 0}
                </div>
                <div style={{ color: '#666', marginTop: 8 }}>Chờ duyệt</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  {stats.totalApplications > 0
                    ? ((stats.pendingCount / stats.totalApplications) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', backgroundColor: '#dcfce7' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.approvedCount || 0}
                </div>
                <div style={{ color: '#666', marginTop: 8 }}>Đã duyệt</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  {stats.totalApplications > 0
                    ? ((stats.approvedCount / stats.totalApplications) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', backgroundColor: '#fee2e2' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                  {stats.rejectedCount || 0}
                </div>
                <div style={{ color: '#666', marginTop: 8 }}>Từ chối</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  {stats.totalApplications > 0
                    ? ((stats.rejectedCount / stats.totalApplications) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </Spin>
  );
};

export default Reports;
