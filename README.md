# La Navy 282

## Description

La Navy 282 is a web application designed to manage digital menus for restaurants. It allows users to explore products, categories, promotions, and place orders via WhatsApp.

## Main Features

- **Shopping Cart**: Users can add products to the cart, adjust quantities, and place orders.
- **Category and Product Management**: Organize products into categories for easier navigation.
- **Promotions**: Apply discounts and promotions to selected products.
- **WhatsApp Integration**: Orders are sent directly via WhatsApp.
- **Modern Interface**: Responsive and attractive design using Tailwind CSS.

## Technologies Used

- **Next.js**: React framework for web applications.
- **TypeScript**: Static typing for JavaScript.
- **Tailwind CSS**: Utility-first CSS framework for design.
- **Framer Motion**: Smooth and modern animations.
- **Server Actions**: Simulated database for data persistence.

## Project Structure

```
public/         # Static files
src/
  actions/      # Server actions and API handlers
  app/          # Pages and main layout
  components/   # Reusable UI components
  hooks/        # Custom React hooks
  lib/          # Business logic, utilities, TypeScript type definitions
  store/        # Global state management
```

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/deiviiss/menu-digital.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the application in production mode.

## Contribution

1. Fork the project.
2. Create a branch for your feature or bug fix:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push your changes:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
