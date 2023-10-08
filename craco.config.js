const path = require('path');
module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, 'src', 'components'),
            '@assets': path.resolve(__dirname, 'src', 'assets'),
            '@providers': path.resolve(__dirname, 'src', 'providers'),
            '@utilities': path.resolve(__dirname, 'src', 'utilities'),
        },
    },
};
