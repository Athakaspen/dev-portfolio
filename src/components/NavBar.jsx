import {
  Navbar, Nav, Container, Button,
} from 'react-bootstrap';
import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
// import Singleton from './Singleton';
import PropTypes from 'prop-types';
import jpEndpoints from '../constants/jpEndpoints';
import ThemeToggler from './ThemeToggler';
import enEndpoints from '../constants/endpoints';

const styles = {
  logoStyle: {
    width: 50,
    height: 40,
  },
  changeLangStyle: {
    padding: '6px',
    display: 'inline-flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100px',
  },
};

const ExternalNavLink = styled.a`
  color: ${(props) => props.theme.navbarTheme.linkColor};
  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }
  &::after {
    background-color: ${(props) => props.theme.accentColor};
  }
`;

const InternalNavLink = styled(NavLink)`
  color: ${(props) => props.theme.navbarTheme.linkColor};
  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }
  &::after {
    background-color: ${(props) => props.theme.accentColor};
  }
  &.navbar__link--active {
    color: ${(props) => props.theme.navbarTheme.linkActiveColor};
  }
`;

const NavBar = (props) => {
  const { lang, changeLang } = props;
  const theme = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  let endpoints = jpEndpoints;

  const refreshData = () => {
    fetch(endpoints.navbar, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // const history = useHistory();

  const swapLangauge = () => {
    if (lang === 'ja') {
      changeLang('en');
      endpoints = enEndpoints;
      refreshData();
      // history.push('/home');
    } else {
      changeLang('ja');
      endpoints = jpEndpoints;
      refreshData();
      // history.push('/homejp');
    }
  };

  return (
    <Navbar
      fixed="top"
      expand="md"
      bg={theme.bsPrimaryVariant}
      variant={theme.bsPrimaryVariant}
      className="navbar-custom"
      expanded={expanded}
    >
      <Container>
        {data?.logo && (
          <Navbar.Brand href="/">
            <img
              src={data?.logo?.source}
              className="d-inline-block align-top"
              alt="main logo"
              style={
                data?.logo?.height && data?.logo?.width
                  ? { height: data?.logo?.height, width: data?.logo?.width }
                  : styles.logoStyle
              }
            />
          </Navbar.Brand>
        )}
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" />
          <Button
            onClick={swapLangauge}
            variant={theme.bsSecondaryVariant}
            style={styles.changeLangStyle}
          >
            <img
              src={(theme.bsPrimaryVariant === 'dark') ? data?.languageChange?.iconBlack : data?.languageChange?.iconWhite}
              className="d-inline-block align-top"
              alt="change langauge"
              style={
                data?.languageChange?.height && data?.languageChange?.width
                  ? { height: data?.languageChange?.height, width: data?.languageChange?.width, display: 'inline-block' }
                  : styles.logoStyle
              }
            />
            <div
              style={{
                display: 'table', paddingLeft: '6px', paddingRight: '6px', paddingBottom: '2px',
              }}
            >
              <h5 style={{ display: 'table-cell' }}>
                {data?.languageChange?.text}
              </h5>
            </div>
          </Button>
          <div style={{ width: '16px' }} />
          <Nav>
            {data
              && data.sections?.map((section, index) => (section?.type === 'link' ? (
                <ExternalNavLink
                  key={section.title}
                  href={section.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setExpanded(false)}
                  className="navbar__link"
                  theme={theme}
                >
                  {section.title}
                </ExternalNavLink>
              ) : (
                <InternalNavLink
                  key={section.title}
                  onClick={() => setExpanded(false)}
                  exact={index === 0}
                  activeClassName="navbar__link--active"
                  className="navbar__link"
                  to={section.href}
                  theme={theme}
                >
                  {section.title}
                </InternalNavLink>
              )))}
          </Nav>
          <div style={{ width: '20px' }} />
          <ThemeToggler
            onClick={() => setExpanded(false)}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

NavBar.propTypes = {
  lang: PropTypes.string.isRequired,
  changeLang: PropTypes.func.isRequired,
};

const NavBarWithRouter = withRouter(NavBar);
export default NavBarWithRouter;
