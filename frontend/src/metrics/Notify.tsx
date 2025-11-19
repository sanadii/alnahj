function loadNotifyScript(notifyId: string): void {
  if (!notifyId) {
    return;
  }

  // Check if the script is already loaded
  if (document.getElementById('notify-script')) return;

  const script = document.createElement('script');
  script.id = 'notify-script';
  script.src = `https://phpstack-207002-5085356.cloudwaysapps.com/pixel/${notifyId}`;
  script.defer = true;

  script.onload = () => {};

  script.onerror = () => {};

  document.body.appendChild(script);
}

export default function Notify({ notifyId }: { notifyId: string }) {
  // Call the utility function to load the script
  loadNotifyScript(notifyId);

  return null; // This component doesn't render any visible content
}
