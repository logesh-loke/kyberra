export const triggerSessionExpired = () => {
  window.dispatchEvent(new Event("SESSION_EXPIRED"));
};
