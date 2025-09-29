// const BASE_URL = 'https://json-server-ojuzebdv--3000.local.webcontainer.io'; // for stackblitz
const BASE_URL = 'http://localhost:3000'; // for local use
const THEME_KEY = 'preferred-theme';

function getSystemPreference() {
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light';
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function setTheme(theme, themeIconEl) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeIconEl) {
    themeIconEl.textContent = theme === 'dark' ? '☀️' : '🌙';

  }
  localStorage.setItem(THEME_KEY, theme);

  // Debug
  console.log({
    'User Pref': getStoredTheme() || 'unknown',
    'Browser Pref': window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    'OS Pref': getSystemPreference()
  });
}

// Fetch logs function
async function fetchLogs(courseId, uvuId) {
  try {
    const response = await axios.get(`${BASE_URL}/logs`, {
      params: { courseId, uvuId },
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error('An error occurred while fetching logs');
  }
}

// Fetch courses function
async function fetchCourses() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/courses`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

// List log output function
function listLogOutput(logs) {
  const ul = document.querySelector('ul[data-cy="logs"]');
  const logArea = document.querySelector('.log-area');

  ul.innerHTML = '';
  logArea.style.display = logs.length > 0 ? 'flex' : 'none';

  logs.forEach((log) => {
    const li = document.createElement('li');

    const dateDiv = document.createElement('div');
    const date = document.createElement('h4');
    date.textContent = log.date;
    dateDiv.appendChild(date);
    li.appendChild(dateDiv);

    const p = document.createElement('p');
    p.textContent = log.text;
    li.appendChild(p);

    li.addEventListener('click', () => {
      p.classList.toggle('hidden');
    });

    ul.appendChild(li);
  });

  isButtonDisabled();
}

// Clear logs function
function clearLogs() {
  const ul = document.querySelector('ul[data-cy="logs"]');
  const logArea = document.querySelector('.log-area');
  const status = document.getElementById('uvuIdDisplay');

  status.textContent = '';
  ul.innerHTML = '';
  logArea.style.display = 'none';
  isButtonDisabled();
}

// Button disabled function
function isButtonDisabled() {
  const addLogButton = document.querySelector('[data-cy="add_log_btn"]');
  const logs = document.querySelector('ul[data-cy="logs"]');
  const textArea = document.querySelector('[data-cy="log_textarea"]');
  const uvuInput = document.getElementById('uvuId');

  const hasText = textArea.value.trim().length > 0;
  const hasLogs = logs.querySelectorAll('li').length > 0;
  const validUvu = uvuInput.value.length === 8;

  addLogButton.disabled = !(hasText && validUvu);
}

// Theme initialization function
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');

  // Set initial theme
  const savedPref = getStoredTheme();
  const systemPref = getSystemPreference();
  // Set theme based on saved preference or system preference or default to light
  setTheme(savedPref || systemPref || 'light', themeIcon);

  // Theme toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark', themeIcon);
    });
  }

  // React to system changes only if user hasn't chosen
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light', themeIcon);
      }
    });
  }
}

// Course options initialization function
async function initCourseOptions() {
  const selector = document.getElementById('course');
  if (!selector) return;

  const courses = await fetchCourses();
  courses.forEach((course) => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = course.display;
    selector.appendChild(option);
  });
}

// Course UI initialization function
function initCourseUI() {
  const selector = document.getElementById('course');
  const inputBox = document.getElementById('uvuId');
  const status = document.getElementById('uvuIdDisplay');
  const textArea = document.querySelector('[data-cy="log_textarea"]');

  if (!selector || !inputBox || !status || !textArea) return;

  // Initial visibility
  inputBox.style.display = selector.value ? 'block' : 'none';

  selector.addEventListener('change', async () => {
    if (!selector.value) {
      inputBox.style.display = 'none';
      clearLogs();
      return;
    }

    inputBox.style.display = 'block';

    // If UVU ID already complete, try fetching immediately
    if (inputBox.value.length === 8) {
      try {
        const response = await fetchLogs(selector.value, inputBox.value);
        if (response.length > 0) {
          status.textContent = `Student Logs for ${inputBox.value}:`;
          listLogOutput(response);
        } else {
          status.textContent = 'No Logs Found!';
          clearLogs();
        }
      } catch {
        status.textContent = 'Error!';
        clearLogs();
      }
    }
  });

  // Enable/disable add button based on textarea edits
  textArea.addEventListener('input', isButtonDisabled);
}

// UVU ID initialize function
function initUvuInput() {
  const uvuInput = document.getElementById('uvuId');
  const courseSelector = document.getElementById('course');
  const status = document.getElementById('uvuIdDisplay');

  if (!uvuInput || !courseSelector || !status) return;

  uvuInput.addEventListener('input', async () => {
    // digits only, 8 chars
    uvuInput.value = uvuInput.value.replace(/\D/g, '').slice(0, 8);

    if (uvuInput.value.length !== 8) {
      clearLogs();
      return;
    }

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
  });
}

// Add log function
async function addLog() {
  const text = document.querySelector('[data-cy="log_textarea"]').value;
  const courseId = document.getElementById('course').value;
  const uvuId = document.getElementById('uvuId').value;

  const id = crypto.randomUUID();
  const data = {
    id,
    courseId,
    uvuId,
    date: new Date().toLocaleString('en-US'),
    text,
  };

  try {
    await axios.post(`${BASE_URL}/logs`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const logs = await fetchLogs(courseId, uvuId);
    listLogOutput(logs);
    console.log('Log added successfully!');
  } catch (error) {
    console.error('Error adding log:', error);
    throw new Error(`Failed to add log: ${error.message}`);
  }
}

// Main listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await initCourseOptions();   // populate dropdown first
  initCourseUI();              // wire course selector + textarea rules
  initUvuInput();              // wire UVU input behavior
  isButtonDisabled();          // set initial button state
});