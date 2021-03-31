export default [
    {
        type: 'link',
        label: 'Home',
        url: '/',
    },
    {
        type: 'link',
        label: 'Scrap Deals',
        url: '/product',
    },
    {
        type: 'link',
        label: 'My bids',
        url: '/bids',
        role: ['ROLE_MEMBER', 'ROLE_MERCHANT', 'ROLE_ADMIN'],
    },
    {
        type: 'link',
        label: 'My Offers',
        url: '/admin/product',
        role: ['ROLE_MERCHANT'],
    },
    {
        type: 'link',
        label: 'Offers',
        url: '/admin/product',
        role: ['ROLE_ADMIN'],
    },
    {
        type: 'link',
        label: 'Users',
        url: '/admin/user',
        role: ['ROLE_ADMIN'],
    },
    {
        type: 'link',
        label: 'Account',
        url: '/account',
        children: [
            { type: 'link', label: 'Login', url: '/login' },
            { type: 'link', label: 'Dashboard', url: '/account/dashboard' },
            { type: 'link', label: 'Edit Profile', url: '/account/profile' },
            { type: 'link', label: 'Change Password', url: '/account/password' },
        ],
    },
    {
        type: 'button',
        label: 'Language',
        children: [
            { type: 'button', label: 'English', data: { type: 'language', locale: 'en' } },
            { type: 'button', label: 'Russian', data: { type: 'language', locale: 'ru' } },
        ],
    },
];
