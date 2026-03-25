/**
 * Tipos para Quản lý Sổ Văn Bằng Tốt Nghiệp
 */

// Enum cho trạng thái của quyết định
export type QuyetDinhStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Enum cho kiểu dữ liệu của trường thông tin
export type FieldDataType = 'STRING' | 'NUMBER' | 'DATE';

// Sổ Văn Bằng - Diploma Register
export interface SoVanBang {
  id: string;
  nam: number; // Năm
  soHieu: string; // Số hiệu sổ
  ngayMo: string; // Ngày mở sổ
  soVaoSoHienTai: number; // Số vào sổ hiện tại (cho số tiếp theo)
  trangThai: 'ACTIVE' | 'INACTIVE';
  ghiChu?: string;
  createdAt: string;
  updatedAt: string;
}

// Quyết Định Tốt Nghiệp - Graduation Decision
export interface QuyetDinhTotNghiep {
  id: string;
  soQD: string; // Số Quyết Định
  ngayBanHanh: string; // Ngày ban hành (YYYY-MM-DD)
  trichYeu: string; // Trích yếu
  soVanBangId: string; // Thuộc sổ văn bằng nào
  trangThai: QuyetDinhStatus;
  tongSoLuotTroCuu: number; // Tổng số lượt tra cứu
  createdAt: string;
  updatedAt: string;
}

// Trường Thông Tin Phụ Lục - Custom Field Configuration
export interface TruongThongTin {
  id: string;
  ten: string; // Tên trường (e.g., "Dân tộc", "Nơi sinh", "Điểm TB")
  kieuDuLieu: FieldDataType; // Kiểu dữ liệu
  batBuoc?: boolean; // Bắt buộc hay không
  tuTheTu?: string; // Tuple như "Kinh, Tày, Dao..." cho select
  ghiChu?: string;
  thuTuHienThi: number; // Thứ tự hiển thị
  createdAt: string;
  updatedAt: string;
}

// Biểu Mẫu Phụ Lục - Diploma Template Configuration
export interface BieuMauPhuLuc {
  id: string;
  ten: string;
  mota?: string;
  soVanBangId: string; // Gắn với sổ nào
  cacTruong: TruongThongTin[]; // Danh sách trường được cấu hình
  createdAt: string;
  updatedAt: string;
}

// Thông Tin Văn Bằng - Student Diploma Information
export interface ThongTinVanBang {
  id: string;
  soVaoSo: number; // Số vào sổ (auto-increment, không cho chỉnh sửa)
  soHieuVanBang: string; // Số hiệu văn bằng
  maSinhVien: string; // Mã sinh viên
  hoTen: string; // Họ tên
  ngaySinh: string; // Ngày sinh (YYYY-MM-DD) - mặc định có
  soVanBangId: string; // Thuộc sổ văn bằng nào
  quyetDinhId: string; // Thuộc quyết định nào
  thongTinPhuLuc: Record<string, any>; // Dữ liệu của các trường cấu hình
  // Ví dụ: { "danToc": "Kinh", "noiSinh": "Hà Nội", "diemTB": 3.5, "ngayNhapHoc": "2022-09-01" }
  createdAt: string;
  updatedAt: string;
}

// Context type for App
export interface AppContextType {
  soVanBangList: SoVanBang[];
  quyetDinhList: QuyetDinhTotNghiep[];
  thongTinVanBangList: ThongTinVanBang[];
  bieuMauList: BieuMauPhuLuc[];
  
  // Actions for SoVanBang
  addSoVanBang: (soVanBang: SoVanBang) => void;
  updateSoVanBang: (soVanBang: SoVanBang) => void;
  deleteSoVanBang: (id: string) => void;
  
  // Actions for QuyetDinhTotNghiep
  addQuyetDinh: (quyetDinh: QuyetDinhTotNghiep) => void;
  updateQuyetDinh: (quyetDinh: QuyetDinhTotNghiep) => void;
  deleteQuyetDinh: (id: string) => void;
  incrementTroCuuCount: (quyetDinhId: string) => void;
  
  // Actions for ThongTinVanBang
  addThongTinVanBang: (thongTin: ThongTinVanBang) => void;
  updateThongTinVanBang: (thongTin: ThongTinVanBang) => void;
  deleteThongTinVanBang: (id: string) => void;
  
  // Actions for BieuMauPhuLuc
  addBieuMau: (bieuMau: BieuMauPhuLuc) => void;
  updateBieuMau: (bieuMau: BieuMauPhuLuc) => void;
  deleteBieuMau: (id: string) => void;
}

// Search parameters for diploma lookup
export interface DiplomaSearchParams {
  soHieuVanBang?: string;
  soVaoSo?: number;
  maSinhVien?: string;
  hoTen?: string;
  ngaySinh?: string; // YYYY-MM-DD
}
