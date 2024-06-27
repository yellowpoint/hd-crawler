import React from 'react';

import { useSetState } from 'ahooks';

export const ContextTaskCard = React.createContext();
export const useContextTaskCard = () => React.useContext(ContextTaskCard);

export const ContextPage = React.createContext();
export const useContextPage = () => React.useContext(ContextPage);

export const ContextPageProvider = ({ children }) => {
  const [pageData, setPageData] = useSetState({});

  return (
    <ContextPage.Provider value={{ pageData, setPageData }}>
      {children}
    </ContextPage.Provider>
  );
};
