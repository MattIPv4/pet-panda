const rwc = require('random-weighted-choice');
const { randomInt, immediateDOM, promiseDelay, isObject } = require('./utils');

class Bamboo {
    /**
     * Choose a random Bamboo shoot, weighted toward the tallest shoot
     * @param {Bamboo[]} shoots
     * @param {Boolean} [shortest=false] - Invert the weights to prefer the shortest shoot
     * @return {Bamboo}
     */
    static randomShoot(shoots, shortest = false) {
        // Weight heavily based on shoot size
        let weighted = shoots.map((shoot, index) => ({
            weight: shoot.size * (Math.random() + 1),
            id: index,
        }));

        // Invert the weights for shortest preference
        if (shortest) {
            const max = weighted.reduce((prev, cur) => cur.weight > prev ? cur.weight : prev, 0);
            weighted = weighted.map(data => {
                data.weight = max - data.weight;
                return data;
            });
        }

        // Get random, fallback to complete random
        let index = rwc(weighted);
        if (index === null) index = randomInt(0, shoots.length - 1);

        // Return
        return shoots[index];
    }

    /**
     * Create a new Bamboo shoot
     * @param {number} baseHeight
     * @param {number} minInitialSegments
     * @param {number} maxInitialSegments
     * @param {Object} [opts={}]
     * @param {number} [opts.rotation]
     */
    constructor(baseHeight, minInitialSegments, maxInitialSegments, opts = {}) {
        /**
         * Options for controlling the bamboo growth
         * @type {Object}
         */
        this.options = isObject(opts) ? opts : {};

        /**
         * The DOM element for the shoot, containing the segments
         * @type {HTMLDivElement}
         * @readonly
         */
        this.element = document.createElement('div');
        this.element.className = 'pet-panda-bamboo';
        this.setRotation(this.options.rotation ?? this.randomRotation());

        /**
         * Base height of the shoots, will be random within 25% of this
         * @type {number}
         * @private
         */
        this.baseHeight = baseHeight;

        /**
         * The current state of the Bamboo shoot
         * @type {("idle"|"growing"|"destroying")}
         * @private
         */
        this.state = 'idle';

        /**
         * The size of the segments in the Bamboo shoot
         * @type {number[]}
         * @private
         */
        this.segmentSizes = [];

        // Create the initial segments
        const size = randomInt(minInitialSegments, maxInitialSegments);
        for (let i = 0; i < size; i++) {
            this.element.appendChild(this.newSegment());
        }
    }

    /**
     * Get a random tilt value for the bamboo shoot
     * @return {number}
     * @private
     */
    randomRotation() {
        if (Math.random() < 0.5) return 0;
        return (Math.random() < 0.5 ? 1 : -1) * randomInt(0, 4);
    }

    /**
     * Set the rotation for the bamboo shoot
     * @param {number} deg
     * @private
     */
    setRotation (deg) {
        this.element.style.transform = deg ? `rotate(${deg}deg)` : '';
    }

    /**
     * Create a new Bamboo segment and store the height
     * @return {HTMLDivElement}
     * @private
     */
    newSegment () {
        // Decide the height
        const segmentHeight = randomInt(this.baseHeight * 0.75, this.baseHeight * 1.25);
        this.segmentSizes.push(segmentHeight);

        // Create the element
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.height = `${segmentHeight}px`;

        // Add the ring
        const ring = document.createElement('div');
        ring.className = 'ring';
        segment.appendChild(ring);

        // Decide if we should have a leaf
        if (Math.random() < 0.8) return segment;

        // Create the first leaf, on the right or left
        const leftLeaf = Math.random() < 0.5;
        segment.appendChild(this.newLeaf(segmentHeight, leftLeaf));

        // Decide if we should have a second leaf
        if (Math.random() < 0.3) segment.appendChild(this.newLeaf(segmentHeight, !leftLeaf));

        return segment;
    }

    /**
     * Create a new leaf to be added to a Bamboo segment
     * @param {number} height - The height of the Bamboo segment the leaf will be on
     * @param {boolean} [left=false] - If the leaf will be on the left side of the segment
     * @return {HTMLDivElement}
     * @private
     */
    newLeaf (height, left = false) {
        const rotation = left ? randomInt(-75, -55) : randomInt(45, 65);
        const bottom = randomInt(height * 0.05, height * 0.4);
        const leaf = document.createElement('div');
        leaf.className = `leaf ${left ? 'left' : ''}`;
        leaf.style.transform = `rotate(${rotation}deg)`;
        leaf.style.bottom = `${bottom}px`;
        return leaf;
    }

    /**
     * Grow a new segment on the top of the Bamboo shoot, animated
     * @param {number} [speed=1000] - Duration of the animation in milliseconds
     * @return {Promise<void>}
     */
    async growSegment(speed = 1000) {
        const previousState = this.state;
        this.state = 'growing';

        // Get the new segment
        const segment = this.newSegment();
        segment.style.opacity = '0';
        segment.style.filter = 'brightness(5)';
        segment.style.transition = `filter ${speed}ms linear, opacity ${speed / 4}ms linear`;
        this.element.insertBefore(segment, this.element.firstElementChild);

        // Make the segment visible
        await immediateDOM(() => {
            segment.style.filter = '';
            segment.style.opacity = '';
        });

        // Wait for the animation
        await promiseDelay(speed);

        // Remove the transition to clean up
        segment.style.transition = '';

        // Reset our state
        this.state = previousState;
    }

    /**
     * Remove the top segment from the Bamboo shoot, animated
     * @param {number} [speed=1000] - Duration of the animation in milliseconds
     * @return {Promise<void>}
     */
    async removeSegment(speed = 1000) {
        const previousState = this.state;
        this.state = 'destroying';

        // Get the segment to destroy
        const segment = this.element.firstElementChild;
        this.segmentSizes.pop();

        // Fade out the segment
        segment.style.transition = `filter ${speed / 4}ms linear, opacity ${speed}ms linear`;
        await immediateDOM(() => {
            segment.style.opacity = '0';
            segment.style.filter = 'brightness(5)';
        });

        // Wait for the animation
        await promiseDelay(speed);

        // Remove the element
        this.element.removeChild(segment);

        // Reset our state
        this.state = previousState;
    }

    /**
     * Remove all segments from the Bamboo shoot, and then grow one new one, animated
     * @return {Promise<void>}
     */
    async removeAllSegments() {
        const previousState = this.state;
        this.state = 'destroying';

        // Destroy all the segments
        while (this.element.firstElementChild) {
            await this.removeSegment(750);
            await promiseDelay(150);
        }

        // Set rotation and grow a new segment
        this.setRotation(this.options.rotation ?? this.randomRotation());
        await this.growSegment();

        // Reset our state
        this.state = previousState;
    }

    /**
     * The size of the Bamboo shoot
     * @return {number}
     * @readonly
     */
    get size() {
        return this.segmentSizes.reduce((acc, item) => acc + item, 0);
    }
}

module.exports = Bamboo;
