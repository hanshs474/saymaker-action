# SayMaker AI Video and Image Generator (GitHub Action)

Generate an image or a video clip inside a workflow with [SayMaker](https://saymaker.ai/?utm_source=github-action&utm_medium=package): Veo 3.1, Kling 3.0, Seedance 2.0, MiniMax H3, Nano Banana 2, GPT Image 2.5, Seedream 5.0 and more on one API key. Use it for release banners, blog covers, social cards, product shots, or a nightly clip from a prompt file.

```yaml
- uses: hanshs474/saymaker-action@v1
  id: cover
  with:
    api-key: ${{ secrets.SAYMAKER_API_KEY }}
    prompt: "isometric diorama of a ramen shop at night, warm window light"
    aspect-ratio: "16:9"
    model: gpt-image-2-5-flare
    output-path: assets/cover.webp
- run: echo "${{ steps.cover.outputs.url }}"
```

A clip from a still:

```yaml
- uses: hanshs474/saymaker-action@v1
  with:
    api-key: ${{ secrets.SAYMAKER_API_KEY }}
    media: video
    model: kling-3-0
    image-url: https://example.com/product.jpg
    prompt: "the camera slowly orbits the product while light sweeps across it"
    duration: "5"
    output-path: assets/teaser.mp4
```

## Inputs

| Input | |
|---|---|
| `api-key` | required. Create one at [saymaker.ai/settings/apikeys](https://saymaker.ai/settings/apikeys?utm_source=github-action&utm_medium=package) and store it as a repository secret |
| `prompt` | required. What to make; for an edit, the change and what must stay |
| `media` | `image` (default) or `video` |
| `model` | empty uses `saymaker-image-v1` (or `nano-banana-2-lite` for edits) and `minimax-h3-fast` for video |
| `image-url` | photo to edit, or first frame of a clip |
| `aspect-ratio`, `duration` | e.g. `16:9`, `5` |
| `output-path` | download the file into the workspace |
| `timeout-minutes` | default 75; runs on a free account wait in a queue first |

Outputs: `url` (the finished file) and `path` (if `output-path` was set).

`minimax-h3-fast` is the video model a free account can run; Veo 3.1, Kling 3.0 and Seedance 2.0 need a plan or a credit pack ([pricing](https://saymaker.ai/pricing?utm_source=github-action&utm_medium=package)). The step fails with the service's own message on a wrong key, an empty balance, a model your plan does not include, or a refused prompt.

No dependencies; MIT licensed.
