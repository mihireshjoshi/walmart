const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Modify node settings to avoid bundling node modules
  config.node = {
    global: true,
    __filename: false,
    __dirname: false,
  };

  config.resolve.fallback = {
    fs: false,
    net: false,
    tls: false,
    dgram: false,
    dns: false,
    child_process: false,
    http2: false,
  };

  return config;
};
