# Research Vector Synthesis

AI-powered research synthesis using TF-IDF vectors, cosine similarity search, and meta-prompting for "steelpoint" outputs.

## Features

- **TF-IDF Embeddings**: Sparse vector representations of research papers and repositories
- **Cosine Similarity**: Efficient nearest-neighbor search for relevant sources
- **Meta-Prompting**: Structured synthesis of findings with citations
- **Confidence Scoring**: Visual indicators of result reliability
- **Zero CORS Issues**: Embedded mock data for instant deployment

## Quick Start

```bash
# Clone or download the project
cd research-app

# Serve locally
python -m http.server 8080
# or
npx serve .

# Open http://localhost:8080
```

## How It Works

1. **Input**: Enter a research goal (e.g., "meta-prompt vector optimization")
2. **Vectorization**: Your query is converted to a TF-IDF vector
3. **Similarity Search**: Cosine similarity finds the most relevant sources
4. **Synthesis**: A meta-prompt generates actionable insights with citations
5. **Output**: Steelpoint synthesis with confidence score and full citations

## Tech Stack

- Pure HTML/CSS/JS (no build step required)
- Client-side TF-IDF implementation
- Cosine similarity in vanilla JavaScript
- Responsive, modern UI design

## API Sources (Simulated)

- arXiv papers on meta-prompting, vector databases, TF-IDF
- GitHub repositories for production frameworks

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
