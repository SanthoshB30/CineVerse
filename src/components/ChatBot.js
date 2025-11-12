import React, { useState, useEffect, useRef } from 'react';
import { 
  searchMovieForChatbot, 
  getMoviesByGenreName,
  getAllGenres,
  getAllMovies
} from '../api/contentstack';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! 👋 I can help you discover movies. Try asking me:\n• "Tell me about [movie name]"\n• "Recommend a [genre] movie"\n• "Suggest movies about [topic]" (e.g., space travel)\n• "What genres are available?"',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 🔹 Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔹 Auto-focus when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // 🔹 Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const extractKeywords = (message) => {
    const stopWords = ['recommend', 'suggest', 'movie', 'movies', 'film', 'films', 'about', 'on', 'a', 'an', 'the', 'with', 'in', 'for', 'to'];
    const words = message.toLowerCase().split(' ');
    return words.filter(word => word.length > 2 && !stopWords.includes(word));
  };

  const searchMoviesByTopic = async (keywords) => {
    const movies = await getAllMovies();
    const scoredMovies = movies.map(movie => {
      let score = 0;
      const movieText = `${movie.title} ${movie.description}`.toLowerCase();
      keywords.forEach(keyword => {
        if (movie.title.toLowerCase().includes(keyword)) score += 10;
        if (movie.description?.toLowerCase().includes(keyword)) score += 5;
      });
      return { ...movie, score };
    });
    return scoredMovies.filter(m => m.score > 0).sort((a, b) => b.score - a.score);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();

    setMessages(prev => [
      ...prev,
      { type: 'user', text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputValue('');
    setIsTyping(true);

    const response = await processMessage(userMessage);

    // 🔹 Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 600 + Math.random() * 500);
  };

  const processMessage = async (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('genre') && (lowerMessage.includes('available') || lowerMessage.includes('what') || lowerMessage.includes('list'))) {
      const genres = await getAllGenres();
      if (genres.length > 0) {
        const genreList = genres.map(g => g.name).join(', ');
        return `We have the following genres available: ${genreList}. Which genre interests you?`;
      }
      return "I'm having trouble fetching genres right now. Please try again later.";
    }

    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      const genres = await getAllGenres();
      for (const genre of genres) {
        if (lowerMessage.includes(genre.name.toLowerCase())) {
          const movies = await getMoviesByGenreName(genre.name);
          if (movies.length > 0) {
            const topMovies = movies.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
            let response = `Here are some great ${genre.name} movies:\n\n`;
            topMovies.forEach((movie, idx) => {
              response += `${idx + 1}. **${movie.title}** (${movie.release_year})`;
              if (movie.rating) response += ` - ⭐ ${movie.rating.toFixed(1)}`;
              if (movie.director?.[0]) response += ` - Directed by ${movie.director[0].name}`;
              response += '\n';
            });
            return response;
          }
          return `I couldn't find any ${genre.name} movies at the moment.`;
        }
      }

      const keywords = extractKeywords(lowerMessage);
      if (keywords.length > 0) {
        const movies = await searchMoviesByTopic(keywords);
        if (movies.length > 0) {
          const topMovies = movies.slice(0, 5);
          let response = `Here are movies about ${keywords.join(', ')}:\n\n`;
          topMovies.forEach((movie, idx) => {
            response += `${idx + 1}. **${movie.title}** (${movie.release_year})`;
            if (movie.rating) response += ` - ⭐ ${movie.rating.toFixed(1)}`;
            if (movie.director?.[0]) response += ` - Directed by ${movie.director[0].name}`;
            response += '\n';
          });
          return response;
        }
        return `I couldn't find any movies about ${keywords.join(', ')}. Try another topic!`;
      }

      return "Please specify a genre or topic, e.g., 'Recommend movies about space travel' or 'Suggest a Drama film'.";
    }

    if (lowerMessage.includes('tell me about') || lowerMessage.includes('what is') || lowerMessage.includes('about')) {
      let searchTerm = message;
      if (lowerMessage.includes('tell me about')) searchTerm = message.split(/tell me about/i)[1]?.trim() || message;
      else if (lowerMessage.includes('what is')) searchTerm = message.split(/what is/i)[1]?.trim() || message;
      else if (lowerMessage.includes('about')) searchTerm = message.split(/about/i)[1]?.trim() || message;

      const movies = await searchMovieForChatbot(searchTerm);
      if (movies.length > 0) {
        const movie = movies[0];
        let response = `**${movie.title}** (${movie.release_year})\n\n`;
        if (movie.director?.[0]) response += `Directed by: ${movie.director[0].name}\n`;
        if (movie.genre && movie.genre.length > 0) response += `Genre: ${movie.genre.map(g => g.name).join(', ')}\n`;
        if (movie.duration) response += `Duration: ${movie.duration}\n`;
        if (movie.rating) response += `Rating: ⭐ ${movie.rating.toFixed(1)}/5\n`;
        response += `\n${movie.description?.substring(0, 200)}...`;
        return response;
      }
      return `I couldn't find a movie matching "${searchTerm}". Try another title!`;
    }

    const movies = await searchMovieForChatbot(message);
    if (movies.length > 0) {
      let response = `I found ${movies.length} movie(s) matching your search:\n\n`;
      movies.forEach((movie, idx) => {
        response += `${idx + 1}. ${movie.title} (${movie.release_year})`;
        if (movie.rating) response += ` - ⭐ ${movie.rating.toFixed(1)}`;
        response += '\n';
      });
      response += '\nWant to know more about any of these?';
      return response;
    }

    return "I'm not sure how to help with that. Try asking about a specific movie, or request recommendations by genre!";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)} aria-label="Open chatbot">💬</button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>CineVerse AI 🎬</h3>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chatbot">✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.split('**').map((part, j) => 
                        j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                      )}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me about movies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend} disabled={!inputValue.trim()} aria-label="Send message">➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
