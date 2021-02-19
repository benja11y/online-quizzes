import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Container,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  List,
} from '@material-ui/core';
import Question from './Question';
import ScorePage from './ScorePage';
import {
  setItemSession,
  getItemSession,
  setItem,
  getItem,
} from '../helpers/storage';
import { strings } from '../config/constants';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.primary.light,
  },
  container: {
    margin: theme.spacing(3, 0),
  },
  quizOverview: {
    fontSize: theme.typography.fontSize * 1.5,
    margin: theme.spacing(3, 0),
  },
  navigationButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2, 2),

    '& button': {
      borderRadius: 0,
      '&.MuiButton-containedPrimary': {
        backgroundColor: theme.palette.primary.dark,
        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabledBackground,
        },
      },
    },
  },
}));

const QuizContent = props => {
  const [page, setPage] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState({ value: 0, points: 1, from: 100 });
  const { currentQuiz } = props;
  const classes = useStyles();

  // Only when the component mounts, look for existing session data
  useEffect(() => {
    const currentPage = getItemSession(strings.CURRENT_PAGE);
    if (currentPage) {
      const savedPage = currentPage[currentQuiz.id];
      if (savedPage) {
        setPage(savedPage);
      }
    }

    const answers = getItemSession(strings.ANSWERS);
    if (answers) {
      const savedAnswers = answers[currentQuiz.id];
      if (savedAnswers) {
        setAnswers(savedAnswers);
      }
    }
  }, [currentQuiz.id]);

  useEffect(() => {
    if (currentQuiz.questions) {
      const number = currentQuiz.questions.length;
      setNumberOfQuestions(number);
      setScore(prevScore => ({
        ...prevScore,
        from: number * prevScore.points,
      }));
    }
  }, [currentQuiz.questions]);

  useEffect(() => {
    const prevPageObject = getItemSession(strings.CURRENT_PAGE);

    if (page !== numberOfQuestions + 1) {
      setItemSession(strings.CURRENT_PAGE, {
        ...prevPageObject,
        [currentQuiz.id]: page,
      });
    } else {
      setAnswers([]);

      // To avoid storing score page in storage
      setItemSession(strings.CURRENT_PAGE, {
        ...prevPageObject,
        [currentQuiz.id]: 0,
      });
    }
  }, [page, currentQuiz.id, numberOfQuestions]);

  useEffect(() => {
    const prevAnswersObject = getItemSession(strings.ANSWERS);
    setItemSession(strings.ANSWERS, {
      ...prevAnswersObject,
      [currentQuiz.id]: answers,
    });
  }, [answers, currentQuiz.id]);

  useEffect(() => {
    if (page === numberOfQuestions + 1) {
      // Save result in local storage
      const result = {
        quiz: currentQuiz.title,
        value: score.value,
        date: Date.now(),
      };

      const sotredResults = getItem(strings.RESULTS);
      if (sotredResults) {
        setItem(strings.RESULTS, [...sotredResults, result]);
      } else {
        setItem(strings.RESULTS, [result]);
      }
    }
  }, [page, numberOfQuestions, score, currentQuiz.title]);

  const selectAnswer = (questionId, answerId) => {
    const newAnswer = {
      questionId,
      answerId,
    };

    // Get all answers except those for the current question (if any)
    const newAnswersArray = answers.filter(
      answer => answer.questionId !== questionId
    );

    // Add the new answer and update the state
    newAnswersArray.push(newAnswer);
    setAnswers(newAnswersArray);
  };

  const startQuiz = () => {
    setPage(1);
  };

  const submitQuiz = () => {
    const correctAnswers = currentQuiz.questions.map(question => ({
      questionId: question.question_id,
      correctAnswer: question.answer,
    }));

    answers.forEach(answer => {
      const correspondingCorrectAns = correctAnswers.filter(
        correctAns => correctAns.questionId === answer.questionId
      )[0];

      if (answer.answerId === correspondingCorrectAns.correctAnswer) {
        setScore(prevScore => ({
          ...prevScore,
          value: prevScore.value + score.points,
        }));
      }
    });

    // Move to the score page
    setPage(numberOfQuestions + 1);
  };

  const retakeQuiz = () => {
    setPage(0);
    setAnswers([]);
    setScore(prevScore => ({ ...prevScore, value: 0 }));
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const isFirstPage = page === 0;
  const isLastPage = page === numberOfQuestions;
  const isScorePage = page === numberOfQuestions + 1;

  // Render the current page
  const renderPage = () => {
    // The overview page
    if (isFirstPage) {
      return (
        <React.Fragment>
          <CardContent className={classes.quizOverview}>
            {currentQuiz.overview}
          </CardContent>
          <CardActions>
            <Button color="primary" size="large" onClick={startQuiz}>
              Start
            </Button>
          </CardActions>
        </React.Fragment>
      );
    }

    if (isScorePage) {
      return (
        <ScorePage
          score={{ value: score.value, from: score.from }}
          retakeQuiz={retakeQuiz}
        />
      );
    }

    // The question page (based on the question index number)
    if (currentQuiz.questions) {
      return currentQuiz.questions.map((question, index) => {
        // Question pages start at 1
        if (index + 1 === page) {
          const questionAnswer = answers.filter(
            answer => answer.questionId === question.question_id
          )[0];

          return (
            <React.Fragment key={question.question_id}>
              <Question
                question={question}
                index={index}
                selectAnswer={selectAnswer}
                answer={questionAnswer ? questionAnswer.answerId : undefined}
              />
            </React.Fragment>
          );
        }

        // No selected question, return nothing.
        return '';
      });
    }
  };

  const renderNavigation = () => {
    if (!isFirstPage && !isScorePage) {
      return (
        <CardActions className={classes.navigationButtons}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={prevPage}
            disabled={page === 1 ? true : false}
          >
            Previous
          </Button>
          {isLastPage ? (
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              onClick={submitQuiz}
            >
              Submit
            </Button>
          ) : (
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={nextPage}
              >
                Next
              </Button>
            )}
        </CardActions>
      );
    }
  };

  return (
    <Paper className={classes.root} variant="outlined" square>
      <Container className={classes.container}>
        <Card square raised className={classes.card}>
          <CardHeader title={currentQuiz.title} />
          <CardContent className={classes.cardContent}>
            {renderPage()}
          </CardContent>
          {renderNavigation()}
        </Card>
      </Container>
    </Paper>
  );
};

export default QuizContent;
