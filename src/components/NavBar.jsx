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

  const change = () => {
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
      bg="dark"
      variant="dark"
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
          <ThemeToggler
            onClick={() => setExpanded(false)}
          />
          <Button
            onClick={() => change()}
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
