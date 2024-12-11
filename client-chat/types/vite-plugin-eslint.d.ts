// types/vite-plugin-eslint.d.ts
declare module 'vite-plugin-eslint' {
  import { Plugin } from 'vite';

  interface EslintPluginOptions {
    include?: string[]; // Specify types as needed
    exclude?: string[]; // Specify types as needed
    // Add other properties based on the plugin's documentation
  }

  function eslintPlugin(options?: EslintPluginOptions): Plugin;
  export default eslintPlugin;
}
