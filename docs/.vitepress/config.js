export default {
  title: 'Laravel Shopping Cart',
  description: 'A powerful and flexible shopping cart implementation for Laravel',
  base: '/laravelshoppingcart/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/faysal0x1/laravelshoppingcart' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Basic Usage', link: '/guide/basic-usage' }
          ]
        },
        {
          text: 'Integration Methods',
          items: [
            { text: 'Blade Templates', link: '/guide/blade-templates' },
            { text: 'Inertia.js (Vue)', link: '/guide/inertia' },
            { text: 'Inertia.js (React)', link: '/guide/inertia-react' },
            { text: 'API Integration', link: '/guide/api-integration' }
          ]
        },
        {
          text: 'Advanced Features',
          items: [
            { text: 'Multiple Instances', link: '/guide/multiple-instances' },
            { text: 'Database Storage', link: '/guide/database-storage' },
            { text: 'Events', link: '/guide/events' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Cart Methods', link: '/api/cart-methods' },
            { text: 'CartItem', link: '/api/cart-item' },
            { text: 'Buyable Interface', link: '/api/buyable-interface' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/faysal0x1/laravelshoppingcart' }
    ]
  }
} 