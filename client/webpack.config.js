import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/scripts/index.js',
  
  output: {
    path: path.resolve(__dirname, '../server/public'),
    filename: 'bundle.js',
    clean: true,
  },

  mode: 'development',

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/game.html',
      filename: 'game.html',
    }),

new CopyPlugin({
      patterns: [
        { 
          from: "src/css/index.css", 
          to: "index.css" 
        },
        { 
          from: "src/css/game.css", 
          to: "game.css" 
        },
        { 
          from: "src/css/about.css", 
          to: "about.css" 
        },
        { 
          from: "src/css/navbar.css", 
          to: "navbar.css" 
        },
        { 
          from: "src/assets/favicon.ico", 
          to: "favicon.ico" 
        },
        {
          from: "src/html/index.html",
          to: "index.html"
        },
        {
          from: "src/html/about.html",
          to: "about.html"
        },
      ],
    }),
  ],
};