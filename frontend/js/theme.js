
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.className = savedTheme;
}

function changeTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}
