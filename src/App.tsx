import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Grid, Box, Menu, MenuItem, List, ListItem, ListItemText, ThemeProvider, CssBaseline, Paper } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import { useEffect, useState } from 'react';
import theme from './theme';
import { fetchBreed, fetchBreeds, fetchRandomDogs, useRandomDogs } from './utils';

export interface DogObj {
  breed: string,
  url: string,
}
export default function App() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dogs, setDogs] = useState<DogObj[]>([]);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [options, setOptions] = useState<any>();

  function setRandom(breeds: string[]) {
    fetchRandomDogs(useRandomDogs(breeds, 9)).then((res) => {
      setDogs(() => {
        setTimeout(() => {
          setIsDataFetched(true)
        }, 1000)
        return res
      });
    })
  }

  useEffect(() => {
    fetchBreeds().then(res => {
      setOptions(res);
      setRandom(Object.keys(res));
    })
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container >
        <Box sx={{ my: 4, textAlign: 'center', padding: '2rem' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Here are some dogs why not
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'row', padding: '2rem', alignItems: 'center' }}>
            <List
              component="nav"
              aria-label="Device settings"
              sx={{ bgcolor: 'background.paper' }}
            >
              <ListItem
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setOpenDropdown(true);
                  setAnchorEl(e.currentTarget);
                }}
              >
                <ListItemText
                  primary="Pick a breed"
                />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={openDropdown}
              onClose={() => { setOpenDropdown(false) }}
              MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
              }}
            >
              {options ? Object.entries(options).map((option: [string, any], i: number) => {
                if (option[1].length === 0) {
                  return (<MenuItem
                    key={option[0] + i}
                    disabled={i === 0}
                    onClick={() => {
                      fetchBreed(option[0]).then((res) => {
                        setDogs(() => {
                          setIsDataFetched(false);
                          setTimeout(() => {
                            setIsDataFetched(true)
                          }, 1000)
                          setOpenDropdown(false)
                          return res;
                        })
                      }
                      )
                    }}>
                    {option}
                  </MenuItem>)
                }
              }) : null}
            </Menu>
            <button onClick={() => {
              setIsDataFetched(false);
              if (options) setRandom(Object.keys(options));
            }}>Random</button>
          </div>
        </Box>
      </Container>
      <Container sx={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
      }}>

        {isDataFetched ? <Grid container spacing={{ xs: 2, md: 3 }} 
        onClick={() => {
          setIsDataFetched(false);
          fetchRandomDogs(dogs).then((res) => {
            setDogs(() => {
              setTimeout(() => {
                setIsDataFetched(true)
              }, 1000)
              return res
            });
          })
        }}
        >
          {dogs.map((dog: DogObj, i: number) => {
            return (<Grid item xs={2} sm={4} md={4} key={i} sx={{
              width: '250px', height: '300px',
            }}>
              <Paper sx={{
                height: '100%',
                width: '100%',
                backgroundImage: `url(${dog.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }} />
            </Grid>)
          }
          )}
        </Grid> : <LoopIcon fontSize='large' sx={{
          animation: 'lds-roller 1.1s infinite ease',
        }} />}
      </Container>
    </ThemeProvider>
  );
}
