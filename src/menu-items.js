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
                    icon: 'feather icon-bookmark',
                },
                {
                    id: 'curriculum-manager',
                    title: 'Curriculum',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'curriculum',
                            title: 'Curriculum Manager',
                            type: 'item',
                            url: '/curriculum',
                            icon: 'feather icon-bookmark',
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
                            icon: 'feather icon-book',
                        },
                    ]
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
    ]
}