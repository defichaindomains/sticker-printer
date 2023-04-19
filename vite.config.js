import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      GRAPH_URI:
        "https://api.thegraph.com/subgraphs/name/defichaindomains/defichain-domains-registry",
      WEB3_PROVIDER: "https://rpc-mumbai.maticvigil.com",
    },
  },
  base: "/ens-print/",
});
