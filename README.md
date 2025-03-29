# Didact - A React-from-Scratch Library

This project is inspired by the article [Build Your Own React](https://pomb.us/build-your-own-react/) by **Rodrigo Pombo**. It demonstrates how to build a simple version of React, covering concepts like the Virtual DOM, reconciliation, and the fiber architecture.

## Rewriting in TypeScript

The project has been rewritten in TypeScript. Some additional hooks have been introduced : **useRef**, **useContext** and **useEffect**.

While the types work for the most part, they could have been better structured. The types were written incrementally throughout the article, without knowing the final structure of each component or feature. As a result, there might be room for improvement in how the types are defined and organized.

## Demo

This site itself serves as a demo, showcasing the use of the **useRef**, **useContext**, **useState**, and **useEffect** hooks in action.

You can check out the live version of the site [here](https://react-from-scratch-ts.onrender.com/).
**Note**: The site is only supported in **Google Chrome** and on **desktop screens**.
