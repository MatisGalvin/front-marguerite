// format a phone number to have dash
export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber?.replace(
    /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
    "$1-$2-$3-$4-$5",
  );
};
