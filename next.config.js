// next.config.js
module.exports = {
  i18n: {
    locales: ['pl', 'en', 'ua'],
    defaultLocale: 'pl',
  },
  // Zapasowo (np. bez middleware): query ?token= jest domyślnie doklejany do destination.
  async redirects() {
    return [
      {
        source: '/api/auth/verify-email',
        destination: '/panel/freelancer/activate',
        permanent: false,
        locale: false,
      },
    ];
  },
  devIndicators: {
    buildActivity: false,
    // buildActivityPosition: 'bottom-right', // jeśli chcesz zmienić pozycję
  },
};
