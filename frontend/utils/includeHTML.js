const includeHTML = async () => {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
        const file = el.getAttribute('data-include');
        const res = await fetch(file);
        if (res.ok) {
            const html = await res.text();
            el.innerHTML = html;
        } else {
            el.innerHTML = "<!-- Error cargando " + file + " -->";
        }
    }
};

document.addEventListener('DOMContentLoaded', includeHTML);