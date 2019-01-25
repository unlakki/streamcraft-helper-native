// ==UserScript==
// @name         StreamCraft
// @namespace    https://streamcraft.com/
// @version      0.3
// @description  StreamCraft help script
// @author       Anime-chan
// @match        https://streamcraft.com/*
// @grant        none
// ==/UserScript==

// eslint-disable-next-line func-names
((function () {
  let likesInterval = null;
  let commentsInterval = null;

  const disabled = { hideLeftPanel: false };

  const qs = e => document.querySelector(e);

  function createElement(tag, attrs) {
    const element = document.createElement(tag);
    if (attrs.id) element.id = attrs.id;
    if (attrs.text) element.innerText = attrs.text;
    if (attrs.type) element.type = attrs.type;
    if (typeof attrs.style === 'object') {
      Object.keys(attrs.style).forEach((k) => {
        element.style[k] = attrs.style[k];
      });
    }
    if (typeof attrs.classes === 'object') {
      attrs.classes.forEach(c => element.classList.add(c));
    }
    if (typeof attrs.childs === 'object') {
      attrs.childs.forEach(c => element.appendChild(c));
    }
    if (typeof attrs.events === 'object') {
      Object.keys(attrs.events).forEach(k => element.addEventListener(k, attrs.events[k]));
    }
    return element;
  }

  document.body.appendChild(createElement('style', {
    childs: [document.createTextNode([
      '::-webkit-scrollbar { width: 0.47rem }',
      '::-webkit-scrollbar-track { background: #303031 }',
      '::-webkit-scrollbar-thumb { background: #47474a; border-radius: 1.27rem }',
      '::-webkit-scrollbar-thumb:hover { background: #71767c }',
    ].join('\n'))],
  }));

  const loadingInterval = setInterval(() => {
    if (!qs('.player-bar')) return;
    clearInterval(loadingInterval);

    const userscriptSettings = createElement('div', {
      style: { left: '40px', userSelect: 'none' },
      classes: ['manage-im'],
      childs: [
        createElement('i', {
          style: {
            width: '24px', height: '24px', backgroundImage: 'url(https://goo.gl/bX5c9N)', filter: 'invert(.25641)',
          },
          classes: ['icon'],
        }),
        createElement('div', {
          id: 'userscript-settings',
          style: { display: 'none' },
          classes: ['manage-bar'],
          childs: [
            createElement('h4', { text: 'Настройки отображения' }),
            createElement('div', {
              classes: ['manage-list'],
              childs: [
                // Режим кинотеатра
                createElement('p', {
                  childs: [
                    createElement('label', {
                      classes: ['el-checkbox', 'manage-item'],
                      childs: [
                        createElement('span', {
                          classes: ['el-checkbox__input'],
                          childs: [
                            createElement('span', { classes: ['el-checkbox__inner'] }),
                            createElement('input', { classes: ['el-checkbox__original'], type: 'checkbox' }),
                          ],
                        }),
                        createElement('span', { classes: ['el-checkbox__label'], text: 'Режим кинотеатра' }),
                      ],
                      events: {
                        mousedown: (e) => {
                          if (e.button !== 0) return;
                          const label = e.path.find(p => p.classList.contains('el-checkbox'));

                          const sideBar = qs('.side-bar');
                          const header = qs('.header');
                          const personalWrapper = qs('.personal-wrapper');
                          const channel = qs('.channel');
                          const contaniner = qs('.contaniner');
                          const roomWrapper = qs('.room-wrapper');
                          const channelSider = qs('.channel-sider');
                          const playerBar = qs('.player-bar');
                          const chatLists = qs('.chat-lists');

                          if (label.classList.contains('is-checked')) {
                            label.classList.remove('is-checked');
                            label.children[0].classList.remove('is-checked');
                            disabled.hideLeftPanel = true;

                            sideBar.style.display = '';
                            header.style.display = '';
                            personalWrapper.style.paddingLeft = '';
                            channel.style.paddingTop = '';
                            contaniner.style.paddingTop = '';
                            roomWrapper.style.paddingRight = '';
                            channelSider.style.width = '';
                            channelSider.style.top = '';
                            playerBar.style.height = '';
                            chatLists.style.paddingRight = '';
                            return;
                          }
                          label.classList.add('is-checked');
                          label.children[0].classList.add('is-checked');
                          disabled.hideLeftPanel = false;

                          sideBar.style.display = 'none';
                          header.style.display = 'none';
                          personalWrapper.style.paddingLeft = '0';
                          channel.style.paddingTop = '0';
                          contaniner.style.paddingTop = '0';
                          roomWrapper.style.paddingRight = '400px';
                          channelSider.style.width = '400px';
                          channelSider.style.top = '0';
                          playerBar.style.height = '100vh';
                          chatLists.style.paddingRight = '0';
                        },
                      },
                    }),
                  ],
                }),
                // Закрепить плеер
                createElement('p', {
                  childs: [
                    createElement('label', {
                      classes: ['el-checkbox', 'manage-item'],
                      childs: [
                        createElement('span', {
                          classes: ['el-checkbox__input'],
                          childs: [
                            createElement('span', { classes: ['el-checkbox__inner'] }),
                            createElement('input', { classes: ['el-checkbox__original'], type: 'checkbox' }),
                          ],
                        }),
                        createElement('span', { classes: ['el-checkbox__label'], text: 'Закрепить плеер' }),
                      ],
                      events: {
                        mousedown: (e) => {
                          if (e.button !== 0) return;
                          const label = e.path.find(p => p.classList.contains('el-checkbox'));

                          if (label.classList.contains('is-checked')) {
                            label.classList.remove('is-checked');
                            label.children[0].classList.remove('is-checked');

                            document.body.style.overflow = 'auto';
                            return;
                          }
                          label.classList.add('is-checked');
                          label.children[0].classList.add('is-checked');

                          document.body.style.overflow = 'hidden';
                        },
                      },
                    }),
                  ],
                }),
                // Анимация лайков
                createElement('p', {
                  childs: [
                    createElement('label', {
                      classes: ['el-checkbox', 'manage-item'],
                      childs: [
                        createElement('span', {
                          classes: ['el-checkbox__input'],
                          childs: [
                            createElement('span', { classes: ['el-checkbox__inner'] }),
                            createElement('input', { classes: ['el-checkbox__original'], type: 'checkbox' }),
                          ],
                        }),
                        createElement('span', { classes: ['el-checkbox__label'], text: 'Анимация лайков' }),
                      ],
                      events: {
                        mousedown: (e) => {
                          if (e.button !== 0) return;
                          const label = e.path.find(p => p.classList.contains('el-checkbox'));

                          const hearts = qs('.hearts');

                          if (label.classList.contains('is-checked')) {
                            label.classList.remove('is-checked');
                            label.children[0].classList.remove('is-checked');
                            disabled.hideLeftPanel = true;

                            hearts.style.display = '';
                            return;
                          }
                          label.classList.add('is-checked');
                          label.children[0].classList.add('is-checked');
                          disabled.hideLeftPanel = false;

                          hearts.style.display = 'none';
                        },
                      },
                    }),
                  ],
                }),
                // Скрыть панель рейтинга и VIP
                createElement('p', {
                  childs: [
                    createElement('label', {
                      classes: ['el-checkbox', 'manage-item'],
                      childs: [
                        createElement('span', {
                          classes: ['el-checkbox__input'],
                          childs: [
                            createElement('span', { classes: ['el-checkbox__inner'] }),
                            createElement('input', { classes: ['el-checkbox__original'], type: 'checkbox' }),
                          ],
                        }),
                        createElement('span', { classes: ['el-checkbox__label'], text: 'Скрыть панель рейтинга и VIP' }),
                      ],
                      events: {
                        mousedown: (e) => {
                          if (e.button !== 0) return;
                          const label = e.path.find(p => p.classList.contains('el-checkbox'));

                          const panel = qs('.contribution-guard');

                          if (label.classList.contains('is-checked')) {
                            label.classList.remove('is-checked');
                            label.children[0].classList.remove('is-checked');

                            panel.style.display = '';
                            return;
                          }
                          label.classList.add('is-checked');
                          label.children[0].classList.add('is-checked');

                          panel.style.display = 'none';
                        },
                      },
                    }),
                  ],
                }),
                // Скрыть панель слева
                createElement('p', {
                  childs: [
                    createElement('label', {
                      classes: ['el-checkbox', 'manage-item'],
                      childs: [
                        createElement('span', {
                          classes: ['el-checkbox__input'],
                          childs: [
                            createElement('span', { classes: ['el-checkbox__inner'] }),
                            createElement('input', { classes: ['el-checkbox__original'], type: 'checkbox' }),
                          ],
                        }),
                        createElement('span', { classes: ['el-checkbox__label'], text: 'Скрыть панель слева' }),
                      ],
                      events: {
                        mousedown: (e) => {
                          if (e.button !== 0 || !disabled.hideLeftPanel) return;
                          const label = e.path.find(p => p.classList.contains('el-checkbox'));

                          const personalWrapper = qs('.personal-wrapper');
                          const sideBar = qs('.side-bar');
                          const playerBar = qs('.player-bar');
                          const chatLists = qs('.chat-lists ');

                          if (label.classList.contains('is-checked')) {
                            label.classList.remove('is-checked');
                            label.children[0].classList.remove('is-checked');

                            personalWrapper.style.paddingLeft = '';
                            chatLists.style.paddingRight = '';
                            sideBar.style.display = '';
                            playerBar.style.height = '';
                            return;
                          }
                          label.classList.add('is-checked');
                          label.children[0].classList.add('is-checked');

                          personalWrapper.style.paddingLeft = '26px';
                          chatLists.style.paddingRight = '0';
                          sideBar.style.display = 'none';
                          playerBar.style.height = 'calc((900vw - 4585px)/16)';
                        },
                      },
                    }),
                  ],
                }),
              ],
            }),
            createElement('h4', { text: 'Автоматизация' }),
            createElement('div', {
              classes: ['manage-list'],
              childs: [
                // Лайки
                createElement('p', {
                  childs: [
                    createElement('label', {
                      classes: ['el-checkbox', 'manage-item'],
                      childs: [
                        createElement('span', {
                          classes: ['el-checkbox__input'],
                          childs: [
                            createElement('span', { classes: ['el-checkbox__inner'] }),
                            createElement('input', { classes: ['el-checkbox__original'], type: 'checkbox' }),
                          ],
                        }),
                        createElement('span', { classes: ['el-checkbox__label'], text: 'Лайки' }),
                      ],
                      events: {
                        mousedown: (e) => {
                          if (e.button !== 0) return;
                          const label = e.path.find(p => p.classList.contains('el-checkbox'));

                          if (label.classList.contains('is-checked')) {
                            label.classList.remove('is-checked');
                            label.children[0].classList.remove('is-checked');

                            clearInterval(likesInterval);
                            return;
                          }
                          label.classList.add('is-checked');
                          label.children[0].classList.add('is-checked');

                          likesInterval = setInterval(() => document.querySelector('.like').click(), 1);
                        },
                      },
                    }),
                  ],
                }),
              ],
            }),
            createElement('h4', { text: 'Experimental' }),
            createElement('div', {
              classes: ['manage-list'],
              childs: [
                // Подсветка комментариев
                createElement('p', {
                  childs: [
                    createElement('label', {
                      classes: ['el-checkbox', 'manage-item'],
                      childs: [
                        createElement('span', {
                          classes: ['el-checkbox__input'],
                          childs: [
                            createElement('span', { classes: ['el-checkbox__inner'] }),
                            createElement('input', { classes: ['el-checkbox__original'], type: 'checkbox' }),
                          ],
                        }),
                        createElement('span', { classes: ['el-checkbox__label'], text: 'Подсветка комментариев' }),
                      ],
                      events: {
                        mousedown: (e) => {
                          if (e.button !== 0) return;
                          const label = e.path.find(p => p.classList.contains('el-checkbox'));

                          const nick = document.querySelector('.nick').innerText;

                          if (label.classList.contains('is-checked')) {
                            label.classList.remove('is-checked');
                            label.children[0].classList.remove('is-checked');
                            disabled.hideLeftPanel = true;

                            clearInterval(commentsInterval);

                            return;
                          }
                          label.classList.add('is-checked');
                          label.children[0].classList.add('is-checked');
                          disabled.hideLeftPanel = false;

                          commentsInterval = setInterval(() => {
                            document.querySelectorAll('.chat-list li div p').forEach((c) => {
                              if (c.lastChild.innerText && c.lastChild.innerText.includes(nick)) {
                                if (c.style.backgroundColor === '#820d0d') return;
                                // eslint-disable-next-line no-param-reassign
                                c.style.backgroundColor = '#820d0d';
                              } else {
                                // eslint-disable-next-line no-param-reassign
                                c.style.backgroundColor = '';
                              }
                            });
                          }, 500);
                        },
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    userscriptSettings.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || !e.target.classList.contains('icon')) return;
      const us = qs('#userscript-settings');
      us.style.display = us.style.display === 'none' ? '' : 'none';
    });

    qs('.chat-dialog').appendChild(userscriptSettings);
  }, 500);
})());
