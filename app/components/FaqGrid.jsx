import { useState } from 'react';

export default function FaqGrid({ faqs }) {
  return (
    <>
      <div className="faq-grid">
        {faqs.map((faq, index) => (
          <FaqItem key={index} faq={faq} />
        ))}
      </div>
      <style>{`
        /* General grid setup */
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        /* Grid responsiveness */
        @media (min-width: 768px) {
          .faq-grid {
            grid-template-columns: repeat(2, 1fr); /* Two columns on medium screens */
          }
        }

        /* Individual FAQ item styles */
        .faq-item {
          border-bottom: 1px solid #ddd;
          padding-bottom: 1rem;
        }

        /* Button styles */
        .faq-button {
          display: flex;
          justify-content: space-between;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 0;
          font-size: 1.125rem;
        }

        /* Header style for the FAQ item */
        .faq-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .faq-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .faq-question {
          font-weight: 500;
          font-size: 1.125rem;
        }

        /* Toggle button styles (+/-) */
        .faq-toggle {
          font-size: 1.5rem;
        }

        /* Answer text styling */
        .faq-answer {
          margin-top: 1rem;
          color: #4a4a4a;
          font-size: 1rem;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button onClick={() => setOpen(!open)} className="faq-button">
        <div className="faq-header">
          {faq.icon && <img src={faq.icon} alt="" className="faq-icon" />}
          <span className="faq-question">{faq.question}</span>
        </div>
        <span className="faq-toggle">{open ? '-' : '+'}</span>
      </button>

      {open && <p className="faq-answer">{faq.answer}</p>}
    </div>
  );
}
