import React, { useState } from 'react';
import {
  Container,
  Typography,
  NativeSelect,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getItem } from '../../helpers/storage';
import { strings } from '../../config/constants';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  instructions: {
    margin: theme.spacing(2, 0),
  },
  chartContainer: {
    marginTop: theme.spacing(4),
  },
  quizSelect: {
    width: '50%',
  },
  periodsRadioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: theme.spacing(2, 0),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [selectedQuiz, setSelectedQuiz] = useState(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const formatDate = date => moment(date).format('D/MMM/YYYY');

  const handleChoosingQuiz = e => {
    const { value } = e.target;
    setSelectedQuiz(value);
  };

  const getQuizData = () => {
    const results = getItem(strings.RESULTS);
    if (results) {
      const quizResults = results.filter(
        result => result.quiz === selectedQuiz
      );

      // Filter results based on the selected period
      let filteredResults = quizResults.filter(result => {
        if (selectedPeriod === 'all') {
          return result;
        }

        const now = moment();
        const date = moment(result.date);
        return now.diff(date, 'days') < selectedPeriod;
      });

      // Return formatted date labels
      let dateLabels = filteredResults.map(result => formatDate(result.date));

      // Remove duplicates
      dateLabels = [...new Set(dateLabels)];

      // This is where the data on the chart will be stored
      const data = [];

      // This is to determine how many chart bars there should be
      let maxNumberTrials = 0;

      // Iterate over all dates to find how many trials there are
      // for each date
      dateLabels.forEach(label => {
        const item = {
          name: label,
        };

        let counter = 1;

        quizResults.forEach(result => {
          if (formatDate(result.date) === label) {
            if (counter > maxNumberTrials) {
              maxNumberTrials = counter;
            }

            item[`Trial${counter}`] = result.value;
            counter++;
          }
        });

        data.push(item);
      });

      const bars = [];

      for (let i = 1; i <= maxNumberTrials; i++) {
        // To make colors of even-numbered bars different from odd-numbered
        let color = i % 2 === 0 ? '#82ca9d' : '#8884d8';

        // Add to an array for rendering
        bars.push(<Bar key={i} dataKey={`Trial${i}`} fill={color} />);
      }

      return [data, bars];
    }
  };

  const renderSelectableQuizzes = () => {
    const results = getItem(strings.RESULTS);

    if (results) {
      // List that contains duplicates
      const initialList = results.map(result => result.quiz);

      // After removing duplicates (ready for rendering)
      const finalList = new Set(initialList);

      return [...finalList].map(quiz => <option key={quiz}>{quiz}</option>);
    }
  };

  const TableHeaderRow = ({ rowCount }) => {

    return (
      <TableHead>
        <TableRow>

        {TableHeaderRowNameCell()}
        {TableHeaderRowTrialCells({rowCount})}
        </TableRow>
      </TableHead>
    )
  }

  const TableHeaderRowNameCell = () => {
    return (
      <TableCell>Date</TableCell>
    )
  }

  const TableHeaderRowTrialCells = ( {rowCount}) => {
    var rows = [];

    for (var i = 0; i < rowCount; i++) {
      rows.push(
      <TableCell>Trial {i+1}</TableCell>
      )
    }

    return rows;
  } 

  const TableRows = ({ data, rowCount }) => {
    return data.map((data) =>
      <TableRow>
        
        {TableBodyRowNameCell({data})}
        {TableBodyRowTrialCells({data, rowCount})}

      </TableRow>
    );
  }

  const TableBodyRowNameCell = ({data}) => {
return (
    <TableCell component="th" scope="row">{data.name}</TableCell>
)
  }

  const TableBodyRowTrialCells = ( {data, rowCount}) => {
    
    console.log(data);
    var rows = [];

    for (var i = 0; i < rowCount; i++) {
      rows.push(
      <TableCell>{data["Trial" + (i+1)] ?? "N/A"}</TableCell>
      )
    }

    return rows;
  }

  const TableFunction = ({ data }) => {
    var rowCount = calcLongestRow({ data });
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHeaderRow rowCount={rowCount} />
          <caption>{selectedQuiz} results</caption>
          <TableBody>
            <TableRows data={data} rowCount={rowCount} />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  const calcLongestRow = ({ data }) => {
    var longest = 0;
    data.map((data) => {
      var size = 0,
        key;
      for (key in data) {
        if (data.hasOwnProperty(key)) size++;
      }

      if (size > longest) {
        longest = size;
      }
    }
    )
    return (longest - 1); //-1 to account for name
  };



  const renderBarChart = () => {
    const [data, bars] = getQuizData();

    return (
      <React.Fragment>
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={500}>
            
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {bars}
          </BarChart>
        </ResponsiveContainer>
          </div>
        <TableFunction data={data}></TableFunction>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Container fixed disableGutters className="text-center">
        <Typography variant="h4" align="center">
          Welcome to your dashboard
        </Typography>
        <Typography
          variant="body1"
          align="center"
          className={classes.instructions}
        >
          Please select a quiz to see your trials for that quiz
        </Typography>
        <NativeSelect
          defaultValue="Choose a quiz"
          value={selectedQuiz}
          onChange={handleChoosingQuiz}
          className={classes.quizSelect}
        >
          <option disabled>Choose a quiz</option>
          {renderSelectableQuizzes()}
        </NativeSelect>

        {selectedQuiz && (
          <>
            <div className={classes.chartContainer}>
              <Typography id="selectedQuiz" variant="h5" align="center">
                {selectedQuiz}
              </Typography>
              {renderBarChart()}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
