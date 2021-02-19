import React from 'react';
import { Container, Paper, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Assignment } from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: `${theme.spacing(2)}px`,
    marginTop: theme.spacing(2),

    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
    },
  },
  welcomeAlert: {
    borderRadius: 0,
  },
}));

// Cuatom Button
const CustomButton = withStyles(() => ({
  root: {
    textTransform: 'none',
    textAlign: 'left',
  },
}))(Button);

const QuizzesNav = props => {
  const classes = useStyles();
  const { quizzes, handleChoosingQuiz, currentQuiz } = props;

  const renderButtons = () => {
    const buttons = quizzes.map(quiz => {
      const isSelected = currentQuiz ? currentQuiz.id === quiz.id : false;


      return (
        <CustomButton
          key={quiz.id}
          size="medium"
          variant="contained"
          color={isSelected ? 'default' : 'secondary'}
          startIcon={<Assignment />}
          onClick={() => handleChoosingQuiz(quiz.id)}
          disableRipple
        >
          {quiz.title}
        </CustomButton>
      );
    });

    return buttons;
  };


  return (
    <Paper variant="outlined" square className={classes.paper}>
      <Container fixed className={classes.container}>
        {renderButtons()}
      </Container>
    </Paper>
  );
};

export default QuizzesNav;
