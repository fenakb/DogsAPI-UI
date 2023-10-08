import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Grid, Paper, styled } from '@mui/material';
import axios from 'axios';
import Box from '@mui/material/Box';
import LoopIcon from '@mui/icons-material/Loop';
import { useEffect, useState } from 'react';

interface DogObj {
  breed: string,
  url: string,
}

export default function App() {
  const [dogs, setDogs] = useState<DogObj[]>([{ breed: 'boxer', url: '' }, { breed: 'dachshund', url: '' }, { breed: 'labrador', url: '' }, { breed: 'whippet', url: '' }]);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);

  const fetchDogs = ()=>{
    dogs.map((dog: DogObj, i, {length}) => {
      axios.get(`https://dog.ceo/api/breed/${dog.breed}/images/random`)
        .then(response => setDogs((prev: DogObj[]) => {
          const url = response.data.message;
          let newState: DogObj[] = prev;
          newState.map(obj => {
            if (obj.breed === dog.breed) {
              obj.url = url
            }
          });
          if(i === length - 1){
            setTimeout(()=>{
              setIsDataFetched(true)
            }, 1000) 
          }
          return newState;
        })
        );
        
    })
  }
  useEffect(() => {
    fetchDogs();
  }, [])
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Here are some dogs why not
        </Typography>
        { isDataFetched ? <Grid container spacing={2} onClick={()=>{
          setIsDataFetched(false);
          fetchDogs();
        }}
        sx={{
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: '5px',
          justifyContent: 'center',
        }}>
          {dogs.map((dog: DogObj, i) => {
            return (<Grid key={i} sx={{padding: '2px', height: '300px', width: '80%'}}>
              <img
                style={{height:'100%',
                width:'auto',}}
                src={dog.url}
                alt={dog.breed}
                loading="lazy"
                //height={'250px'}
              />
            </Grid>)
          }
          )}
        </Grid> : <LoopIcon fontSize='large' sx={{
          animation: 'lds-roller 1.1s infinite ease',
        }}/>}
      </Box>
    </Container>
  );
}
