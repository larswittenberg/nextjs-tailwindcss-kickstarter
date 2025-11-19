# Next.js + Tailwind CSS Kickstarter Template

This repository serves as a feature-rich kickstarter template for modern Next.js projects, pre-configured with Tailwind CSS and a suite of developer experience enhancements.

[Visit Demo-Website](https://nextjs-tailwindcss-kickstarter.vercel.app/)

## Getting Started

This template includes an interactive installer to help you customize your initial project setup.

### 1. Initial Setup

To get started, run the setup script:

```bash
yarn install
yarn setup
```

This command launches an interactive script that lets you choose which features to include in your project. You can select from the following modules:

- **SCSS/SASS**: Adds support for styling with `.scss` or `.sass` files.
- **MDX**: Allows you to create pages using `.mdx` for a powerful content authoring experience.
- **Tailwind Typography**: Integrates the official `@tailwindcss/typography` plugin for beautifully styled long-form content.
- **shadcn/ui**: Sets up the necessary files and dependencies for the popular `shadcn/ui` component library.

The script automatically updates your `package.json`, copies the required template files, and installs all dependencies for you.

### 2. Development

Once the setup is complete, you can start the development server:

`yarn dev` Starts the development server.

`yarn dev-https` Starts the development server with a simple SSL HTTP proxy on [https://localhost:3000](https://localhost:3000)

`yarn build` Builds the app for production.

`yarn start` Runs the built app in production mode.

`yarn lint` Runs ESLint

`yarn format` Runs Prettier

## Todos

- [ ] Intercepting Routes demo page
- [ ] Parallel Routes demo page

## Useful Links

- [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Lee Rob - Switching to Tailwind CSS](https://leerob.io/blog/tailwind)
- [local SSL proxy](https://www.npmjs.com/package/local-ssl-proxy)
