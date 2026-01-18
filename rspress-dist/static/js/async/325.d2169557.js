'use strict';
(self.webpackChunkresin_hooks = self.webpackChunkresin_hooks || []).push([
  ['325'],
  {
    5730: function (e, n, s) {
      (s.r(n), s.d(n, { default: () => i }));
      var r = s(2676),
        d = s(453);
      function l(e) {
        let n = Object.assign(
          {
            h1: 'h1',
            a: 'a',
            h2: 'h2',
            h3: 'h3',
            p: 'p',
            h4: 'h4',
            ul: 'ul',
            li: 'li',
            strong: 'strong',
            code: 'code',
            table: 'table',
            thead: 'thead',
            tr: 'tr',
            th: 'th',
            tbody: 'tbody',
            td: 'td',
            ol: 'ol',
            pre: 'pre',
          },
          (0, d.ah)(),
          e.components,
        );
        return (0, r.jsxs)(r.Fragment, {
          children: [
            (0, r.jsxs)(n.h1, {
              id: 'hooks',
              children: [
                'Hooks',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#hooks',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsxs)(n.h2, {
              id: '状态管理',
              children: [
                '状态管理',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#状态管理',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsxs)(n.h3, {
              id: 'useboolean',
              children: [
                'useBoolean',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#useboolean',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsx)(n.p, { children: '用于管理布尔值状态的 Hook。' }),
            '\n',
            (0, r.jsxs)(n.h4, {
              id: '基本信息',
              children: [
                '基本信息',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#基本信息',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsxs)(n.ul, {
              children: [
                '\n',
                (0, r.jsxs)(n.li, {
                  children: [
                    (0, r.jsx)(n.strong, { children: '引入' }),
                    '：',
                    (0, r.jsx)(n.code, {
                      children:
                        "import { useBoolean } from '@resin-hooks/core';",
                    }),
                  ],
                }),
                '\n',
                (0, r.jsxs)(n.li, {
                  children: [
                    (0, r.jsx)(n.strong, { children: '类型' }),
                    '：',
                    (0, r.jsx)(n.code, {
                      children:
                        'useBoolean(initialValue?: boolean): [boolean, (value: boolean) => void, () => void]',
                    }),
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, r.jsxs)(n.h4, {
              id: '参数',
              children: [
                '参数',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#参数',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsxs)(n.table, {
              children: [
                '\n',
                (0, r.jsxs)(n.thead, {
                  children: [
                    '\n',
                    (0, r.jsxs)(n.tr, {
                      children: [
                        '\n',
                        (0, r.jsx)(n.th, { children: '参数' }),
                        '\n',
                        (0, r.jsx)(n.th, { children: '类型' }),
                        '\n',
                        (0, r.jsx)(n.th, { children: '默认值' }),
                        '\n',
                        (0, r.jsx)(n.th, { children: '说明' }),
                        '\n',
                      ],
                    }),
                    '\n',
                  ],
                }),
                '\n',
                (0, r.jsxs)(n.tbody, {
                  children: [
                    '\n',
                    (0, r.jsxs)(n.tr, {
                      children: [
                        '\n',
                        (0, r.jsx)(n.td, { children: 'initialValue' }),
                        '\n',
                        (0, r.jsx)(n.td, {
                          children: (0, r.jsx)(n.code, { children: 'boolean' }),
                        }),
                        '\n',
                        (0, r.jsx)(n.td, {
                          children: (0, r.jsx)(n.code, { children: 'false' }),
                        }),
                        '\n',
                        (0, r.jsx)(n.td, { children: '初始布尔值' }),
                        '\n',
                      ],
                    }),
                    '\n',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, r.jsxs)(n.h4, {
              id: '返回值',
              children: [
                '返回值',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#返回值',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsx)(n.p, { children: '返回一个元组，包含：' }),
            '\n',
            (0, r.jsxs)(n.ol, {
              children: [
                '\n',
                (0, r.jsxs)(n.li, {
                  children: [
                    (0, r.jsx)(n.strong, { children: 'value' }),
                    ' (',
                    (0, r.jsx)(n.code, { children: 'boolean' }),
                    '): 当前的布尔值',
                  ],
                }),
                '\n',
                (0, r.jsxs)(n.li, {
                  children: [
                    (0, r.jsx)(n.strong, { children: 'setValue' }),
                    ' (',
                    (0, r.jsx)(n.code, {
                      children: '(value: boolean) => void',
                    }),
                    '): 设置布尔值的函数',
                  ],
                }),
                '\n',
                (0, r.jsxs)(n.li, {
                  children: [
                    (0, r.jsx)(n.strong, { children: 'toggle' }),
                    ' (',
                    (0, r.jsx)(n.code, { children: '() => void' }),
                    '): 切换布尔值的函数',
                  ],
                }),
                '\n',
              ],
            }),
            '\n',
            (0, r.jsxs)(n.h4, {
              id: '使用示例',
              children: [
                '使用示例',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#使用示例',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsx)(n.pre, {
              children: (0, r.jsx)(n.code, {
                className: 'language-tsx',
                children:
                  "import { useBoolean } from '@resin-hooks/core';\n\nfunction App() {\n  const [value, setValue, toggle] = useBoolean(false);\n\n  return (\n    <div>\n      <p>Value: {value.toString()}</p>\n      <button onClick={() => setValue(true)}>Set True</button>\n      <button onClick={() => setValue(false)}>Set False</button>\n      <button onClick={toggle}>Toggle</button>\n    </div>\n  );\n}\n",
              }),
            }),
            '\n',
            (0, r.jsxs)(n.h4, {
              id: '使用场景',
              children: [
                '使用场景',
                (0, r.jsx)(n.a, {
                  className: 'header-anchor',
                  'aria-hidden': 'true',
                  href: '#使用场景',
                  children: '#',
                }),
              ],
            }),
            '\n',
            (0, r.jsxs)(n.ul, {
              children: [
                '\n',
                (0, r.jsx)(n.li, {
                  children: '控制开关状态（如模态框、下拉菜单）',
                }),
                '\n',
                (0, r.jsx)(n.li, { children: '管理布尔标志位' }),
                '\n',
                (0, r.jsx)(n.li, { children: '切换 UI 状态' }),
                '\n',
              ],
            }),
          ],
        });
      }
      function h() {
        let e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          { wrapper: n } = Object.assign({}, (0, d.ah)(), e.components);
        return n
          ? (0, r.jsx)(n, { ...e, children: (0, r.jsx)(l, { ...e }) })
          : l(e);
      }
      let i = h;
      ((h.__RSPRESS_PAGE_META = {}),
        (h.__RSPRESS_PAGE_META['hooks%2Findex.md'] = {
          toc: [
            { text: '状态管理', id: '状态管理', depth: 2 },
            { text: 'useBoolean', id: 'useboolean', depth: 3 },
            { text: '基本信息', id: '基本信息', depth: 4 },
            { text: '参数', id: '参数', depth: 4 },
            { text: '返回值', id: '返回值', depth: 4 },
            { text: '使用示例', id: '使用示例', depth: 4 },
            { text: '使用场景', id: '使用场景', depth: 4 },
          ],
          title: 'Hooks',
          headingTitle: 'Hooks',
          frontmatter: {},
        }));
    },
  },
]);
