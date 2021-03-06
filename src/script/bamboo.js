const rwc = require('random-weighted-choice');
const { randomInt, immediateDOM, promiseDelay } = require('./utils');

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
     */
    constructor(baseHeight, minInitialSegments, maxInitialSegments) {
        /**
         * The DOM element for the shoot, containing the segments
         * @type {HTMLDivElement}
         * @private
         */
        this.element = document.createElement('div');
        this.element.className = 'bamboo';
        this.setRandomRotation();

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
     * Set a random tilt to the bamboo shoot
     */
    setRandomRotation() {
        const hasTilt = Math.random() < 0.5;
        const leftTilt = Math.random() < 0.5;
        this.element.style.transform = hasTilt ? `rotate(${leftTilt ? '-' : ''}${randomInt(0, 4)}deg` : '';
    }

    /**
     * Create a new Bamboo segment and store the height
     * @return {HTMLDivElement}
     */
    newSegment () {
        // Decide the height
        const segmentHeight = randomInt(this.baseHeight * 0.75, this.baseHeight * 1.25);
        this.segmentSizes.push(segmentHeight);

        // Create the element
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.height = `${segmentHeight}px`;

        // Decide if we should have a leaf
        const hasLeaf = Math.random() < 0.2;
        if (!hasLeaf) return segment;

        // Decide if we have two leaves, and what leaf types they are
        const hasSecondLeaf = Math.random() < 0.3;
        const lightLeaf = Math.random() < 0.5;
        const leftLeaf = Math.random() < 0.5;

        // Create our first leaf
        const firstLeaf = document.createElement('div');
        firstLeaf.className = `leaf ${leftLeaf ? 'left' : 'right'}30${hasSecondLeaf || lightLeaf ? ' light' : ''}`;
        segment.appendChild(firstLeaf);

        // Create the second leaf if needed
        if (hasSecondLeaf) {
            const sameSide = Math.random() < 0.8;
            const secondLeaf = document.createElement('div');
            secondLeaf.className = `leaf ${sameSide && leftLeaf ? 'left' : 'right'}60`;
            segment.appendChild(secondLeaf);
        }

        return segment;
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
        this.setRandomRotation();
        await this.growSegment();

        // Reset our state
        this.state = previousState;
    }

    /**
     * The size of the Bamboo shoot
     * @return {number}
     */
    get size() {
        return this.segmentSizes.reduce((acc, item) => acc + item, 0);
    }
}

module.exports = Bamboo;
