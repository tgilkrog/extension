const container = document.getElementById('fields-container');
const addButton = document.getElementById('add-field');

const ICONS = {
  drag:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"/></svg>',
  remove: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>',
  gitlab: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M503.5 204.6L502.8 202.8L433.1 21C431.7 17.5 429.2 14.4 425.9 12.4C423.5 10.8 420.8 9.9 417.9 9.6C415 9.3 412.2 9.7 409.5 10.7C406.8 11.7 404.4 13.3 402.4 15.5C400.5 17.6 399.1 20.1 398.3 22.9L351.3 166.9H160.8L113.7 22.9C112.9 20.1 111.5 17.6 109.6 15.5C107.6 13.4 105.2 11.7 102.5 10.7C99.9 9.7 97 9.3 94.1 9.6C91.3 9.9 88.5 10.8 86.1 12.4C82.8 14.4 80.3 17.5 78.9 21L9.3 202.8L8.5 204.6C-1.5 230.8-2.7 259.6 5 286.6C12.8 313.5 29.1 337.3 51.5 354.2L51.7 354.4L52.3 354.8L158.3 434.3L210.9 474L242.9 498.2C246.6 500.1 251.2 502.5 255.9 502.5C260.6 502.5 265.2 500.1 268.9 498.2L300.9 474L353.5 434.3L460.2 354.4L460.5 354.1C482.9 337.2 499.2 313.5 506.1 286.6C514.7 259.6 513.5 230.8 503.5 204.6z"/></svg>',
}

// Debounce save
function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const saveFields = debounce(() => {
  const values = Array.from(container.children).map(wrapper => {
    const input = wrapper.querySelector('input');
    const isCollapsed = wrapper.querySelector('.field-content').style.display === 'none';
    return { value: input.value, collapsed: isCollapsed };
  });
  chrome.storage.local.set({ fields: values });
});

function createSvgButton({ title, className, svg }) {
  const btn = document.createElement('button');
  btn.title = title;
  btn.className = className;
  btn.innerHTML = svg;
  return btn;
}

function createField(field = { value: '', collapsed: false }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'line-item';

  const topDiv = document.createElement('div');
  topDiv.className = 'topDiv';

  // Collapse toggle buttons
  const collapseToggle = document.createElement('button');
  collapseToggle.textContent = field.collapsed ? '▶' : '▼';
  collapseToggle.className = 'collapse-toggle';
  collapseToggle.title = 'Collapse/Expand';
  collapseToggle.style.marginRight = '8px';

  // Drag handle
  const dragHandle = document.createElement('span');
  dragHandle.className = 'drag-handle';
  dragHandle.title = 'Drag to reorder';
  dragHandle.innerHTML = ICONS.drag;

  // Input field
  const input = document.createElement('input');
  input.type = 'text';
  input.value = field.value;
  input.style.flex = '1';
  input.addEventListener('input', saveFields);
 
  // Remove button
  const removeBtn = createSvgButton({
    title: 'Remove this field',
    className: 'remove-button',
    svg: ICONS.remove
  });
  removeBtn.addEventListener('click', () => {
    container.removeChild(wrapper);
    saveFields();
  });

  const gitlabBtn = createSvgButton({
    title: 'Go to Gitlab',
    className: 'gitlabBtn',
    svg: ICONS.gitlab
  });
  gitlabBtn.addEventListener('click', () => {
    const value = input.value.trim();
    if (value) {
      const url = `https://gitlab.com/wexo/sw6/${encodeURIComponent(value)}`;
      chrome.tabs.create({ url });
    }
  });

  topDiv.append(collapseToggle, input, dragHandle, gitlabBtn, removeBtn);
  wrapper.appendChild(topDiv);

  // Content (buttons)
  const contentDiv = document.createElement('div');
  contentDiv.className = 'field-content';
  if (field.collapsed) contentDiv.style.display = 'none';

  wrapper._input = input;
  wrapper._fieldContent = contentDiv;

  if (window.buttonGroups) {
    const allGroupsContainer = document.createElement('div');
    allGroupsContainer.className = 'all-button-groups';

    window.buttonGroups.forEach(group => {
      const buttonGroup = buildButtonGroup(group, input);
      allGroupsContainer.appendChild(buttonGroup);
    });

    contentDiv.appendChild(allGroupsContainer);
  }

  wrapper.appendChild(contentDiv);
  container.appendChild(wrapper);
  makeDraggable(wrapper, dragHandle);

  // Toggle collapse and save
  collapseToggle.addEventListener('click', () => {
    const isHidden = contentDiv.style.display === 'none';
    contentDiv.style.display = isHidden ? '' : 'none';
    collapseToggle.textContent = isHidden ? '▼' : '▶';
    saveFields();
  });

  return wrapper;
}

function buildButtonGroup(group, input) {
  const groupContainer = document.createElement('div');
  groupContainer.className = 'button-group-container';

  const label = document.createElement('div');
  label.className = 'button-group-label';
  label.textContent = group.label;
  groupContainer.appendChild(label);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'button-group';

  group.buttons.forEach(({ title, icon, name, buildUrl }) => {
    const btn = document.createElement('button');
    btn.title = title;

    // Clear button content
    btn.textContent = '';

    // Determine if icon is an SVG string
    if (icon.trim().startsWith('<svg')) {
      btn.innerHTML = icon;
    } else {
      btn.textContent = icon;
    }
    btn.className = name;

    btn.addEventListener('click', () => {
      const urlText = input.value;
      if (urlText) {
        chrome.tabs.create({ url: buildUrl(urlText) });
      }
    });

    buttonsDiv.appendChild(btn);
  });

  groupContainer.appendChild(buttonsDiv);

  return groupContainer;
}

function loadFields() {
  chrome.storage.local.get('fields', (data) => {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const values = Array.isArray(data.fields)
      ? data.fields.map(f => typeof f === 'string' ? { value: f, collapsed: false } : f)
      : [{ value: '', collapsed: false }];

    values.forEach(field => fragment.appendChild(createField(field)));
    container.appendChild(fragment);
  });
}

addButton.addEventListener('click', () => {
  createField('');
  saveFields();
});

document.addEventListener('DOMContentLoaded', loadFields);

let dragSrcEl = null;

function makeDraggable(wrapper, handle) {
  handle.setAttribute('draggable', 'true');

  handle.addEventListener('dragstart', (e) => {
    dragSrcEl = wrapper;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    wrapper.classList.add('dragging');
  });

  handle.addEventListener('dragend', () => {
    wrapper.classList.remove('dragging');
    Array.from(container.children).forEach(item => item.classList.remove('over'));
  });

  wrapper.addEventListener('dragenter', handleDragEnter);
  wrapper.addEventListener('dragover', handleDragOver);
  wrapper.addEventListener('dragleave', handleDragLeave);
  wrapper.addEventListener('drop', handleDrop);
}

function handleDragEnter(e) {
  if (this !== dragSrcEl) this.classList.add('over');
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDrop(e) {
  e.stopPropagation();
  if (dragSrcEl !== this) {
    const children = Array.from(container.children);
    const dragIndex = children.indexOf(dragSrcEl);
    const dropIndex = children.indexOf(this);

    if (dragIndex < dropIndex) {
      container.insertBefore(dragSrcEl, this.nextSibling);
    } else {
      container.insertBefore(dragSrcEl, this);
    }

    saveFields();
  }
  this.classList.remove('over');
  return false;
}
