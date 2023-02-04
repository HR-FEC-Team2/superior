import React, { useState, useEffect } from 'react';
import fetcher from '../../fetchers';
import SearchBar from './SearchBar.jsx';
import QuestionsList from './QuestionsList.jsx';
import './styles/questions.css';

export default function Questions({
  feature,
}) {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [timer, setTimer] = useState(null);

  const onFilterTextChange = (value) => {
    setFilterText(value);
    clearTimeout(timer);
  };

  const putQuestions = () => fetcher.getQuestionsById(feature.id)
    .then(({ data }) => setQuestions(data.results))
    .catch((err) => console.error('Questions on feature change fetch: ', err));

  // TODO: maybe want to search through answers too
  // const combineAnswerText = ()

  const byHasAnswers = (question) => {
    if (!Object.keys(question.answers).length) return false;
    return true;
  };

  const bySearchTerm = (question) => {
    if (!question.question_body
      .toUpperCase()
      .includes(filterText.toUpperCase())) return false;
    return true;
  };

  const filterQuestionsWithAnswers = () => {
    setFilteredQuestions(questions.filter(byHasAnswers));
  };

  const filterQuestionsBySearch = () => {
    setFilteredQuestions(questions.filter(bySearchTerm));
  };

  // TODO: investigate react-hooks/exhaustive-deps
  // TODO: probably some way to use less useEffects and condense the functions
  useEffect(() => {
    putQuestions();
  }, [feature]);

  useEffect(() => {
    if (filterText.length >= 3) {
      setTimer(setTimeout(filterQuestionsBySearch, 500));
    }
  }, [filterText]);

  useEffect(() => {
    if (filterText.length < 3) {
      filterQuestionsWithAnswers();
    }
  }, [questions]);

  // TODO: want to refactor the footer buttons in QuestionsList into this
  // component since this component acts as a control for the questions list
  // seeing as it already applies filters.
  return (
    <div id="questions-widget" className="qa qa-section">
      <h2>QUESTIONS & ANSWERS</h2>
      <SearchBar
        text={filterText}
        handleChange={onFilterTextChange}
      />
      <QuestionsList
        product_id={feature.id}
        questions={!filteredQuestions.length ? questions : filteredQuestions}
        updateQuestions={putQuestions}
        filterText={filterText}
      />
    </div>
  );
}