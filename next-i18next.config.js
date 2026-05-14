const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'pl', 'uk'],
    defaultLocale: 'en'
  },
  // Upewnij się, że ścieżka do tłumaczeń jest poprawna:
  localePath: path.resolve('./public/locales')
};