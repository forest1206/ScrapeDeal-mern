export default [
    {
        title: 'Home',
        url: '/',
    },
    {
        title: 'Scrap Deals',
        url: '/product',
    },
    {
        title: 'My bids',
        url: '/bids',
        role: ['ROLE_MEMBER'],
    },
    {
        title: 'Offers',
        url: '/admin/product',
        role: ['ROLE_ADMIN'],
    },
    {
        title: 'Users',
        url: '/admin/user',
        role: ['ROLE_ADMIN'],
    },
];
