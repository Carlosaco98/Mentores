const STORAGE_KEY = "coinnecta-mentores-v1";
const CALENDAR_KEY = "coinnecta-mentores-agenda-v1";
const currency = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const dateFormat = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
const weekdayFormat = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "2-digit", month: "2-digit" });
const agendaTimes = ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00"];

const seedStudents = [
  {
    id: crypto.randomUUID(),
    course: "1-1",
    name: "Alexandra",
    store: "Pendiente de enviar URL",
    startDate: "2026-02-09",
    endDate: "2026-05-09",
    price: 100,
    paid: 0,
    pascuPaid: false,
    status: "active",
    mentors: { carlos: true, irene: true },
    nextAction: "Revisar estructura de tienda y confirmar tareas de la semana.",
    tasks: [
      { id: crypto.randomUUID(), text: "Pedir acceso a la tienda", done: false, dueDate: "2026-05-31" },
      { id: crypto.randomUUID(), text: "Confirmar pago pendiente", done: false, dueDate: "2026-06-02" }
    ],
    notes: [
      { id: crypto.randomUUID(), author: "Carlos", text: "Quiere mejorar ficha de producto antes de lanzar anuncios.", createdAt: "2026-05-20" }
    ]
  },
  {
    id: crypto.randomUUID(),
    course: "1-1",
    name: "Agustin",
    store: "Tienda en revision",
    startDate: "2026-02-20",
    endDate: "2026-05-20",
    price: 100,
    paid: 0,
    pascuPaid: false,
    status: "review",
    mentors: { carlos: true, irene: false },
    nextAction: "Revisar proveedores y dejar checklist de mejoras.",
    tasks: [
      { id: crypto.randomUUID(), text: "Enviar feedback de portada", done: false, dueDate: "2026-05-29" }
    ],
    notes: [
      { id: crypto.randomUUID(), author: "Irene", text: "Falta claridad en politica de envios.", createdAt: "2026-05-22" }
    ]
  },
  {
    id: crypto.randomUUID(),
    course: "1-1",
    name: "Ruben y Nara",
    store: "Sin tienda publicada",
    startDate: "2026-03-02",
    endDate: "2026-06-02",
    price: 100,
    paid: 0,
    pascuPaid: false,
    status: "blocked",
    mentors: { carlos: true, irene: false },
    nextAction: "Desbloquear seleccion de nicho y producto ganador.",
    tasks: [
      { id: crypto.randomUUID(), text: "Agendar llamada de desbloqueo", done: false, dueDate: "2026-05-30" }
    ],
    notes: []
  },
  {
    id: crypto.randomUUID(),
    course: "SKOOL",
    name: "Joan Coll",
    store: "joancoll-shop.com",
    startDate: "2026-03-08",
    endDate: "2026-06-08",
    price: 0,
    paid: 0,
    pascuPaid: false,
    status: "active",
    mentors: { carlos: false, irene: false },
    nextAction: "Esperando primera revision.",
    tasks: [],
    notes: []
  },
  {
    id: crypto.randomUUID(),
    course: "1-1",
    name: "Adria",
    store: "Pendiente branding",
    startDate: "2026-05-20",
    endDate: "2026-08-20",
    price: 100,
    paid: 0,
    pascuPaid: false,
    status: "active",
    mentors: { carlos: false, irene: false },
    nextAction: "Definir tienda y preparar objetivos de la semana 1.",
    tasks: [
      { id: crypto.randomUUID(), text: "Crear checklist inicial", done: true, dueDate: "2026-05-21" }
    ],
    notes: []
  },
  {
    id: crypto.randomUUID(),
    course: "1-1",
    name: "Lucas",
    store: "lucasfit.store",
    startDate: "2026-05-20",
    endDate: "2026-08-20",
    price: 100,
    paid: 100,
    pascuPaid: true,
    status: "active",
    mentors: { carlos: false, irene: false },
    nextAction: "Revisar upsells y email de carrito abandonado.",
    tasks: [],
    notes: [
      { id: crypto.randomUUID(), author: "Carlos", text: "Buen avance en producto, falta optimizar checkout.", createdAt: "2026-05-27" }
    ]
  }
];

const state = {
  students: loadStudents(),
  appointments: loadAppointments(),
  weekStart: getWeekStart(new Date()),
  selectedId: null,
  filter: "all",
  view: "agenda",
  search: ""
};

const els = {
  activeStudents: document.querySelector("#activeStudents"),
  pageTitle: document.querySelector("#pageTitle"),
  pageSubtitle: document.querySelector("#pageSubtitle"),
  unpaidStudentsCount: document.querySelector("#unpaidStudentsCount"),
  weeklyCallsCount: document.querySelector("#weeklyCallsCount"),
  paymentBoard: document.querySelector("#paymentBoard"),
  agendaGrid: document.querySelector("#agendaGrid"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingStudent: document.querySelector("#bookingStudent"),
  studentList: document.querySelector("#studentList"),
  studentDetail: document.querySelector("#studentDetail"),
  searchInput: document.querySelector("#searchInput"),
  dialog: document.querySelector("#studentDialog"),
  form: document.querySelector("#studentForm"),
  dialogTitle: document.querySelector("#dialogTitle")
};

function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return seedStudents;

  try {
    return JSON.parse(saved);
  } catch {
    return seedStudents;
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
}

function loadAppointments() {
  const saved = localStorage.getItem(CALENDAR_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveAppointments() {
  localStorage.setItem(CALENDAR_KEY, JSON.stringify(state.appointments));
}

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  const date = parseLocalDate(value);
  return date ? dateFormat.format(date) : "-";
}

function toDateInputValue(date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

function getWeekStart(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function pendingAmount(student) {
  return isPascuPaid(student) ? 0 : Number(student.price || 0);
}

function isPascuPaid(student) {
  if (typeof student.pascuPaid === "boolean") return student.pascuPaid;
  return Number(student.paid || 0) >= Number(student.price || 0) && Number(student.price || 0) > 0;
}

function paymentLabel(student) {
  return isPascuPaid(student) ? "Pagado por Pascu" : "No pagado";
}

function paymentClass(student) {
  return isPascuPaid(student) ? "status-paid" : "status-unpaid";
}

function studentMentors(student) {
  return Object.entries(student.mentors || {})
    .filter(([, active]) => active)
    .map(([name]) => name);
}

function isEndingSoon(student) {
  const end = parseLocalDate(student.endDate);
  if (!end) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = (end - today) / 86400000;
  return days >= 0 && days <= 7;
}

function statusLabel(status) {
  return {
    active: "Activo",
    review: "Revision",
    blocked: "Bloqueado",
    finished: "Finalizado"
  }[status] || "Activo";
}

function statusClass(status) {
  return {
    active: "",
    review: "status-review",
    blocked: "status-blocked",
    finished: "status-finished"
  }[status] || "";
}

function visibleStudents() {
  const query = state.search.trim().toLowerCase();

  return state.students.filter((student) => {
    const matchesSearch = [student.name, student.course, student.store, student.nextAction]
      .join(" ")
      .toLowerCase()
      .includes(query);

    const matchesFilter =
      state.filter === "all" ||
      (state.filter === "active" && student.status !== "finished") ||
      (state.filter === "ending" && isEndingSoon(student)) ||
      (state.filter === "unpaid" && !isPascuPaid(student)) ||
      (state.filter === "paid" && isPascuPaid(student));

    return matchesSearch && matchesFilter;
  });
}

function render() {
  if (!state.selectedId || !state.students.some((student) => student.id === state.selectedId)) {
    state.selectedId = state.students[0]?.id ?? null;
  }

  const students = visibleStudents();
  if (students.length && !students.some((student) => student.id === state.selectedId)) {
    state.selectedId = students[0].id;
  }

  renderMetrics();
  renderBookingStudents();
  renderAgenda();
  renderPaymentBoard();
  renderStudents();
  renderDetail();
  applyView();
}

function renderMetrics() {
  const active = state.students.filter((student) => student.status !== "finished").length;
  const unpaidStudents = state.students.filter((student) => !isPascuPaid(student)).length;
  const weekStartValue = toDateInputValue(state.weekStart);
  const weekEndValue = toDateInputValue(addDays(state.weekStart, 4));
  const weeklyCalls = state.appointments.filter((appointment) => appointment.date >= weekStartValue && appointment.date <= weekEndValue).length;

  els.activeStudents.textContent = active;
  els.unpaidStudentsCount.textContent = unpaidStudents;
  els.weeklyCallsCount.textContent = weeklyCalls;
}

function applyView() {
  const viewMeta = {
    agenda: ["Agenda alumnos sin lios.", "Elige alumno, pega enlace y pulsa una hora libre."],
    students: ["Alumnos claros.", "Ficha simple: tienda, estado, pago y comentarios."],
    money: ["Cobros sin dudas.", "Marca si Pascu ya ha pagado o falta por pagar."]
  };
  const [title, subtitle] = viewMeta[state.view] || viewMeta.agenda;

  els.pageTitle.textContent = title;
  els.pageSubtitle.textContent = subtitle;

  document.querySelectorAll(".view-section").forEach((section) => {
    const sections = section.dataset.section.split(" ");
    section.hidden = !sections.includes(state.view);
  });
}

function renderStudents() {
  const students = visibleStudents();
  els.studentList.innerHTML = "";

  if (!students.length) {
    els.studentList.append(document.querySelector("#emptyStateTemplate").content.cloneNode(true));
    return;
  }

  for (const student of students) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `student-row ${student.id === state.selectedId ? "selected" : ""}`;
    row.dataset.id = student.id;
    row.innerHTML = `
      <span class="student-name">
        <strong>${escapeHtml(student.name)}</strong>
        <span>${escapeHtml(student.store || "Sin tienda")}</span>
      </span>
      <span class="row-muted">${escapeHtml(student.course)}</span>
      <span class="row-muted">${formatDate(student.endDate)}</span>
      <span class="status-pill ${paymentClass(student)}">${paymentLabel(student)}</span>
      <span class="mentor-stack">${renderMentorDots(student)}</span>
    `;
    row.addEventListener("click", () => {
      state.selectedId = student.id;
      render();
    });
    els.studentList.append(row);
  }
}

function renderPaymentBoard() {
  const unpaid = state.students.filter((student) => !isPascuPaid(student));
  const paid = state.students.filter(isPascuPaid);

  els.paymentBoard.innerHTML = `
    <section class="payment-column">
      <div class="payment-column-head">
        <span>No pagados</span>
        <strong>${unpaid.length}</strong>
      </div>
      <div class="payment-list">
        ${unpaid.map((student) => renderPaymentCard(student, "mark-paid")).join("") || renderPaymentEmpty("No falta nadie por pagar.")}
      </div>
    </section>
    <section class="payment-column paid-column">
      <div class="payment-column-head">
        <span>Pagados por Pascu</span>
        <strong>${paid.length}</strong>
      </div>
      <div class="payment-list">
        ${paid.map((student) => renderPaymentCard(student, "mark-unpaid")).join("") || renderPaymentEmpty("Aun no hay alumnos pagados.")}
      </div>
    </section>
  `;
}

function renderPaymentCard(student, action) {
  return `
    <article class="payment-card">
      <div>
        <strong>${escapeHtml(student.name)}</strong>
        <span>${escapeHtml(student.course)} - ${currency.format(student.price || 0)}</span>
      </div>
      <button class="${action === "mark-paid" ? "primary-button" : "ghost-button"}" data-action="${action}" data-student-id="${student.id}" type="button">
        ${action === "mark-paid" ? "Marcar pagado" : "Marcar no pagado"}
      </button>
    </article>
  `;
}

function renderPaymentEmpty(text) {
  return `<div class="payment-empty">${escapeHtml(text)}</div>`;
}

function renderBookingStudents() {
  const previousValue = els.bookingStudent.value;
  els.bookingStudent.innerHTML = state.students
    .filter((student) => student.status !== "finished")
    .map((student) => `<option value="${student.id}">${escapeHtml(student.name)}</option>`)
    .join("");

  if (previousValue && state.students.some((student) => student.id === previousValue)) {
    els.bookingStudent.value = previousValue;
  } else if (state.selectedId) {
    els.bookingStudent.value = state.selectedId;
  }
}

function renderAgenda() {
  const days = Array.from({ length: 5 }, (_, index) => addDays(state.weekStart, index));
  const weekLabel = `${formatDate(toDateInputValue(days[0]))} - ${formatDate(toDateInputValue(days[4]))}`;

  els.agendaGrid.innerHTML = `
    <div class="agenda-week-label">${weekLabel}</div>
    <div class="agenda-days">
      ${days
        .map(
          (day) => {
            const dayValue = toDateInputValue(day);
            return `
          <div class="agenda-day ${dayValue === toDateInputValue(new Date()) ? "today" : ""}">
            <div class="agenda-day-title">${weekdayFormat.format(day)}</div>
            <div class="slot-list">
              ${agendaTimes.map((time) => renderSlot(day, time)).join("")}
            </div>
          </div>
        `;
          }
        )
        .join("")}
    </div>
  `;
}

function renderSlot(day, time) {
  const date = toDateInputValue(day);
  const appointment = state.appointments.find((item) => item.date === date && item.time === time);

  if (!appointment) {
    return `
      <button class="slot-button available" data-action="book-slot" data-date="${date}" data-time="${time}" type="button">
        <span>${time}</span>
        <strong>Disponible</strong>
      </button>
    `;
  }

  const student = state.students.find((item) => item.id === appointment.studentId);
  return `
    <div class="slot-button booked" data-appointment-id="${appointment.id}">
      <span>${time} - ${escapeHtml(appointment.channel)}</span>
      <strong>${escapeHtml(student?.name || "Alumno")}</strong>
      <small>${escapeHtml(appointment.mentor)}</small>
      <div class="slot-actions">
        ${appointment.link ? `<a href="${escapeHtml(appointment.link)}" target="_blank" rel="noreferrer">Abrir</a>` : ""}
        <button class="mini-button" data-action="delete-appointment" type="button">Liberar</button>
      </div>
    </div>
  `;
}

function renderMentorDots(student) {
  const mentors = studentMentors(student);
  if (!mentors.length) return '<span class="row-muted">Sin asignar</span>';
  return mentors.map((name) => `<span class="mentor-dot">${name.slice(0, 1).toUpperCase()}</span>`).join("");
}

function renderDetail() {
  const student = state.students.find((item) => item.id === state.selectedId);

  if (!student) {
    els.studentDetail.innerHTML = `
      <div class="empty-state">
        <strong>Crea el primer alumno.</strong>
        <span>Cuando haya alumnos, aqui veras su ficha completa.</span>
      </div>
    `;
    return;
  }

  els.studentDetail.innerHTML = `
    <div class="detail-head">
      <div class="detail-title">
        <p class="eyebrow">${escapeHtml(student.course)}</p>
        <h2>${escapeHtml(student.name)}</h2>
        <span class="status-pill ${statusClass(student.status)}">${statusLabel(student.status)}</span>
      </div>
      <div class="detail-actions">
        <button class="ghost-button" data-action="edit" type="button">Editar</button>
        <button class="ghost-button" data-action="finish" type="button">${student.status === "finished" ? "Reabrir" : "Finalizar"}</button>
      </div>
    </div>

    <div class="detail-grid">
      <div class="info-box"><span>Inicio</span><strong>${formatDate(student.startDate)}</strong></div>
      <div class="info-box"><span>Fin</span><strong>${formatDate(student.endDate)}</strong></div>
      <div class="info-box"><span>Precio</span><strong>${currency.format(student.price || 0)}</strong></div>
      <div class="info-box"><span>Cobro</span><strong class="${paymentClass(student)}">${paymentLabel(student)}</strong></div>
      <div class="info-box"><span>Mentores</span><strong>${studentMentors(student).join(", ") || "Sin asignar"}</strong></div>
      <div class="info-box"><span>Tienda</span><strong>${escapeHtml(student.store || "Sin tienda")}</strong></div>
    </div>

    <section class="section-block">
      <h3>Proxima accion</h3>
      <form class="quick-form" data-form="nextAction">
        <textarea rows="3" name="nextAction">${escapeHtml(student.nextAction || "")}</textarea>
        <button class="primary-button" type="submit">Guardar accion</button>
      </form>
    </section>

    <section class="section-block">
      <h3>Comentarios de tienda</h3>
      <form class="quick-form" data-form="note">
        <textarea rows="3" name="note" placeholder="Revision, avance, bloqueo o contexto para la proxima llamada" required></textarea>
        <button class="primary-button" type="submit">Guardar comentario</button>
      </form>
      <ul class="note-list">
        ${renderNotes(student)}
      </ul>
    </section>
  `;
}

function renderNotes(student) {
  if (!student.notes.length) {
    return `<li class="note-item"><span>Aun no hay comentarios.</span></li>`;
  }

  return student.notes
    .map(
      (note) => `
      <li class="note-item">
        <strong>${escapeHtml(note.author || "Mentor")}</strong>
        <p>${escapeHtml(note.text)}</p>
        <small>${formatDate(note.createdAt)}</small>
      </li>
    `
    )
    .join("");
}

function openStudentDialog(student = null) {
  els.form.reset();
  els.form.dataset.editingId = student?.id || "";
  els.dialogTitle.textContent = student ? "Editar alumno" : "Nuevo alumno";

  if (student) {
    els.form.name.value = student.name;
    els.form.course.value = student.course;
    els.form.startDate.value = student.startDate;
    els.form.endDate.value = student.endDate;
    els.form.price.value = student.price;
    els.form.pascuPaid.value = String(isPascuPaid(student));
    els.form.store.value = student.store;
    els.form.status.value = student.status;
    els.form.mentorCarlos.checked = !!student.mentors?.carlos;
    els.form.mentorIrene.checked = !!student.mentors?.irene;
    els.form.nextAction.value = student.nextAction || "";
  } else {
    const today = new Date().toISOString().slice(0, 10);
    els.form.startDate.value = today;
    els.form.endDate.value = addMonths(today, 3);
  }

  els.dialog.showModal();
}

function addMonths(value, months) {
  const date = parseLocalDate(value) || new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function handleStudentForm(event) {
  event.preventDefault();
  const data = new FormData(els.form);
  const editingId = els.form.dataset.editingId;
  const existing = state.students.find((student) => student.id === editingId);
  const student = {
    id: existing?.id || crypto.randomUUID(),
    course: data.get("course"),
    name: data.get("name").trim(),
    store: data.get("store").trim(),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    price: Number(data.get("price") || 0),
    pascuPaid: data.get("pascuPaid") === "true",
    paid: data.get("pascuPaid") === "true" ? Number(data.get("price") || 0) : 0,
    status: data.get("status"),
    mentors: {
      carlos: data.get("mentorCarlos") === "on",
      irene: data.get("mentorIrene") === "on"
    },
    nextAction: data.get("nextAction").trim(),
    tasks: existing?.tasks || [],
    notes: existing?.notes || []
  };

  if (editingId) {
    state.students = state.students.map((item) => (item.id === editingId ? student : item));
  } else {
    state.students.unshift(student);
  }

  state.selectedId = student.id;
  els.dialog.close();
  saveStudents();
  render();
}

function updateSelected(mutator) {
  state.students = state.students.map((student) => {
    if (student.id !== state.selectedId) return student;
    return mutator(structuredClone(student));
  });
  saveStudents();
  render();
}

function exportData() {
  const payload = JSON.stringify({ students: state.students, appointments: state.appointments }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `coinnecta-mentores-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelector("#newStudentButton").addEventListener("click", () => openStudentDialog());
document.querySelector("#newStudentPaymentButton").addEventListener("click", () => openStudentDialog());
document.querySelector("#closeDialogButton").addEventListener("click", () => els.dialog.close());
document.querySelector("#cancelDialogButton").addEventListener("click", () => els.dialog.close());
document.querySelector("#exportButton").addEventListener("click", exportData);
document.querySelector("#resetDemoButton").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CALENDAR_KEY);
  state.students = structuredClone(seedStudents);
  state.appointments = [];
  state.selectedId = state.students[0]?.id || null;
  render();
});

document.querySelector("#previousWeekButton").addEventListener("click", () => {
  state.weekStart = addDays(state.weekStart, -7);
  render();
});

document.querySelector("#currentWeekButton").addEventListener("click", () => {
  state.weekStart = getWeekStart(new Date());
  render();
});

document.querySelector("#nextWeekButton").addEventListener("click", () => {
  state.weekStart = addDays(state.weekStart, 7);
  render();
});

els.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  render();
});

els.form.addEventListener("submit", handleStudentForm);

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    state.filter = chip.dataset.filter;
    render();
  });
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
    state.view = item.dataset.view;

    if (state.view === "students") {
      state.filter = "all";
      document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.filter === "all"));
    }

    render();
  });
});

els.paymentBoard.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const studentId = button.dataset.studentId;
  const shouldBePaid = button.dataset.action === "mark-paid";

  state.students = state.students.map((student) => {
    if (student.id !== studentId) return student;
    return {
      ...student,
      pascuPaid: shouldBePaid,
      paid: shouldBePaid ? Number(student.price || 0) : 0
    };
  });
  state.selectedId = studentId;
  saveStudents();
  render();
});

els.agendaGrid.addEventListener("click", (event) => {
  const bookButton = event.target.closest('[data-action="book-slot"]');
  const deleteButton = event.target.closest('[data-action="delete-appointment"]');

  if (bookButton) {
    const data = new FormData(els.bookingForm);
    const studentId = data.get("studentId");

    if (!studentId) return;

    state.appointments.push({
      id: crypto.randomUUID(),
      date: bookButton.dataset.date,
      time: bookButton.dataset.time,
      studentId,
      mentor: data.get("mentor"),
      channel: data.get("channel"),
      link: data.get("link").trim()
    });
    state.selectedId = studentId;
    saveAppointments();
    render();
  }

  if (deleteButton) {
    const appointmentId = deleteButton.closest("[data-appointment-id]")?.dataset.appointmentId;
    state.appointments = state.appointments.filter((appointment) => appointment.id !== appointmentId);
    saveAppointments();
    render();
  }
});

els.studentDetail.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const student = state.students.find((item) => item.id === state.selectedId);

  if (action === "edit") openStudentDialog(student);

  if (action === "finish") {
    updateSelected((item) => {
      item.status = item.status === "finished" ? "active" : "finished";
      return item;
    });
  }

});

els.studentDetail.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;

  if (form.dataset.form === "nextAction") {
    const nextAction = new FormData(form).get("nextAction").trim();
    updateSelected((item) => ({ ...item, nextAction }));
  }

  if (form.dataset.form === "note") {
    const text = new FormData(form).get("note").trim();
    updateSelected((item) => {
      item.notes.unshift({ id: crypto.randomUUID(), author: "Mentor", text, createdAt: new Date().toISOString().slice(0, 10) });
      return item;
    });
  }
});

render();
