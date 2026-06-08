export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^\+?[\d\s\-()]{7,15}$/.test(phone);
}

export function validateClaimForm(data) {
  const errors = {};
  if (!data.customerName?.trim()) errors.customerName = "Name is required";
  if (!data.email || !isValidEmail(data.email)) errors.email = "Valid email is required";
  if (!data.policyNumber?.trim()) errors.policyNumber = "Policy number is required";
  if (!data.claimType) errors.claimType = "Claim type is required";
  if (!data.incidentDate) errors.incidentDate = "Incident date is required";
  if (!data.description?.trim()) errors.description = "Description is required";
  if (!data.claimAmount || Number(data.claimAmount) <= 0)
    errors.claimAmount = "Valid claim amount is required";
  return errors;
}

export function validateContactForm(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Name is required";
  if (!data.email || !isValidEmail(data.email)) errors.email = "Valid email is required";
  if (!data.subject?.trim()) errors.subject = "Subject is required";
  if (!data.message?.trim()) errors.message = "Message is required";
  return errors;
}