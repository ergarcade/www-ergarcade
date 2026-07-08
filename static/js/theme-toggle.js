'use strict';

const root = document.documentElement;
const STORAGE_KEY = 'theme';

const systemPrefersDark = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const currentTheme = () => root.getAttribute('data-theme') || (systemPrefersDark() ? 'dark' : 'light');

const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
};

document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', () => {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
});
