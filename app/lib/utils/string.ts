export const toTitleCase = (value: string) =>
  value
    .split(' ') // Split the string into an array of words
    .map((word) => {
      // Capitalize the first letter of each word, and make the rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' '); // Join the words back into a single string

export const extractInitials = (value: string) =>
  value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
