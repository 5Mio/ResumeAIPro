const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf-parse', '@napi-rs/canvas'],
    },
    webpack: (config) => {
        // Fix for pdfjs-dist
        config.resolve.alias.canvas = false;
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
};

module.exports = nextConfig;
