import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  retake_button: {
    textTransform: 'none',
    margin: theme.spacing(2, 0, 0),
    borderRadius: 0,
  },
}));

const ScorePage = ({ title, score, retakeQuiz }) => {
  const classes = useStyles();
  const pageTitle = title || 'Good job, you finished the quiz.';

  return (
    <Card square>
      <CardHeader title={pageTitle} />
      <CardContent>
        <Typography variant="h6">
          Your score is {score.value} out of {score.from}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.retake_button}
          onClick={retakeQuiz}
        >
          Retake Quiz
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScorePage;
