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
      template: './src/html/index.html',
    }),

new CopyPlugin({
      patterns: [
        { 
          from: "src/css/style.css", 
          to: "style.css" 
        },
        { 
          from: "src/assets/favicon.ico", 
          to: "favicon.ico" 
        },
      ],
    }),
  ],
};