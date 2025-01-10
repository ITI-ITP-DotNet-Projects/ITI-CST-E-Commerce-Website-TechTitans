/**
 * @description Function to show a success message
 * @param {string} message
 */
export function showSuccessMessage(message) {
  const messageBox = document.createElement('div');
  messageBox.className =
    'alert alert-success position-fixed bottom-0 end-0 m-3';
  messageBox.style.zIndex = 1050;
  messageBox.innerText = message;

  document.body.appendChild(messageBox);

  setTimeout(() => {
    messageBox.remove();
  }, 3000); // Automatically remove after 3 seconds
}
