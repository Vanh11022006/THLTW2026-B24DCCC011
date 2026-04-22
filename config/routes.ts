export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user/login',
                layout: false,
                name: 'login',
                component: './user/Login',
            },
            {
                path: '/user',
                redirect: '/user/login',
            },
        ],
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: './TrangChu',
        icon: 'HomeOutlined',
    },
    {
        path: '/gioi-thieu',
        name: 'About',
        component: './TienIch/GioiThieu',
        hideInMenu: true,
    },
    {
        path: '/random-user',
        name: 'RandomUser',
        component: './RandomUser',
        icon: 'ArrowsAltOutlined',
    },
    {
        path: '/todo-list',
        name: 'TodoList',
        icon: 'OrderedListOutlined',
        component: './TodoList',
    },
    {
        path: '/quan-ly-san-pham',
        name: 'Quản lý sản phẩm',
        icon: 'ShoppingOutlined',
        component: './quanlysanpham',
    },
   
    {
        path: '/bai-1-TH1',
        name: 'Bài 1',
        icon: 'PlayCircleOutlined', 
        component: './Gamedoanso/GuessNumberGame', 
    },
    
    {
        path: '/bai-2-TH1',
        name: 'Bài 2',
        icon: 'BookOutlined', 
        component: './StudyTracker', 
    },
    
    {
        path: '/bai-1-TH2',
        name: 'Trò chơi oản tù ti',
        icon: 'TrophyOutlined',
        component: './OanTuTi',
    },

    {
        path: '/bai-2-TH2',
        name: 'Quản lý câu hỏi',
        icon: 'ReconciliationOutlined',
        component: './Quanlycauhoi',
    },

    {
        path: '/TH3',
        name: 'Quản nhân viên và dịch vụ',
        icon: 'ReconciliationOutlined',
        component: './QuanlyNhanVien',
    },

    {
        path: '/TH4/quan-ly-van-bang',
        name: 'Quản lý Sổ Văn Bằng',
        icon: 'FileOutlined',
        component: './QuanLyVanBang',
    },

    {
        path: '/TH5/quan-ly-clb',
        name: 'Quản Lý CLB',
        icon: 'TeamOutlined',
        component: './QuanlyCLB',
    },
    

    {
        name: 'Kế Hoạch Du Lịch',
        icon: 'GlobalOutlined',
        path: '/ke-hoach-du-lich',
        routes: [
            {
                name: 'Khám phá điểm đến',
                path: '/ke-hoach-du-lich/kham-pha',
                component: './KeHoachDuLich/KhamPha',
            },
      
            {
        
                name: 'Lịch trình của tôi',
                path: '/ke-hoach-du-lich/lich-trinh',
                component: './KeHoachDuLich/LichTrinh',
            },
      
            {
                name: 'Quản lý điểm đến (Admin)',
                path: '/ke-hoach-du-lich/admin/diem-den',
                component: './KeHoachDuLich/Admin/QuanLyDiemDen',
      
            },
            {
                name: 'Thống kê (Admin)',
                path: '/ke-hoach-du-lich/admin/thong-ke',
                component: './KeHoachDuLich/Admin/ThongKe',
      },
    ],

    },

    {
        path: '/KTGK/quan-ly-phong-hoc',
        name: 'Quản Lý phòng học',
        icon: 'TeamOutlined',
        component: './QuanLyPhongHoc',
    },

    {
        name: 'Khám phá Blog',
        icon: 'ReadOutlined',
        path: '/blog',
        routes: [
            {
                name: 'Trang chủ',
                path: '/blog/trang-chu',
                component: './Blog/TrangChu',
            },

            {
                name: 'Giới thiệu',
                path: '/blog/gioi-thieu',
                component: './Blog/GioiThieu',
            },

      {
        name: 'Chi tiết bài viết',
        path: '/blog/bai-viet/:slug', 
        component: './Blog/ChiTietBaiViet',
        hideInMenu: true, 
      },
    ],
    },
    {
        name: 'Quản trị Blog',
        icon: 'FormOutlined', 
        path: '/admin-blog',

    routes: [
        {
            name: 'Quản lý bài viết',
            path: '/admin-blog/bai-viet',
            component: './AdminBlog/QuanLyBaiViet',
        },

        {
            name: 'Quản lý thẻ (Tags)',
            path: '/admin-blog/the',
            component: './AdminBlog/QuanLyThe',
        },
        
        ],

        },
  
        {
            path: '/notification',
            routes: [
                {
                    path: './subscribe',
                    exact: true,
                    component: './ThongBao/Subscribe',
                },
                {
                    path: './check',
                    exact: true,
                    component: './ThongBao/Check',
                },
                {
                    path: './',
                    exact: true,
                    component: './ThongBao/NotifOneSignal',
                },
            ],
            layout: false,
            hideInMenu: true,
        },
    {
        path: '/',
    },
    {
        path: '/403',
        component: './exception/403/403Page',
        layout: false,
    },
    {
        path: '/hold-on',
        component: './exception/DangCapNhat',
        layout: false,
    },
    {
        component: './exception/404',
    },
];