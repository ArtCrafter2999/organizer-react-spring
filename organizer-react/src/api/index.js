const { localStorage } = window;
const apiBaseUrl = 'http://localhost:8080/api';

// Method to sign up a new user
export const signUpUser = (user) =>
    fetch(`${apiBaseUrl}/signUpUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помилка реєстрації: ${t}`);
            });
        } else {
            return response.text().then(token => {
                localStorage.setItem('token', token);// Store the token in localStorage
            });
        }
    });


// Method to sign in a user
export const signInUser = (user) =>
    fetch(`${apiBaseUrl}/signInUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помилка входу: ${t}`);
            });
        } else {
            return response.text().then(token => {
                localStorage.setItem('token', token); // Store the token in localStorage
            });
        }
    });

export const checkAuthorization = () => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/checkAuthorization`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
    })
};

export const getAllEvents = () => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/getAllEvents`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помилка в отриманні подій: ${t}`);
            });
        } else {
            return response.json();
        }
    });
};

// Method to add a new event
export const saveEvent = (event) => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/saveEvent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(event),
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помика при збереженні події: ${t}`);
            });
        } else {
            return response.json();
        }
    });
};

export const removeEvent = (event) => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/removeEvent/${event.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        }
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помика при видалені події: ${t}`);
            });
        } else {
            return response.text();
        }
    });
};

export const getAllTasks = () => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/getAllTasks`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помилка в отриманні евентів: ${t}`);
            });
        } else {
            return response.json();
        }
    });
};

// Method to add a new task
export const saveTask = (task) => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/saveTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(task),
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помика при збереженні задачі: ${t}`);
            });
        } else {
            return response.json();
        }
    });
};

export const saveTasks = (tasks) => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/saveTasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({tasks}),
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помика при збереженні задач: ${t}`);
            });
        } else {
            return response.text();
        }
    });
};

export const removeTask = (task) => {
    const token = localStorage.getItem('token');
    return fetch(`${apiBaseUrl}/removeTask/${task.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        }
    }).then(response => {
        if (!response.ok) {
            return response.text().then(t => {
                throw new Error(`Помика при видалені події: ${t}`);
            });
        } else {
            return response.text();
        }
    });
};