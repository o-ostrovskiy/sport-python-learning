// Visit counting with Google Analytics, on the public site only (never on localhost or in tests).
// It answers "how many visits, which lessons, what kind of device". Advertising features are switched off here
// and in the Analytics property itself (no Google signals, no ads personalization, 2-month retention).
// What parents are told about this is in the Privacy section of about.html: keep the two in step.
(function () {
  var ID = 'G-KVVSBG2CE6';
  if (location.hostname !== 'python.mystoryland.ai') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
})();
