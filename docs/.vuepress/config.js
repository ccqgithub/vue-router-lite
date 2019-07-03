module.exports = {
  base: process.env.VUEPRESS_BASE || '/',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Router Lite',
      description: 'A cpmponent-based router for Vue.js.'
    },
    // '/zh/': {
    //   lang: 'zh-CN',
    //   title: 'Vue Router',
    //   description: '基于组件的 Vue.js 路由管理器。'
    // },
  },
  serviceWorker: true,
  // theme: '@vuepress/default',
  themeConfig: {
    repo: 'ccqgithub/vue-router-lite',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'API Reference',
            link: '/api/'
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/ccqgithub/vue-router-lite/releases'
          }
        ],
        sidebar: [
          '/',
          '/installation.md',
          '/guide/'
        ]
      }
    }
  }
}
