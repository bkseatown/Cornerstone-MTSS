(function () {
  const KEYS = {
    litQuickCheck: 'cs_lit_quickcheck_v1',
    mathQuickCheck: 'cs_math_quickcheck_v1',
    pmPrefix: 'cs_pm_v1::',
    pmActive: 'cs_pm_v1_active_student',
    sstPrefix: 'cs_sst_v1::',
    sstActive: 'cs_sst_v1_active',
    writingPrefix: 'cs_writing_v1::',
    writingActive: 'cs_writing_v1_active'
  };

  const nodes = {
    countLit: document.getElementById('admin-count-lit'),
    countMath: document.getElementById('admin-count-math'),
    countPm: document.getElementById('admin-count-pm'),
    countSst: document.getElementById('admin-count-sst'),
    weeklyBody: document.getElementById('admin-weekly-body'),
    rollupBody: document.getElementById('admin-rollup-body'),
    emptyNote: document.getElementById('admin-empty-note'),
    actionStatus: document.getElementById('admin-action-status'),
    exportCsvBtn: document.getElementById('admin-export-csv'),
    clearDataBtn: document.getElementById('admin-clear-data'),
    clearModal: document.getElementById('admin-clear-modal'),
    clearCancelBtn: document.getElementById('admin-clear-cancel'),
    clearConfirmBtn: document.getElementById('admin-clear-confirm')
  };

  if (!nodes.rollupBody || !nodes.weeklyBody) return;

  let latestRows = [];
  renderAll();
  bindEvents();

  function bindEvents() {
    nodes.exportCsvBtn?.addEventListener('click', () => {
      if (!latestRows.length) {
        setStatus('No local rows available yet. Add activity first.', true);
        return;
      }
      exportRollupCsv(latestRows);
      setStatus('Admin roll-up CSV downloaded.');
    });

    nodes.clearDataBtn?.addEventListener('click', () => {
      if (!nodes.clearModal) {
        if (window.confirm('Clear local MTSS data from this device?')) {
          clearLocalMtssData();
          renderAll();
          setStatus('Local MTSS data cleared on this device.');
        }
        return;
      }
      nodes.clearModal.hidden = false;
    });

    nodes.clearCancelBtn?.addEventListener('click', () => {
      if (nodes.clearModal) nodes.clearModal.hidden = true;
    });

    nodes.clearConfirmBtn?.addEventListener('click', () => {
      clearLocalMtssData();
      if (nodes.clearModal) nodes.clearModal.hidden = true;
      renderAll();
      setStatus('Local MTSS data cleared on this device.');
    });
  }

  function renderAll() {
    const dataset = aggregateLocalData();
    latestRows = dataset.rows;

    if (nodes.countLit) nodes.countLit.textContent = String(dataset.summary.litStudents);
    if (nodes.countMath) nodes.countMath.textContent = String(dataset.summary.mathStudents);
    if (nodes.countPm) nodes.countPm.textContent = String(dataset.summary.pmStudents);
    if (nodes.countSst) nodes.countSst.textContent = String(dataset.summary.sstStudents);

    renderWeeklyTable(dataset.weeklyCounts);
    renderStudentRollup(dataset.rows);
  }

  function aggregateLocalData() {
    const studentMap = new Map();
    const litStudentIds = new Set();
    const mathStudentIds = new Set();
    const pmStudentIds = new Set();
    const sstStudentIds = new Set();
    const events = [];

    function ensureStudentRow(id, fallbackName) {
      const key = String(id || '').trim() || `unknown-${studentMap.size + 1}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          id: key,
          student: String(fallbackName || '').trim(),
          gradeBand: '',
          latestLit: null,
          latestMath: null,
          latestPm: null,
          latestSst: null,
          notes: ''
        });
      }
      return studentMap.get(key);
    }

    function setLatest(row, field, date) {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) return;
      if (!row[field] || date > row[field]) row[field] = date;
    }

    const litPayload = safeParse(localStorage.getItem(KEYS.litQuickCheck) || '');
    if (litPayload && typeof litPayload === 'object') {
      const litDate = parseAnyDate(litPayload.date);
      const litName = extractStudentName(litPayload);
      const litGrade = extractGradeBand(litPayload);
      const litId = litName ? slugify(litName) : 'local-device';
      const row = ensureStudentRow(litId, litName || 'Current learner (local)');
      if (litGrade && !row.gradeBand) row.gradeBand = litGrade;
      setLatest(row, 'latestLit', litDate);
      if (litDate) events.push(litDate);
      litStudentIds.add(litId);
    }

    const mathPayload = safeParse(localStorage.getItem(KEYS.mathQuickCheck) || '');
    if (mathPayload && typeof mathPayload === 'object') {
      const mathDate = parseAnyDate(mathPayload.date);
      const mathName = extractStudentName(mathPayload);
      const mathGrade = extractGradeBand(mathPayload);
      const mathId = mathName ? slugify(mathName) : 'local-device';
      const row = ensureStudentRow(mathId, mathName || 'Current learner (local)');
      if (mathGrade && !row.gradeBand) row.gradeBand = mathGrade;
      setLatest(row, 'latestMath', mathDate);
      if (mathDate) events.push(mathDate);
      mathStudentIds.add(mathId);
    }

    forEachStorageKey((key) => key.startsWith(KEYS.pmPrefix), (key) => {
      const payload = safeParse(localStorage.getItem(key) || '');
      if (!payload || typeof payload !== 'object') return;

      const slugFromKey = key.slice(KEYS.pmPrefix.length).split('::')[0];
      const studentName = String(payload.student || '').trim();
      const studentId = studentName ? slugify(studentName) : slugFromKey || `pm-${studentMap.size + 1}`;
      const row = ensureStudentRow(studentId, studentName || readableSlug(slugFromKey) || 'Student');
      if (!row.student && studentName) row.student = studentName;
      const gradeBand = String(payload.grade_band || '').trim();
      if (gradeBand && !row.gradeBand) row.gradeBand = gradeBand;

      const results = Array.isArray(payload.results) ? payload.results : [];
      if (!results.length) return;

      pmStudentIds.add(studentId);
      results.forEach((entry) => {
        const date = parseAnyDate(entry?.dateISO || entry?.createdAt);
        if (date) {
          setLatest(row, 'latestPm', date);
          events.push(date);
        }
      });
    });

    forEachStorageKey((key) => key.startsWith(KEYS.sstPrefix), (key) => {
      const payload = safeParse(localStorage.getItem(key) || '');
      if (!payload || typeof payload !== 'object') return;

      const slugFromKey = key.slice(KEYS.sstPrefix.length).split('::')[0];
      const studentName = String(payload.studentName || payload.student || '').trim();
      const studentId = studentName ? slugify(studentName) : slugFromKey || `sst-${studentMap.size + 1}`;
      const row = ensureStudentRow(studentId, studentName || readableSlug(slugFromKey) || 'Student');
      if (!row.student && studentName) row.student = studentName;
      const gradeBand = String(payload.gradeBand || payload.grade_band || '').trim();
      if (gradeBand && !row.gradeBand) row.gradeBand = gradeBand;

      const sstDate = parseAnyDate(payload.packetGeneratedAt || payload.updatedAt || payload.createdAt);
      if (sstDate) {
        setLatest(row, 'latestSst', sstDate);
        events.push(sstDate);
      }
      if (payload.packetGeneratedAt) {
        sstStudentIds.add(studentId);
      }
    });

    forEachStorageKey((key) => key.startsWith(KEYS.writingPrefix), (key) => {
      const payload = safeParse(localStorage.getItem(key) || '');
      if (!payload || typeof payload !== 'object') return;
      const writingDate = parseAnyDate(payload.updatedAt || payload.createdAt || payload.ts);
      if (writingDate) events.push(writingDate);

      const studentName = String(payload.learnerName || payload.author || '').trim();
      if (!studentName) return;
      const studentId = slugify(studentName);
      const row = ensureStudentRow(studentId, studentName);
      if (!row.student) row.student = studentName;
      const gradeBand = String(payload.gradeBand || payload.grade_band || '').trim();
      if (gradeBand && !row.gradeBand) row.gradeBand = gradeBand;
    });

    const rows = Array.from(studentMap.values())
      .filter((row) => row.latestLit || row.latestMath || row.latestPm || row.latestSst || row.student)
      .map((row) => ({
        id: row.id,
        student: row.student || 'Unknown student',
        gradeBand: row.gradeBand || '-',
        latestLit: row.latestLit,
        latestMath: row.latestMath,
        latestPm: row.latestPm,
        latestSst: row.latestSst,
        notes: row.notes || ''
      }))
      .sort((a, b) => a.student.localeCompare(b.student));

    const weeklyCounts = buildWeeklyCounts(events);

    return {
      rows,
      weeklyCounts,
      summary: {
        litStudents: litStudentIds.size,
        mathStudents: mathStudentIds.size,
        pmStudents: pmStudentIds.size,
        sstStudents: sstStudentIds.size
      }
    };
  }

  function renderWeeklyTable(weeklyCounts) {
    if (!nodes.weeklyBody) return;
    if (!weeklyCounts.length) {
      nodes.weeklyBody.innerHTML = `
        <tr>
          <td colspan="2">No local MTSS activity saved for this month yet.</td>
        </tr>
      `;
      return;
    }
    nodes.weeklyBody.innerHTML = weeklyCounts.map((row) => `
      <tr>
        <td>${escapeHtml(formatDate(row.weekStart))}</td>
        <td>${row.count}</td>
      </tr>
    `).join('');
  }

  function renderStudentRollup(rows) {
    if (!nodes.rollupBody) return;
    if (!rows.length) {
      nodes.rollupBody.innerHTML = `
        <tr>
          <td colspan="7">No local student MTSS roll-up data found yet.</td>
        </tr>
      `;
      if (nodes.emptyNote) {
        nodes.emptyNote.textContent = 'Friendly tip: run quick checks, progress monitoring, or SST sessions to populate this table.';
      }
      return;
    }

    if (nodes.emptyNote) nodes.emptyNote.textContent = '';
    nodes.rollupBody.innerHTML = rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.student)}</td>
        <td>${escapeHtml(row.gradeBand)}</td>
        <td>${escapeHtml(formatDate(row.latestLit))}</td>
        <td>${escapeHtml(formatDate(row.latestMath))}</td>
        <td>${escapeHtml(formatDate(row.latestPm))}</td>
        <td>${escapeHtml(formatDate(row.latestSst))}</td>
        <td>${escapeHtml(row.notes || '')}</td>
      </tr>
    `).join('');
  }

  function exportRollupCsv(rows) {
    const header = [
      'student',
      'grade_band',
      'latest_literacy_quick_check',
      'latest_math_quick_check',
      'latest_progress_monitoring',
      'latest_sst',
      'notes'
    ];
    const lines = [header.join(',')];
    rows.forEach((row) => {
      lines.push([
        csvEscape(row.student),
        csvEscape(row.gradeBand),
        csvEscape(formatDateIso(row.latestLit)),
        csvEscape(formatDateIso(row.latestMath)),
        csvEscape(formatDateIso(row.latestPm)),
        csvEscape(formatDateIso(row.latestSst)),
        csvEscape(row.notes || '')
      ].join(','));
    });
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `admin-rollup-${stamp}.csv`;
    downloadBlob(filename, lines.join('\n'), 'text/csv;charset=utf-8;');
  }

  function clearLocalMtssData() {
    const removals = [];
    try {
      if (localStorage.getItem(KEYS.litQuickCheck) !== null) removals.push(KEYS.litQuickCheck);
      if (localStorage.getItem(KEYS.mathQuickCheck) !== null) removals.push(KEYS.mathQuickCheck);
      if (localStorage.getItem(KEYS.pmActive) !== null) removals.push(KEYS.pmActive);
      if (localStorage.getItem(KEYS.sstActive) !== null) removals.push(KEYS.sstActive);
      if (localStorage.getItem(KEYS.writingActive) !== null) removals.push(KEYS.writingActive);

      forEachStorageKey((key) => key.startsWith(KEYS.pmPrefix), (key) => removals.push(key));
      forEachStorageKey((key) => key.startsWith(KEYS.sstPrefix), (key) => removals.push(key));
      forEachStorageKey((key) => key.startsWith(KEYS.writingPrefix), (key) => removals.push(key));

      removals.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch {}
      });
    } catch {}
  }

  function buildWeeklyCounts(events) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const buckets = new Map();

    events.forEach((eventDate) => {
      if (!(eventDate instanceof Date) || Number.isNaN(eventDate.getTime())) return;
      if (eventDate.getMonth() !== month || eventDate.getFullYear() !== year) return;
      const weekStart = startOfWeek(eventDate);
      const key = weekStart.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });

    return Array.from(buckets.entries())
      .map(([key, count]) => ({ weekStart: new Date(`${key}T12:00:00`), count }))
      .sort((a, b) => a.weekStart - b.weekStart);
  }

  function startOfWeek(date) {
    const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = copy.getDay();
    const distance = (day + 6) % 7;
    copy.setDate(copy.getDate() - distance);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function parseAnyDate(value) {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number' && Number.isFinite(value)) {
      const asMs = value > 1e12 ? value : value * 1000;
      const date = new Date(asMs);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function extractStudentName(payload) {
    return String(
      payload.student ||
      payload.student_name ||
      payload.learner ||
      payload.learnerName ||
      payload.name ||
      ''
    ).trim();
  }

  function extractGradeBand(payload) {
    return String(payload.gradeBand || payload.grade_band || payload.grade || '').trim();
  }

  function forEachStorageKey(predicate, callback) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (typeof key === 'string') keys.push(key);
    }
    keys.forEach((key) => {
      if (predicate(key)) callback(key);
    });
  }

  function safeParse(raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function readableSlug(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    return text
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function formatDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString();
  }

  function formatDateIso(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    return date.toISOString();
  }

  function csvEscape(value) {
    const text = String(value === undefined || value === null ? '' : value);
    if (!/[",\n]/.test(text)) return text;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadBlob(filename, contents, contentType) {
    const blob = new Blob([contents], { type: contentType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function setStatus(message, isWarn) {
    if (!nodes.actionStatus) return;
    nodes.actionStatus.textContent = String(message || '');
    nodes.actionStatus.classList.toggle('cs-admin-warning-note', !!isWarn);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
