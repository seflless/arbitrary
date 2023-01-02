# Simple Starter

This is a starter project for publishing a simple Typescript module.

## Features

- Test runner, examples, and useful github actions
- Publishing commands
- Easy to use instructions (I hope others agree)
- It was initially based on this article: https://onderonur.netlify.app/blog/creating-a-typescript-library-with-vite/

## Usage

1. Setup
   ```bash
   git clone
   # Search replace all instances of "simple-starter" with your module project name.
   ```
1. To Build
   ```bash
   yarn build
   ```
1. To Watch/Auto-rebuild
   ```bash
   yarn dev
   ```
1. To Test
   ```bash
   yarn test
   # TODO: Add support for watching/rerunning tests. Check out vitest?
   ```
1. To publish (dry-run)
   ```bash
   npm pack --dry-run
   ```
1. To publish
   ```bash
   npm version patch|minor|major
   npm publish
   # Push new version tag to git
   git push --tags
   # Go to your repo's tags page and manually create release notes using the new tag
     # Eg. https://github.com/seflless/simple-starter/tags
   # TODO: Add more mature tooling for automated-testing, publishing, and making release notes.
   ```

### Warning

If you found this via npmjs.org, go to the github repo. This repo publishes itself for demonstration purposes to npm, it is not itself useful. You can test that it works though by including it. It should properly include types, export two functions, work with Typescript and Javascript codebases, and be able to use in a project via `import` or `require()`.

```
yarn add simple-starter
```

To test, include it and call the functions in a test file. Eg.

```js
// In test.ts
import { sum, subtract } from "simple-starter";

console.log(sum(1, 2));
console.log(subtract(8, 3));
```

This should output:

```bash
3
5
```

# TODO:

- This project should be turned into a `yarn create` style approach, instead of a clone/fork approach.
