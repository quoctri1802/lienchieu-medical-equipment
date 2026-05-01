export const initialEquipment = [
  {
    id: 'EQ-001',
    name: 'Máy MRI Magnetom Lumina',
    type: 'Chẩn đoán hình ảnh',
    department: 'Khoa Chẩn đoán hình ảnh',
    status: 'Sử dụng tốt',
    lastMaintenance: '2024-03-15',
    nextMaintenance: '2024-09-15',
    vendor: 'Siemens Healthineers',
    purchaseDate: '2022-10-20',
    price: 4500000000,
    serialNumber: 'SN-MRI-9821'
  },
  {
    id: 'EQ-002',
    name: 'Máy nội soi tiêu hóa CV-190',
    type: 'Nội soi',
    department: 'Khoa Nội soi',
    status: 'Đang bảo trì',
    lastMaintenance: '2024-04-20',
    nextMaintenance: '2024-05-20',
    vendor: 'Olympus',
    purchaseDate: '2023-01-12',
    price: 1200000000,
    serialNumber: 'SN-NS-4451'
  },
  {
    id: 'EQ-003',
    name: 'Máy thở Puritan Bennett 980',
    type: 'Hồi sức cấp cứu',
    department: 'Khoa ICU',
    status: 'Sử dụng tốt',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10',
    vendor: 'Medtronic',
    purchaseDate: '2021-05-15',
    price: 850000000,
    serialNumber: 'SN-VT-1102'
  },
  {
    id: 'EQ-004',
    name: 'Máy siêu âm Voluson E10',
    type: 'Siêu âm',
    department: 'Khoa Sản',
    status: 'Hỏng - Chờ sửa chữa',
    lastMaintenance: '2023-11-05',
    nextMaintenance: '2024-05-05',
    vendor: 'GE Healthcare',
    purchaseDate: '2022-08-30',
    price: 2100000000,
    serialNumber: 'SN-SA-8872'
  },
  {
    id: 'EQ-005',
    name: 'Máy monitor theo dõi bệnh nhân B125',
    type: 'Theo dõi',
    department: 'Khoa Cấp cứu',
    status: 'Sử dụng tốt',
    lastMaintenance: '2024-02-28',
    nextMaintenance: '2024-08-28',
    vendor: 'GE Healthcare',
    purchaseDate: '2023-06-14',
    price: 150000000,
    serialNumber: 'SN-MN-3321'
  },
  {
    id: 'EQ-006',
    name: 'Máy X-Quang kỹ thuật số DRX-Evolution',
    type: 'Chẩn đoán hình ảnh',
    department: 'Khoa Chẩn đoán hình ảnh',
    status: 'Sử dụng tốt',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-09-01',
    vendor: 'Carestream',
    purchaseDate: '2021-12-10',
    price: 3200000000,
    serialNumber: 'SN-XQ-6678'
  }
];

export const chartData = [
  { name: 'T1', value: 8 },
  { name: 'T2', value: 12 },
  { name: 'T3', value: 10 },
  { name: 'T4', value: 15 },
  { name: 'T5', value: 7 },
  { name: 'T6', value: 11 },
];

export const alerts = [
  { id: 1, equipment: 'Máy siêu âm Voluson E10', issue: 'Lỗi đầu dò 4D', type: 'error' },
  { id: 2, equipment: 'Máy nội soi tiêu hóa', issue: 'Cần bảo trì định kỳ', type: 'warning' },
  { id: 3, equipment: 'Máy monitor B125', issue: 'Pin yếu', type: 'warning' },
];

export const departments = [
  'Khoa Chẩn đoán hình ảnh',
  'Khoa Nội soi',
  'Khoa ICU',
  'Khoa Sản',
  'Khoa Cấp cứu',
  'Khoa Ngoại',
  'Khoa Nhi'
];

export const equipmentTypes = [
  'Chẩn đoán hình ảnh',
  'Nội soi',
  'Hồi sức cấp cứu',
  'Siêu âm',
  'Theo dõi',
  'Xét nghiệm',
  'Phẫu thuật'
];
