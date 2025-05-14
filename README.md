# Grid Shape to Vertices

This tool lets you draw a shape to a grid and then displays the vertices for that shape.

Try the [Live Demo](https://jrbarnhart.github.io/grid-shape-to-vertices/)

## Tech

Created with Vite, React, TypeScript, and Tailwind

## Description

This tool is designed to draw grid based shapes, add their vertices, and get an array of those vertices relative
to an arbitrary origin.

First draw a shape. Then add your vertices manually. Adjust the origin as desired. The vertices will be output below the grid.

They are presented as an array of pairs: [[0,0], [0,1], [1,1], [1,0]]

Use these vertices for whatever you need, like drawing the shape to a canvas element.

## Controls

- **Select single cell** → Left Click
- **Select multiple cells** → Left Click + Drag
- **Deselect single cell** → Right Click
- **Deselect multiple cells** → Right Click + Drag
- **Change origin** → Middle Mouse Button
- **Set vertice** → Q, E, A, D

## Installation

1. Open a terminal and navigate to directory where you wish to save the project

2. Clone the project

   ```
   git clone https://github.com/jrbarnhart/grid-shape-to-vertices.git
   ```

3. Change directory to cloned project directory

   ```
   cd grid-shape-to-vertices
   ```

4. Install dependencies

   ```
   pnpm install
   ```

5. Start the dev server with the dev script

   ```
   pnpm dev
   ```

6. Navigate to the displayed url. Default: http://localhost:5173/

## License

This project is licensed under the MIT License.
