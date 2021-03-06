import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Cuisine = () => {
  const { type } = useParams();
  const [cuisine, setCuisine] = useState([]);

  const getCuisine = async (name) => {
    const check = localStorage.getItem(`cuisine-${name}`);

    if (check) {
      setCuisine(JSON.parse(check));
      return;
    }
    const data = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.REACT_APP_APIKEY}&cuisine=${name}`
    );
    const recipes = await data.json();
    setCuisine(recipes.results);
    localStorage.setItem(`cuisine-${name}`, JSON.stringify(recipes.results));
  };

  useEffect(() => {
    getCuisine(type);
  }, [type]);

  if (cuisine.length === 0) {
    return <div>Loading {type} dishes...</div>;
  }

  return (
    <>
      <h1 className="header">{type}</h1>
      <Grid
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {cuisine.map((item) => {
          return (
            <Card key={item.id}>
              <Link to={`/recipe/${item.id}`}>
                <img src={item.image} alt={item.name} />
                <h4>{item.title}</h4>
              </Link>
            </Card>
          );
        })}
      </Grid>
    </>
  );
};

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 3rem;
`;

const Card = styled.div`
  img {
    width: 100%;
    border-radius: 2rem;
  }

  a {
    text-decoration: none;
  }

  h4 {
    text-align: center;
    padding: 1rem;
  }
`;
export default Cuisine;
