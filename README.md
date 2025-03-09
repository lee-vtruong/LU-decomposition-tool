# LU Decomposition Visualization Tool

This project is an interactive web application for visualizing the LU decomposition process in linear algebra. It allows users to input a square matrix and see the step-by-step transformation into lower (L) and upper (U) triangular matrices using elementary row operations.

## Live demo:
[Click here](https://lu-decomposition-tool2.vercel.app/)

## Table of Contents

- [LU Decomposition Visualization Tool](#lu-decomposition-visualization-tool)

- [Table of Contents](#table-of-contents)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [Customization](#customization)
- [Mathematical Background](#mathematical-background)
- [Contributing](#contributing)


## Project Structure

The project is organized into the following directories:

- **`app`**: Contains the main Next.js application files.
- **`page.tsx`**: The main page component.
- **`layout.tsx`**: The root layout component.
- **`globals.css`**: Global CSS styles.
- **`components`**: Contains all React components used in the project.
- **`lu-decomposition-tool.tsx`**: The main component for the LU decomposition tool.
- **`matrix-input.tsx`**: Component for matrix input and manipulation.
- **`step-visualizer.tsx`**: Component for visualizing each step of the decomposition.
- **`matrix-display.tsx`**: Component for displaying matrices with highlighting.
- **`result-display.tsx`**: Component for displaying the final decomposition result.
- **`theme-toggle.tsx`**: Component for toggling between light and dark mode.
- **`ui`**: Contains shadcn/ui components.
- **`public`**: Contains static assets.
- **`tailwind.config.ts`**: Tailwind CSS configuration.
- **`next.config.mjs`**: Next.js configuration.
- **`README.md`**: This documentation file.


## Technologies Used

- **Next.js**: React framework for building the application.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: For type-safe JavaScript code.
- **Tailwind CSS**: For styling the application.
- **shadcn/ui**: For UI components.
- **Lucide React**: For icons.


## Features

- **Interactive Matrix Input**: Users can input custom matrices or generate random/example matrices.
- **Matrix Size Selection**: Support for different matrix sizes (2×2 to 5×5).
- **Step-by-Step Visualization**: Detailed visualization of each step in the LU decomposition process.
- **Row Operation Notation**: Displays row operations in standard mathematical notation (e.g., r₂ → r₂ - 3/4 × r₁).
- **Fraction Display**: Shows multipliers and matrix elements as fractions for better mathematical clarity.
- **Result Verification**: Verifies that A = L×U by calculating the product.
- **Dark Mode Support**: Toggle between light and dark themes.
- **Responsive Design**: Works on devices of all sizes.
- **Educational Information**: Includes information about LU decomposition and its applications.


## Getting Started

1. **Clone the repository:**

```shellscript
git clone [repository URL]
```


2. **Navigate to the project directory:**

```shellscript
cd lu-decomposition-tool
```


3. **Install dependencies:**

```shellscript
npm install
```


4. **Run the development server:**

```shellscript
npm run dev
```


5. **Open your browser and navigate to [http://localhost:3000](http://localhost:3000).**

The application should now be running in your browser.




## Customization

- **Matrix Size**: Modify the `matrixSize` state in `lu-decomposition-tool.tsx` to change the default matrix size.
- **Example Matrices**: Update the `generateExampleMatrix` function in `matrix-input.tsx` to add more example matrices.
- **Theme Colors**: Modify the color variables in `globals.css` to change the theme colors.
- **UI Components**: Replace or modify the shadcn/ui components in the `components/ui` directory.
- **Step Descriptions**: Update the descriptions in the `performLUDecomposition` function in `lu-decomposition-tool.tsx`.
- **Fraction Display**: Adjust the `decimalToFraction` function in `matrix-display.tsx` to change how fractions are displayed.


## Mathematical Background

LU decomposition is a matrix factorization technique that decomposes a matrix into the product of a lower triangular matrix (L) and an upper triangular matrix (U). This decomposition is useful for:

- Solving systems of linear equations
- Computing determinants
- Matrix inversion
- Numerical analysis


The process uses Gaussian elimination to transform the original matrix A into an upper triangular matrix U, while simultaneously constructing a lower triangular matrix L such that A = LU.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear messages.
4. Push your changes to your fork.
5. Submit a pull request.
