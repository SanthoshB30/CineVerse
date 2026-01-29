import React, { useState, useEffect, useRef } from 'react';
import { 
  searchMovieForChatbot, 
  getMoviesByGenreName,
  getAllGenres,
  getAllMovies
} from '../api/contentstack';

// Chatbot API URL from environment
const CHATBOT_API_URL = process.env.REACT_APP_CONTENTSTACK_AUTOMATIONS_CHATBOT_URL;

// Supported languages (static configuration)
const SUPPORTED_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Japanese',
  'Korean',
  'Chinese',
  'Italian',
  'Portuguese'
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Welcome to CineVerse Assistant.\n\nHow can I help you today?\n\n• Tell me about [movie name]\n• Recommend a [genre] movie\n• Suggest movies about [topic]\n• What genres are available?',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastDiscussedMovieRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Load metadata on mount
  useEffect(() => {
    loadMetadata();
  }, []);

  /**
   * Load metadata containing genres and movies grouped by genre
   */
  const loadMetadata = async () => {
    try {
      const [genres, movies] = await Promise.all([
        getAllGenres(),
        getAllMovies()
      ]);

      const moviesByGenre = {};
      genres.forEach(genre => {
        const genreMovies = movies.filter(movie => 
          movie.genre?.some(g => g.uid === genre.uid || g.name === genre.name)
        );
        moviesByGenre[genre.name] = genreMovies.map(m => ({
          title: m.title,
          release_year: m.release_year,
          rating: m.rating,
          director: m.director?.[0]?.name || 'Unknown'
        }));
      });

      setMetadata({
        genres: genres.map(g => g.name),
        languages: SUPPORTED_LANGUAGES,
        ...moviesByGenre
      });

      console.log('📦 Chatbot metadata loaded:', {
        genres: genres.length,
        totalMovies: movies.length
      });
    } catch (error) {
      console.error('Error loading chatbot metadata:', error);
      setMetadata({
        genres: [],
        languages: SUPPORTED_LANGUAGES
      });
    }
  };

  /**
   * Send user query to the Contentstack Automations chatbot API
   */
  const sendToChatbotAPI = async (userQuery) => {
    if (!CHATBOT_API_URL) {
      console.error('Chatbot API URL not configured');
      return null;
    }

    const currentMetadata = metadata || { genres: [], languages: SUPPORTED_LANGUAGES };

    const requestBody = {
      user_query: userQuery,
      metadata: currentMetadata
    };

    console.log('🤖 Sending to chatbot API:', {
      url: CHATBOT_API_URL,
      query: userQuery,
      metadataKeys: Object.keys(currentMetadata)
    });

    try {
      const response = await fetch(CHATBOT_API_URL.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 Chatbot API response:', data);

      return extractResponseText(data);
    } catch (error) {
      console.error('Chatbot API error:', error);
      return null;
    }
  };

  /**
   * Extract response text from API response
   */
  const extractResponseText = (data) => {
    if (typeof data === 'string') return data;
    if (data.response) return data.response;
    if (data.message) return data.message;
    if (data.text) return data.text;
    if (data.answer) return data.answer;
    if (data.output) return data.output;
    if (data.result) {
      if (typeof data.result === 'string') return data.result;
      if (data.result.response) return data.result.response;
      if (data.result.message) return data.result.message;
    }
    return JSON.stringify(data, null, 2);
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

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 600 + Math.random() * 500);
  };

  const processMessage = async (message) => {
    // First, try to get response from the API
    const apiResponse = await sendToChatbotAPI(message);
    if (apiResponse) {
      return apiResponse;
    }

    // Fallback to local processing if API fails or is not configured
    const lowerMessage = message.toLowerCase().trim();
    const genres = await getAllGenres();
    const allMovies = await getAllMovies();

    // 1. Check for genre list request
    if (lowerMessage === 'genre' || 
        lowerMessage === 'genres' || 
        lowerMessage === 'all genres' ||
        lowerMessage === 'list genres' ||
        lowerMessage === 'show genres' ||
        (lowerMessage.includes('genre') && (lowerMessage.includes('available') || lowerMessage.includes('what') || lowerMessage.includes('list') || lowerMessage.includes('show') || lowerMessage.includes('all')))) {
      if (genres.length > 0) {
        const genreList = genres.map(g => g.name).join(', ');
        return `**Available Genres**\n\n${genreList}\n\nSelect a genre to view recommendations.`;
      }
      return 'Unable to retrieve genres at this time. Please try again later.';
    }

    // 2. Check for similar movie request
    if (lowerMessage.includes('similar')) {
      const lastMovie = lastDiscussedMovieRef.current;
      
      if (lastMovie && lastMovie.genre && lastMovie.genre.length > 0) {
        const primaryGenre = lastMovie.genre[0].name;
        const movies = await getMoviesByGenreName(primaryGenre);
        
        if (movies.length > 0) {
          const similarMovies = movies
            .filter(m => m.title !== lastMovie.title)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5);
          
          if (similarMovies.length > 0) {
            let response = `**Similar to ${lastMovie.title}**\n\n`;
            response += `Based on genre: ${primaryGenre}\n\n`;
            similarMovies.forEach((movie, idx) => {
              response += `${idx + 1}. **${movie.title}** (${movie.release_year})`;
              if (movie.rating) response += `\n   Rating: ${movie.rating.toFixed(1)}/5`;
              if (movie.director?.[0]) response += `\n   Director: ${movie.director[0].name}`;
              response += '\n\n';
            });
            response += '**Next Steps**\nAsk for details on any title above.';
            return response;
          }
        }
        return `No similar titles found for ${lastMovie.title}.`;
      }
      
      return 'No movie context available.\n\nFirst, ask about a specific movie, then request similar recommendations.';
    }

    // 3. Extract search term from common phrases
    let searchTerm = message.trim();
    if (lowerMessage.includes('tell me about')) {
      searchTerm = message.split(/tell me about/i)[1]?.trim() || message;
    } else if (lowerMessage.includes('what is')) {
      searchTerm = message.split(/what is/i)[1]?.trim() || message;
    } else if (lowerMessage.includes('show me')) {
      searchTerm = message.split(/show me/i)[1]?.trim() || message;
    } else if (lowerMessage.includes('find')) {
      searchTerm = message.split(/find/i)[1]?.trim() || message;
    } else if (lowerMessage.includes('search')) {
      searchTerm = message.split(/search/i)[1]?.trim() || message;
    } else if (lowerMessage.startsWith('about ')) {
      searchTerm = message.substring(6).trim();
    }

    const searchTermLower = searchTerm.toLowerCase();

    // 4. Check if the input matches a genre name directly
    for (const genre of genres) {
      const genreLower = genre.name.toLowerCase();
      if (searchTermLower === genreLower || 
          searchTermLower.includes(genreLower) || 
          lowerMessage.includes(genreLower + ' movie') ||
          lowerMessage.includes(genreLower + ' films')) {
        const movies = await getMoviesByGenreName(genre.name);
        if (movies.length > 0) {
          const topMovies = movies.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
          let response = `**${genre.name} Movies**\n\n`;
          topMovies.forEach((movie, idx) => {
            response += `${idx + 1}. **${movie.title}** (${movie.release_year})`;
            if (movie.rating) response += `\n   Rating: ${movie.rating.toFixed(1)}/5`;
            if (movie.director?.[0]) response += `\n   Director: ${movie.director[0].name}`;
            response += '\n\n';
          });
          response += '**Next Steps**\nAsk for details on any title above.';
          return response;
        }
        return `No ${genre.name} titles are currently available.`;
      }
    }

    // 5. Check for exact or close movie title match
    const exactMatch = allMovies.find(m => m.title.toLowerCase() === searchTermLower);
    if (exactMatch) {
      lastDiscussedMovieRef.current = exactMatch;
      return formatMovieDetails(exactMatch);
    }

    // 6. Search movies by title (partial match)
    const titleMatches = allMovies.filter(m => 
      m.title.toLowerCase().includes(searchTermLower) ||
      searchTermLower.includes(m.title.toLowerCase())
    ).sort((a, b) => {
      // Prioritize closer matches
      const aStartsWith = a.title.toLowerCase().startsWith(searchTermLower);
      const bStartsWith = b.title.toLowerCase().startsWith(searchTermLower);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    if (titleMatches.length === 1) {
      // Single match - show details
      lastDiscussedMovieRef.current = titleMatches[0];
      return formatMovieDetails(titleMatches[0]);
    } else if (titleMatches.length > 1) {
      // Multiple matches - show list
      let response = `**Movies matching "${searchTerm}"**\n\n`;
      titleMatches.slice(0, 5).forEach((movie, idx) => {
        response += `${idx + 1}. **${movie.title}** (${movie.release_year})`;
        if (movie.rating) response += ` - ${movie.rating.toFixed(1)}/5`;
        if (movie.genre?.length > 0) response += `\n   Genre: ${movie.genre.map(g => g.name).join(', ')}`;
        response += '\n\n';
      });
      response += 'Type a movie name for more details.';
      return response;
    }

    // 7. Search by keywords in description, director, etc.
    const keywords = extractKeywords(searchTermLower);
    if (keywords.length > 0) {
      const keywordMatches = await searchMoviesByTopic(keywords);
      if (keywordMatches.length > 0) {
        const topMovies = keywordMatches.slice(0, 5);
        let response = `**Results for "${searchTerm}"**\n\n`;
        topMovies.forEach((movie, idx) => {
          response += `${idx + 1}. **${movie.title}** (${movie.release_year})`;
          if (movie.rating) response += ` - ${movie.rating.toFixed(1)}/5`;
          if (movie.genre?.length > 0) response += `\n   Genre: ${movie.genre.map(g => g.name).join(', ')}`;
          response += '\n\n';
        });
        response += 'Type a movie name for more details.';
        return response;
      }
    }

    // 8. Try the searchMovieForChatbot API as last resort
    const apiMovies = await searchMovieForChatbot(searchTerm);
    if (apiMovies.length > 0) {
      if (apiMovies.length === 1) {
        lastDiscussedMovieRef.current = apiMovies[0];
        return formatMovieDetails(apiMovies[0]);
      }
      let response = `**Search Results** (${apiMovies.length} found)\n\n`;
      apiMovies.forEach((movie, idx) => {
        response += `${idx + 1}. **${movie.title}** (${movie.release_year})`;
        if (movie.rating) response += ` - ${movie.rating.toFixed(1)}/5`;
        response += '\n';
      });
      response += '\nType a movie name for more details.';
      return response;
    }

    // 9. No results found
    return `No results found for "${searchTerm}".\n\nTry:\n• A movie title (e.g., "Inception")\n• A genre (e.g., "Horror", "Comedy")\n• A keyword (e.g., "space", "love")`;
  };

  /**
   * Format movie details for display
   */
  const formatMovieDetails = (movie) => {
    let response = `**${movie.title}** (${movie.release_year})\n\n`;
    response += '**Overview**\n';
    response += `${movie.description?.substring(0, 300) || 'No description available.'}${movie.description?.length > 300 ? '...' : ''}\n\n`;
    response += '**Key Details**\n';
    if (movie.director?.[0]) response += `Director: ${movie.director[0].name}\n`;
    if (movie.genre && movie.genre.length > 0) response += `Genre: ${movie.genre.map(g => g.name).join(', ')}\n`;
    if (movie.duration) response += `Duration: ${movie.duration}\n`;
    if (movie.rating) response += `Rating: ${movie.rating.toFixed(1)}/5\n`;
    response += '\n**Suggested Follow-ups**\n';
    response += '• "Similar movies"\n';
    response += '• Try another genre or movie name';
    return response;
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
