/**
 * Contentstack Analytics
 * 
 * Analytics are tracked automatically by Contentstack when deployed.
 * View analytics in: Contentstack Dashboard → Analytics
 */

window.addEventListener("DOMContentLoaded", function () {
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    console.log('📊 Development Mode - Analytics tracked after deployment');
  } else {
    console.log('✅ Contentstack Analytics Active');
  }
});

