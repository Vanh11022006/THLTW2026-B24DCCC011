import React, { createContext, useContext, useState, ReactNode } from 'react';
import type {
  SoVanBang,
  QuyetDinhTotNghiep,
  ThongTinVanBang,
  BieuMauPhuLuc,
  AppContextType,
} from './types';
import {
  mockSoVanBang,
  mockQuyetDinh,
  mockThongTinVanBang,
  mockBieuMau,
} from './mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [soVanBangList, setSoVanBangList] = useState<SoVanBang[]>(mockSoVanBang);
  const [quyetDinhList, setQuyetDinhList] = useState<QuyetDinhTotNghiep[]>(mockQuyetDinh);
  const [thongTinVanBangList, setThongTinVanBangList] = useState<ThongTinVanBang[]>(mockThongTinVanBang);
  const [bieuMauList, setBieuMauList] = useState<BieuMauPhuLuc[]>(mockBieuMau);

  // =============== SoVanBang Actions ===============
  const addSoVanBang = (soVanBang: SoVanBang) => {
    setSoVanBangList([...soVanBangList, soVanBang]);
  };

  const updateSoVanBang = (updatedSoVanBang: SoVanBang) => {
    setSoVanBangList(
      soVanBangList.map((item) => (item.id === updatedSoVanBang.id ? updatedSoVanBang : item))
    );
  };

  const deleteSoVanBang = (id: string) => {
    setSoVanBangList(soVanBangList.filter((item) => item.id !== id));
  };

  // =============== QuyetDinhTotNghiep Actions ===============
  const addQuyetDinh = (quyetDinh: QuyetDinhTotNghiep) => {
    setQuyetDinhList([...quyetDinhList, quyetDinh]);
  };

  const updateQuyetDinh = (updatedQuyetDinh: QuyetDinhTotNghiep) => {
    setQuyetDinhList(
      quyetDinhList.map((item) => (item.id === updatedQuyetDinh.id ? updatedQuyetDinh : item))
    );
  };

  const deleteQuyetDinh = (id: string) => {
    setQuyetDinhList(quyetDinhList.filter((item) => item.id !== id));
  };

  const incrementTroCuuCount = (quyetDinhId: string) => {
    setQuyetDinhList(
      quyetDinhList.map((item) =>
        item.id === quyetDinhId
          ? { ...item, tongSoLuotTroCuu: item.tongSoLuotTroCuu + 1 }
          : item
      )
    );
  };

  // =============== ThongTinVanBang Actions ===============
  const addThongTinVanBang = (thongTin: ThongTinVanBang) => {
    setThongTinVanBangList([...thongTinVanBangList, thongTin]);
  };

  const updateThongTinVanBang = (updatedThongTin: ThongTinVanBang) => {
    setThongTinVanBangList(
      thongTinVanBangList.map((item) => (item.id === updatedThongTin.id ? updatedThongTin : item))
    );
  };

  const deleteThongTinVanBang = (id: string) => {
    setThongTinVanBangList(thongTinVanBangList.filter((item) => item.id !== id));
  };

  // =============== BieuMauPhuLuc Actions ===============
  const addBieuMau = (bieuMau: BieuMauPhuLuc) => {
    setBieuMauList([...bieuMauList, bieuMau]);
  };

  const updateBieuMau = (updatedBieuMau: BieuMauPhuLuc) => {
    setBieuMauList(
      bieuMauList.map((item) => (item.id === updatedBieuMau.id ? updatedBieuMau : item))
    );
  };

  const deleteBieuMau = (id: string) => {
    setBieuMauList(bieuMauList.filter((item) => item.id !== id));
  };

  const value: AppContextType = {
    soVanBangList,
    quyetDinhList,
    thongTinVanBangList,
    bieuMauList,

    addSoVanBang,
    updateSoVanBang,
    deleteSoVanBang,

    addQuyetDinh,
    updateQuyetDinh,
    deleteQuyetDinh,
    incrementTroCuuCount,

    addThongTinVanBang,
    updateThongTinVanBang,
    deleteThongTinVanBang,

    addBieuMau,
    updateBieuMau,
    deleteBieuMau,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
