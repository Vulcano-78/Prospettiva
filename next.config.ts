import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/genera-report': [
      './public/fonts/**/*',
      './node_modules/pdfkit/js/data/**/*',
      './node_modules/fontkit/**/*',
      './node_modules/linebreak/**/*',
    ],
  },
};

export default nextConfig;
