function filterIcons() {
    const searchInput = document.getElementById('search');
    const filter = searchInput.value.toLowerCase();
    const wrappers = document.getElementsByClassName('wrapper');

    Array.from(wrappers).forEach(wrapper => {
        const icon = wrapper.getElementsByClassName('icon-name')[0];
        const iconName = icon.getAttribute('data-name');
        if (iconName.toLowerCase().includes(filter)) {
            wrapper.style.display = '';
        } else {
            wrapper.style.display = 'none';
        }
    });

    // Re-register event listeners after filtering
    registerClickListeners();
}





// Initial setup
document.getElementById('search').addEventListener('input', filterIcons);
