# KIM - Research Chat Assistant

AI-powered research synthesis using TF-IDF vectors, cosine similarity search, and meta-prompting for "steelpoint" outputs.

## Features

- **TF-IDF Embeddings**: Sparse vector representations of research papers and repositories
- **Cosine Similarity**: Efficient nearest-neighbor search for relevant sources
- **Meta-Prompting**: Structured synthesis of findings with citations
- **Confidence Scoring**: Visual indicators of result reliability
- **Electron Desktop App**: Native Windows application
- **Chat Interface**: Conversational AI research assistant

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## How It Works

1. **Input**: Enter a research question in the chat
2. **Vectorization**: Your query is converted to a TF-IDF vector
3. **Similarity Search**: Cosine similarity finds the most relevant sources
4. **Synthesis**: A meta-prompt generates actionable insights with citations
5. **Output**: Synthesis response with confidence score and source citations

## Tech Stack

- Electron 33
- Pure HTML/CSS/JavaScript
- Client-side TF-IDF implementation
- Cosine similarity in vanilla JavaScript
- Mocha + Chai for testing
- Responsive, modern UI design

## API Sources (Simulated)

- arXiv papers on meta-prompting, vector databases, TF-IDF
- GitHub repositories for production frameworks

## Project Structure

```
├── app.js          # Main application (browser)
├── core.js         # Core logic (Node.js compatible)
├── index.html      # Chat UI
├── styles.css      # Styling
├── main.js         # Electron main process
├── tests/          # Unit tests
│   └── unit/
│       ├── tfidf.test.js
│       ├── core.test.js
│       └── response.test.js
└── dist/           # Built application
```

## Running Tests

```bash
npm test
```

23 unit tests covering:

- TF-IDF utilities (tokenize, buildDocFreq, tfidfEmbed, cosineSim)
- Core logic (initVectors, findTopK, calculateConfidence)
- Response generation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
