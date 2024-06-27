
const block = document.getElementsByClassName('wrapper');


function filterIcons() {
    const searchInput = document.getElementById('search');
    const filter = searchInput.value.toLowerCase();
    const wrappers = document.getElementsByClassName('wrapper');
    console.log("filter");

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
    console.log("copy working",this);
    const iconName = this.getElementsByClassName('icon-name')[0];
    console.log("iconName",iconName);

    navigator.clipboard.writeText(`<span class="${iconName.innerHTML.toString()}"></span>`);
    setTimeout(() => {
    this.classList.remove('copying');
    }, 500);
}