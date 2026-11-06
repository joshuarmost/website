[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

# Joshua Most Photography Website

This repository contains the **source code** for my personal photography website, built with **React, Vite, and Node.js/Express**. The site includes:

* Home, About, Contact, and Dev pages
* Dark mode toggle
* Dev journal powered by Markdown files
* Contact form email delivery via SMTP

## Installation

Super basic setup steps:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Run the backend** (from `/server` or root, depending on your setup)

   ```bash
   node server.js
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

## Container deployment

Run the production container with a read-only filesystem, dropped capabilities,
and no privilege escalation when the hosting platform supports these options:

```bash
docker run --read-only --cap-drop=ALL --security-opt=no-new-privileges \
   -p 5555:5555 --env-file .env your-image:tag
```

Newsletter signup is not included in the deployed API. Add verified double
opt-in and bot protection before reintroducing it.

## License

> **Note:** Only the source code is open-sourced. Images, personal names, emails, and other private data are **not included** and are not covered by the license.

This code is open-source under the **Apache License 2.0**.
