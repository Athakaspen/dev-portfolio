import React, { useState, useEffect, useContext } from 'react';
import Typewriter from 'typewriter-effect';
import { Button } from 'react-bootstrap';
import { ThemeContext } from 'styled-components';
import Fade from 'react-reveal';
import PropTypes from 'prop-types';
import enEndpoints from '../constants/endpoints';
import jpEndpoints from '../constants/jpEndpoints';
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

function Home(props) {
  const { lang } = props;
  const [data, setData] = useState(null);

  let endpoints = enEndpoints;
  const updateLang = () => {
    if (lang === 'ja') {
      endpoints = jpEndpoints;
    } else {
      endpoints = enEndpoints;
    }
  };

  useEffect(() => {
    updateLang();
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
          {(lang === 'en')
            ? <h2 style={styles.inlineChild}>I&apos;m&nbsp;</h2>
            : <h2 style={styles.inlineChild}>世界最強</h2>}
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
          {data?.see_projects}
        </Button>
        <Social />
      </div>
    </Fade>
  ) : <FallbackSpinner />;
}

Home.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Home;
