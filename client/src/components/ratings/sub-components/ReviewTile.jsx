import React, { useState, useEffect } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { RxDividerVertical } from 'react-icons/rx';
import ReviewImageModal from './ReviewImageModal.jsx';
import fetcher from '../../../fetchers';
import StarRating from '../../../helpers/star-rating/starRating.jsx';

export default function ReviewTile({ review, setReviews, reviews }) {
  const [modalToggle, setModalToggle] = useState(false);
  const [imgString, setImgString] = useState('');
  const [showFull, setShowFull] = useState(false);
  const [helpfulClick, setHelpfulClick] = useState(false);

  const getDateString = (dateString) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${monthName} ${day}, ${year}`;
  };

  const nameAndDate = `${getDateString(review.date)}, ${review.reviewer_name}`;
  // handles review summary
  const summaryLengthChecker = () => {
    if (review.summary.length > 60) {
      return `${review.summary.substring(0, 60)} ...`;
    }
    return review.summary;
  };
  // elipses function that works with bodyLengthChecker
  const elipsesSpan = () => (
    <span className="review-elipses-span" onClick={() => setShowFull(true)}>
      {showFull ? review.body : '...'}
    </span>
  );
  // Handles review body with truncation if neccessary
  const bodyLengthChecker = () => {
    if (review.body.length > 250) {
      return `${review.body.substring(0, 250)}`;
    }
    return review.body;
  };
  // Handles image Modal
  const imgToggler = (pic) => {
    setModalToggle(!modalToggle);
    setImgString(pic);
  };
  // Creates thumbnails with on-click functionality
  const photoHandler = () => {
    if (review.photos.length > 0) {
      const photoAltTxt = `Image for review titled ${review.summary}`;
      return review.photos.map((element) => (
        <img
          src={element.url}
          alt={photoAltTxt}
          key={element.id}
          className="review-tile-individual-photo"
          onClick={()=>imgToggler(element.url)}
        />
      ));
    }
  };

  const helpfulHandler = () => {
    fetcher.ratings.updateUseful(review.review_id)
      .then(() => fetcher.ratings.getReviews(40348))// needs id from App.jsx
      .then(({ data }) => setReviews(data.results))
      .then(() => setHelpfulClick(true))
      .catch((error) => console.log(error));
  };
  const reportHandler = () => {
    fetcher.ratings.updateReport(review.review_id)
      .then(() => fetcher.ratings.getReviews(40348))// needs id from App.jsx
      .then(({ data }) => setReviews(data.results))
      .then(() => setHelpfulClick(true))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    if (review.body.length < 250) {
      setShowFull(true);
    }
  }, [review, review.helpfulness, reviews]);

  return (
    <div className="review-tile-main-container">
      <div>
        <div className="review-tile-container-1">
          <div className="review-tile-nameAndDate">
            {nameAndDate}
          </div>
          <div className="review-tile-stars">
            <StarRating ratingPercentage={`${(review.rating / 5) * 100}%`} />
          </div>
        </div>
        <div className="review-tile-summary">{summaryLengthChecker()}</div>
        <p className="review-tile-body">
          {bodyLengthChecker()}
          {showFull ? review.body.substring(250) : elipsesSpan()}
        </p>
        <div className="review-tile-recommendation">
          {review.recommend ? <AiFillCheckCircle /> : null}
          {review.recommend ? 'I recommend this product' : null}
        </div>
        <div className="review-tile-response">
          {review.response ? `Response from seller: ${review.response}` : null}
        </div>
        <div className="review-tile-photos-container">{photoHandler()}</div>
        <div className="review-tile-container-2">
          <div className="review-tile-name">Was this review helpful?</div>
          <div
            className="review-tile-helpful"
            onClick={()=> !helpfulClick ? helpfulHandler() : null}
            style={helpfulClick ? {cursor: 'default'} : {}}>
            Yes
            <span className="review-helpful-span">
              (
              {review.helpfulness}
              )
            </span>
          </div>
          <RxDividerVertical />
          <div
            className="review-tile-report"
            onClick={()=> !helpfulClick ? reportHandler() : null}>
            Report
          </div>
          <div>
            {modalToggle
            && <ReviewImageModal imgString={imgString} setModalToggle={setModalToggle} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// TO-DO:
// Combine username and date into 1 string.
// place this new string where summary is
// move summary to its own container below container-1
// Check to see what "recommended" means for review tile
// check to see what "response" means for tile...likely both from metadata
// add helpful? Yes(numHelpful) | report buttons

