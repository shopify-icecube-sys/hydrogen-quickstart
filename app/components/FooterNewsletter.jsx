import {useState} from 'react';

export function FooterNewsletter({ 
  title = "Subscribe to our emails", 
  description = "Be the first to know about new collections and exclusive offers." 
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="footer-newsletter">
      <div className="newsletter-content">
        <h3 className="newsletter-title">{title}</h3>
        <p className="newsletter-description">
          {description}
        </p>
        
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={status === 'loading'}
              className="newsletter-input"
              aria-label="Email address"
            />
            <button 
              type="submit" 
              disabled={status === 'loading' || !email}
              className={`newsletter-button ${status === 'loading' ? 'loading' : ''}`}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </button>
          </div>

          {status === 'success' && (
            <div className="newsletter-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="#22c55e"/>
                <path d="M6.5 8.5L7.5 9.5L10.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {message}
            </div>
          )}
          
          {status === 'error' && (
            <div className="newsletter-error">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}