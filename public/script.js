// TODO: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html

//const BASE_URL = 'https://json-server-ojuzebdv--3000.local.webcontainer.io';
const BASE_URL = 'http://localhost:3000';

// Theme management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const THEME_KEY = 'preferred-theme';

// Theme preference detection
function getSystemPreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem(THEME_KEY, theme);
  
  // Log preferences for debugging
  console.log({
    'User Pref': getStoredTheme() || 'unknown',
    'Browser Pref': window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    'OS Pref': getSystemPreference()
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// Initialize theme
function initTheme() {
  // Check for saved user preference, then browser preference, then system preference
  const savedTheme = getStoredTheme();
  const systemTheme = getSystemPreference();
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia) {
    setTheme(systemTheme);
  } else {
    setTheme('light'); // Default fallback
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  themeToggle.addEventListener('click', toggleTheme);
});

// Watch for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!getStoredTheme()) { // Only change if user hasn't set a preference
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// Logic for course selector
document.addEventListener('DOMContentLoaded', async () => {
  const selector = document.getElementById('course');

  const data = await fetchCourses();
  data.forEach((course) => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = course.display;
    selector.appendChild(option);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('course');
  const inputBox = document.getElementById('uvuId');
  const status = document.getElementById('uvuIdDisplay');
  const textArea = document.querySelector('[data-cy="log_textarea"]');

  // Initial check before adding the change listener
  if (selector.value) {
    inputBox.style.display = 'block';
  } else {
    inputBox.style.display = 'none';
  }

  // Adding listener to hide or unhide depending on selection
  selector.addEventListener('change', async () => {
    if (selector.value) {
      inputBox.style.display = 'block';
      if (inputBox.value.length === 8) {
        const courseId = selector.value;
        const uvuId = inputBox.value;
        try {
          const response = await fetchLogs(courseId, uvuId);
          if (response.length > 0) {
            status.textContent = `Student Logs for ${uvuId}:`;
            listLogOutput(response);
          } else {
            status.textContent = 'No Logs Found!';
            clearLogs();
          }
          console.log(response);
        } catch {
          status.textContent = 'Error!';
          clearLogs();
        }
      }
    } else {
      inputBox.style.display = 'none';
    }
  });

  // fires whenever user types, deletes, pastes, etc.
  textArea.addEventListener('input', (e) => {
    isButtonDisabled();
  });
});

function isButtonDisabled() {
  const addLogButton = document.querySelector('[data-cy="add_log_btn"]');
  const logs = document.querySelector('ul[data-cy="logs"]');
  const textArea = document.querySelector('[data-cy="log_textarea"]');
  const uvuInput = document.getElementById('uvuId');

  const text = textArea.value.trim().length > 0;
  const hasLogs = logs.querySelectorAll('li').length > 0;
  const isValidUvuId = uvuInput.value.length === 8;

  if (text && hasLogs && isValidUvuId) {
    addLogButton.disabled = false;
  } else {
    addLogButton.disabled = true;
  }
}

// logic for UVU ID input box
document.addEventListener('DOMContentLoaded', () => {
  const uvuInput = document.getElementById('uvuId');
  const courseSelector = document.getElementById('course');
  const status = document.getElementById('uvuIdDisplay');

  uvuInput.addEventListener('input', async () => {
    // Remove all non-digits and trim to 8 chars
    uvuInput.value = uvuInput.value.replace(/\D/g, '').slice(0, 8);
    if (uvuInput.value.length === 8) {
      const courseId = courseSelector.value;
      const uvuId = uvuInput.value;
      try {
        const response = await fetchLogs(courseId, uvuId);
        if (response.length > 0) {
          status.textContent = `Student Logs for ${uvuId}`;
          listLogOutput(response);
        } else {
          status.textContent = 'No Logs Found!';
          clearLogs();
        }
      } catch {
        status.textContent = 'Error!';
        clearLogs();
      }
    } else {
      clearLogs();
    }
  });
});

function listLogOutput(logs) {
  const ul = document.querySelector('ul[data-cy="logs"]');
  const logArea = document.querySelector('.log-area');

  ul.innerHTML = ''; // clear out any placeholder <li>
  if (logs.length > 0) {
    logArea.style.display = 'flex';
  } else {
    logArea.style.display = 'none';
  }

  logs.forEach((log) => {
    const li = document.createElement('li');

    // date
    const dateDiv = document.createElement('div');
    const date = document.createElement('h4');
    date.textContent = log.date;
    dateDiv.appendChild(date);
    li.appendChild(dateDiv);

    // log text
    const p = document.createElement('p');
    p.textContent = log.text;
    li.appendChild(p);

    // toggle log text on click
    li.addEventListener('click', () => {
      p.classList.toggle('hidden');
    });

    ul.appendChild(li);
  });
  isButtonDisabled();
}

function clearLogs() {
  const ul = document.querySelector('ul[data-cy="logs"]');
  const logArea = document.querySelector('.log-area');
  const status = document.getElementById('uvuIdDisplay');

  status.textContent = '';
  ul.innerHTML = '';
  logArea.style.display = 'none';
  isButtonDisabled();
}

async function fetchLogs(courseId, uvuId) {
  try {
    const res = await fetch(
      `${BASE_URL}/logs?courseId=${courseId}&uvuId=${uvuId}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );

    if (res.status === 200 || res.status === 304) {
      const data = await res.json();
      return data;
    } else {
      throw new Error('An error occurred');
    }
  } catch (err) {
    throw err;
  }
}

async function fetchCourses() {
  const courseUrl = `${BASE_URL}/api/v1/courses`;

  try {
    const res = await fetch(courseUrl);
    if (!res.ok) {
      console.error('Failed to fetch courses:', res.status);
      return;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Network error:', err);
  }
}

// Create/replace a log using PUT /logs/:id
async function addLog() {
  const text = document.querySelector('[data-cy="log_textarea"]').value;
  const courseId = document.getElementById('course').value;
  const uvuId = document.getElementById('uvuId').value;
  console.log(crypto.randomUUID());
  const id = crypto.randomUUID();
  const body = {
    id,
    courseId,
    uvuId,
    date: new Date().toLocaleString('en-US'),
    text,
  };

  const res = await fetch(`${BASE_URL}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok && res.status !== 304) {
    throw new Error(`POST failed: ${res.status}`);
  } else {
    const logs = await fetchLogs(courseId, uvuId);
    listLogOutput(logs);
  }
  console.log('it worked!');
}
