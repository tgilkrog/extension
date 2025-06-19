document.getElementById('fillData').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-fill.js']
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.querySelector(".settings_btn");
  const settingsPage = document.querySelector(".settings_page");
  const closeBtn = document.querySelector(".settings_close");
  const overlay = document.querySelector(".settings_overlay");

  const openSettings = () => {
    settingsPage.classList.add("open");
    overlay.classList.add("visible");
  };

  const closeSettings = () => {
    settingsPage.classList.remove("open");
    overlay.classList.remove("visible");
  };

  settingsBtn.addEventListener("click", openSettings);
  closeBtn.addEventListener("click", closeSettings);
  overlay.addEventListener("click", closeSettings);

  loadFormData();
  document.querySelectorAll('.checkout_fields input').forEach(input => {
    input.addEventListener('change', saveFormData);
  });
});

const saveFormData = debounce(() => {
  const inputs = document.querySelectorAll('.checkout_fields input');
  const data = {};

  inputs.forEach(input => {
    data[input.name] = input.value;
  });

  chrome.storage.local.set({ checkoutData: data });
});

function loadFormData() {
  chrome.storage.local.get('checkoutData', (result) => {
    const data = result.checkoutData || {};
    const inputs = document.querySelectorAll('.checkout_fields input');

    inputs.forEach(input => {
      if (data[input.name] !== undefined) {
        input.value = data[input.name];
      }
    });
  });
}