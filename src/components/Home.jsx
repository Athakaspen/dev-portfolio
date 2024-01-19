import React, { useState, useEffect, useContext } from 'react';
import Typewriter from 'typewriter-effect';
import { Button } from 'react-bootstrap';
import { ThemeContext } from 'styled-components';
import Fade from 'react-reveal';
import endpoints from '../constants/endpoints';
import Social from './Social';
import FallbackSpinner from './FallbackSpinner';

const styles = {
  nameStyle: {
    fontSize: '4.4em',
  },
  inlineChild: {
    display: 'inline-block',
  },
  mainContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeWorkStyle: {
    margin: 22,
    padding: 12,
    fontSize: '1.2em',
  },
};

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.home, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const theme = useContext(ThemeContext);

  return data ? (
    <Fade>
      <div style={styles.mainContainer}>
        <img src={data?.image} className="App-logo" alt="logo" />
        <h1 style={styles.nameStyle}>{data?.name}</h1>
        <div style={{ flexDirection: 'row' }}>
          <h2 style={styles.inlineChild}>I&apos;m&nbsp;</h2>
          <Typewriter
            options={{
              loop: true,
              autoStart: true,
              strings: data?.roles,
            }}
          />
        </div>
        <Button
          style={styles.seeWorkStyle}
          variant={theme.bsSecondaryVariant}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/projects';
          }}
        >
          See My Work
        </Button>
        <Social />
      </div>
    </Fade>
  ) : <FallbackSpinner />;
}

export default Home;
