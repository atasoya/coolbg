![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

# CoolBg

**A CLI and web tool to create cool backgrounds for your images.**

![CoolBg Preview](preview.png)

Website: [coolbg.ata.soy](https://coolbg.ata.soy)

# Project Structure

```
coolbg/
├── cli/
│   ├── index.js
│   ├── package.json
│   └── utils/
│       ├── processing.js
│       ├── prompts.js
│       └── validation.js
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   ├── Hero.tsx
│   │   │   └── Footer.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md
```

# Installation & Usage

## Settings

- Color 1: Gradient color starts top left.
- Color 2: Gradient color ends bottom right.
- Padding: Space between main image and background.
- Roundness: Edge curve of main image.

## CLI

- Simply install [coolbg npm package](https://www.npmjs.com/package/coolbg)

```bash
npx coolbg
```

## Web

- Visit : [coolbg.ata.soy](https://coolbg.ata.soy)
- Upload your image and start playing with the settings
- Download your _cool_ image
