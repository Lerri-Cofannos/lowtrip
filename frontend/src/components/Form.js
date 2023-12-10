import axios from "axios";
import { useState } from "react";
import { Autocomplete, Button, Card, Grid, TextField } from "@mui/material";
import { useStationData } from "../hooks";

export function Form({
  setResponse,
  departure,
  setDeparture,
  arrival,
  setArrival,
}) {
  const [departureInput, setDepartureInput] = useState("");
  const [arrivalInput, setArrivalInput] = useState("");
  const { stationsData: departureStations } = useStationData(departureInput);
  const { stationsData: arrivalStations } = useStationData(arrivalInput);

  if (!departureStations || !arrivalStations) return null;

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("departure_coord", departure);
    formData.append("arrival_coord", arrival);
    axios
      .post("http://localhost:8000", formData, {
        headers: { "Access-Contol-Allow-Origin": "*" },
      })
      .then((response) => {
        console.log("SUCCESS", response);
        setResponse(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card
      sx={{
        position: "fixed",
        right: 10,
        top: 10,
        zIndex: 1,
        padding: 2,
        maxWidth: "30%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Autocomplete
            disablePortal
            options={departureStations}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Departure" />
            )}
            onChange={(_, value) => {
              if (value) setDeparture(`${value.latitude}, ${value.longitude}`);
            }}
            filterOptions={(options) =>
              options.filter((option) =>
                option.name.toLowerCase().includes(departureInput.toLowerCase())
              )
            }
            inputValue={departureInput}
            onInputChange={(_, inputValue) => setDepartureInput(inputValue)}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            disablePortal
            options={arrivalStations}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Arrival" />}
            onChange={(_, value) => {
              if (value) setArrival(`${value.latitude}, ${value.longitude}`);
            }}
            filterOptions={(options) =>
              options.filter((option) =>
                option.name.toLowerCase().includes(arrivalInput.toLowerCase())
              )
            }
            inputValue={arrivalInput}
            onInputChange={(_, inputValue) => setArrivalInput(inputValue)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={departure}
            onChange={(_, value) => setDeparture(value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={arrival}
            onChange={(_, value) => setArrival(value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth type="submit" onClick={handleSubmit}>
            Emissions computation
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
