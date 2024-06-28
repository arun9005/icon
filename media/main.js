
const block = document.getElementsByClassName('wrapper');

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
}

document.getElementById('search').addEventListener('input', filterIcons);

copyText = document.getElementsByClassName('wrapper');

for (var i = 0; i < copyText.length; i++) {
    copyText[i].addEventListener('click', copy, false);
}
function copy(){
    this.classList.add("copying");
    const iconName = this.getElementsByClassName('icon-name')[0];
    navigator.clipboard.writeText(`<span class="cfl-icon--${iconName.innerHTML.toString()}"></span>`);
    setTimeout(() => {
    this.classList.remove('copying');
    }, 500);
}