
// toggle

const closeIcons = document.querySelectorAll('.closeIcon');
closeIcons.forEach((closeIcon) => {
    closeIcon.addEventListener('click', function() {
        const section = this.closest('.section');
        section.classList.toggle('closed');
    });
});


const block = document.getElementsByClassName('wrapper');

function filterIcons() {
    const searchInput = document.getElementById('search');
    const filter = searchInput.value.toLowerCase();
    const wrappers = document.getElementsByClassName('wrapper');
    const sections = document.querySelectorAll('.section');
    sections.forEach(section =>{
        section.classList.remove('closed');
    })
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

// copy to clipboard
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

