import React, { useEffect } from 'react';
import './web.css';
function Chatbot() {
  useEffect(() => {
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const closeBtn = document.querySelector('.close-btn');
    const chatbox = document.querySelector('.chatbox');
    const chatInput = document.querySelector('.chat-input textarea');
    const sendChatBtn = document.querySelector('.chat-input span');

    let userMessage = null;
    const inputInitHeight = chatInput.scrollHeight;
    const API_KEY = "YOUR_OPENAI_API_KEY"; 

    const createChatLi = (message, className = "outgoing") => {
      const chatLi = document.createElement("li");
      chatLi.classList.add("chat", className);
      let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
      chatLi.innerHTML = chatContent;
      chatLi.querySelector("p").textContent = message;
      return chatLi;
    };

    const generateResponse = (chatElement) => {
      const API_URL = "https://api.openai.com/v1/chat/completions";
      const messageElement = chatElement.querySelector("p");

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        }),
      };

      fetch(API_URL, requestOptions)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          messageElement.textContent = data.choices[0].message.content.trim();
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          messageElement.classList.add("error");
          messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    };

    const handleChat = () => {
      userMessage = chatInput.value.trim();
      if (!userMessage) return;

      chatInput.value = "";
      chatInput.style.height = `${inputInitHeight}px`;

      chatbox.appendChild(createChatLi(userMessage, "outgoing"));
      chatbox.scrollTo(0, chatbox.scrollHeight);

      setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
      }, 600);
    };

    chatInput.addEventListener("input", () => {
      chatInput.style.height = `${inputInitHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
      }
    });

    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

    // End of your JavaScript code
  }, []); // Empty dependency array means this effect will only run once when the component mounts

  return (
    <div className="flex-container">
      <button className="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot">
        <header>
          <h2>Chatbot</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        <ul className="chatbox">
          <li className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
            <p>Hi there 👋<br />How can I help you today?</p>
          </li>
        </ul>
        <div className="chat-input">
          <textarea placeholder="Enter a message..." spellCheck="false" required></textarea>
          <span id="send-btn" className="material-symbols-rounded">send</span>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
