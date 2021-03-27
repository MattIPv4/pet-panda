<!-- Source: https://github.com/MattIPv4/template/blob/master/README.md -->

<!-- Title -->
<h1 align="center" id="pet-panda">
    Pet Panda
</h1>

<!-- Tag line -->
<h3 align="center">A simple virtual pet panda to embed on any webpage.</h3>

<!-- Badges -->
<p align="center">
    <a href="https://github.com/users/MattIPv4/sponsorship" target="_blank">
        <img src="https://img.shields.io/badge/GitHub%20Sponsors-MattIPv4-blue.svg?style=flat-square" alt="GitHub Sponsors"/>
    </a>
    <a href="http://patreon.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/Patreon-IPv4-blue.svg?style=flat-square" alt="Patreon"/>
    </a>
    <a href="http://slack.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/Slack-MattIPv4-blue.svg?style=flat-square" alt="Slack"/>
    </a>
</p>

----

<!-- Content -->
## Usage

To get started with the Panda, include the pet-panda script in your own JavaScript file and
spawn a new Panda in your chosen container:

```js
const Panda = require('pet-panda');

document.addEventListener('DOMContentLoaded', () => {
    new Panda(document.body);
});
```

This will automatically include the needed styling to render the Panda and its Bamboo. The world the
Panda lives in will expand to fill the container that you give it, with the Panda exploring along
the bottom edge and the Bamboo slowly growing the full height of the world.

The scale of the Panda's world can also be customised, such as setting the Panda's world to be
zoomed out at 2x the world size in the same given container:

```js
const Panda = require('pet-panda');

document.addEventListener('DOMContentLoaded', () => {
    new Panda(document.body, { worldScale: 2 });
});
```

Supported options for the object passed as the second argument are as follows:

- `worldScale` -- Defaults to 1, a float value for the scale of the Panda's world in the container.
- `shootCount` -- Defaults to 5, an integer number of Bamboo shoots to spawn in the Panda's world.
- `shootHeight` -- Defaults to 80, a float value for the base Bamboo segment height (will be random within 25%).
- `debugMessages` -- Defaults to false, a toggle to enable state debug messages for the Panda.

<!-- Contributing -->
## Contributing

Contributions are always welcome to this project!\
Take a look at any existing issues on this repository for starting places to help contribute towards, or simply create your own new contribution to the project.

Please make sure to follow the existing standards within the project such as code styles, naming conventions and commenting/documentation.

When you are ready, simply create a pull request for your contribution and I will review it whenever I can!

### Donating

You can also help me and the project out by sponsoring me through [GitHub Sponsors](https://github.com/users/MattIPv4/sponsorship) (preferred), contributing through a [donation on PayPal](http://paypal.mattcowley.co.uk/) or by supporting me monthly on my [Patreon page](http://patreon.mattcowley.co.uk/).
<p>
    <a href="https://github.com/users/MattIPv4/sponsorship" target="_blank">
        <img src="https://img.shields.io/badge/GitHub%20Sponsors-MattIPv4-blue.svg?logo=github&logoColor=FFF&style=flat-square" alt="GitHub Sponsors"/>
    </a>
    <a href="http://patreon.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/Patreon-IPv4-blue.svg?logo=patreon&logoColor=F96854&style=flat-square" alt="Patreon"/>
    </a>
    <a href="http://paypal.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/PayPal-Matt%20(IPv4)%20Cowley-blue.svg?logo=paypal&logoColor=00457C&style=flat-square" alt="PayPal"/>
    </a>
</p>

<!-- Discussion & Support -->
## Discussion, Support and Issues

Need support with this project, have found an issue or want to chat with others about contributing to the project?
> Please check the project's issues page first for support & bugs!

Not found what you need here?

* If you have an issue, please create a GitHub issue here to report the situation, include as much detail as you can!
* _or,_ You can join our Slack workspace to discuss any issue, to get support for the project or to chat with contributors and myself:

<a href="http://slack.mattcowley.co.uk/" target="_blank">
    <img src="https://img.shields.io/badge/Slack-MattIPv4-blue.svg?logo=slack&logoColor=blue&style=flat-square" alt="Slack" height="30">
</a>
