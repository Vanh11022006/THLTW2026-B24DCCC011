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
        icon: 'TrophyOutlined',
        component: './Quanlycauhoi',
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