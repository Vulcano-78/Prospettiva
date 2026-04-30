import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/genera-report': [
      './node_modules/pdfkit/js/data/**/*',
      './node_modules/fontkit/**/*',
      './node_modules/linebreak/**/*',
    ],
  },
};

export default nextConfig;
