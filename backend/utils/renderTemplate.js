/**
 * Renders an HTML template with data.
 * @param {string} template - The HTML template string with placeholders in {{key}} format.
 * @param {object} data - An object containing the data to replace placeholders with.
 * @returns {string} - The populated HTML string.
 */
export function renderTemplate(template, data) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return key in data ? data[key] : ''; // Replace with value or empty string if key is missing
  });
}
