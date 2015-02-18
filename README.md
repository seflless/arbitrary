# Overview
This will be a javascript modele for generating random numbers based on the TinyMT algorithm. It's benefit over normal
Messener Twister generators is it's state space is very small. This is useful for use cases where you want to backup, clone, or branch
an existing TinyMT instance.

Originally based off of: [github.com/jj1bdx/TinyMT](https://github.com/jj1bdx/TinyMT)

# Todo

  - Explain the benefits better. Is performance reason enough? Probably, espcially in Javascript.
  - Reserve ```tinymt``` npm module name
  - Try porting to javascript using emscripten
  - If emscripten doesn't work out well or at all, port it manually to Javascript.