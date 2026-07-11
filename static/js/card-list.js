'use strict';

const grid = document.getElementById('card-grid');
const filterInput = document.getElementById('card-filter');
const sortSelect = document.getElementById('card-sort');
const emptyMessage = document.getElementById('card-filter-empty');

if (grid && filterInput && sortSelect) {
    const cards = () => Array.from(grid.querySelectorAll('.entry-card'));

    const applyFilter = (query) => {
        const q = query.trim().toLowerCase();
        let visibleCount = 0;
        for (const card of cards()) {
            const match = !q || card.textContent.toLowerCase().includes(q);
            card.hidden = !match;
            if (match) visibleCount++;
        }
        emptyMessage.hidden = visibleCount > 0;
    };

    const applySort = (sortBy) => {
        const sorted = sortBy === 'name'
            ? cards().sort((a, b) => a.querySelector('.entry-title').textContent
                .localeCompare(b.querySelector('.entry-title').textContent))
            : cards().sort((a, b) => Number(b.dataset.dateUnix) - Number(a.dataset.dateUnix));
        sorted.forEach((card) => grid.appendChild(card));
    };

    const updateUrl = (query, sortBy) => {
        const params = new URLSearchParams(location.search);
        if (query) params.set('q', query); else params.delete('q');
        if (sortBy === 'name') params.set('sort', 'name'); else params.delete('sort');
        const qs = params.toString();
        history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    };

    // Restore state from the URL, so a filtered/sorted view is shareable.
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('q') || '';
    const initialSort = params.get('sort') === 'name' ? 'name' : 'date';
    filterInput.value = initialQuery;
    sortSelect.value = initialSort;
    applyFilter(initialQuery);
    if (initialSort === 'name') applySort('name'); // 'date' already matches the server-rendered order

    filterInput.addEventListener('input', () => {
        applyFilter(filterInput.value);
        updateUrl(filterInput.value, sortSelect.value);
    });

    sortSelect.addEventListener('change', () => {
        applySort(sortSelect.value);
        updateUrl(filterInput.value, sortSelect.value);
    });
}
