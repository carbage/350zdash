import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ThermostatIcon from "@mui/icons-material/Thermostat";

import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

function App() {
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
      <Grid container spacing={3} alignItems="center" justify="center">
        <Grid item xs={12}>
          Dashboard
        </Grid>

        <Grid item xs={2}>
          <Typography variant="h1" component="h1" align="right">
            {data.rpm} RPM
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="h1" component="h1" align="right">
            {data.speed} MPH
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h4" component="h1" align="right">
            DTC
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <ThermostatIcon />
            <Grid xs item>
              <BorderLinearProgress variant="determinate" value={data.temp} />
            </Grid>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <LocalGasStationIcon />
            <Grid xs item>
              <BorderLinearProgress variant="determinate" value={data.fuel} />
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
