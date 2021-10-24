const Panda = require('../src');

document.addEventListener('DOMContentLoaded', async () => {
    // Spawn a panda in the body
    new Panda(document.body, { shootCount: 10 });

    // Spawn a panda in a terrarium
    new Panda(document.getElementById('world'), { debugMessages: true, worldScale: 2 });

    // Spawn a single shoot the height of the screen
    const bamboo = new Panda.Bamboo(80, 1, 1, { rotation: 0 });
    const height = window.innerHeight;
    while (bamboo.size < height) await bamboo.growSegment(0);
    document.getElementById('shoot').appendChild(bamboo.element);
});
