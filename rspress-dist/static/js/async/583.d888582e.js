'use strict';
(self.webpackChunkresin_hooks = self.webpackChunkresin_hooks || []).push([
  ['583'],
  {
    2055: function (e, n, s) {
      (s.r(n), s.d(n, { default: () => t }));
      var a = s(2676),
        r = s(453);
      function o(e) {
        let n = Object.assign(
          {
            h1: 'h1',
            a: 'a',
            h2: 'h2',
            p: 'p',
            pre: 'pre',
            code: 'code',
            h3: 'h3',
          },
          (0, r.ah)(),
          e.components,
        );
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsxs)(n.h1, {
              id: '指南',
              children: [
                '指南',
                (0, a.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#指南',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, a.jsxs)(n.h2, {
              id: '什么是-resin-hooks',
              children: [
                '什么是 Resin Hooks？',
                (0, a.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#什么是-resin-hooks',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, a.jsx)(n.p, {
              children:
                'Resin Hooks 是一个实用的 React 业务 Hooks 库，提供了一系列常用的 React Hooks，帮助开发者更高效地构建 React 应用。',
            }),
            '\n',
            (0, a.jsxs)(n.h2, {
              id: '安装',
              children: [
                '安装',
                (0, a.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#安装',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, a.jsx)(n.pre, {
              children: (0, a.jsx)(n.code, {
                className: 'language-bash',
                children: 'pnpm add @resin-hooks/core\n',
              }),
            }),
            '\n',
            (0, a.jsxs)(n.h2, {
              id: '使用示例',
              children: [
                '使用示例',
                (0, a.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#使用示例',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, a.jsxs)(n.h3, {
              id: 'useboolean',
              children: [
                'useBoolean',
                (0, a.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#useboolean',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, a.jsx)(n.pre, {
              children: (0, a.jsx)(n.code, {
                className: 'language-tsx',
                children:
                  "import { useBoolean } from '@resin-hooks/core';\n\nfunction App() {\n  const [value, { setTrue, setFalse, toggle }] = useBoolean(false);\n\n  return (\n    <div>\n      <p>Value: {value.toString()}</p>\n      <button onClick={setTrue}>Set True</button>\n      <button onClick={setFalse}>Set False</button>\n      <button onClick={toggle}>Toggle</button>\n    </div>\n  );\n}\n",
              }),
            }),
            '\n',
            (0, a.jsxs)(n.h2, {
              id: '贡献指南',
              children: [
                '贡献指南',
                (0, a.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#贡献指南',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, a.jsx)(n.p, { children: '欢迎贡献代码或提出建议！' }),
          ],
        });
      }
      function h() {
        let e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          { wrapper: n } = Object.assign({}, (0, r.ah)(), e.components);
        return n
          ? (0, a.jsx)(n, { ...e, children: (0, a.jsx)(o, { ...e }) })
          : o(e);
      }
      let t = h;
      ((h.__RSPRESS_PAGE_META = {}),
        (h.__RSPRESS_PAGE_META['guide%2Findex.md'] = {
          toc: [
            {
              text: '什么是 Resin Hooks？',
              id: '什么是-resin-hooks',
              depth: 2,
            },
            { text: '安装', id: '安装', depth: 2 },
            { text: '使用示例', id: '使用示例', depth: 2 },
            { text: 'useBoolean', id: 'useboolean', depth: 3 },
            { text: '贡献指南', id: '贡献指南', depth: 2 },
          ],
          title: '指南',
          headingTitle: '指南',
          frontmatter: {},
        }));
    },
  },
]);
