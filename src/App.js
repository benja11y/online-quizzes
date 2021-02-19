import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Header from './components/Header';
import Quiz from './components/layout/Quiz';
import Dashboard from './components/layout/Dashboard';

const App = () => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#1b75bc',
      },
      secondary: {
        main: '#43a047',
      },
      background: {
        default: '#f7f7f7',
      },
    },
  });

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Container maxWidth="md">
            <Switch>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/">
                <Quiz />
              </Route>
            </Switch>
          </Container>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
