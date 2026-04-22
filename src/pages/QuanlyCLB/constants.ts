/**
 * Status constants
 */
export const STATUS_PENDING = 'Pending';
export const STATUS_APPROVED = 'Approved';
export const STATUS_REJECTED = 'Rejected';

export const APPLICATION_STATUS_MAP = {
  Pending: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Rejected: 'Từ chối',
};

export const APPLICATION_STATUS_COLOR = {
  Pending: 'orange',
  Approved: 'green',
  Rejected: 'red',
};

/**
 * Gender constants
 */
export const GENDER_MALE = 'Male';
export const GENDER_FEMALE = 'Female';
export const GENDER_OTHER = 'Other';

export const GENDER_MAP = {
  Male: 'Nam',
  Female: 'Nữ',
  Other: 'Khác',
};

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

/**
 * Date format
 */
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * API base endpoints
 */
export const API_CLUBS = '/api/clubs';
export const API_APPLICATIONS = '/api/applications';
export const API_ACTION_HISTORIES = '/api/action-histories';
export const API_REPORTS = '/api/reports';

/**
 * Messages
 */
export const MESSAGES = {
  // Club
  CLUB_CREATE_SUCCESS: 'Thêm mới câu lạc bộ thành công',
  CLUB_UPDATE_SUCCESS: 'Cập nhật câu lạc bộ thành công',
  CLUB_DELETE_SUCCESS: 'Xóa câu lạc bộ thành công',

  // Application
  APP_CREATE_SUCCESS: 'Thêm mới đơn đăng ký thành công',
  APP_UPDATE_SUCCESS: 'Cập nhật đơn đăng ký thành công',
  APP_DELETE_SUCCESS: 'Xóa đơn đăng ký thành công',
  APP_APPROVE_SUCCESS: 'Duyệt đơn thành công',
  APP_REJECT_SUCCESS: 'Từ chối đơn thành công',

  // Member
  MEMBER_CHANGE_CLUB_SUCCESS: 'Chuyển câu lạc bộ cho thành viên thành công',
  MEMBER_SELECT_WARNING: 'Vui lòng chọn ít nhất một thành viên',

  // Validation
  FIELD_REQUIRED: 'Vui lòng nhập {field}',
  EMAIL_INVALID: 'Email không hợp lệ',
  REJECT_NOTE_REQUIRED: 'Vui lòng nhập lý do từ chối',

  // General
  ERROR_OCCURRED: 'Có lỗi xảy ra',
  SUCCESS: 'Thành công',
  EXPORT_SUCCESS: 'Xuất báo cáo {format} thành công',
  EXPORT_ERROR: 'Xuất báo cáo thất bại',

  // Upload
  AVATAR_UPLOAD_SUCCESS: 'Tải lên ảnh đại diện thành công',
  AVATAR_UPLOAD_ERROR: 'Tải lên ảnh đại diện thất bại',
};

/**
 * Export formats
 */
export const EXPORT_FORMATS = {
  XLSX: 'xlsx',
  CSV: 'csv',
};

/**
 * Upload config
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5242880, // 5MB in bytes
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};
