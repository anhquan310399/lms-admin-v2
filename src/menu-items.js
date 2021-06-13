export default {
    items: [
        {
            id: 'home',
            title: 'Home',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/dashboard',
                    icon: 'feather icon-home',
                }
            ]
        },
        {
            id: 'statistic',
            title: 'Statistic',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'learning',
                    title: 'Learning Result',
                    type: 'item',
                    url: '/statistic',
                    icon: 'feather icon-pie-chart',
                }
            ]
        },
        {
            id: 'manager',
            title: 'Manager',
            type: 'group',
            icon: 'icon-navigation-2',
            children: [
                {
                    id: 'faculty',
                    title: 'Faculty Manager',
                    type: 'item',
                    url: '/faculty',
                    icon: 'feather icon-bookmark',
                },
                {
                    id: 'semester',
                    title: 'Semester Manager',
                    type: 'item',
                    url: '/semester',
                    icon: 'feather icon-clock',
                },
                {
                    id: 'curriculum-manager',
                    title: 'Curriculum',
                    type: 'collapse',
                    icon: 'feather icon-server',
                    children: [
                        {
                            id: 'curriculum',
                            title: 'Curriculum Manager',
                            type: 'item',
                            url: '/curriculum',
                            icon: 'feather icon-list',
                        },
                        {
                            id: 'subject',
                            title: 'Subject Manager',
                            type: 'item',
                            url: '/subject',
                            icon: 'feather icon-book',
                        },
                        {
                            id: 'class',
                            title: 'Class Manager',
                            type: 'item',
                            url: '/class',
                            icon: 'feather icon-edit-2',
                        },
                    ]
                },
                {
                    id: 'course',
                    title: 'Course Manager',
                    type: 'item',
                    url: '/course',
                    icon: 'feather icon-clipboard',
                },
                {
                    id: 'manager',
                    title: 'User Managers',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'teacher',
                            title: 'Teacher Manager',
                            type: 'item',
                            url: '/manager/teacher',
                            icon: 'feather icon-briefcase'
                        },
                        {
                            id: 'student',
                            title: 'Student Manager',
                            type: 'item',
                            url: '/manager/student',
                            icon: 'feather icon-users'
                        },
                        {
                            id: 'register',
                            title: 'Register Manager',
                            type: 'item',
                            url: '/manager/register',
                            icon: 'feather icon-share-2'
                        }
                    ]
                }
            ]
        },
        {
            id: 'setting',
            title: 'Setting',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'profile',
                    title: 'Profile',
                    type: 'item',
                    url: '/profile',
                    icon: 'feather icon-image',
                }
            ]
        },
    ]
}