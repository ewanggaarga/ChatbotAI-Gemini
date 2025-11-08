const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Add temporary "Thinking..." message
  const thinkingMsg = document.createElement('div');
  thinkingMsg.classList.add('message', 'bot');
  thinkingMsg.textContent = 'Thinking...';
  chatBox.appendChild(thinkingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Remove thinking message and add AI response
    chatBox.removeChild(thinkingMsg);
    
    if (data.result) {
      appendFormattedMessage('bot', data.result);
    } else {
      appendMessage('bot', 'Sorry, no response received.');
    }
  } catch (error) {
    // Remove thinking message and show error
    chatBox.removeChild(thinkingMsg);
    appendMessage('bot', 'Failed to get response from server.');
    console.error('Error:', error);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendFormattedMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  
  // Format the text with proper line breaks and structure
  const formattedText = text
    .replace(/\n\n/g, '</p><p>')  // Double line breaks become paragraph breaks
    .replace(/\n/g, '<br>')       // Single line breaks become <br>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic text
    .replace(/`(.*?)`/g, '<code>$1</code>');           // Inline code
  
  msg.innerHTML = '<p>' + formattedText + '</p>';
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
