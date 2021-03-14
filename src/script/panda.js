const rwc = require('random-weighted-choice');
const { randomInt, immediateDOM, promiseDelay } = require('./utils');
const Bamboo = require('./bamboo');

const pixelsPerSecond = 24;

class Panda {
    /**
     * Spawn a new Panda in a given container element with a set number of Bamboo shoots
     * @param {HTMLElement} element
     * @param {number} [shootCount=5]
     */
    constructor(element, shootCount = 5) {
        /**
         * The container in which the Panda's world will reside
         * @type {HTMLElement}
         * @private
         */
        this.container = element;

        /**
         * The world in which the Panda and the Bamboo will reside
         * @type {?HTMLDivElement}
         * @private
         */
        this.world = null;
        this.createWorld();

        /**
         * How hungry the Panda currently is
         * @type {number}
         * @private
         */
        this.hunger = 0;

        /**
         * How tired the Panda currently is
         * @type {number}
         * @private
         */
        this.tiredness = 0;

        /**
         * How bored the Panda currently is
         * @type {number}
         * @private
         */
        this.boredom = 0;

        /**
         * The current state of the Panda
         * - idle: the Panda is doing nothing, can do something new
         * - eating: the Panda is eating Bamboo to reduce hunger
         * - resting: the Panda is having a rest to reduce tiredness
         * - walking: the Panda is walking to a new location
         * @type {("idle"|"eating"|"resting"|"walking")}
         * @private
         */
        this.state = 'idle';

        /**
         * The set of Bamboo shoots that exist in the Panda's world
         * @type {Bamboo[]}
         * @private
         */
        this.shoots = [];
        this.createBambooShoots(shootCount);

        /**
         * The DOM representation of the Panda itself
         * @type {?HTMLDivElement}
         * @private
         */
        this.pandaElement = null;
        this.createPanda();

        // Tick forward our Panda's world once per second
        setInterval(() => this.doTick(), 1000);
    }

    /**
     * Create a new world for the Panda (replacing any previous one)
     * Once created, the Bamboo shoots and Panda will also need to be created
     * @private
     */
    createWorld() {
        // Remove any existing world
        if (this.world) this.container.removeChild(this.world);

        // Create a fresh world container
        this.world = document.createElement('div');
        this.world.className = 'pet-panda-world';
        this.container.appendChild(this.world);
    }

    /**
     * Spawn a set of fresh Bamboo shoots for the Panda
     * @param {number} shootCount
     * @private
     */
    createBambooShoots(shootCount) {
        // Remove any existing shoots
        for (const shoot of this.shoots) this.world.removeChild(shoot.element);

        // Create the shoots
        this.shoots = [];
        for (let i = 0; i < shootCount; i++) {
            const shoot = new Bamboo(1, 3);
            this.shoots.push(shoot);
            this.world.appendChild(shoot.element);
        }
    }

    /**
     * Spawn a new Panda into the container (replacing any previous one)
     * @private
     */
    createPanda() {
        if (this.pandaElement) this.world.removeChild(this.pandaElement);

        this.pandaElement = document.createElement('div');
        this.setClasses([]);
        this.world.appendChild(this.pandaElement);
    }

    /**
     * Set the classes applied to the Panda
     * @param {string[]} classes
     * @private
     */
    setClasses(classes) {
        const uqClasses = new Set(classes);
        uqClasses.add('panda');
        this.pandaElement.className = [...uqClasses].join(' ');
    }

    /**
     * Perform a tick forward in time for the Panda's world
     * @private
     */
    doTick() {
        // Maybe grow a bit of Bamboo
        this.doBamboo();

        // Maybe update the Panda's vitals
        this.doVitals();

        // Maybe have the Panda perform an action
        this.doAction().then();
    }

    /**
     * Randomly grow a Bamboo shoot in the world, sometimes
     * @private
     */
    doBamboo() {
        // 10% chance of growing a Bamboo shoot
        if (Math.random() > 0.1) return;

        // Get the shoot to grow, preferring the smallest
        const shoot = Bamboo.randomShoot(this.shoots.filter(shoot => shoot.state === 'idle'), true);
        if (shoot) shoot.growSegment().then();
    }

    /**
     * Update the vital stats for the Panda based on its current state
     * @private
     */
    doVitals() {
        // Apply our hunger based on current state
        // Eating reduces hunger lots, walking increases hunger a bit
        const hungerChance =
            this.state === 'eating' ? 0.75 :
                (this.state === 'walking' ? 0.2 :
                    (this.state === 'idle' ? 0.1 :
                        (this.state === 'resting' ? 0.05 : 0)));
        const hungerChange =
            this.state === 'eating' ? randomInt(-10, -5) :
                (this.state === 'walking' ? randomInt(1, 2) :
                    (this.state === 'idle' ? randomInt(1, 2) :
                        (this.state === 'resting' ? randomInt(1, 2) : 0)));
        if (Math.random() < hungerChance) this.hunger += hungerChange;
        this.hunger = Math.max(0, this.hunger);

        // Apply our tiredness based on current state
        // Resting reduces tiredness lots, walking and eating increase tiredness a bit
        const tirednessChance =
            this.state === 'resting' ? 0.6 :
                (this.state === 'walking' ? 0.4 :
                    (this.state === 'eating' ? 0.2 :
                        (this.state === 'idle' ? 0.05 : 0)));
        const tirednessChange =
            this.state === 'resting' ? randomInt(-5, -2) :
                (this.state === 'walking' ? randomInt(1, 3) :
                    (this.state === 'eating' ? randomInt(1, 3) :
                        (this.state === 'idle' ? randomInt(1, 2) : 0)));
        if (Math.random() < tirednessChance) this.tiredness += tirednessChange;
        this.tiredness = Math.max(0, this.tiredness);

        // Apply our boredom based on current state
        // Walking reduces boredom lots, eating reduces it a bit, resting and idling increase it
        const boredomChance =
            this.state === 'walking' ? 0.5 :
                (this.state === 'eating' ? 0.2 :
                    (this.state === 'resting' ? 0.3 :
                        (this.state === 'idle' ? 0.2 : 0)));
        const boredomChange =
            this.state === 'walking' ? randomInt(-3, -1) :
                (this.state === 'eating' ? randomInt(-2, -1) :
                    (this.state === 'resting' ? randomInt(1, 3) :
                        (this.state === 'idle' ? randomInt(1, 2) : 0)));
        if (Math.random() < boredomChance) this.boredom += boredomChange;
        this.boredom = Math.max(0, this.boredom);
    }

    /**
     * Decide if the Panda should perform and action, and do it if it should
     * @return {Promise<void>}
     * @private
     */
    doAction() {
        console.log(this.state, this.hunger, this.tiredness, this.boredom);

        // If doing something, don't do anything else
        if (this.state !== 'idle') return Promise.resolve();

        // Define what options the Panda has
        const options = [
            { weight: this.hunger, id: 'eating' },
            { weight: this.tiredness, id: 'resting' },
            { weight: this.boredom, id: 'walking' },
            { weight: 1, id: 'idle' },
        ];

        // Decide what to do
        const action = rwc(options);
        if (action === 'eating') return this.eatRandomShoot();
        if (action === 'resting') return this.restForRandom();
        if (action === 'walking') return this.walkToRandom();
        return Promise.resolve()
    }

    /**
     * Eat a random Bamboo shoot, including walking to it first
     * @return {Promise<void>}
     * @private
     */
    async eatRandomShoot() {
        const previousState = this.state;
        this.state = 'eating';

        // Choose a shoot and walk to it
        const shoot = Bamboo.randomShoot(this.shoots);
        await this.walkToShoot(shoot);

        // Eat the shoot
        this.setClasses(['eating']);
        await shoot.removeAllSegments();

        // Reset the Panda
        this.setClasses([]);
        this.state = previousState;
    }

    /**
     * Have a rest by sitting for a while, based on how tired the Panda currently is
     * @return {Promise<void>}
     * @private
     */
    async restForRandom() {
        const previousState = this.state;
        this.state = 'resting';

        // Choose a random amount of time to rest for
        const time = randomInt(250 * this.tiredness, 500 * this.tiredness);

        // Rest!
        this.setClasses(['sitting']);
        await promiseDelay(time);

        // Reset the Panda
        this.setClasses([]);
        this.state = previousState;
    }

    /**
     * Walk to a given Bamboo shoot
     * @param {Bamboo} shoot - Shoot of Bamboo to walk to
     * @return {Promise<void>}
     * @private
     */
    walkToShoot(shoot) {
        const shootLeft = shoot.element.getBoundingClientRect().left;
        const pandaWidth = this.pandaElement.getBoundingClientRect().width;
        const worldLeft = this.world.getBoundingClientRect().left;

        const newLeft = shootLeft - worldLeft - (pandaWidth / 2);
        return this.walkToPosition(newLeft);
    }

    /**
     * Walk to a random position within the container
     * @return {Promise<void>}
     * @private
     */
    walkToRandom() {
        const { left: worldLeft, width: worldWidth } = this.world.getBoundingClientRect();
        const pandaWidth = this.pandaElement.getBoundingClientRect().width;

        const newLeft = randomInt(worldLeft + pandaWidth, worldLeft + worldWidth - pandaWidth);
        return this.walkToPosition(newLeft);
    }

    /**
     * Walk to an arbitrary left value within the container
     * @param {number} newLeft - New position to walk to
     * @return {Promise<void>}
     * @private
     */
    async walkToPosition(newLeft) {
        const previousState = this.state;
        this.state = 'walking';

        // Calculate where the Panda is currently
        const pandaLeft = this.pandaElement.getBoundingClientRect().left;
        const worldLeft = this.world.getBoundingClientRect().left;
        const oldLeft = pandaLeft - worldLeft;

        // Calculate how long the walk will take
        const distance = Math.abs(oldLeft - newLeft);
        const time = distance / pixelsPerSecond;

        // Apply the correct transition and animation
        this.pandaElement.style.transition = `left ${time}s linear`;
        this.setClasses(['walking', newLeft < oldLeft ? 'left' : 'right']);

        // Tell the Panda to walk
        await immediateDOM(() => {
            this.pandaElement.style.left = `${newLeft}px`;
        });

        // Wait for the walk to complete
        await promiseDelay(time * 1000);

        // Reset the Panda
        this.pandaElement.style.transition = '';
        this.setClasses([]);
        this.state = previousState;
    }
}

module.exports = Panda;
