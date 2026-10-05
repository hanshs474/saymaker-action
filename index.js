// SayMaker GitHub Action. Plain node, no dependencies: inputs come from INPUT_* env vars,
// outputs go to $GITHUB_OUTPUT.
'use strict';
const fs = require('fs');
const path = require('path');
const { run } = require('./client');

const input = (name) => (process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '').trim();

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  console.log(`${name}=${value}`);
}

async function main() {
  const key = input('api-key');
  if (key) console.log(`::add-mask::${key}`);
  const media = input('media') === 'video' ? 'video' : 'image';
  const url = await run(input('prompt'), {
    media,
    apiKey: key,
    model: input('model') || undefined,
    imageUrl: input('image-url') || undefined,
    aspectRatio: input('aspect-ratio') || undefined,
    duration: Number(input('duration')) || undefined,
    timeoutMs: (Number(input('timeout-minutes')) || (media === 'video' ? 90 : 75)) * 60_000,
    onQueued: (id) => console.log(`submitted run ${id}; polling`),
  });
  setOutput('url', url);
  const out = input('output-path');
  if (out) {
    const target = path.resolve(process.env.GITHUB_WORKSPACE || '.', out);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.from(await (await fetch(url)).arrayBuffer()));
    setOutput('path', target);
  }
}

main().catch((err) => {
  console.log(`::error::${err.message || err}`);
  process.exit(1);
});
