let filterApps = function() {
    document.querySelectorAll('.app').forEach(function(a) {
        a.style.display = 'none';
    });
    document.querySelectorAll('input[type=checkbox]').forEach(function(box) {
        if (box.checked) {
            document.querySelectorAll('.' + box.name).forEach(function(a) {
                a.style.display = 'block';
            });
        }
    });
};

let filtersAll = function() {
    document.querySelectorAll('input[type=checkbox]').forEach(function(box) {
        box.checked = 'checked';
    });

    filterApps();
};

let filtersNone = function() {
    document.querySelectorAll('input[type=checkbox]').forEach(function(box) {
        box.checked = '';
    });

    filterApps();
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#filters_all').addEventListener('click', filtersAll);
    document.querySelector('#filters_none').addEventListener('click', filtersNone);
    document.querySelectorAll('input[type=checkbox]').forEach(function(box) {
        box.addEventListener('change', filterApps);
    });
});
