import { initAccordions } from './accordionHandler.js';

let currentGrade = null;

/**
 * Loads and displays the HTML content for a specific grade.
 * Fetches HTML from `gradeX_content.html`, updates the placeholder, initializes accordions,
 * manages active button states, updates the document title, and browser history.
 * @param {string} grade - The grade identifier (e.g., "1", "10-12").
 * @param {HTMLElement} gradeContentPlaceholder - The DOM element to load content into.
 * @param {NodeListOf<HTMLButtonElement>} loadGradeButtons - Nodelist of buttons that trigger grade loading.
 */
const loadGradeContent = async (grade, gradeContentPlaceholder, loadGradeButtons) => {
    const gradeFilenameSuffix = grade;
    const gradeHashSuffix = grade.replace('-', '');

    // Avoid reloading if content for the current grade is already displayed
    // and it's not the initial placeholder message.
    if (currentGrade === grade && 
        gradeContentPlaceholder.innerHTML.trim() !== '' && 
        !gradeContentPlaceholder.querySelector('.text-center.p-10.text-gray-500')) {
        
        // Check if accordions need re-initialization (e.g., if somehow they were missed)
        if (gradeContentPlaceholder.querySelectorAll('.accordion-header').length > 0 && 
            !gradeContentPlaceholder.querySelector('.accordion-header').dataset.accordionInitialized) {
            initAccordions(gradeContentPlaceholder);
        }
        return;
    }

    gradeContentPlaceholder.innerHTML = '<p class="text-center p-10 text-gray-500">Đang tải nội dung...</p>';
    try {
        const response = await fetch(`grade${gradeFilenameSuffix}_content.html`);
        if (!response.ok) {
            throw new Error(`Không tìm thấy file nội dung cho Lớp ${grade}. HTTP status ${response.status}`);
        }
        const html = await response.text();
        gradeContentPlaceholder.innerHTML = html;
        currentGrade = grade; // Update currentGrade after successful load
        initAccordions(gradeContentPlaceholder);

        // Update active state for navigation buttons
        loadGradeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-grade') === grade) {
                btn.classList.add('active');
            }
        });

        document.title = `Giáo Án STEM - Lớp ${grade} - Trường LQĐ`;

        // Update browser history and URL hash
        if (history.pushState) {
            history.pushState({ grade: grade }, `Lớp ${grade}`, `#lop${gradeHashSuffix}`);
        } else {
            window.location.hash = `#lop${gradeHashSuffix}`;
        }

    } catch (error) {
        console.error('Lỗi tải nội dung:', error);
        gradeContentPlaceholder.innerHTML = `<p class="text-center p-10 text-red-600">Lỗi khi tải nội dung cho Lớp ${grade}. Vui lòng thử lại sau.</p>`;
        currentGrade = null; // Reset currentGrade on error
    }
};

/**
 * Resets the current grade state, typically used when navigating back to the initial page state.
 */
const resetCurrentGrade = () => {
    currentGrade = null;
};

/**
 * Gets the currently loaded grade.
 * @returns {string | null} The current grade identifier or null if none is active.
 */
const getCurrentGrade = () => currentGrade;

export { loadGradeContent, getCurrentGrade, resetCurrentGrade }; 