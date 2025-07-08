/**
 * Carga fragmentos HTML externos en los elementos que tienen el atributo data-include.
 *
 * - Busca todos los elementos con [data-include] y reemplaza su contenido por el archivo especificado.
 * - Si ocurre un error al cargar el archivo, muestra un comentario de error en el HTML.
 * - Al finalizar, ejecuta un callback si se proporciona.
 *
 * @param {Function} [callback] - Función opcional a ejecutar después de cargar todos los includes.
 */
const includeHTML = async (callback) => {
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
    
    // Ejecutar callback si se proporciona
    if (typeof callback === 'function') {
        callback();
    }
};

document.addEventListener('DOMContentLoaded', includeHTML);