export type QuyetDinhStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type FieldDataType = 'STRING' | 'NUMBER' | 'DATE';

export interface SoVanBang {
  id: string;
  nam: number; 
  soHieu: string; 
  ngayMo: string; 
  soVaoSoHienTai: number; 
  trangThai: 'ACTIVE' | 'INACTIVE';
  ghiChu?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuyetDinhTotNghiep {
  id: string;
  soQD: string; 
  ngayBanHanh: string; 
  trichYeu: string;
  soVanBangId: string; 
  trangThai: QuyetDinhStatus;
  tongSoLuotTroCuu: number; 
  createdAt: string;
  updatedAt: string;
}

export interface TruongThongTin {
  id: string;
  ten: string; 
  kieuDuLieu: FieldDataType; 
  batBuoc?: boolean; 
  tuTheTu?: string; 
  ghiChu?: string;
  thuTuHienThi: number; 
  createdAt: string;
  updatedAt: string;
}


export interface BieuMauPhuLuc {
  id: string;
  ten: string;
  mota?: string;
  soVanBangId: string; 
  cacTruong: TruongThongTin[]; 
  createdAt: string;
  updatedAt: string;
}


export interface ThongTinVanBang {
  id: string;
  soVaoSo: number;
  soHieuVanBang: string; 
  maSinhVien: string; 
  hoTen: string; 
  ngaySinh: string; 
  soVanBangId: string; 
  quyetDinhId: string; 
  thongTinPhuLuc: Record<string, any>; 
  createdAt: string;
  updatedAt: string;
}

export interface AppContextType {
  soVanBangList: SoVanBang[];
  quyetDinhList: QuyetDinhTotNghiep[];
  thongTinVanBangList: ThongTinVanBang[];
  bieuMauList: BieuMauPhuLuc[];
  
  addSoVanBang: (soVanBang: SoVanBang) => void;
  updateSoVanBang: (soVanBang: SoVanBang) => void;
  deleteSoVanBang: (id: string) => void;
  
  addQuyetDinh: (quyetDinh: QuyetDinhTotNghiep) => void;
  updateQuyetDinh: (quyetDinh: QuyetDinhTotNghiep) => void;
  deleteQuyetDinh: (id: string) => void;
  incrementTroCuuCount: (quyetDinhId: string) => void;
  
  addThongTinVanBang: (thongTin: ThongTinVanBang) => void;
  updateThongTinVanBang: (thongTin: ThongTinVanBang) => void;
  deleteThongTinVanBang: (id: string) => void;
  
  addBieuMau: (bieuMau: BieuMauPhuLuc) => void;
  updateBieuMau: (bieuMau: BieuMauPhuLuc) => void;
  deleteBieuMau: (id: string) => void;
}

export interface DiplomaSearchParams {
  soHieuVanBang?: string;
  soVaoSo?: number;
  maSinhVien?: string;
  hoTen?: string;
  ngaySinh?: string; 
}
