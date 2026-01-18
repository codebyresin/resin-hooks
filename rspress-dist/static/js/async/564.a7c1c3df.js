'use strict';
(self.webpackChunkresin_hooks = self.webpackChunkresin_hooks || []).push([
  ['564'],
  {
    3946: function (t, e, i) {
      (i.r(e), i.d(e, { default: () => u }));
      var o = i(2676),
        s = i(453);
      function n(t) {
        return (0, o.jsx)(o.Fragment, {});
      }
      function r() {
        let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          { wrapper: e } = Object.assign({}, (0, s.ah)(), t.components);
        return e
          ? (0, o.jsx)(e, { ...t, children: (0, o.jsx)(n, { ...t }) })
          : n(t);
      }
      let u = r;
      ((r.__RSPRESS_PAGE_META = {}),
        (r.__RSPRESS_PAGE_META['index.md'] = {
          toc: [],
          title: 'Resin Hooks',
          headingTitle: '',
          frontmatter: {
            title: 'Resin Hooks',
            hero: {
              title: 'Resin Hooks',
              description: '实用的 React 业务 Hooks 库',
              image: { src: '/images/logo.png', alt: 'Resin Hooks Logo' },
              actions: [
                { text: '快速开始', link: '/guide', type: 'primary' },
                { text: '查看 Hooks', link: '/hooks', type: 'default' },
              ],
            },
            features: [
              {
                title: '\uD83D\uDCE6 开箱即用',
                description: '无需配置，直接使用，节省开发时间',
              },
              {
                title: '\uD83C\uDFAF 类型安全',
                description: '完整的 TypeScript 类型定义，提供良好的开发体验',
              },
              {
                title: '\uD83D\uDE80 性能优化',
                description: '精心设计的实现，确保最佳性能',
              },
              {
                title: '\uD83D\uDCD6 详细文档',
                description: '每个 Hook 都有详细的使用示例和说明',
              },
              {
                title: '\uD83D\uDD27 灵活配置',
                description: '支持各种使用场景的配置选项',
              },
              {
                title: '\uD83C\uDFA8 易于扩展',
                description: '基于 React Hooks 标准，易于理解和扩展',
              },
            ],
          },
        }));
    },
  },
]);
