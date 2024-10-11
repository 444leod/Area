import axios from 'axios';
import fs from 'fs';
import widdershins from 'widdershins';

const openApiUrl = 'http://127.0.0.1:8080/swagger-json';

const widdershinsOptions = {
  codeSamples: true,
  httpsnippet: false,
  language_tabs: [{ javascript: 'JavaScript' }, { python: 'Python' }],
  toc_footers: [],
  headings: 2,
};

async function updateReadme() {
  try {
    const response = await axios.get(openApiUrl);
    const openApiSpec = response.data;

    const markdown = await widdershins.convert(openApiSpec, widdershinsOptions);

    fs.writeFileSync('../README.md', markdown, 'utf-8');
    console.log('README.md has been updated with the latest OpenAPI specs.');
  } catch (error) {
    console.error('Make sure the server is running');
    console.error('Error updating README:', error.message);
  }
}

updateReadme();
