/**
 * Initializes accordion functionality for elements within a given container.
 * Looks for elements with the class '.accordion-header'.
 * Toggles the '.open' class on the header and its next sibling (content) on click.
 * Ensures that event listeners are not added multiple times to the same header.
 * @param {HTMLElement} container - The parent element containing the accordions.
 */
const initAccordions = (container) => {
    if (!container) return;
    container.querySelectorAll('.accordion-header').forEach(header => {
        // Prevent adding multiple listeners if content is reloaded or accordions are re-initialized
        if (header.dataset.accordionInitialized === 'true') return;
        header.dataset.accordionInitialized = 'true';

        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            this.classList.toggle('open');
            if (content && content.classList.contains('accordion-content')) {
                content.classList.toggle('open');
            }
        });
    });
};

export { initAccordions }; 