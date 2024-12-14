import React, { useState, useEffect, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import FallbackSpinner from './components/FallbackSpinner';
import NavBarWithRouter from './components/NavBar';
import Home from './components/Home';
import endpoints from './constants/endpoints';
// import Singleton from './components/Singleton';

function MainApp() {
  const [data, setData] = useState(null);
  const [lang, setLang] = useState('ja');

  const changeLang = (newLang) => {
    setLang(newLang);
  };

  useEffect(() => {
    fetch(endpoints.routes, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <div className="MainApp">
      <NavBarWithRouter lang={lang} changeLang={changeLang} />
      <main className="main">
        <Switch>
          <Suspense fallback={<FallbackSpinner />}>
            <Route exact path="/" component={() => (<Home lang={lang} />)} />
            {data
              && data.sections.map((route) => {
                const SectionComponent = React.lazy(() => import('./components/' + route.component));
                return (
                  <Route
                    key={route.headerTitle}
                    path={route.path}
                    component={() => (
                      <SectionComponent header={route.headerTitle} lang={lang} />
                    )}
                  />
                );
              })}
          </Suspense>
        </Switch>
      </main>
    </div>
  );
}

export default MainApp;
