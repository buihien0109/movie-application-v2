import {
    CarOutlined,
    FileTextOutlined,
    PieChartOutlined,
    ProjectOutlined,
    RocketOutlined,
    TabletOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined
} from "@ant-design/icons";

const menu = [
    {
        id: 1,
        label: "Dashboard",
        icon: PieChartOutlined,
        url: "/admin/dashboard",
        subs: [
            {
                id: 11,
                label: "Tổng quan",
                url: "/admin/dashboard",
            },
        ],
    },
    {
        id: 2,
        label: "Quản lý phim",
        icon: TabletOutlined,
        url: "/admin/movies",
        subs: [
            {
                id: 21,
                label: "Danh sách phim",
                url: "/admin/movies",
            },
            {
                id: 22,
                label: "Tạo phim",
                url: "/admin/movies/create",
            },
        ],
    },
    {
        id: 3,
        label: "Quản lý đơn hàng",
        icon: CarOutlined,
        url: "/admin/orders",
        subs: [
            {
                id: 31,
                label: "Danh sách đơn hàng",
                url: "/admin/orders",
            },
            {
                id: 32,
                label: "Tạo đơn hàng",
                url: "/admin/orders/create",
            }
        ],
    },
    {
        id: 4,
        label: "Quản lý khuyến mại",
        icon: CarOutlined,
        url: "/admin/coupons",
        subs: [
            {
                id: 41,
                label: "Danh sách khuyến mại",
                url: "/admin/coupons",
            }
        ],
    },
    {
        id: 5,
        label: "Quản lý bài viết",
        icon: FileTextOutlined,
        url: "/admin/blogs",
        subs: [
            {
                id: 51,
                label: "Tất cả bài viết",
                url: "/admin/blogs",
            },
            {
                id: 52,
                label: "Bài viết của tôi",
                url: "/admin/blogs/own-blogs",
            },
            {
                id: 53,
                label: "Tạo bài viết",
                url: "/admin/blogs/create",
            },
        ],
    },
    {
        id: 6,
        label: "Quản lý user",
        icon: UserOutlined,
        url: "/admin/users",
        subs: [
            {
                id: 61,
                label: "Danh sách user",
                url: "/admin/users",
            },
            {
                id: 62,
                label: "Tạo user",
                url: "/admin/users/create",
            },
        ],
    },
    {
        id: 7,
        label: "Quản lý thể loại",
        icon: TeamOutlined,
        url: "/admin/genres",
        subs: [
            {
                id: 71,
                label: "Danh sách thể loại",
                url: "/admin/genres",
            },
        ],
    },
    {
        id: 8,
        label: "Quản lý quốc gia",
        icon: ProjectOutlined,
        url: "/admin/countries",
        subs: [
            {
                id: 81,
                label: "Danh sách quốc gia",
                url: "/admin/countries",
            }
        ],
    },
    {
        id: 9,
        label: "Quản lý đạo diễn",
        icon: RocketOutlined,
        url: "/admin/directors",
        subs: [
            {
                id: 91,
                label: "Danh sách đạo diễn",
                url: "/admin/directors",
            },
            {
                id: 92,
                label: "Tạo đạo diễn",
                url: "/admin/directors/create",
            },
        ],
    },
    {
        id: 10,
        label: "Quản lý diễn viên",
        icon: TrophyOutlined,
        url: "/admin/actors",
        subs: [
            {
                id: 101,
                label: "Danh sách diễn viên",
                url: "/admin/actors",
            },
            {
                id: 102,
                label: "Tạo diễn viên",
                url: "/admin/actors/create",
            },
        ],
    },
];

export default menu;
