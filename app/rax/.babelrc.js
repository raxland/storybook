module.exports = {
  presets: [
    ['@babel/preset-env', { shippedProposals: true }],
    ['babel-preset-rax', { development: process.env.BABEL_ENV === 'development' }],
  ],
};
