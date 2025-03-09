# Grid Shape to Vertices

This tool lets you draw a shape to a grid and then displays the vertices for that shape.

Try the Live Demo (Coming Soon)

## Tech

Created with Vite, React, TypeScript, and Tailwind

## Description

Need to extract vertices from 2D grid-based shapes? Tired of manually counting grid cells? Let this tool handle it for you!

First draw a valid shape (all cells but the first must be connected to other cells). Then, look at the output and see the vertices.

They are presented as an array of pairs: [[0,0], [0,1], [1,1], [1,0]]

Use these vertices for whatever you need, such as drawing the shape to a canvas element.

## Controls

- **Select single cell** → Left Click
- **Select multiple cells** → Left Click + Drag
- **Deselect single cell** → Right Click
- **Deselect multiple cells** → Right Click + Drag
- **Change origin** → Middle Mouse Button / Space

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
