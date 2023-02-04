import React, { useState } from 'react';
import Answer from './Answer.jsx';
import QandAModal from './QandAModal.jsx';
import fetcher from '../../fetchers';

export default function Question({
  question: {
    question_id,
    question_body: body,
    // question_date: date,
    // asker_name: asker,
    question_helpfulness: helpfulness,
    // reported,
    answers,
  },
  updateQuestions,
  filterText,
}) {
  const [numAnswers, setNumAnswers] = useState(2);
  const [showAddA, setShowAddA] = useState(false);
  const [helpfulStatus, setHelpfulStatus] = useState(true);

  // TODO: need to sort answers by helpfulness
  // const byHelpfulness = (a, b) => {
  //   if (a[1].helpfulness > b[1].helpfulness) return -1;
  //   if (a[1].helpfulness < b[1].helpfulness) return 1;
  //   return 0;
  // };

  // const sortedAnswers = () => Object.entries(answers).sort(byHelpfulness);

  const markHelpfulQuestion = (e) => {
    if ((e.type === 'click' || e.key === 'Enter') && helpfulStatus) {
      fetcher
        .markHelpfulQuestion(question_id)
        .then(updateQuestions)
        .then(() => setHelpfulStatus(false))
        .catch((err) => console.error('markHelpfulQuestion: ', err));
    }
  };

  const loadMoreAnswers = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      const increment = numAnswers + 2 > Object.keys(answers).length
        ? Object.keys(answers).length - numAnswers
        : 2;
      setNumAnswers(numAnswers + increment);
    }
  };

  // TODO: same function in QuestionsList.jsx
  const showModal = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      setShowAddA(true);
    }
  };

  const formatBody = () => {
    if (filterText.length < 3) return body;
    const parts = body.split(new RegExp(`(${filterText})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => (
          part.toLowerCase() === filterText.toLowerCase()
            ? <mark key={`${i + 1}_${part}`}>{part}</mark>
            : part
        ))}
      </span>
    );
  };

  return (
    <div className="qa q&a">
      <div className="qa question">
        <h3 className="qa question-body">
          {'Q: '}
          {formatBody()}
        </h3>
        <span className="qa control">
          {'Helpful? '}
          {helpfulStatus ? (
            <span
              className="qa link"
              role="link"
              tabIndex={0}
              onKeyUp={markHelpfulQuestion}
              onClick={markHelpfulQuestion}
            >
              Yes
            </span>
          ) : <span>Marked!</span>}
          {` (${helpfulness}) | `}
          <span
            className="qa link"
            role="link"
            tabIndex={0}
            onKeyUp={showModal}
            onClick={showModal}
          >
            Add Answer
          </span>
          <QandAModal
            type="answer"
            show={showAddA}
            closeModal={setShowAddA}
            question_id={question_id}
          />
        </span>
      </div>
      {Object.keys(answers).length > 0 ? (
        <div className="qa answers-section">
          <h3>A: </h3>
          <div className="qa answers-list">
            {/* TODO: sort answers by helpfulness */}
            {Object.keys(answers).slice(0, numAnswers).map((key) => (
              <Answer
                key={key}
                answer={answers[key]}
                updateQuestions={updateQuestions}
              />
            ))}
          </div>
        </div>
      ) : null}
      {numAnswers < Object.keys(answers).length ? (
        <span
          className="qa link link-bold"
          role="link"
          tabIndex={0}
          onKeyUp={loadMoreAnswers}
          onClick={loadMoreAnswers}
        >
          LOAD MORE ANSWERS
        </span>
      )
        : null}
    </div>
  );
}