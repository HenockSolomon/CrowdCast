import React from'react';
import { useHistory } from 'react-router-dom';

export function handleLogout() {
  // Clear user information (e.g. authentication token)
  localStorage.removeItem('authToken');

  // Redirect to home page
  const history = useHistory();
  history.push('/');
}
