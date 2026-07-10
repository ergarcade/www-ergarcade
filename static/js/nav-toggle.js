'use strict';

const navToggle = document.querySelector('.nav-toggle');
const navlinks = document.getElementById('navlinks');

if (navToggle && navlinks) {
    navToggle.addEventListener('click', () => {
        const open = navlinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open);
    });

    navlinks.querySelectorAll('.navlink').forEach((link) => {
        link.addEventListener('click', () => {
            navlinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}
