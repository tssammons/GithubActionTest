const express = require('express');
const fetch = require('node-fetch'); // node-fetch@2
const cors = require('cors');
const app = express();
const PORT = 3000;

// Allow CORS for all origins including null
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.post('/trigger-action', async (req, res) => {
  const { filename, user } = req.body;

  try {
    const response = await fetch('https://api.github.com/repos/tssammons/GithubActionTest/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer REMOVE_PAT', // Replace this
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'figma_plugin_trigger',
        client_payload: { filename, user },
      }),
    });

    if (response.ok) {
      res.json({ message: 'GitHub Action triggered successfully!' });
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ error: errorText });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
