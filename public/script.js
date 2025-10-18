const THEME_KEY = 'preferred-theme';

function getSystemPreference() {
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function setTheme(theme, $themeIcon) {
  $('html').attr('data-theme', theme);

  const isDark = theme === 'dark';
  const $body = $('body');
  const $form = $('#formCard'); // make sure your form wrapper has id="formCard"

  // Body/Form via Bootstrap utilities
  $body.toggleClass('bg-dark', isDark).toggleClass('bg-white', !isDark);

  $form
    .toggleClass('bg-dark text-white', isDark)
    .toggleClass('bg-white text-dark', !isDark);

  if ($themeIcon && $themeIcon.length) {
    $themeIcon.text(isDark ? '☀️' : '🌙');
  }
  localStorage.setItem(THEME_KEY, theme);

  // Debug
  console.log({
    'User Pref': getStoredTheme() || 'unknown',
    'Browser Pref': window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    'OS Pref': getSystemPreference(),
  });
}

async function fetchLogs(courseId, uvuId) {
  try {
    const data = await $.ajax({
      url: `/logs`,
      method: 'GET',
      data: { courseId, uvuId },
      cache: false, // similar intent to your no-cache header
    });
    return data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error('An error occurred while fetching logs');
  }
}

async function fetchCourses() {
  try {
    const data = await $.ajax({
      url: `/api/v1/courses`,
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

function listLogOutput(logs) {
  const $ul = $('#logs');
  const $wrapper = $('#logsWrapper');

  $ul.empty();

  if (logs && logs.length > 0) {
    $wrapper.removeClass('d-none');

    logs.forEach((log) => {
      const $li = $('<li>', { class: 'list-group-item' });

      // date header
      $('<h6>', { class: 'mb-1', text: log.date }).appendTo($li);

      // body text
      const $p = $('<p>', { class: 'mb-0 small', text: log.text }).appendTo(
        $li
      );

      // click to toggle the text only
      $li.on('click', () => {
        $p.toggleClass('d-none');
      });

      $ul.append($li);
    });
  } else {
    $wrapper.addClass('d-none');
  }

  isButtonDisabled();
}

function clearLogs() {
  const $ul = $('#logs');
  const $wrapper = $('#logsWrapper');
  const $status = $('#uvuIdDisplay');

  $status.text('');
  $ul.empty();
  $wrapper.addClass('d-none');

  isButtonDisabled();
}

function isButtonDisabled() {
  const $addLogButton = $('[data-cy="add_log_btn"]');
  const $textArea = $('[data-cy="log_textarea"]');
  const $uvuInput = $('#uvuId');

  if (!$addLogButton.length || !$textArea.length || !$uvuInput.length) return;

  const hasText = ($textArea.val() || '').trim().length > 0;
  const validUvu = ($uvuInput.val() || '').length === 8;

  // enable only when there's text AND UVU is valid
  $addLogButton.prop('disabled', !(hasText && validUvu));
}

function initTheme() {
  const $themeToggle = $('#themeToggle');
  const $themeIcon = $('.theme-icon');

  // Set initial theme (stored > system > light)
  const savedPref = getStoredTheme();
  const systemPref = getSystemPreference();
  setTheme(savedPref || systemPref || 'light', $themeIcon);

  $themeToggle.on('click', () => {
    const current = $('html').attr('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark', $themeIcon);
  });

  // React to system changes only if user hasn't chosen
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light', $themeIcon);
      }
    });
  }
}

async function initCourseOptions() {
  const $selector = $('#course');
  if (!$selector.length) return;

  const courses = await fetchCourses();
  courses.forEach((course) => {
    $('<option>', { value: course.id, text: course.display }).appendTo(
      $selector
    );
  });
}

function initCourseUI() {
  const $selector = $('#course');
  const $inputBox = $('#uvuId');
  const $status = $('#uvuIdDisplay');
  const $textArea = $('[data-cy="log_textarea"]');

  if (
    !$selector.length ||
    !$inputBox.length ||
    !$status.length ||
    !$textArea.length
  )
    return;

  // Initial visibility
  $inputBox.toggle(!!$selector.val());

  $selector.on('change', async () => {
    if (!$selector.val()) {
      $inputBox.hide();
      clearLogs();
      return;
    }

    $inputBox.show();

    // If UVU ID already complete, try fetching immediately
    if (($inputBox.val() || '').length === 8) {
      try {
        const response = await fetchLogs($selector.val(), $inputBox.val());
        if (response.length > 0) {
          $status.text(`Student Logs for ${$inputBox.val()}:`);
          listLogOutput(response);
        } else {
          $status.text('No Logs Found!');
          clearLogs();
        }
      } catch {
        $status.text('Error!');
        clearLogs();
      }
    }
  });

  // Enable/disable add button based on textarea edits
  $textArea.on('input', isButtonDisabled);
}

function initUvuInput() {
  const $uvuInput = $('#uvuId');
  const $courseSelector = $('#course');
  const $status = $('#uvuIdDisplay');

  if (!$uvuInput.length || !$courseSelector.length || !$status.length) return;

  $uvuInput.on('input', async () => {
    // digits only, 8 chars
    $uvuInput.val(($uvuInput.val() || '').replace(/\D/g, '').slice(0, 8));

    if (($uvuInput.val() || '').length !== 8) {
      clearLogs();
      return;
    }

    const courseId = $courseSelector.val();
    const uvuId = $uvuInput.val();
    try {
      const response = await fetchLogs(courseId, uvuId);
      if (response.length > 0) {
        $status.text(`Student Logs for ${uvuId}`);
        listLogOutput(response);
      } else {
        $status.text('No Logs Found!');
        clearLogs();
      }
    } catch {
      $status.text('Error!');
      clearLogs();
    }
  });
}

async function addLog() {
  const $textArea = $('[data-cy="log_textarea"]');
  const $course = $('#course');
  const $uvu = $('#uvuId');

  const text = $textArea.val();
  const courseId = $course.val();
  const uvuId = $uvu.val();

  const id = crypto.randomUUID();
  const data = {
    id,
    courseId,
    uvuId,
    date: new Date().toLocaleString('en-US'),
    text,
  };

  try {
    await $.ajax({
      url: `/logs`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
    });

    const logs = await fetchLogs(courseId, uvuId);
    listLogOutput(logs);
    console.log('Log added successfully!');
  } catch (error) {
    console.error('Error adding log:', error);
    throw new Error(`Failed to add log: ${error.message}`);
  }
}

$(async function () {
  initTheme();
  await initCourseOptions(); // populate dropdown first
  initCourseUI(); // wire course selector + textarea rules
  initUvuInput(); // wire UVU input behavior
  isButtonDisabled(); // set initial button state
});
