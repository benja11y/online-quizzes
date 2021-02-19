import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Fab,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Assignment } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: theme.spacing(1.5),
  },
  cardActions: {
    justifyContent: 'center',
  },
}));

const Welcome = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      {/* <CardHeader title="Welcome to Online Quizzes System" /> */}
      <CardContent className={classes.cardContent}>
        <Typography variant="h5">Welcome to the test bed!</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        {/* <Fab color="primary" variant="extended">
          <Assignment />
          Start
        </Fab> */}
      </CardActions>
    </Card>
  );
};

export default Welcome;
