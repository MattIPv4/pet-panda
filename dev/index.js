const Panda = require('../src');

document.addEventListener('DOMContentLoaded', () => {
    new Panda(document.getElementById('world'), { debugMessages: true, worldScale: 2 });
});
