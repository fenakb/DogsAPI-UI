import axios from "axios";
import { DogObj } from "./App";

export const fetchBreeds = async () => {
    try {
      const response = await axios.get(`https://dog.ceo/api/breeds/list/all`);
      return response.data.message;
    } catch (error) {
      console.error("Error fetching breeds:", error);
      return null;
    }
  };

 export const fetchBreed = async (breed: string) => {
    let dogsObj: DogObj[] = [];
    for(let i = 0; i < 3; i++){
      axios.get(`https://dog.ceo/api/breed/${breed}/images/random`)
      .then(response => {
        const url = response.data.message
        dogsObj.push({breed: breed, url: url });
      });
    }
    return dogsObj;
  }

 export const fetchRandomDogs = async (dogs: DogObj[]) => {
    dogs.map((dog: DogObj) => {
      axios.get(`https://dog.ceo/api/breed/${dog.breed}/images/random`)
        .then(res => { dog.url = res.data.message} 
        );
    })
    return dogs;
  }

  export const useRandomDogs = (breeds: any, n: number): DogObj[] => {
    const randomDogs: DogObj[] = [];
    for(let i = 0; i < n; i++){
        const randomIndex = Math.floor(Math.random() * breeds.length);
        const breed =  Object.values(breeds)[randomIndex] as string;
        randomDogs.push({breed: breed, url: '' });
    }
    return randomDogs; 
  }