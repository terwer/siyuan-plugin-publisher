import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "思源笔记发布插件",
    description: "思源笔记发布插件的官方文档",
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/' },
            { text: '功能', link: '/features/' },
            { text: '平台', link: '/platforms/' },
            { text: '开发', link: '/development/' },
            { text: 'API', link: '/api/' },
            { text: 'FAQ', link: '/faq/' }
        ],
        sidebar: {
            '/guide/': [
                {
                    text: '入门指南',
                    items: [
                        { text: '简介', link: '/guide/' },
                        { text: '安装', link: '/guide/getting-started/installation' },
                        { text: '快速开始', link: '/guide/quick-start' },
                        { text: '基本概念', link: '/guide/concepts' }
                    ]
                }
            ],
            '/features/': [
                {
                    text: '核心功能',
                    items: [
                        { text: '发布管理', link: '/features/publishing' },
                        { text: '模板系统', link: '/features/templates' },
                        { text: '图片处理', link: '/features/images' },
                        { text: '代码块', link: '/features/code-blocks' }
                    ]
                }
            ],
            '/platforms/': [
                {
                    text: '平台支持',
                    items: [
                        { text: '博客平台', link: '/platforms/blog' },
                        { text: '社交媒体', link: '/platforms/social' },
                        { text: '知识平台', link: '/platforms/knowledge' }
                    ]
                }
            ],
            '/development/': [
                {
                    text: '开发指南',
                    items: [
                        { text: '环境配置', link: '/development/setup' },
                        { text: 'UI 开发', link: '/development/ui' },
                        { text: '插件开发', link: '/development/plugin-system' },
                        { text: '贡献指南', link: '/development/contributing' }
                    ]
                }
            ],
            '/api/': [
                {
                    text: 'API 文档',
                    items: [
                        { text: '概述', link: '/api/' },
                        { text: '配置项', link: '/api/config' },
                        { text: '接口说明', link: '/api/interfaces' }
                    ]
                }
            ],
            '/faq/': [
                {
                    text: '常见问题',
                    items: [
                        { text: '常见问题', link: '/faq/' },
                        { text: '故障排除', link: '/faq/troubleshooting' }
                    ]
                }
            ]
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/terwer/siyuan-plugin-publisher-new-ui' }
        ]
    }
}) 