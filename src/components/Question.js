import React from 'react';
import { Card, CardContent, Typography, ListItemText, List, ListItem } from '@material-ui/core';
import AnswerListItem from './AnswerListItem';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  questionContent: {
    fontSize: "1.2em",
    color: theme.palette.primary.main,
  },  
  questionNr: {
    fontSize: "1.7em",
    color: theme.palette.primary.main,
  },
}));

const Question = ({ question, index, selectAnswer, answer }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
    <Typography variant="h3" className={classes.questionNr}>Question {index + 1}:</Typography>
    <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography className={classes.questionContent}>
              {question.title}
            </Typography>
          </FormLabel>
          <RadioGroup>
          {question.choices.map(choice => {
            return (
              <FormControlLabel value={choice.choice_id} control={<Radio />} label={choice.value} onClick={() => selectAnswer(question.question_id, choice.choice_id)}/>
          );
          })}
          </RadioGroup>
      </FormControl>
      </React.Fragment>
  );
};

export default Question;
