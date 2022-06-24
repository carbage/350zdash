import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ThermostatIcon from "@mui/icons-material/Thermostat";

import { CircularProgress, LinearProgress } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="h4" color="text.primary" align="right">{props.text}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

function CircularProgressWithContent(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {props.content}
      </Box>
    </Box>
  );
}

function App() {
  const redline = 6800;

  const [data, setData] = useState({
    rpm: 7000,
    speed: 50,
    fuel: 75,
    temp: 80,
    dtc: ["na"],
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);
      try {
        if ((json.event = "data")) {
          setData(json);
        }
      } catch (err) {
        console.log(err);
      }
    };

    return () => {
      //ws.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <Grid container spacing={2} sx={{ p: 10 }} alignItems="center" justify="center">
        <Grid item xs={2}>
          <CircularProgressWithContent
            content={<ThermostatIcon fontSize="large" />}
            variant="determinate"
            size={"10rem"}
            value={(100 / 280) * data.temp}
            style={{
              color:
                data.temp > 180 ? (data.temp > 200 ? "red" : "green") : "blue",
            }}
          />

          <CircularProgressWithContent
            content={<LocalGasStationIcon fontSize="large" />}
            variant="determinate"
            size={"10rem"}
            value={data.fuel}
            style={{ color: data.fuel < 10 ? "red" : "green" }}
          />
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              color:
                data.rpm > 6000
                  ? data.rpm > 7000
                    ? "red"
                    : "green"
                  : "orange",
            }}
          >
            <LinearProgressWithLabel
              variant="determinate"
              height={"50px"}
              value={(100 / 8000) * data.rpm}
              color="inherit"
              style={{ height: "50px", }}
              text={data.rpm + " RPM"}
            />
          </Box>
            <Typography variant="h1" align="center">
              {data.speed} MPH
            </Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
