function getSubscriptionStatus(sub) {
  const today = new Date();
  const end = new Date(sub.endDate);
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

  if (end < today) return "expired";
  if (diffDays <= 3) return "expiringSoon";
  return "active";
}

module.exports = { getSubscriptionStatus };
