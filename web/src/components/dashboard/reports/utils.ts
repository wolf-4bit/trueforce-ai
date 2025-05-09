/**
 * Get CSS class for styling a tag based on category
 */
export const getTagClass = (tag: string): string => {
  switch (tag) {
    case 'Casualties':
    case 'Violent':
    case 'Homicide':
      return 'bg-red-100 text-red-600';
    case 'Theft':
      return 'bg-blue-100 text-blue-600';
    case 'Narcotics':
      return 'bg-purple-100 text-purple-600';
    case 'Fraud':
    case 'Corruption':
      return 'bg-yellow-100 text-yellow-600';
    case 'Cyber Crime':
    case 'Data Breach':
      return 'bg-green-100 text-green-600';
    case 'Arson':
      return 'bg-orange-100 text-orange-600';
    case 'International':
    case 'Organized Crime':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

/**
 * Format date to a more readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}; 