export default {
  title: 'Laravel Shopping Cart',
  description: 'A simple shopping cart implementation for Laravel',
  base: '/laravelshoppingcart/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'GitHub', link: 'https://github.com/faysal0x1/laravelshoppingcart' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Basic Usage', link: '/guide/basic-usage' },
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
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/faysal0x1/laravelshoppingcart' }
    ]
  }
} 