const SUPABASE_URL = 'https://bepyxzbywxyqfbljkxyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcHl4emJ5d3h5cWZibGpreHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NDQ4NTMsImV4cCI6MjEwODAyMDg1M30.IcyP_ZIqG9uqbcEnLNnXnlPzW0RbKM0rFrEuQpe6U3c';

const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const elements = {
  addBtn: document.getElementById('addLessonBtn'),
  addStub: document.getElementById('addCardStub'),
  modal: document.getElementById('lessonModal'),
  closeBtns: [document.getElementById('closeModal'), document.getElementById('closeIconBtn')],
  form: document.getElementById('lessonForm'),
  grid: document.getElementById('lessonsGrid'),
  modalTitle: document.getElementById('modalTitle'),
  editIdInput: document.getElementById('editCardId'),
  submitBtn: document.getElementById('submitBtn')
};

const openModal = (editMode = false) => {
  elements.modalTitle.textContent = editMode ? 'Edytuj materiały' : 'Dodaj materiały z zajęć';
  elements.submitBtn.textContent = editMode ? 'Zapisz zmiany' : 'Zapisz';
  if (!editMode) {
    elements.form.reset();
    elements.editIdInput.value = '';
  }
  elements.modal.showModal();
};

const closeModal = () => {
  elements.modal.close();
  elements.form.reset();
};

// Listenery otwierania/zamykania
elements.addBtn?.addEventListener('click', () => openModal(false));
elements.addStub?.addEventListener('click', () => openModal(false));
elements.closeBtns.forEach(btn => btn?.addEventListener('click', closeModal));
elements.modal?.addEventListener('click', (e) => {
  if (e.target === elements.modal) closeModal();
});

// Renderowanie pojedynczego kafelka
const createCardElement = (item) => {
  const tagsHtml = item.tags ? item.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : '';
  const linksHtml = item.links ? item.links.split(' ').map(link => link.trim() ? `<a href="${link}" target="_blank" rel="noopener">🔗 Link</a>` : '').join('') : '';
  const safeCode = item.code ? item.code.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

  const tile = document.createElement('article');
  tile.className = `glass-card-tile ${item.completed ? 'completed' : ''}`;
  tile.id = item.id;
  tile.innerHTML = `
    <div class="tile-header">
      <div class="tile-subject">${item.subject || 'Brak przedmiotu'} &bull; ${item.date || 'Brak daty'}</div>
      <h3>${item.title}</h3>
      <div class="tile-tags">${tagsHtml}</div>
    </div>
    
    ${item.notes ? `<div class="tile-notes">${item.notes}</div>` : ''}
    ${item.code ? `<pre class="tile-code"><code>${safeCode}</code></pre>` : ''}
    ${linksHtml ? `<div class="tile-links">${linksHtml}</div>` : ''}
    
    <div class="tile-footer">
      <div class="tile-actions">
        <button class="btn-glass btn-edit" title="Edytuj">✏️</button>
        <button class="btn-glass btn-complete" title="Oznacz jako opanowane">⚡</button>
        <button class="btn-glass btn-delete" title="Usuń z panelu">🗑</button>
      </div>
    </div>
    
    <template class="raw-data">${JSON.stringify(item)}</template>
  `;
  return tile;
};

// Pobieranie wszystkich materiałów z Supabase
const loadLessons = async () => {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient
    .from('lessons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Błąd pobierania lekcji z Supabase:', error);
    return;
  }

  // Wyczyść istniejące kafelki (oprócz addCardStub)
  const existingTiles = elements.grid.querySelectorAll('.glass-card-tile:not(#addCardStub)');
  existingTiles.forEach(tile => tile.remove());

  // Renderuj pobrane z bazy
  data.forEach(item => {
    const card = createCardElement(item);
    elements.grid.insertBefore(card, elements.addStub);
  });
};

// Zapis / Edycja kafelka w bazie Supabase
elements.form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(elements.form);
  const data = Object.fromEntries(formData);
  
  const isEdit = data.editCardId && data.editCardId !== '';
  const cardId = isEdit ? data.editCardId : `card-${Date.now()}`;

  const payload = {
    id: cardId,
    title: data.title,
    subject: data.subject || '',
    date: data.date || '',
    notes: data.notes || '',
    code: data.code || '',
    links: data.links || '',
    tags: data.tags || ''
  };

  if (!isEdit) {
    payload.completed = false;
  }

  // Optimistic UI update
  if (isEdit) {
    const existing = document.getElementById(cardId);
    if (existing) {
      const oldRaw = JSON.parse(existing.querySelector('.raw-data')?.textContent || '{}');
      payload.completed = oldRaw.completed || false;
      const updated = createCardElement(payload);
      existing.replaceWith(updated);
    }
  } else {
    const newCard = createCardElement(payload);
    elements.grid.insertBefore(newCard, elements.addStub);
  }

  closeModal();

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('lessons')
      .upsert(payload);

    if (error) {
      console.error('Błąd zapisu do Supabase:', error);
      loadLessons(); // fallback: przywróć stan z bazy
    }
  }
});

// Event Delegation - obsługa kliknięć przycisków w wygenerowanych kafelkach
elements.grid?.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const card = btn.closest('.glass-card-tile');
  if (!card || card.id === 'addCardStub') return;
  const cardId = card.id;
  
  if (btn.classList.contains('btn-delete')) {
    card.remove();
    if (supabaseClient) {
      await supabaseClient.from('lessons').delete().eq('id', cardId);
    }
  } 
  else if (btn.classList.contains('btn-complete')) {
    const willBeCompleted = !card.classList.contains('completed');
    card.classList.toggle('completed');

    if (supabaseClient) {
      await supabaseClient
        .from('lessons')
        .update({ completed: willBeCompleted })
        .eq('id', cardId);
    }
  }
  else if (btn.classList.contains('btn-edit')) {
    const rawTemplate = card.querySelector('.raw-data');
    if (!rawTemplate) return;
    const rawData = JSON.parse(rawTemplate.textContent);
    
    elements.form.elements['title'].value = rawData.title || '';
    elements.form.elements['subject'].value = rawData.subject || '';
    elements.form.elements['date'].value = rawData.date || '';
    elements.form.elements['notes'].value = rawData.notes || '';
    elements.form.elements['code'].value = rawData.code || '';
    elements.form.elements['links'].value = rawData.links || '';
    elements.form.elements['tags'].value = rawData.tags || '';
    elements.editIdInput.value = card.id;
    
    openModal(true);
  }
});

// Inicjalizacja: załaduj dane z Supabase i nasłuchuj zmian Realtime
window.addEventListener('DOMContentLoaded', () => {
  loadLessons();

  if (supabaseClient) {
    supabaseClient
      .channel('public:lessons')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, () => {
        loadLessons();
      })
      .subscribe();
  }
});
