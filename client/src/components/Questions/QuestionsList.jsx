import React, { useState, useEffect } from 'react';
import Question from './Question.jsx';
import QandAModal from './QandAModal.jsx';

export default function QuestionsList({
  questions,
  product_id,
  updateQuestions,
  filterText,
}) {
  const [numQuestions, setNumQuestions] = useState(2);
  const [showAddQ, setShowAddQ] = useState(false);

  const loadMoreQuestions = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      const increment = numQuestions + 2 > questions.length
        ? questions.length - numQuestions
        : 2;
      setNumQuestions(numQuestions + increment);
    }
  };

  // TODO: same function in Question.jsx
  const showModal = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      setShowAddQ(true);
    }
  };

  useEffect(() => {
    setNumQuestions(questions.length < 2 ? questions.length : 2);
  }, [questions]);

  return (
    <div className="qa list">
      {questions.length > 0
        ? questions.slice(0, numQuestions).map((question) => (
          <Question
            key={question.question_id}
            question={question}
            updateQuestions={updateQuestions}
            filterText={filterText}
          />
        ))
        : null}
      <div className="qa footer-control">
        <button
          className="qa footer-btn"
          type="button"
          tabIndex={0}
          onKeyUp={showModal}
          onClick={showModal}
        >
          {'ADD A QUESTION \t +'}
        </button>
        {numQuestions !== questions.length ? (
          <button
            className="qa footer-btn"
            type="button"
            tabIndex={0}
            onKeyUp={loadMoreQuestions}
            onClick={loadMoreQuestions}
          >
            MORE ANSWERED QUESTIONS
          </button>
        )
          : null}

        <QandAModal
          type="question"
          show={showAddQ}
          closeModal={setShowAddQ}
          product_id={product_id}
        />
      </div>
    </div>
  );
}