import { loadGradeContent, getCurrentGrade, resetCurrentGrade } from './contentLoader.js';

// DOM elements that are constant throughout the page lifecycle
const gradeContentPlaceholder = document.getElementById('grade-content-placeholder');
const loadGradeButtons = document.querySelectorAll('.btn-load-grade');

/**
 * Sets the initial message in the content placeholder.
 */
const setInitialPlaceholderMessage = () => {
    gradeContentPlaceholder.innerHTML = '<div class="text-center p-10 text-gray-500"><i class="fas fa-hand-pointer fa-3x mb-4"></i><p class="text-xl">Chọn một lớp để xem nội dung chi tiết.</p></div>';
};

/**
 * Resets the page to its initial state when no grade is selected.
 * This includes resetting the title, clearing active buttons, and showing the initial placeholder message.
 */
const resetToInitialState = () => {
    document.title = 'GIÁO ÁN KHÓA HỌC HÈ STEM TỔNG QUÁT - CẤP TIỂU HỌC & THCS/THPT';
    setInitialPlaceholderMessage();
    loadGradeButtons.forEach(btn => btn.classList.remove('active'));
    resetCurrentGrade(); // Reset the current grade in the contentLoader module
};


// Event listeners for grade selection buttons
loadGradeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const grade = this.getAttribute('data-grade');
        if (grade) {
            loadGradeContent(grade, gradeContentPlaceholder, loadGradeButtons);
        }
    });
});

// Handle content loading based on URL hash on initial page load
window.addEventListener('load', () => {
    if (window.location.hash) {
        const hash = window.location.hash.toLowerCase(); // e.g., #lop1, #lop6, #lop1012
        let gradeToLoad = null;

        if (hash.startsWith('#lop')) {
            const gradeSuffix = hash.substring(4); // "1", "6", "1012"
            
            // Find a button whose data-grade (with hyphen removed) matches the suffix
            const targetButton = Array.from(loadGradeButtons).find(btn => {
                const btnGrade = btn.getAttribute('data-grade');
                return btnGrade && btnGrade.replace('-', '') === gradeSuffix;
            });

            if (targetButton) {
                gradeToLoad = targetButton.getAttribute('data-grade');
            }
        }

        if (gradeToLoad) {
            loadGradeContent(gradeToLoad, gradeContentPlaceholder, loadGradeButtons);
        } else {
            resetToInitialState(); // If hash is invalid or no matching grade
        }
    } else {
        resetToInitialState(); // If no hash, show initial state
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.grade) {
        loadGradeContent(event.state.grade, gradeContentPlaceholder, loadGradeButtons);
    } else if (!window.location.hash) { 
        // If navigating back to the page state without a hash (e.g., main.html)
        resetToInitialState();
    }
    // If there's a hash but no event.state, the 'load' event logic for hash usually covers it,
    // or it implies a state not managed by this script, so we don't reset explicitly here unless it's the base URL.
}); 