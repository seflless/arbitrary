# Overview
This will be a javascript modele for generating random numbers based on the TinyMT algorithm. It's benefit over normal
Messener Twister generators is it's state space is very small. This is useful for use cases where you want to backup, clone, or branch
an existing TinyMT instance.

Originally based off of: [github.com/jj1bdx/TinyMT](https://github.com/jj1bdx/TinyMT)

# Project Goals
 - Be able to easily clone a generator instance
 - Be able to step a generator backward (soft requirement, as it's 28 bytes for the total state. But that could add up if you want to go backwards in time and rollback generator state.)
 - Be efficient.
 - Provide Module Distributions
   - Vanilla .js file
   - Browserfy
   - Require
   - Bower

# Todo

  - [ ] Explain the benefits better. Is performance reason enough? Probably, espcially in Javascript.
  - [x] Reserve ```tinymt``` npm module name
  - [ ] Try porting to javascript using emscripten
  - [ ] If emscripten doesn't work out well or at all, port it manually to Javascript.
  - [ ] Give a [list of references](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/ARTICLES/earticles.html) and history lessong for the general MT work as well as the TinyMT implementation.

